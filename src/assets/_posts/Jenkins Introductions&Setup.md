---
title: Jenkins Introductions&Setup
categories:
  - jenkins
  - notes
tags:
  - setup
  - jenkins
date: 2018-11-19 14:51:00
series: jenkins
---

### Introductions

首先 Jenkins 要吐槽一下，Jenkins 的 Logo 真的是太丑了，虽然很明显是一个管家形象- -

![](../img/20181119145558.png)

Jenkins 的默认 UI 也有点丑，还不如官网的 UI 好看

但是不影响这玩意的强大表现

### Installation on CentOS

#### Fetch yum repo

Add the Jenkins repository to the yum repos, and install Jenkins from here.

There is also [a LTS YUM repository](http://pkg.jenkins-ci.org/redhat-stable/) for the [LTS Release Line](https://wiki.jenkins.io/display/JENKINS/LTS+Release+Line)

- `sudo wget -O /etc/yum.repos.d/jenkins.repo` `http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo`
- `sudo rpm --import` `https://jenkins-ci.org/redhat/jenkins-ci.org.key`
- `sudo yum install jenkins`

#### Installation of Java

Jenkins requires Java in order to run, yet certain distros don't include this by default. To install the Open Java Development Kit (OpenJDK) run the following:

```bash
$ sudo yum install java
```

**Note:** If running CentOS, ensure you follow the [guide below](https://wiki.jenkins.io/display/JENKINS/Installing+Jenkins+on+Red+Hat+distributions#InstallingJenkinsonRedHatdistributions-ImportantNoteonCentOSJava).

#### Start/Stop

- `sudo service jenkins start/stop/restart`
- `sudo chkconfig jenkins on`

**Note:** if you get the following error message, ensure that Java has been installed:

```bash
Starting jenkins (via systemctl):  Job `for` jenkins.service failed. See `'systemctl status jenkins.service'` and `'journalctl -xn'` `for` details.[FAILED]
```

#### What does this package do?

- Jenkins will be launched as a daemon on startup. See `/etc/init.d/jenkins` for more details.
- The '`jenkins`' user is created to run this service. If you change this to a different user via the config file, you must change the owner of /var/log/jenkins, /var/lib/jenkins, and /var/cache/jenkins.
- Log file will be placed in `/var/log/jenkins/jenkins.log`. Check this file if you are troubleshooting Jenkins.
- `/etc/sysconfig/jenkins` will capture configuration parameters for the launch.
- By default, Jenkins listen on port 8080. Access this port with your browser to start configuration. Note that the built-in firewall may have to be opened to access this port from other computers. (See <http://www.cyberciti.biz/faq/disable-linux-firewall-under-centos-rhel-fedora/> for instructions how to disable the firewall permanently)
- A Jenkins RPM repository is added in `/etc/yum.repos.d/jenkins.repo`

> **Notice**:
>
> - 可以在`/etc/sysconfig/jenkins`这个路径下找到 Jenkins 的配置文件
> - 要在 CentOS 下支持 Jenkins，请不要使用 JDK，要安装 OpenJDK

#### More: change Jenkins run as with root

在 Jenkins 中运行 shell 脚本经常遇到权限问题，解决起来非常麻烦，我们索性来个终极解决办法，就是给 jenkins 一个 root 权限，这样就不会再遇到权限问题了。

1. `vim /etc/sysconfig/jenkins`

2. 找到 JENKINS_USER 改为 “root”:

```
JENKINS_USER="root"
```

3)然后更改 Jenkins home，webroot 和日志的所有权：

```bash
$ chown -R root:root /var/lib/jenkins
$ chown -R root:root /var/cache/jenkins
$ chown -R root:root /var/log/jenkins
```

4).重新启动 Jenkins 并检查用户是否已被更改

```bash
$ service jenkins restart
```

这样我们就给 jenkins 设置了 root 权限，我们再运行 shell 脚本就不会提示权限问题了。

#### Wiki

https://wiki.jenkins.io/display/JENKINS/Installing+Jenkins+on+Red+Hat+distributions

### Create your first pipline by using github repo as branch source

To get started quickly with Pipeline:

1. Copy one of the [examples below](https://jenkins.io/doc/pipeline/tour/hello-world/#examples) into your repository and name it `Jenkinsfile`
2. Click the **New Item** menu within Jenkins
3. Provide a name for your new item (e.g. **My Pipeline**) and select **Multibranch Pipeline**
4. Click the **Add Source** button, choose the type of repository you want to use and fill in the details.
5. Click the **Save** button and watch your first Pipeline run!

![](../img/20181119184317.png)

Jinkinsfile:

```Jenkinsfile
// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent { docker { image 'maven:3.3.3' } }
    stages {
        stage('build') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}
```

Then when the pipline is building, you can see the console output at:

![](../img/20181119185023.png)
