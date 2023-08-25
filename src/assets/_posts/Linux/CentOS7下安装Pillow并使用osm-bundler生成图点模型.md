---
title: CentOS7下安装Pillow并使用osm-bundler生成图点模型
comments: true
tags:
  - centos7
  - python
  - Pillow
  - osm-bundler
  - pip
date: 2018-01-21 11:50:30
---

{% cq %}
前言：之前留下的 17 大创项目总得做点什么，马上就要结题了，我们做的 AR 留影需要将用户照下来的照片生成点云然后合成模型。由此 Escnqh[link:gayhub]找到了使用 PIL+osm-bundler 的解决方案。
{% endcq %}

<!-- more -->

### Python Photogrammetry ToolKit（PPT）

这玩意是意大利的一个团队开发的一个 Python 图像处理工具包，正是这个工具包提供的 osm-bundler 加上 PIL 构成了一套解决方案。

官网：http://184.106.205.13/arcteam/ppt.php

#### PIL

> The Python Imaging Library (PIL) adds image processing capabilities to your Python interpreter. This library supports many file formats, and provides powerful image processing and graphics capabilities.

简单来说就是 Python 的图像处理库，osm-bundler 基于这个库对图像进行分析。

官网：http://www.pythonware.com/products/pil/

但是很坑的一点是，这个项目 09 年就停止维护了，所以安装这个东西异常困难。

#### Pillow

由于 PIL 属于史前神物，无法触碰，安装过程中所需要的组件特别零散，其实这对于 Debian 系的 Linux 系统来说问题并不大，大部分的库使用 apt 就能获取到，但是我的服务器是 CentOS7，属于 Redhat 系的，只有 yum 和 rpm。而开发 PPT 的意大利团队是在 Debian 下开发的，Redhat 下库的获取不一样，所以我还不能按照官方给的思路来进行 PPT 的部署- -///。

于是我找到了 Pillow。

介绍：

> Pillow is the friendly PIL fork by Alex Clark and Contributors. PIL is the Python Imaging Library by Fredrik Lundh and Contributors.

Pillow 是 PIL 的一个友好的 Fork，而且这个项目在 GitHub 上持续维护。

官网：http://pillow.readthedocs.io/en/latest/index.html

hub：https://github.com/python-pillow/Pillow

所以说，我可以使用 Pillow 来代替 PIL，这是完全可行的！！

而且 Pillow 的安装异常简单，我们只需要使用 python 系的包管理工具 PIP 就可以一键安装！！！

#### PIP

> The PyPA recommended tool for installing Python packages.

官网：https://pip.pypa.io/en/stable/

---

### 安装 PPT

#### 安装 Python

这是一切的大前提，你的系统里需要有 python 环境，但是一般的 linux 都会内置一个，只不过你不要使用版本太低的 python 就好，具体到多少我也不清楚，python 的版本断代真的是傻的不行。

#### 安装 pip

自己看：https://packaging.python.org/guides/installing-using-linux-tools/#installing-pip-setuptools-wheel-with-linux-package-managers

然后需要更新一下 pip

```bash
pip install -U pip
```

#### 安装 Pillow

Installation 页：http://pillow.readthedocs.io/en/latest/installation.html

大概浏览一下这个页面，不要急着一上来就安装 Pillow。

在“External Libraries”一节，它提示我们，在安装 Pillow 之前我们需要安装完运行 Pillow 所需的库。

开发 Pillow 的团队在 hub 的 depends 文件夹下提供了这些库在各种系统下的安装脚本，我们选择 fedora_23.sh 的脚本(fedora 是 RedHat)，但是不要运行这个脚本，我们看它对应的 package 需要安装哪些就好。

![fedora](../../img/3aef0a673e1639aec3272e205b934971.png)

如图最下面一行，在 centos 下就可以执行：

```bash
yum install libtiff-devel libjpeg-devel zlib-devel freetype-devel  lcms2-devel libwebp-devel openjpeg2-devel tkinter python3-tkinter  tcl-devel tk-devel harfbuzz-devel fribidi-devel libraqm-devel
```

![yum](../../img/5e3b4f30ce74fefbc7e2ebfcccb76543.png)

这些我都安装过了，其中丢失的 python3-tkinter 在 centos 下没有那就不用管了。

这些库安装完之后，我们就可以安装 Pillow 了：

```bash
pip install Pillow
```

安装完 Pillow 我们来验证一下，我们写一个 test.py 脚本：

```python
from PIL import Image
picPath = './card.jpg'

im = Image.open(picPath)
print im.getbbox()
```

和脚本一起有一个 card.jpg 文件，我们使用 Pillow 来分析这个文件，执行：

```bash
python test.py
```

分析出了数据：

```bash
[root@VM_16_214_centos youyinnn]# python test.py
(0, 0, 564, 738)
[root@VM_16_214_centos youyinnn]#
```

说明已经安装成功！

#### 安装 BLAS 库

我们要使用 PPT，除了 PIL 之外，还需要两个重要组件，其中一个便是 BLAS (libblas3gf, libblas-dev) 。

就不介绍了，直接开始安装，在 centos 下的安装比较奇葩，因为 PPT 官网给的包名什么的都是 apt 有的，有的可能 yum 下没有，所以我们需要选择合适的库：

首先把 blas 安装了：

```bash
yum install blas
```

以上命令在我的主机上会安装"blas-3.4.2-8.el7.x86_64"：

```bash
[root@VM_16_214_centos youyinnn]# yum install blas
Loaded plugins: fastestmirror, langpacks
Repository epel is listed more than once in the configuration
Loading mirror speeds from cached hostfile
Package blas-3.4.2-8.el7.x86_64 already installed and latest version
Nothing to do
[root@VM_16_214_centos youyinnn]#
```

它主要提供一下三个 lib：

```bash
/usr/lib64/libblas.so.3
/usr/lib64/libblas.so.3.4
/usr/lib64/libblas.so.3.4.2
```

然后 search 一下 blas：

```bash
[root@VM_16_214_centos youyinnn]# yum search blas
Loaded plugins: fastestmirror, langpacks
Repository epel is listed more than once in the configuration
Loading mirror speeds from cached hostfile
==================================================================================== N/S matched: blas ====================================================================================
blas-devel.i686 : BLAS development libraries
blas-devel.x86_64 : BLAS development libraries
blas-static.i686 : BLAS static libraries
blas-static.x86_64 : BLAS static libraries
blas64-devel.x86_64 : BLAS development libraries
blas64-static.x86_64 : BLAS static libraries (64bit INTEGER)
...

[root@VM_16_214_centos youyinnn]#
```

得出的结果比较多，我们需要选择安装“blas-devel”，至于是否是 64 位系统的选择，就看你自己的机子了。

安装的“blas-devel”提供下面这个 lib：

```bash
/usr/lib64/libblas.so
```

PPT 还需要安装的是“libblas3gf”，但是这个玩意 centos 没有，好在我找到了对应的一个 rpm：https://altlinux.pkgs.org/sisyphus/classic-x86_64/libblas3gf-3.9.2-alt1.x86_64.rpm.html

所以我们要下载这个文件，然后使用 rpm 来安装它！

安装完了之后我们可以得到这个关键的 lib：

```bash
/usr/lib64/libblas.so.3gf
/usr/lib64/libblas.so.3gf.0
```

然后我们 BLAS 就安装完成了！

#### 安装 LAPACK 库

LAPACK 库需要安装：LAPACK (liblapack3gf, liblapack-dev)

直接 yum：

```bash
yum install lapack
```

会安装：

```bash
[root@VM_16_214_centos linux]# yum install lapack
Loaded plugins: fastestmirror, langpacks
Repository epel is listed more than once in the configuration
Loading mirror speeds from cached hostfile
Package lapack-3.4.2-8.el7.x86_64 already installed and latest version
Nothing to do
[root@VM_16_214_centos linux]#
```

它提供了：

```bash
/usr/lib64/liblapack.so.3
/usr/lib64/liblapack.so.3.4
/usr/lib64/liblapack.so.3.4.2
/usr/lib64/liblapacke.so.3
/usr/lib64/liblapacke.so.3.4
/usr/lib64/liblapacke.so.3.4.2
```

然后安装 liblapack3gf，这里巨坑的是，liblapack3gf 只有 Debian 系统有，连 rpm 都没有，开始是想把 deb
文件转成 rpm 文件的，直到后来 Escnqh 输入了一行玄学指令：

```bash
ln -s /usr/lib64/liblapack.so.3 /usr/lib64/liblapack.so.3gf
```

直接用 liblapack.so.3 伪装成 liblapack.so.3gf（- -）...

最后 liblapack-dev 我反正没安装，后面好像也能跑出模型- -

支持 LAPACK 库也安装完毕。

---
