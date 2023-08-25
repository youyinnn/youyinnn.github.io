---
title: Docker Swarm&ClusterSetup
tags:
  - docker
  - cluster
  - swarm
date: 2018-11-28 21:06:03
series: docker
---

### Introduction

In the last post, we discussed the relationship between Application and Service.

So they say: **Services are really just "Containers in Production".**

And when we deploy a service, we use `docker swarm init` to prepare for it.

Now let's learn what is swarm and how to setup a cluster with **docker-machine**.

### Swarm

**A swarm is a group of machines that are running Docker and joined into a cluster.**

After that has happened, you continue to run the Docker commands you’re used to, but now they are executed on a cluster by a **swarm manager**. The machines in a swarm can be **physical or virtual**. After joining a swarm, they are referred to as **nodes**.

Swarm managers can use several **strategies** to run containers, such as :

- “emptiest node”

  which fills the least utilized machines with containers.

- “global”

  which ensures that each machine gets exactly one instance of the specified container.

You instruct the swarm manager to use these strategies **in the Compose file**, just like the one you have already been using.

#### Swarm manager

Swarm managers are the only machines in a swarm that can execute your commands, or authorize other machines to join the swarm as **workers**. Workers are just there to provide capacity and do not have the authority to tell any other machine what it can and cannot do.

```
Relationship in swarm:

	1.each virtual/physical machine as a "node" ni a swarm.
							(node)			(node)			(node)
			  		 		-------			-------			-------
  	2."swarm init" --->  	|  A  |			|  B  |			|  C  |
       then A became 	 	-------			-------			-------
       manager         	"swarm manager"     "worker"		"worker"

	3.other nodes can "join" the swarm and became "worker" to work for the "manager",
    "manager" certainly can manage it's "workers"
```

### Setup your swarm with virtual machines

> **:warning:Notice:**
>
> If your machine is a cloud server such as "Tencent Cloud Server", you might couldn't able to create a vm on it.Because your machine is also a vm too ! There are some hardware options should support from a phycial machine.
>
> But you can still follow the post and practice with it, on this section, you should focus on the concept of swarm and knowning how to create vms with `docker-machine`.

So, how can we setup a swarm with multiple machine for just practice ? Several real machine ? No, you could create some virtual machine by `docker-machine`. Then use the as a node of swarm.

#### Install VirtualBox

You need a hypervisor that can create virtual machines (VMs), so [install Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads) for your machine’s OS.

Some RPM base:

- [rpmfind](http://rpmfind.net/linux/RPM/index.html)
- [pkgs](https://pkgs.org/)
- [pbone](http://rpm.pbone.net/)

#### Install docker-machine

> **Notice:**
>
> **Never ever intall docker on WIN10 system !!! Because the `Hyper-V` that docker need will just weaken your machine's performance at some ways !!! Such as I found my LOL's fps rate was suddenly fall down to 58-61, and it usually was 100+ !!! And when I uninstall the docker on WIN10 then turn off the `Hyper-V` on windows functional options, the fps problem was solved !!!**

1. download

   ```bash
   $ base=https://github.com/docker/machine/releases/download/v0.16.0 && wget $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine
   ```

2. install

   ```bash
   $ install /tmp/docker-machine /usr/local/bin/docker-machine
   ```

3. verify

   ```bash
   $ docker-machine
   Usage: docker-machine [OPTIONS] COMMAND [arg...]
   Create and manage machines running Docker.
   Version: 0.16.0, build 702c267f
   ...
   ```

Reference: https://docs.docker.com/machine/install-machine/#install-machine-directly

#### Create virtual machines

Now, create a couple of VMs using `docker-machine`, using the VirtualBox driver:

```bash
$ docker-machine create --driver virtualbox myvm1
$ docker-machine create --driver virtualbox myvm2
```

You now have two VMs created, named `myvm1` and `myvm2`.

Use this command to list the machines and get their IP addresses.

```bash
$ docker-machine ls
```

Here is example output from this command.

```bash
$ docker-machine ls
NAME    ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER        ERRORS
myvm1   -        virtualbox   Running   tcp://192.168.99.100:2376           v17.06.2-ce
myvm2   -        virtualbox   Running   tcp://192.168.99.101:2376           v17.06.2-ce
```

#### Initalize the swarm and add nodes

The first machine acts as the manager, which executes management commands and authenticates workers to join the swarm, and the second is a worker.

You can send commands to your VMs using `docker-machine ssh`. Instruct `myvm1` to become a swarm manager with `docker swarm init` and look for output like this:

```bash
$ docker-machine ssh myvm1 "docker swarm init --advertise-addr <myvm1 ip>"
Swarm initialized: current node <node ID> is now a manager.

To add a worker to this swarm, run the following command:

  docker swarm join \
  --token <token> \
  <myvm ip>:<port>

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

> ##### Ports 2377 and 2376
>
> Always run `docker swarm init` and `docker swarm join` with port 2377 (the swarm management port), or no port at all and let it take the default.
>
> The machine IP addresses returned by `docker-machine ls` include port 2376, which is the Docker daemon port. Do not use this port or [you may experience errors](https://forums.docker.com/t/docker-swarm-join-with-virtualbox-connection-error-13-bad-certificate/31392/2).

> ##### Having trouble using SSH? Try the --native-ssh flag
>
> Docker Machine has [the option to let you use your own system’s SSH](https://docs.docker.com/machine/reference/ssh/#different-types-of-ssh), if for some reason you’re having trouble sending commands to your Swarm manager. Just specify the `--native-ssh` flag when invoking the `ssh` command:
>
> ```
> docker-machine --native-ssh ssh myvm1 ...
> ```

As you can see, the response to `docker swarm init` contains a pre-configured `docker swarm join` command for you to run on any nodes you want to add. Copy this command, and send it to `myvm2` via `docker-machine ssh` to have `myvm2` join your new swarm as a worker:

```
$ docker-machine ssh myvm2 "docker swarm join \
--token <token> \
<ip>:2377"

This node joined a swarm as a worker.
```

Congratulations, you have created your first swarm!

Run `docker node ls` on the manager to view the nodes in this swarm:

```
$ docker-machine ssh myvm1 "docker node ls"
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
brtu9urxwfd5j0zrmkubhpkbd     myvm2               Ready               Active
rihwohkh3ph38fhillhhb84sk *   myvm1               Ready               Active              Leader
```

> ##### Leaving a swarm
>
> If you want to start over, you can run `docker swarm leave` from each node.

### Deploy your app on the swarm cluster

**The hard part is over.** Now you just repeat the process you used in [part 3](https://docs.docker.com/get-started/part3/) to deploy on your new swarm.

**Just remember that only swarm managers like `myvm1` execute Docker commands; workers are just for capacity.**

#### Two ways to talk to your vms

So far, you’ve been wrapping Docker commands in `docker-machine ssh` to talk to the VMs.

Another option is to run `docker-machine env <machine>` to get and run a command that configures your current shell to talk to the Docker daemon on the VM. This method works better for the next step because it allows you to use your local `docker-compose.yml` file to deploy the app “remotely” without having to copy it anywhere.

Type `docker-machine env myvm1`, then copy-paste and run the command provided as the last line of the output to configure your shell to talk to `myvm1`, the swarm manager.

The commands to configure your shell differ depending on whether you are Mac, Linux, or Windows, so examples of each are shown on the tabs below.

To more details, refer to: https://docs.docker.com/get-started/part4/#configure-a-docker-machine-shell-to-the-swarm-manager

#### Deploy

```bash
# send compose file to manager node with scp
$ docker-machine scp docker-compose.yml myvm1:~

# deploy it
$ docker-machine ssh myvm1 "docker stack deploy -c docker-compose.yml getstartedlab"
Creating network getstartedlab_webnet
Creating service getstartedlab_web

# get it's info
$ docker-machine ssh myvm1 "docker stack ps getstartedlab"
ID                  NAME                  IMAGE                              NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
kjeymj6rp0y8        getstartedlab_web.1   johndmulhausen/get-started:part1   myvm2               Running             Running 24 seconds ago
dehkjrmu0fxn        getstartedlab_web.2   johndmulhausen/get-started:part1   myvm1               Running             Running 18 seconds ago
acnejfyy1cmg        getstartedlab_web.3   johndmulhausen/get-started:part1   myvm2               Running             Running 24 seconds ago
36lpsek707gj        getstartedlab_web.4   johndmulhausen/get-started:part1   myvm1               Running             Running 18 seconds ago
q5yb5uj97ef1        getstartedlab_web.5   johndmulhausen/get-started:part1   myvm2               Running             Running 24 seconds ago
```

### Accessing your cluster

You can access your app from the IP address of **either** `myvm1` or `myvm2`.

The network you created is shared between them and load-balancing. Run `docker-machine ls` to get your VMs’ IP addresses and visit either of them on a browser, hitting refresh (or just `curl` them).

There are five possible container IDs all cycling by randomly, demonstrating the load-balancing.

**The reason both IP addresses work is that nodes in a swarm participate in an ingress routing mesh**.

This ensures that a service deployed at a certain port within your swarm always has that port reserved to itself, no matter what node is actually running the container. Here’s a diagram of how a routing mesh for a service called `my-web` published at port `8080` on a three-node swarm would look:

![ingress-routing-mesh](https://docs.docker.com/engine/swarm/images/ingress-routing-mesh.png)

### Enough for now

So far you can do a lot of things with docker-machine and knowing how to setup a docker swarm with what you've learn.

There are also some options you might have check out such as cleanup/reboot/reset.

Please refer to: https://docs.docker.com/get-started/part4/#cleanup-and-reboot
