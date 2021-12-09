## Linux

### Shell

#### expect 让你的 shell 可以处理交互命令（如自动 ssh 远程登陆另一台主机）

- https://www.jianshu.com/p/70556b1ce932
- https://www.cnblogs.com/lzrabbit/p/4298794.html
- https://www.jellythink.com/archives/373

#### set 设置你 shell 脚本的运行配置

- https://www.cnblogs.com/liduanjun/p/3536996.html

#### read 在 shell 里面读取新的字符

- http://www.runoob.com/linux/linux-comm-read.html

#### wc 计算字数

- http://www.runoob.com/linux/linux-comm-wc.html

#### cut 字符串切割

- https://www.jb51.net/article/41872.htm

#### shell 脚本 sudo 外部输入密码

- https://blog.csdn.net/qq_23587541/article/details/82841489

#### ./和 sh 执行脚本的区别：

- `./`需要执行权限，使用脚本文件中第一行`#!`指定的 shell（解释器）来执行命令（譬如常见的/bin/bash），不指定系统会调用默认 shell 程序
- `sh`不需要执行权限，是使用`sh`这个 shell 执行命令，是个软链接，它可能是一个任意的 shell，通常默认是`bash shel`，用 type 命令可以查看

#### nohup 使用详解

- https://www.cnblogs.com/jinxiao-pu/p/9131057.html

#### **linux中添加用户自定义的命令**(全局命令)

http://www.findme.wang/blog/detail/id/261.html

https://www.cnblogs.com/Survivalist/p/11297938.html



### Tools & System

#### 工具

- fzf：https://www.colabug.com/4062481.html

#### 设置

- 修改终端提示符：https://www.cnblogs.com/xiaofeiIDO/p/8037331.html
- 环境变量：https://www.cnblogs.com/haore147/p/3633116.html

#### 命令

- 命令大全：http://man.linuxde.net/
- 一些巨棒的命令替代：https://linux.cn/article-10171-1.html

#### CentOS

##### yum 详解

- http://www.cnblogs.com/vathe/p/6736094.html
- [执行 yum 相关命令总是卡住，ctrl+c 也退出不了](https://www.cnblogs.com/wholj/p/11031220.html)

##### LC_CTYPE

On a freshly installed CentOS 7 machine, I got the following notice when I SSH’d into the server.

```
warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
```

The fix is pretty straight-forward. On the server (not your client), edit the file `/etc/environment` and add the following lines.

(You’ll need root privileges to do this)

```
$ cat /etc/environment
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
```

Log out & back in and you should notice the warning message is gone.

#### Ubuntu

##### apt-get 详解

- https://blog.csdn.net/sinat_31206523/article/details/78138822
- https://blog.csdn.net/yessharing/article/details/55806090

##### 安装 nodejs

1. 通过**nvm**

   https://nodejs.org/en/download/package-manager/#nvm



