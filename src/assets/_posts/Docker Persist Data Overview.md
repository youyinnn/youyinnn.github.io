---
title: Docker Persist Data Overview
categories:
  - docker
  - notes
tags:
  - docker
  - volume
date: 2018-12-4 9:44:33
series: docker
---



### Introduction

By default all files created inside a container are stored on a writable container layer.

That means that the data doesn't persist when that container no longer exists, and it can be difficult to get the data out of the container if another process needs it.

And here's you should know: a container's writable layer is tightly coupled to the host machine where the container is running. So **you can't easily move the data somewhere else**.

Docker has two options for containers to store files in the host machine, so that the files are persisted even after the container stops: 

- *volumes*
- *bind mounts*

If you’re running Docker on Linux you can also use a *tmpfs mount*.

### Choose the right type of mount

No matter which type of mount you choose to use, the data looks the same from within the container. It is exposed as either a directory or an individual file in the container’s filesystem.

An easy way to visualize the difference among volumes, bind mounts, and `tmpfs` mounts is to think about where the data lives on the Docker host.

![types of mounts and where they live on the Docker host](https://docs.docker.com/storage/images/types-of-mounts.png)

- **Volumes** are stored in a part of the host filesystem which is *managed by Docker* (`/var/lib/docker/volumes/` on Linux). Non-Docker processes should not modify this part of the filesystem. Volumes are the best way to persist data in Docker.

  > Created and managed by Docker. You can create a volume explicitly using the `docker volume create` command, or Docker can create a volume during container or service creation.
  >
  > When you create a volume, it is stored within a directory on the Docker host. When you mount the volume into a container, this directory is what is mounted into the container. This is similar to the way that bind mounts work, except that volumes are managed by Docker and are isolated from the core functionality of the host machine.
  >
  > A given volume can be mounted into multiple containers simultaneously. **When no running container is using a volume, the volume is still available to Docker and is not removed automatically.** You can remove unused volumes using `docker volume prune`.
  >
  > When you mount a volume, it may be **named** or **anonymous**. Anonymous volumes are not given an explicit name when they are first mounted into a container, so Docker gives them a random name that is guaranteed to be unique within a given Docker host. Besides the name, named and anonymous volumes behave in the same ways.
  >
  > Volumes also support the use of *volume drivers*, which allow you to **store your data on remote hosts or cloud providers, among other possibilities**.

- **Bind mounts** may be stored *anywhere* on the host system. They may even be important system files or directories. **Non-Docker processes on the Docker host or a Docker container can modify them at any time**.

  > Available since the early days of Docker. Bind mounts have limited functionality compared to volumes. 
  >
  > When you use a bind mount, a file or directory on the *host machine* is mounted into a container. The file or directory is referenced by its full path on the host machine. The file or directory does not need to exist on the Docker host already. It is created on demand if it does not yet exist. Bind mounts are very performant, but they rely on the host machine’s filesystem having a specific directory structure available. If you are developing new Docker applications, consider using named volumes instead. You can’t use Docker CLI commands to directly manage bind mounts.

- **tmpfs mounts** are stored in the host system’s memory only, and are never written to the host system’s filesystem.

  > A `tmpfs` mount is not persisted on disk, either on the Docker host or within a container. It can be used by a container during the lifetime of the container, to store non-persistent state or sensitive information. For instance, internally, swarm services use `tmpfs` mounts to mount [secrets](https://docs.docker.com/engine/swarm/secrets/) into a service’s containers.

### Use case

#### For volumes

- **Sharing data among multiple running containers.** If you don’t explicitly create it, a volume is created the first time it is mounted into a container. When that container stops or is removed, the volume still exists. Multiple containers can mount the same volume simultaneously, either read-write or read-only. Volumes are only removed when you explicitly remove them.
- Volumes help you **decouple the configuration** of the Docker host from the container runtime.
- When you want to **store your container’s data on a remote host or a cloud provider**, rather than locally.
- When you **need to back up, restore, or migrate data** from one Docker host to another, volumes are a better choice. You can stop containers using the volume, then back up the volume’s directory (such as `/var/lib/docker/volumes/<volume-name>`).

#### For bind mounts

- **Sharing configuration files from the host machine to containers.** 

  This is how Docker provides DNS resolution to containers by default, by mounting `/etc/resolv.conf` from the host machine into each container.

- **Sharing source code or build artifacts between a development environment on the Docker host and a container.** 

  **For image user:** you may mount a Maven `target/` directory into a container, and each time you build the Maven project on the Docker host, the container gets access to the rebuilt artifacts.

  **For image developer:** your production Dockerfile would copy the production-ready artifacts directly into the image, rather than relying on a bind mount.

- When the file or directory structure of the Docker host is guaranteed to be consistent with the bind mounts the containers require.

#### For tmpfs mounts

`tmpfs` mounts are best used for cases when you do not want the data to persist either on the host machine or within the container. This may be for security reasons or to protect the performance of the container when your application needs to write a large volume of non-persistent state data.

### :gem:Tips for using bind mounts or volumes

If you use either bind mounts or volumes, keep the following in mind:

- If you mount an **empty volume** into a directory in the container in which files or directories exist, these files or directories are propagated (copied) into the volume. Similarly, if you start a container and specify a volume which does not already exist, an empty volume is created for you. This is a good way to pre-populate data that another container needs.
- If you mount a **bind mount or non-empty volume** into a directory in the container in which some files or directories exist, these files or directories are obscured by the mount.



### Conclusion

We have three ways to manage data on a running container:

1. volume: 
   - docker managed
   - the most powerful way to manage data between host machine and container
   - data persist on `/var/lib/docker/volumes/<volume-name>`
2. bind mount:
   - non-docker managed
   - able to access the every where on host machine
   - quite unsafe but easily to work
3. tmpfs mount:
   - persist data on memory
   - for security and protection reason