## Docker

### Centos Installation

问题描述：在 Centos8 系统中，使用 docker run 时，出现如下报错：

```bash
Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.
Error: open /proc/self/uid_map: no such file or directory
```

解决办法：

1. 卸载 podman 软件（可以使用 rpm -qa|grep docker）

   ```bash
   yum remove docker
   ```

2. 下载 docker-ce 源

   ```bash
   curl https://download.docker.com/linux/centos/docker-ce.repo -o /etc/yum.repos.d/docker-ce.repo
   ```

3. 安装 docker-ce

   ```bash
   yum install docker-ce -y
   ```

问题原因分析：
Centos 8 使用 yum install docker -y 时，默认安装的是 podman-docker 软件
