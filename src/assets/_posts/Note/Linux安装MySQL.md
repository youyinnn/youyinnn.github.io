---
title: Linux安装MySql
tags:
  - mysql
  - linux
date: 2018-05-03 16:05:01
---

# Linux 安装 MySql

一位哲人说过，只会用 FTP 工具的人都是傻子。

## 原料

去 [Mysql 官网](https://www.mysql.com/downloads/) 下载
mysql-5.7.19-linux-glibc2.12x86_64.tar.gz。

## 步骤

- 上传至 /usr/local/
- 解压、重命名

```
tar -xvz -f mysql-5.7.19-linuxglibc2.12x86_64.tar.gz
mv /usr/local/mysql-5.7.19-linuxglibc2.12x86_64 /usr/local/mysql
```

此时 MySql 的位置在 /usr/local/mysql/

- 更改 mysql 用户组,如果没有 mysql 用户和用户组，新建即可

```
chown mysql:mysql /usr/local/mysql/
```

这里要提一句，**Linux 中有关于 MySql 的配置文件，最好都将文件所属用户和用户组设置为 mysql，因为在 MySql 启动时会读取或写入数据**。

- 在 /usr/local/mysql/support-files 新建 my_default.cnf 默认配置文件（当然可以改），并添加默认配置，以下是我的 my_default.cnf 。

```
[mysqld]
# 一般配置选项
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
port = 3306
socket = /var/run/mysqld/mysqld.sock
character-set-server=utf8
[client]
socket = /var/run/mysqld/mysqld.sock
[mysql]
```

这里提一句，在新建完之后`ll my_default.cnf`查看一下该文件的用户和用户组，如果是 root 将其改为 mysql。

- 注册和初始化 MySql 服务

```
bin/mysqld --initialize-insecure --user=mysql --basedir=/usr/local/mysql/ --datadir=/usr/local/mysql/data/
```

在这里提示了错误

```
bin/mysqld: error while loading shared libraries: libnuma.so.1: cannot open shared object file: No such file or directory
```

具体意思好像是什么东西没有安装，查了一下 libnuma.so.1 这个东西，可以安装 numactl 来解决这个问题

```
yum install numactl
```

继续初始化服务，虽然有警告，打没有报错

- 复制上述的 my_default.cnf 和 mysql.server 配置文件到 etc 目录，之前复制过该文件到 etc 目录，它这里提示是否覆盖，输入 Y 覆盖

```
cp -a /usr/local/mysql/support-files/my_default.cnf /etc/my.cnf
cp: overwrite ‘/etc/my.cnf’? y
cp -a /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
```

cp 使用 -a 参数，会将该文件的属性（用户组，用户）都复制

- 启动 MySql 服务

```
/usr/local/mysql/bin/mysqld_safe --user=mysql
```

- 重新启动 MySql

```
/etc/init.d/mysqld restart
Shutting down MySQL.. SUCCESS!
Starting MySQL. SUCCESS!
```

但是在登陆的时候出现了一点问题

```
 /usr/local/mysql/bin/mysql -u root -p
Enter password:
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
```

他说在 /tmp/mysql.sock 连接不到 MySQL 的 socket，看到这我仿佛明白了什么，在 MySQL 启动的时候，会读取 /etc/my.cnf 配置文件，在里面可以配置 mysql 的 socket ，当没有配置时 默认就是 socket=/tmp/mysql.sock ，这就简单了，找到我们的 sock 文件 配置到 mysql 节点下面，像这样

```
[mysqld]
# 一般配置选项
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
port = 3306
socket = /var/run/mysqld/mysqld.sock
character-set-server=utf8
[client]
socket = /var/run/mysqld/mysqld.sock
[mysql]
socket = /var/run/mysqld/mysqld.sock ===>这里
```

- 重启 MySQL，从新以 root 进入 mysql

```
/etc/init.d/mysqld restart
Shutting down MySQL.. SUCCESS!
Starting MySQL. SUCCESS!
/usr/local/myqsl/bin/mysql -u root -p
Enter password:
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.19 MySQL Community Server (GPL)
Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

剩下的初始化密码，建立远程连接就不写了。emmm ,在 Linux 下面 安装 MySql 的方法还有很多，慢慢参透吧。

## 参考

[http://www.cnblogs.com/wy123/p/6815049.html](http://www.cnblogs.com/wy123/p/6815049.html)
[http://blog.csdn.net/yoon0205/article/details/50605584](http://blog.csdn.net/yoon0205/article/details/50605584)
