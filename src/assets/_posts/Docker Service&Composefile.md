---
title: Docker Service&Composefile
categories:
  - docker
  - notes
tags:
  - docker
  - compose-file
date: 2018-11-27 12:19:02
series: docker
---



### Service

In a distributed application, different pieces of the app are called “services.” For example, if you imagine a video sharing site, it probably includes **[1]a service for storing application data in a database**, **[2]a service for video transcoding in the background after a user uploads something**, **[3]a service for the front-end**, and so on.

Services are really just “containers in production.” A service only runs one image, but it codifies the way that image runs:

- what ports it should use
- how many replicas of the container should run so the service has the capacity it needs
- scaling a service changes the number of container instances running that piece of software
- assigning more computing resources to the service in the process
- ....

Luckily it’s very easy to **define**, run, and scale services with the Docker platform -- just write a `docker-compose.yml` file

A `docker-compose.yml` file is a YAML file that defines how Docker containers should behave in production.

> image或者说container只是一个app的运行环境，通常来说在完整系统里面我们不止要用到1个app，这也是微服务的架构，而每个app有各自的环境资源和部署策略
>
> 我们这样去看待：
>
> - app是面向业务，而提供解决方案的
> - servcie是面向使用者，而提供使用这个app的管理办法的
>
> 当我们将app看成是一个service的时候，我们可以对service做要上生产环境时候的确保配置，比如为每一个container设置一些容器管理参数，比如replicas、cpu资源、memory资源、重启策略等等
>
> 于是我们可以用`docker-compose.yaml`去组织一个service，这是投入生产环境时候的正确做法

### `docker-compose.yml`

Save this file as `docker-compose.yml` wherever you want. Be sure you have [pushed the image](https://docs.docker.com/get-started/part2/#share-your-image) you created in [Part 2](https://docs.docker.com/get-started/part2/) to a registry, and update this `.yml` by replacing `username/repo:tag` with your image details.

```
version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: username/repo:tag
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "4000:80"
    networks:
      - webnet
networks:
  webnet:
```

This `docker-compose.yml` file tells Docker to do the following:

- Pull the image we uploaded **before** from the registry.
- Run 5 instances of that image as a service called `web`, limiting each one to use, at most, 10% of the CPU (across all cores), and 50MB of RAM.
- Immediately restart containers if one fails.
- Map port 4000 on the host to `web`’s port 80.
- Instruct `web`’s containers to share port 80 via a load-balanced network called `webnet`. (Internally, the containers themselves publish to `web`’s port 80 at an ephemeral port.)
- Define the `webnet` network with the default settings (which is a load-balanced overlay network).

### Deploy a load-balanced app

Before we can use the `docker stack deploy` command we first run:

```bash
$ docker swarm init
Swarm initialized: current node (gadm7xrpe7br364zscnmexkf6) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-16a3wl8wfmnu8z3vzu9t2a32x8mdb7n1c25ehkqbdfxtn1g6s9-8f5x4jehjlffr957k35euvojz 10.169.161.227:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

> **Note**: We get into the meaning of that command in [part 4](https://docs.docker.com/get-started/part4/). If you don’t run `docker swarm init` you get an error that “this node is not a swarm manager.”

Now let’s run it. You need to give your app a name. Here, it is set to `getstartedlab`:

```bash
$ docker stack deploy -c docker-compose.yml getstartedlab
Creating network getstartedlab_webnet
Creating service getstartedlab_web
```

Our single service stack is running 5 container instances of our deployed image on one host. Let’s investigate.

Get the service ID for the one service in our application:

```bash
$ docker service ls
```

Look for output for the `web` service, prepended with your app name. If you named it the same as shown in this example, the name is`getstartedlab_web`. The service ID is listed as well, along with the number of replicas, image name, and **exposed ports**.

A single container running in a service is called a **task**. Tasks are given unique IDs that numerically increment, up to the number of `replicas` you defined in `docker-compose.yml`. List the tasks for your service:

```bash
$ docker service ps getstartedlab_web
```

Tasks also show up if you just list all the containers on your system, though that is not filtered by service:

```bash
$ docker container ls -q
```

### Scale the app

You can scale the app by changing the `replicas` value in `docker-compose.yml`, saving the change, and re-running the `docker stack deploy` command:

```
docker stack deploy -c docker-compose.yml getstartedlab
```

Docker performs an in-place update, no need to tear the stack down first or kill any containers.

Now, re-run `docker container ls -q` to see the deployed instances reconfigured. If you scaled up the replicas, more tasks, and hence, more containers, are started.

### Take down the app and the swarm

- Take the app down with `docker stack rm`:

  ```bash
  $ docker stack rm getstartedlab
  ```

- Take down the swarm.

  ```bash
  $ docker swarm leave --force
  ```

It’s as easy as that to stand up and scale your app with Docker. You’ve taken a huge step towards learning how to run containers in production. Up next, you learn how to run this app as a bonafide swarm on a cluster of Docker machines.

> **Note**: Compose files like this are used to define applications with Docker, and can be uploaded to cloud providers using [Docker Cloud](https://docs.docker.com/docker-cloud/), or on any hardware or cloud provider you choose with [Docker Enterprise Edition](https://www.docker.com/enterprise-edition).


### Compose file Reference

https://docs.docker.com/compose/compose-file/#args