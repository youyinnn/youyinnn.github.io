---
title: 我认为的规范的git commit msg
top: true
comments: true
tags:
  - tips
  - github
  - git
date: 2017-11-29 18:30:01
---

{% cq %}

其实必要的时候使用`git commit -m "xxxxx"`也木有关系 但你也别每条都这样写

{% endcq %}

<!-- more -->

好久没更博了，最近一直在疯狂的推[数据快速导入](https://github.com/DomBro96/dataimport)的项目，推的使用在使用 git 做一些 fix 和 optimize 等工作，经常会进行版本回退和 msg 查阅，看看我昨天晚上到底干了些什么。

然后发现我特么看不懂前一天晚上写的什么鬼 msg，这时候才觉得，有一个良好的 commit 习惯是多么重要！

之前有转过一篇：[5 Useful Tips For A Better Commit Message](https://youyinnn.github.io/post/ce7091ac.html)

按照这篇文章，我自己给我自己的 commit msg 做个规范。

### 第一行

使用规定的标识符表明当次 commit 一共做了哪些工作,不同的提示符使用空格` `分隔，提示符规定如下（持续补充）：

我把一次工作的标识符分“动作”、“对象”两部分描述：

- 可能的动作前缀有：

  - 基本操作前缀：

    > `ADD`：Add 增加
    > `DEL`：Delete 删除
    > `IMP`：Improve 改进
    > `MG`：Merge 合并
    > `MOD`：Modifie 修改
    > `CPL`：Complete 完成

  - 其他操作前缀：

    > `RN`：Rename 重命名
    > `MOV`：Move 移动
    > `CRE`：Create 创造
    > `AMD`：Amend 修正
    > `SUP`：Supplement 补充
    > `RM`：Remove 移除

  - 独立动作：
    > `INIT`：Initialized Repository 初始化仓库
    > `RELEASE`：Release a Version 发布一个版本
    > `TODO`：Todo List 增加 TODO
    > `TOFUNC`：提取重复代码为方法增加代码重用
    > `FIXBUG`：Fix Bug 修复 BUG
    > `RPBUG`：Report Bug 通报 BUG
    > `SAYING`：Saying 有话要说

- 可能的对象有：

  - 业务之内的对象：

    > `FEAT`：Feature 某个功能
    > `MODU`：Module 某个模块
    > `FUNC`：Function 某个函数
    > `CODE`：Code 某段代码
    > `CONT`：Content 某种内容
    > `ANNO`：Annotation 某些注释

  - 业务之外的对象：
    > `CONF`：Config 配置文件
    > `DEP`：Dependences 依赖配置
    > `POM`：POM 文件
    > `README`：Readme 文件
    > `IGNORE`：gitignore 文件
    > `FILE`：File
    > `STRUCT`：Project Structure 项目结构

---

所以我 commit 的第一行会是这样的：

```vim
CPLFEAT RPBUG TOFUNC FIXBUG MODIGNORE
```

这表示我当次 commit 完成了：

> _我在完成一个`新功能`的同时还`发现了一个BUG`顺便`封装了之前写的重复的代码为函数`提高了代码重用率接着`修复了之前发现的一些BUG`最后还`修改了一下ignore文件`！_

### 第二行

得是一个空行

### 第三行

开始按照第一行的写下的工作标识符顺序分条进行简要说明，一般来说，简单而清晰表达即可。但是有以下规定：

- 以工作标识符加冒号占一行。
- 如有当前工作有多个要点，必须有序得分条说明。
- 每条说明文字必须要指明改动源与改动目的。
- 当 commit 多个文件时，涉及代码改动的每条说明文字的最后一个字符必须以一个 tab 键进行制表空格；然后写上`//fileName.fileSuffix`来表明当前这条改动的工作是在哪个文件上进行的；如有必要，可在文件名后面加上`(12-67)`表明改动的行段；如涉及多个文件，则文件之间以空格分隔。
- 每个工作说明完之后必须空一行，最后一个工作除外。
- 全英文标点符号，即使有中文说明；说明行末不加任何标点符号，即使是英文句号。
- FIX 后面必须加上对应`RPBUG`的版本号（如果是以前的 commit 中 report 的 BUG 的话，如果是当次 commit 发现的 BUG 可以不用写版本号，并且可以不写`RPBUG`标识符），然后再简单说明 FIX 了什么 BUG，最后明如何 FIX 即可。
- 如果是一些可以忽略说明的工作，则可以直接在标识符后面加上`*`，表示忽略说明（如`MODIGNORE`标识符）。

比如：

```vim
CPLFEAT:
1.初步完成了用户登陆功能 //LoginService.java
2.初步完成了用户注册功能 //SignupService.java
```

---

以上基本可以清晰表达 commit 的内容了，下面是一个完整的示例：

```vim
CPLFEAT RPBUG TOFUNC FIXBUG MODIGNORE

CPLFEAT:
1.初步完成了用户登陆功能 //LoginService.java
2.初步完成了用户注册功能 //SignupService.java

REBUG:
1.登陆免验证时,在获取session变量时抛空指针异常  //LoginFilter.java(39)

TOFUNC:
1.用户名非法判断抽象成userNameRegExp()方法  //LoginFilter.java(46-68) LoginService.java(35-57)

FIXBUG：
1.59ad23do,表单重复提交,增加了session验证来防止表单重复提交 //BaseService.java

MODIGNORE:*
```
