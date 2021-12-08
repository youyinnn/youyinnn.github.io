---
title: Docker Containers&Dockerfile
categories:
  - docker
  - notes
tags:
  - docker
date: 2018-11-16 15:05:11
series: docker
---

### Introduction

本篇主要介绍Docker里面Containers的概念，以及它的定义

还有就是如何分享你创建的Containers到hub上面

需要注意的是，containers的定义其实就是image的定义

以及说到了docker run了两个option`-p`和`-d`

### Define a container with Dockerfile

`Dockerfile` defines what goes on in the environment inside your container. Access to resources like networking interfaces and disk drives is virtualized inside this environment, which is isolated from the rest of your system, so you need to map ports to the outside world, and be specific about what files you want to “copy in” to that environment. However, after doing that, you can expect that the build of your app defined in this `Dockerfile` behaves exactly the same wherever it runs.

#### Dockerfile

Create an empty directory. Change directories (`cd`) into the new directory, create a file called `Dockerfile`, copy-and-paste the following content into that file, and save it. Take note of the comments that explain each statement in your new Dockerfile.

```dockerfile
# Use an official Python runtime as a parent image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

This `Dockerfile` refers to a couple of files we haven’t created yet, namely `app.py` and `requirements.txt`. Let’s create those next.

#### The App itself

Create two more files, `requirements.txt` and `app.py`, and put them in the same folder with the `Dockerfile`. This completes our app, which as you can see is quite simple. When the above `Dockerfile` is built into an image, `app.py` and `requirements.txt` is present because of that `Dockerfile`’s `COPY` command, and the output from `app.py` is accessible over HTTP thanks to the `EXPOSE`command.

##### `requirements.txt`

```
Flask
Redis
```

##### `app.py`

```python
from flask import Flask
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```

Now we see that `pip install -r requirements.txt` installs the Flask and Redis libraries for Python, and the app prints the environment variable `NAME`, as well as the output of a call to `socket.gethostname()`. Finally, because Redis isn’t running (as we’ve only installed the Python library, and not Redis itself), we should expect that the attempt to use it here fails and produces the error message.

> **Note**: Accessing the name of the host when inside a container retrieves the container ID, which is like the process ID for a running executable.

That’s it! You don’t need Python or anything in `requirements.txt` on your system, nor does building or running this image install them on your system. It doesn’t seem like you’ve really set up an environment with Python and Flask, but you have.

> **Notice**: For quick start and practice, I didn't install the Redis library on my build.

#### Build the app

We are ready to build the app. Make sure you are still at the top level of your new directory. Here’s what `ls` should show:

```bash
$ ls
Dockerfile		app.py			requirements.txt
```

Now run the build command. This creates a Docker image, which we’re going to tag using `-t` so it has a friendly name.

```bash
docker build -t hello-hj .
```

Where is your built image? It’s in your machine’s local Docker image registry:

```bash
$ docker image ls

REPOSITORY            TAG                 IMAGE ID
hello-hj         	latest              326387cea398
```

#### Run the app

##### run on the frontground

Run the app, mapping your machine’s port 4000 to the container’s published port 80 using `-p`:

```
docker run -p 4000:80 hello-hj
```

You should see a message that Python is serving your app at `http://0.0.0.0:80`. But that message is coming from inside the container, which doesn’t know you mapped port 80 of that container to 4000, making the correct URL `http://localhost:4000`.

Go to that URL in a web browser to see the display content served up on a web page.

##### run on the background

Now let’s run the app in the background, in detached mode:

```
docker run -d -p 4000:80 hello-hj
```

You get the long container ID for your app and then are kicked back to your terminal. Your container is running in the background. You can also see the abbreviated container ID with `docker container ls` (and both work interchangeably when running commands):

``` bash
$ docker container ls
CONTAINER ID        IMAGE               COMMAND             CREATED
1fa4ab2cf395        hello-hj       "python app.py"     28 seconds ago
```

Notice that `CONTAINER ID` matches what’s on `http://localhost:4000`.

##### stop an container

Now use `docker container stop` to end the process, using the `CONTAINER ID`, like so:

``` bash
docker container stop 1fa4ab2cf395
```

### Share your image to the hub

#### Log in with your Docker ID

If you don’t have a Docker account, sign up for one at [hub.docker.com](https://hub.docker.com/). Make note of your username.

Log in to the Docker public registry on your local machine.

``` bash
$ docker login
```

#### Tag the image

The notation for associating a local image with a repository on a registry is `username/repository:tag`. The tag is optional, but recommended, since it is the mechanism that registries use to give Docker images a version. Give the repository and tag meaningful names for the context, such as `get-started:part2`. This puts the image in the `get-started` repository and tag it as `part2`.

Now, put it all together to tag the image. Run `docker tag image` with your username, repository, and tag names so that the image uploads to your desired destination. The syntax of the command is:

``` bash
docker tag image username/repository:tag
```

For example:

``` bash
docker tag hello-hj youyinnn/getstarted:tag1
```

Run [docker image ls](https://docs.docker.com/engine/reference/commandline/image_ls/) to see your newly tagged image.

``` bash
$ docker image ls

REPOSITORY               TAG                 IMAGE ID            CREATED             SIZE
hello-hj              latest              27caa1c952f6        2 days ago          130MB
youyinnn/getstarted   tag1                27caa1c952f6        2 days ago          130MB
python                2.7-slim            804b0a01ea83        4 weeks ago         120MB
hello-world           latest              4ab4c602aa5e        2 months ago        1.84kB
```

#### Publish the image

Upload your tagged image to the repository:

``` bash
docker push username/repository:tag
```

Once complete, the results of this upload are publicly available. If you log in to [Docker Hub](https://hub.docker.com/), you see the new image there, with its pull command.

#### Pull and run the image from the remote repository

From now on, you can use `docker run` and run your app on any machine with this command:

``` bash
docker run -p 4000:80 username/repository:tag
```

If the image isn’t available locally on the machine, Docker pulls it from the repository.

``` bash
$ docker run -p 4000:80 youyinnn/getstarted:tag1 
Unable to find image 'youyinnn/getstarted:tag1' locally
part2: Pulling from gordon/get-started
10a267c67f42: Already exists
f68a39a6a5e4: Already exists
9beaffc0cf19: Already exists
3c1fe835fb6b: Already exists
4c9f1fa8fcb8: Already exists
ee7d8f576a14: Already exists
fbccdcced46e: Already exists
Digest: sha256:a569b6b6dc5afc145b4be32ed4d7c7407269c3ecd426dc3b5602b5cf9e3c6ac1
Status: Downloaded newer image for youyinnn/getstarted:tag1
 * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)
```

No matter where `docker run` executes, it pulls your image, along with Python and all the dependencies from `requirements.txt`, and runs your code. It all travels together in a neat little package, and you don’t need to install anything on the host machine for Docker to run it.

### Dockerfile reference

Docker can build images automatically by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. Using `docker build` users can create an automated build that executes several command-line instructions in succession.

For more information,  please refer to: **https://docs.docker.com/engine/reference/builder/#usage**