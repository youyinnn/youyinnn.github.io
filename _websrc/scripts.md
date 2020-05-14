## :star: API相关

###  一些开放的API

[github repo public-apis](https://github.com/public-apis/public-apis)

### 用来查询IP的API

- 国内：
  
  - 搜狐
    
    - [http://pv.sohu.com/cityjson](https://link.jianshu.com?t=http://pv.sohu.com/cityjson)
    - [http://pv.sohu.com/cityjson?ie=utf-8](https://link.jianshu.com?t=http://pv.sohu.com/cityjson?ie=utf-8)
    - [http://txt.go.sohu.com/ip/soip](https://link.jianshu.com?t=http://txt.go.sohu.com/ip/soip)
    
    其中有一个支持https，但是有跨域问题，如果使用`<script>`标签解决跨域的话，它的代码是直接注入的，而不是返回的callback，而且因为没有正式的开放信息，只是搜出来的，不知道什么时候就下线了
    
  - 某大佬个人维护的免费开放接口平台：https://github.com/MZCretin/RollToolsApi，有https，有跨域，但是因为是个人维护，还是怕不稳定，虽然有小程序监控；也是第一版跳转ipcheck
  
  - 百度地图开放API：http://lbs.baidu.com/index.php?title=webapi/ip-api
  
    虽然跨域，但是好在有callback，不用怕注入，而且平台是正式开放的；虽然文档里没有callback的说明，我还是搜出来了，确实接口支持callback，这也是我现在使用的跳转ipcheck
  
- 国外：
  - [ip-api](https://ip-api.com/) https要会员
  - [freegeoip](https://freegeoip.app/) 还行 免费https 每小时1万5的请求 比下面的快
  - [ipinfo](https://ipinfo.io/developers#https-ssl) https免费 速度慢点

### 英语相关API

#### 语法检查

- [Ginger](https://www.gingersoftware.com/ginger-api/documentations?utm_medium=email&utm_source=link&utm_campaign=api_documentation)
- [Grammarly](https://www.grammarly.com/)


## :star: 杂文/问题/乱说/黑科技/技巧

### 关于 github oauth app


![image](https://user-images.githubusercontent.com/23525754/39562055-124667c6-4edc-11e8-91af-d1bfcfe540fd.png)

[reference.](https://github.com/timqian/my-notes/issues/9)


### 代码高亮的的坑


> editor.md的preview页 + highlight.js

#### :small_blue_diamond:1. highlight.js 的坑

##### :small_orange_diamond:highlight.js无效问题

> **hub主页上的highlight.js文件是用不了的!!!**
> 解决: 去[官网主页]()上查看源码下载, 也可以在博客仓库里找到`highlight-site-pack.js`文件

##### :small_orange_diamond:始终只能渲染code而无法渲染pre的问题

> **readme里给的选择器只能选中pre下的code(眼戳没注意...)**
> 解决: 把pre也一起选中就好了


``` js
$('pre, pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});
```

#### :small_blue_diamond:2. editor的默认md code渲染和highlight.js渲染冲突问题

![image](https://user-images.githubusercontent.com/23525754/39576589-3bab975a-4f11-11e8-9a2c-1bb3ea38ab73.png)

如图用的atom-one-dark, 但是背景还是白色的...

##### :small_orange_diamond:1. editor渲染禁用
1. 首先不引用lib下的prettify.min.js文件
2. 修改editormd.min.js源码, 在1505行, 取消对这个文件的引用和code渲染

   ![image](https://user-images.githubusercontent.com/23525754/39576049-4d6e24d2-4f0f-11e8-9532-9d6b5c54389a.png)
   修改完之后, 这样就不会在pre和code上添加pretty的类了

##### :small_orange_diamond:2. css覆盖
因为我们是运行时渲染, 所以我们的highlight.js添加的css类是无论如何都是会冲突的(理论上可以避免的, 不知代码是怎么写的)

注释一部分editormd.preview.css:

![image](https://user-images.githubusercontent.com/23525754/39576285-3c0ceed4-4f10-11e8-8c24-685d894994b6.png)

我们要的是最下面那个css, 所以注掉上面两个就好了, 行数如图.

#### :small_blue_diamond:结果

![image](https://user-images.githubusercontent.com/23525754/39576723-b592211a-4f11-11e8-8b5f-c60303166ce6.png)


### cmd相关


#### :small_blue_diamond:教程
- 扫盲：https://lellansin.wordpress.com/2012/12/15/cmd%E5%BA%94%E7%94%A8%E5%9F%BA%E7%A1%80-%E6%89%AB%E7%9B%B2%E6%95%99%E7%A8%8B/
- 常用cmd：https://blog.csdn.net/hanzheng260561728/article/details/51558990

#### :small_blue_diamond:微软开放命令行文档

>  cmd文档/doc文档/command line

[link](http://download.microsoft.com/download/5/8/9/58911986-D4AD-4695-BF63-F734CD4DF8F2/ws-commands.pdf)


### 关于 CI


#### :small_blue_diamond:示意图

![image](https://user-images.githubusercontent.com/23525754/39740876-26eba2da-52ca-11e8-9403-74ce6686407e.png)

>文章 [The Product Managers’ Guide to Continuous Delivery and DevOps](https://www.mindtheproduct.com/2016/02/what-the-hell-are-ci-cd-and-devops-a-cheatsheet-for-the-rest-of-us/)
>
>对「持续集成（Continuous Integration）」、「持续交付（Continuous Delivery）」和「持续部署（Continuous Deployment）」这三个概念有很详细的解释。


### GitHub API response 条数pagination限制


GitHub API的响应条数是有限制的, 默认是30条, 如果要更多,或者使用分页,可以参照:

![image](https://user-images.githubusercontent.com/23525754/39813936-fe5352ea-53c4-11e8-9f10-79741b895d3a.png)

![image](https://user-images.githubusercontent.com/23525754/39813946-06fa84c2-53c5-11e8-9a35-6e95ea0502f4.png)

参考: https://developer.github.com/v3/#pagination

我现在的blog所有的comments请求都是9999


### 一顿操作 node.js安装


#### :small_blue_diamond:安装nvm

1. 首先去 https://github.com/coreybutler/nvm-windows 下载最新的release版本 然后安装即可

#### :small_blue_diamond:使用mvn安装nodejs的多版本

``` bash
$ nvm install 0.10
$ nvm install 4
$ nvm install 6
$ nvm install 8
```

#### :small_blue_diamond:安装全局npm

可以看到这里安装了4种版本的nodejs, 每个版本都带有自己的npm, 如果要特定使用npm, 则需要先输入

``` bash
mvn use 8
```
比如上面先use了8版本的node

然后再安装全局npm, 不然你找不到npm的环境

------------

Linux下安装nvm

看得懂就行啦：https://github.com/creationix/nvm#git-install

参考: 
https://i5ting.github.io/How-to-learn-node-correctly/#10302
https://blog.csdn.net/jingtian678/article/details/78422760


### Regex 匹配换行符/匹配尾部空格


``` regex
([\s\S]*)
```

``` regex
\s*$
```


### 对IoC/DI的理解


#### :small_blue_diamond:Ioc—Inverse  of Control

**即“控制反转”，不是什么技术，而是一种设计思想**。在Java开发中，**Ioc意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。** 

深入分析一下：

- 谁控制谁，控制什么：传统Java SE程序设计，我们直接在对象内部通过new进行创建对象，是程序主动去创建依赖对象；而IoC是有专门一个容器来创建这些对象，即由Ioc容器来控制对 象的创建；**谁控制谁？当然是IoC 容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。**
- 为何是反转，哪些方面反转了：有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；为何是反转？**因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。**

**举例说明**

“常规的是，我们程序员**手动new**来给程序的**Service对象**提供所**依赖的DAO对象**，而现在是程序通过IoC容器自己提供**DAO对象**给**Service对象**。”

#### :small_blue_diamond:DI—Dependency Injection

**即“依赖注入”**：**组件之间依赖关系**由容器在运行期决定，形象的说，即**由容器动态的将某个依赖关系注入到组件之中**。

**依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为系统搭建一个灵活、可扩展的平台。**通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关心具体的资源来自何处，由谁实现。 

深入分析一下：

- 谁依赖于谁：当然是**应用程序依赖于IoC容器**；
- 为什么需要依赖：**应用程序需要IoC容器来提供对象需要的外部资源**；
- 谁注入谁：很明显是**IoC容器注入应用程序某个对象，应用程序依赖的对象**；
- 注入了什么：就是**注入某个对象所需要的外部资源（包括对象、资源、常量数据）**。

**举例说明**

“**Service对象**依赖于**DAO对象**，IoC容器通过**注解和反射机制**来**注入（Injected）**用户在配置文件中配置好的DAO对象到**Service对象**的对应属性中。”

#### :small_blue_diamond:两者关系

**IoC和DI**由什么**关系**呢？其实它们**是同一个概念的不同角度描述**，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以2004年大师级人物Martin Fowler又给出了一个新的名字：“依赖注入”，相对IoC 而言，“依赖注入”明确描述了“被注入对象依赖IoC容器配置依赖对象”。 

我的理解是：**IoC说的是一种程序过程，而DI说的是注入的动作，DI是IoC的一种实现**。

[参考](https://blog.csdn.net/qq_22654611/article/details/52606960)


### 对于游戏来说 怎么选择TCP和UDP?


- 如果是由客户端间歇性的发起无状态的查询，并且偶尔发生延迟是可以容忍，那么使用HTTP/HTTPS吧。

- 如果客户端和服务器都可以独立发包，但是偶尔发生延迟可以容忍（比如：在线的纸牌游戏，许多MMO类的游戏），那么使用TCP长连接吧。

- 如果客户端和服务器都可以独立发包，而且无法忍受延迟（比如：大多数的多人动作类游戏，一些MMO类游戏），那么使用UDP吧。

转自: http://blog.jobbole.com/64638/


### OOP三大特性


#### :small_blue_diamond:封装优点：

- **安全：** 只能通过规定的方法访问数据 
- **隐藏细节：** 隐藏类的实例细节，方便修改和实现

#### :small_blue_diamond:继承优点：

- **代码复用**

#### :small_blue_diamond:多态主要表现：

- **引用多态**　　　

  - 父类的引用可以指向本类的对象；
  - 父类的引用可以指向子类的对象；

- **方法多态**

  根据上述创建的两个对象：本类对象和子类对象，同样都是父类的引用，当我们指向不同的对象时，它们调用的方法也是多态的。

  - 创建本类对象时，调用的方法为本类方法；

  - 创建子类对象时，调用的方法为子类重写的方法或者继承的方法；

  **注意： 继承是多态的基础。**

参考: https://www.cnblogs.com/hysum/p/7100874.html#_label1


### BitMap


http://blog.51cto.com/zengzhaozheng/1404108
https://blog.csdn.net/hguisu/article/details/7880288
http://www.ruanyifeng.com/blog/2015/09/git-bitmap.html
编程珠玑


### MySQL用户管理


https://www.cnblogs.com/gavin110-lgy/p/5773981.html
https://www.cnblogs.com/clsn/p/8047028.html



### 在Windows的右键菜单上增加新建自定义类型文件的选项


![image](https://user-images.githubusercontent.com/23525754/41817005-31258a84-77c5-11e8-9b36-eb7b089def71.png)

https://www.cnblogs.com/zhengye/articles/2304925.html


### 关于引用奥森图标一类的i标签失效的问题


路径也排查过了 文件也排查过了 也没报错 为什么呢？

因为......

千万要想想是不是全局font-family的问题！！！


### git做用户的全局配置的文件夹在哪？


放在你家

![image](https://user-images.githubusercontent.com/23525754/42872368-59d80c52-8aaf-11e8-8b4a-5f176dbb4d36.png)

如图可以配置别名


### 贪心算法和动态规划的区别


> 贪心算法：贪心算法采用的是逐步构造最优解的方法。在每个阶段，都在一定的标准下做出一个看上去最优的决策。决策一旦做出，就不可能再更改。做出这个局部最优决策所依照的标准称为贪心准则。
>
> 分治算法：分治法的思想是将一个难以直接解决大的问题分解成容易求解的子问题，以便各个击破、分而治之。 
>
> 动态规划：将待求解的问题分解为若干个子问题，按顺序求解子阶段，前一子问题的解，为后一子问题的求解提供了有用的信息。在求解任一子问题时，列出各种可能的局部解，通过决策保留那些有可能达到最优的局部解，丢弃其他局部解。依次解决各子问题，最后一个子问题就是初始问题的解。 

引自：https://www.cnblogs.com/codeskiller/p/6477181.html


### 三种静态查找算法：顺序、二分/折半、索引/分块查找


文章：https://blog.csdn.net/u011489043/article/details/78683856


### MySQL自己更新自己


https://www.cnblogs.com/jeffen/p/7016547.html

mysql不允许在同一次执行中自己更新自己 所以要套一次层中间查询 欺骗mysql以为不是同一张表


### 算法：并查集


https://blog.csdn.net/C20180630/article/details/57074623
https://blog.csdn.net/u013546077/article/details/64509038


### 正则表达式 密码强度


https://www.cnblogs.com/cexm/p/7737538.html


### 文件头魔数 判断文件类型


https://blog.csdn.net/t894690230/article/details/51242110?winzoom=1

但是这种方法比较复杂，在帖子里有前辈提到，文本类型是无法通过魔术去判断的，比如html和txt
而且同一种文件类型不同的程序去创建，魔数也可能不一样，比如ZIP可能有多种不同的魔数

魔数列表参考如下：
https://www.garykessler.net/library/file_sigs.html


### xss攻击和Java处理xss


https://www.cnblogs.com/digdeep/p/4695348.html
https://blog.csdn.net/woniumenga/article/details/47323829#

Java的html解析器
https://github.com/jhy/jsoup

前端xss处理：
https://jsxss.com/zh/index.html


### 微服务/集群/分布式


#### :small_blue_diamond:微服务好文

[学习springboot看这一篇就够了](https://blog.csdn.net/ityouknow/article/details/80490926) 看它的微服务启蒙3篇

#### :small_blue_diamond:集群和分布式
> 小饭店原来只有一个厨师，切菜洗菜备料炒菜全干。后来客人多了，厨房一个厨师忙不过来，又请了个厨师，两个厨师都能炒一样的菜，这两个厨师的关系是集群。为了让厨师专心炒菜，把菜做到极致，又请了个配菜师负责切菜，备菜，备料，厨师和配菜师的关系是分布式，一个配菜师也忙不过来了，又请了个配菜师，两个配菜师关系是集群
>
> 作者：张鹏飞
> 链接：https://www.zhihu.com/question/20004877/answer/112124929
> 来源：知乎
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

参考：
https://blog.csdn.net/cutesource/article/details/5811914
https://www.zhihu.com/question/20004877/answer/61025046
https://www.cnblogs.com/aspirant/p/5697807.html


### 什么是/为什么要Tracing？Opentracing的入门铺垫


![image](https://user-images.githubusercontent.com/23525754/46987507-0e617d80-d127-11e8-86b6-ba3a9ccd8f36.png)

好文：https://yq.aliyun.com/articles/514488

#### :small_blue_diamond:这个Gitbook爆炸推【Opentracing的中文文档翻译】：

https://wu-sheng.gitbooks.io/opentracing-io/content/

Tutorials:

https://github.com/yurishkuro/opentracing-tutorial/tree/master/java


### 什么是/为什么要DevOps？


![image](https://user-images.githubusercontent.com/23525754/46988029-4b2e7400-d129-11e8-943c-81b28b5ac5ec.png)

https://www.cnblogs.com/liufei1983/p/7152013.html


### Spring生命周期详解好文


https://blog.csdn.net/lisongjia123/article/details/52091013?utm_source=blogxgwz0
https://blog.csdn.net/fuzhongmin05/article/details/73389779
https://blog.csdn.net/qq_23473123/article/details/76610052


### html2canvas 页面输出为canvas


超级棒的插件：
教程和踩坑：https://segmentfault.com/a/1190000011478657
hub：https://github.com/niklasvh/html2canvas

#### :small_blue_diamond:生成的canvas没有图片的坑：

要求CDN的图片配置好CORS。CDN配置好后，通过chrome开发者工具可以看到响应头中应含有Access-Control-Allow-Origin的字段。
开启html2canvas的useCORS配置项。即作如下设置： 

``` javascript
var opts = {useCORS: true};
html2canvas(element, opts);
```


### k8s


#### :small_blue_diamond:好文
- 概念：http://www.dockone.io/article/8341?cmd=redirect&arubalp=12345
- 简要介绍：http://www.dockone.io/article/8328
- 10分钟核心概念了解：http://www.dockone.io/article/932

#### :small_blue_diamond:中文文档
- 设计理念（概念介绍）：http://docs.kubernetes.org.cn/249.html

#### :small_blue_diamond:配置
- k8s的Dashboard：http://blog.51cto.com/ylw6006/2113542
- yaml：
    - sample: https://www.mirantis.com/blog/introduction-to-yaml-creating-a-kubernetes-deployment/
    - offical reference: https://kubernetes.io/docs/reference/ see the api



### docker


介绍与入门：http://www.dockone.io/article/8350


### Shell


#### :small_blue_diamond:expect 让你的shell可以处理交互命令（如自动ssh远程登陆另一台主机）
- https://www.jianshu.com/p/70556b1ce932
- https://www.cnblogs.com/lzrabbit/p/4298794.html
- https://www.jellythink.com/archives/373

#### :small_blue_diamond:set 设置你shell脚本的运行配置
- https://www.cnblogs.com/liduanjun/p/3536996.html

#### :small_blue_diamond:read 在shell里面读取新的字符
- http://www.runoob.com/linux/linux-comm-read.html

#### :small_blue_diamond:wc 计算字数
- http://www.runoob.com/linux/linux-comm-wc.html

#### :small_blue_diamond:cut 字符串切割
- https://www.jb51.net/article/41872.htm

#### :small_blue_diamond:shell脚本sudo外部输入密码
- https://blog.csdn.net/qq_23587541/article/details/82841489

#### :small_blue_diamond:./和sh执行脚本的区别：
- `./`需要执行权限，使用脚本文件中第一行`#!`指定的shell（解释器）来执行命令（譬如常见的/bin/bash），不指定系统会调用默认shell程序
- `sh`不需要执行权限，是使用`sh`这个shell执行命令，是个软链接，它可能是一个任意的shell，通常默认是`bash shel`，用type命令可以查看

#### :small_blue_diamond:nohup使用详解
- https://www.cnblogs.com/jinxiao-pu/p/9131057.html


### Linux


#### :small_blue_diamond:工具
- fzf：https://www.colabug.com/4062481.html

#### :small_blue_diamond:设置
- 修改终端提示符：https://www.cnblogs.com/xiaofeiIDO/p/8037331.html
- 环境变量：https://www.cnblogs.com/haore147/p/3633116.html

#### :small_blue_diamond:命令
- 命令大全：http://man.linuxde.net/
- 一些巨棒的命令替代：https://linux.cn/article-10171-1.html

#### :small_blue_diamond:CentOS
##### :small_orange_diamond:yum详解
- http://www.cnblogs.com/vathe/p/6736094.html

#### :small_blue_diamond:Ubuntu
##### :small_orange_diamond:apt-get详解
- https://blog.csdn.net/sinat_31206523/article/details/78138822
- https://blog.csdn.net/yessharing/article/details/55806090


### chrome插件开发


https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html#%E6%89%93%E5%8C%85%E4%B8%8E%E5%8F%91%E5%B8%83


### gRPC & protobuf & Swagger


- [Grpc+Grpc Gateway实践三 Swagger了解一下](https://segmentfault.com/a/1190000013513469)
- [google protobuf安装与使用](https://www.cnblogs.com/luoxn28/p/5303517.html)
- [protobuf](https://github.com/protocolbuffers/protobuf)
- [grpc-gateway：grpc转换为http协议对外提供服务](https://www.cnblogs.com/andyidea/archive/2017/03/10/6529900.html)


### Database Client


[15个windows上好用的client](https://www.slant.co/topics/53/~best-mysql-client-applications-for-windows)


### linux 换行符


https://blog.csdn.net/mulangren1988/article/details/54316783


### 带空格文件名参数传递 xargs


https://blog.csdn.net/u011085172/article/details/77771173


### GraphQL 一种用于 API 的查询语言


> GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 
>
> GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

中文网 : [官网](http://graphql.cn/)
引子 : [segmentfault](https://segmentfault.com/a/1190000006132986)
知乎专栏 : [面向未来的API —— GitHub GraphQL API 使用介绍](https://zhuanlan.zhihu.com/p/28077095)

> 2018年11月16日 10点04分
> 要构建一个graphql需要的成本太大了 还不如restful来的快


### 排序算法图解博客

看到的讲得还阔以的: https://www.cnblogs.com/chengxiao/category/880910.html


## :star: 网站/软件/技术

### 100多个实用的Javascript代码片段

https://1loc.dev/

### 一个素材网站 devianart


https://www.deviantart.com/


### icon相关 素材站/软件


#### :small_blue_diamond:阿里巴巴矢量图标库

![image](https://user-images.githubusercontent.com/23525754/39858740-10f258c4-546a-11e8-88d2-0382dae3fc15.png)

link : http://iconfont.cn/

#### :small_blue_diamond:iconstroe

![image](https://user-images.githubusercontent.com/23525754/39858781-297796b6-546a-11e8-890d-eab6bb371b9d.png)

link : https://iconstore.co/

#### :small_blue_diamond:flaticon

![image](https://user-images.githubusercontent.com/23525754/39859278-e8451b08-546b-11e8-9639-afb2357cd0e0.png)

link : https://www.flaticon.com/

#### :small_blue_diamond:Nucleo Icon管理工具

![image](https://user-images.githubusercontent.com/23525754/39859547-c42d88d0-546c-11e8-9d44-a16a5982fe89.png)

https://nucleoapp.com/


### 软件推介 : cmder


> 一个高颜值功能强大的的windows终端管理器
> 
> 介绍 : https://zhuanlan.zhihu.com/p/28400466

![image](https://user-images.githubusercontent.com/23525754/40038175-47ab3728-5843-11e8-8673-10bd2894ad70.png)

#### :small_blue_diamond:Tips:

软件有mini版本, 还有full版本, 前者8MB, 后者100多MB, full其实就是比mini多了git, 但是我们之前肯定就都有git的.

但是最好不要用mini, 因为mini会有一些权限的问题, 启动的时候必须要管理员权限, 否则没有权限备份它的配置文件, 这样很坑, 都不能放开机启动, 但是full的版本可以不需要管理员权限就启动.

所以我们下载full, 解压在`C:\Program Files`, 可以发现整个软件大概250MB, 我们从软件目录下的`C:\Program Files\cmder\vendor`中删去`git-for-windows`文件夹, 发现这个文件夹就占了230+MB, 删去了之后对软件没有任何的影响.


### 数据结构/算法可视化网站


![aa](https://image.youyinnn.top/sorting-algorithms.png)
https://www.toptal.com/developers/sorting-algorithms


![image](https://user-images.githubusercontent.com/23525754/40883611-f49dc906-6733-11e8-822f-b3f441f11da7.png)
https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

![image](https://user-images.githubusercontent.com/23525754/40886561-d4282520-676c-11e8-8312-223025512f6d.png)
https://visualgo.net/zh


### 经纬度行政区域查询API


[home](http://jwd.funnyapi.com/#/index)


### win10 自带录电脑音软件



![jEHdM1ZoRC](https://user-images.githubusercontent.com/23525754/71551960-fd9bdf80-2a2c-11ea-8049-f9293a6e6198.jpg)
![image](https://user-images.githubusercontent.com/23525754/71551963-08567480-2a2d-11ea-9d24-d08dc2e83ef6.png)
![image](https://user-images.githubusercontent.com/23525754/71551979-8a469d80-2a2d-11ea-82c1-be60e4bca1e3.png)

然后打开win10自带的录音软件Voice Recorder



### Protobuf

#### What are protocol buffers?

Protocol buffers are a flexible, efficient, automated mechanism for serializing structured data – think XML, but smaller, faster, and simpler. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages. You can even update your data structure without breaking deployed programs that are compiled against the "old" format.

#### Why not just use XML?

Protocol buffers have many advantages over XML for serializing structured data. Protocol buffers:

- are simpler
- are 3 to 10 times smaller
- are 20 to 100 times faster
- are less ambiguous
- generate data access classes that are easier to use programmatically

#### References

- [深入Protobuf](https://www.jianshu.com/p/a24c88c0526a)
- [ProtoBuf试用与JSON的比较](https://www.jianshu.com/p/b4b51b99e218)
- [在python中使用ProtocolBuffers](https://mp.weixin.qq.com/s/yiAhQddl42eGSnM6XpkNZw)
- [Google Docs](https://developers.google.com/protocol-buffers/docs/overview)

## :star: Java相关

### Java8系列文章


http://www.importnew.com/11908.html



### 牛客 HttpServletRequest. getParameter


![image](https://user-images.githubusercontent.com/23525754/40235928-620a249c-5ade-11e8-9b07-7dd6254daea3.png)

>  编码格式由浏览器决定，浏览器根据html中指定的编码格式进行编码，tomcat根据指定的格式进行解码, tomcat默认的解码方式是ISO8859-1



### Java Spliterator


参考1: https://segmentfault.com/q/1010000007087438
参考2: https://blog.csdn.net/lh513828570/article/details/56673804


### 牛客 Integer的拆箱装箱


![image](https://user-images.githubusercontent.com/23525754/40236440-22aec3b4-5ae0-11e8-8c36-740673df8f06.png)

![image](https://user-images.githubusercontent.com/23525754/40236420-137a4490-5ae0-11e8-91ae-c75518a5806c.png)

- 基本数据类型和包装类==比较的时候, 基本数据类型会拆箱, 所以是值比较
- valueOf()的取值还有IntegerCached的概念, 在[-127,127]之间的数会从池里面找, 有就返回同样的引用


### 牛客 getDeclaredMethods()的范围


![image](https://user-images.githubusercontent.com/23525754/40236595-ae2525f0-5ae0-11e8-89bb-c0649f2ba2b1.png)

Doc:
> public Method[] getDeclaredMethods()
>
> Returns an array containing Method objects reflecting all the declared methods of the class or interface represented by this Class object, 
>
> including public, protected, default (package) access, and private methods, **but excluding inherited methods**.



### 牛客 sleep()和wait()


![image](https://user-images.githubusercontent.com/23525754/40236826-52947b72-5ae1-11e8-8483-c867082dece0.png)

**Java中的多线程是一种抢占式的机制，而不是分时机制。抢占式的机制是有多个线程处于可运行状态，但是只有一个线程在运行**

##### :small_orange_diamond:共同点 ： 
1. 他们都是在多线程的环境下，都可以在程序的调用处阻塞指定的毫秒数，并返回。 
2. wait()和sleep()都可以通过interrupt()方法 打断线程的暂停状态 ，从而使线程立刻抛出InterruptedException
如果线程A希望立即结束线程B，则可以对线程B对应的Thread实例调用interrupt方法。如果此刻线程B正在wait/sleep/join，则线程B会立刻抛出InterruptedException，在catch() {} 中直接return即可安全地结束线程。 
需要注意的是，InterruptedException是线程自己从内部抛出的，并不是interrupt()方法抛出的。对某一线程调用 interrupt()时，如果该线程正在执行普通的代码，那么该线程根本就不会抛出InterruptedException。但是，一旦该线程进入到 wait()/sleep()/join()后，就会立刻抛出InterruptedException 。 

##### :small_orange_diamond:不同点 ：  
1. 每个对象都有一个锁来控制同步访问。Synchronized关键字可以和对象的锁交互，来实现线程的同步sleep方法没有释放锁，而wait方法释放了锁，使得其他线程可以使用同步控制块或者方法。 

2. wait，notify和notifyAll只能在同步控制方法或者同步控制块里面使用，而sleep可以在任何地方使用

3. sleep必须捕获异常，而wait，notify和notifyAll不需要捕获异常 

4. sleep是线程类（Thread）的方法，导致此线程暂停执行指定时间，给执行机会给其他线程，但是监控状态依然保持，到时后会自动恢复。调用sleep不会释放对象锁。

5. wait是Object类的方法，对此对象调用wait方法导致本线程放弃对象锁，进入等待此对象的等待锁定池，只有针对此对象发出notify方法（或notifyAll）后本线程才进入对象锁定池准备获得对象锁进入运行状态。


### Java static方法中的变量是否存在线程安全问题

我们在知道, 静态字段(static field)和静态方法(static method)的调用是通过类来调用。静态方法不对特定的实例操作，只能访问静态成员。实例方法可对特定的实例操作，既能访问静态成员，也能访问实例成员。

那么,在多线程中使用静态方法是否有线程安全问题?这要看静态方法是是引起线程安全问题要看在静态方法中是否使用了静态成员。

因为，在多线程中使用同一个静态方法时，每个线程使用各自的实例字段(instance field)的副本，而共享一个静态字段(static field)。所以说，如果该静态方法不去操作一个静态成员，只在方法内部使用实例字段(instance field)，不会引起安全性问题。但是，如果该静态方法操作了一个静态字段，则需要静态方法中采用互斥访问的方式进行安全处理。

``` java
public class Test
{
   public static String hello(String str)
   {
       String tmp = "";
       tmp = tmp + str;
       return tmp;
   }
}
```
hello方法会不会有多线程安全问题呢？没有！

> 静态方法如果没有使用静态变量，则没有线程安全问题。
>
> 为什么呢？因为静态方法内声明的变量，每个线程调用时，都会新创建一份，而不会共用一个存储单元。比如这里的tmp,每个线程都会创建自己的一份，因此不会有线程安全问题。
>
> 注意:静态变量，由于是在类加载时占用一个存储区，每个线程都是共用这个存储区的，所以如果在静态方法里使用了静态变量，这就会有线程安全问题！


### Java多线程参考


https://www.cnblogs.com/yjd_hycf_space/p/7526608.html
http://www.importnew.com/21136.html
http://www.importnew.com/21089.html


### Java字符串压缩


``` java
public class StringCompress {
	public static final byte[] compress(String paramString) {
		if (paramString == null)
			return null;
		ByteArrayOutputStream byteArrayOutputStream = null;
		ZipOutputStream zipOutputStream = null;
		byte[] arrayOfByte;
		try {
			byteArrayOutputStream = new ByteArrayOutputStream();
			zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
			zipOutputStream.putNextEntry(new ZipEntry("0"));
			zipOutputStream.write(paramString.getBytes());
			zipOutputStream.closeEntry();
			arrayOfByte = byteArrayOutputStream.toByteArray();
		} catch (IOException localIOException5) {
			arrayOfByte = null;
		} finally {
			if (zipOutputStream != null)
				try {
					zipOutputStream.close();
				} catch (IOException localIOException6) {
			}
			if (byteArrayOutputStream != null)
				try {
					byteArrayOutputStream.close();
				} catch (IOException localIOException7) {
			}
		}
		return arrayOfByte;
	}
 
	@SuppressWarnings("unused")
	public static final String decompress(byte[] paramArrayOfByte) {
		if (paramArrayOfByte == null)
			return null;
		ByteArrayOutputStream byteArrayOutputStream = null;
		ByteArrayInputStream byteArrayInputStream = null;
		ZipInputStream zipInputStream = null;
		String str;
		try {
			byteArrayOutputStream = new ByteArrayOutputStream();
			byteArrayInputStream = new ByteArrayInputStream(paramArrayOfByte);
			zipInputStream = new ZipInputStream(byteArrayInputStream);
			ZipEntry localZipEntry = zipInputStream.getNextEntry();
			byte[] arrayOfByte = new byte[1024];
			int i = -1;
			while ((i = zipInputStream.read(arrayOfByte)) != -1)
				byteArrayOutputStream.write(arrayOfByte, 0, i);
			str = byteArrayOutputStream.toString();
		} catch (IOException localIOException7) {
			str = null;
		} finally {
			if (zipInputStream != null)
				try {
					zipInputStream.close();
				} catch (IOException localIOException8) {
				}
			if (byteArrayInputStream != null)
				try {
					byteArrayInputStream.close();
				} catch (IOException localIOException9) {
				}
			if (byteArrayOutputStream != null)
				try {
					byteArrayOutputStream.close();
				} catch (IOException localIOException10) {
			}
		}
		return str;
	}
}
```

参考：https://blog.csdn.net/isea533/article/details/8199848

### Servlet和CGI的区别

#### CGI (Common Gateway Interface 公共网关接口)

1. 定义：

   CGI(Common Gateway Interface 公共网关接口)是HTTP服务器与你的或其它机器上的程序进行“交谈”的一种工具，其程序须运行在网络服务器上。

2. 功能：

   绝大多数的CGI程序被用来解释处理杰自表单的输入信息，并在服 务器产生相应的处理，或将相应的信息反馈给浏览器。CGI程序使 网页具有交互功能。

3. 运行环境：

   CGI程序在UNIX操作系统上CERN或NCSA格式的服务器上运行。 在其它操作系统（如：windows NT及windows95等）的服务器上 也广泛地使用CGI程序，同时它也适用于各种类型机器。

4. CGI处理步骤：

   1. 通过Internet把用户请求送到服务器。
   2. 服务器接收用户请求并交给CGI程序处理。
   3. CGI程序把处理结果传送给服务器。
   4. 服务器把结果送回到用户。

#### Servlet

Servlet是一种服务器端的Java应用程序，具有独立于平台和协议的特性,可以生成动态的Web页面。 它担当客户请求（Web浏览器或其他HTTP客户程序）与服务器响应（HTTP服务器上的数据库或应用程序）的中间层。 Servlet是位于Web 服务器内部的服务器端的Java应用程序，与传统的从命令行启动的Java应用程序不同，Servlet由Web服务器进行加载，该Web服务器必须包含支持Servlet的Java虚拟机。

工作模式：客户端发送请求至服务器；服务器启动并调用Servlet，Servlet根据客户端请求生成响应内容并将其传给服务器；服务器将响应返回客户端。

 

#### Java Servlet与CGI的比较

与传统的CGI和许多其他类似CGI的技术相比，Java Servlet具有更高的效率，更容易使用，功能更强大，具有更好的可移植性，更节省投资。在未来的技术发展过程中，Servlet有可能彻底取代CGI。

在传统的CGI中，每个请求都要启动一个新的进程，如果CGI程序本身的执行时间较短，启动进程所需要的开销很可能反而超过实际执行时间。而在Servlet中，每个请求由一个轻量级的Java线程处理(而不是重量级的操作系统进程)。

在传统CGI中，如果有N个并发的对同一CGI程序的请求，则该CGI程序的代码在内存中重复装载了N次；而对于Servlet，处理请求的是N个线程，只需要一份Servlet类代码。在性能优化方面，Servlet也比CGI有着更多的选择。
　　* 方便 　
　　Servlet提供了大量的实用工具例程，例如自动地解析和解码HTML表单数据、读取和设置HTTP头、处理Cookie、跟踪会话状态等。
　　* 功能强大
　　在Servlet中，许多使用传统CGI程序很难完成的任务都可以轻松地完成。例如，Servlet能够直接和Web服务器交互，而普通的CGI程序不能。Servlet还能够在各个程序之间共享数据，使得数据库连接池之类的功能很容易实现。
　　* 可移植性好
Servlet用Java编写，Servlet API具有完善的标准。因此，为IPlanet Enterprise Server写的Servlet无需任何实质上的改动即可移植到Apache、Microsoft IIS或者WebStar。几乎所有的主流服务器都直接或通过插件支持Servlet。

转自：https://www.cnblogs.com/MuyouSome/p/3938203.html


### Java HashMap好文


源码解析：
- https://www.cnblogs.com/xrq730/p/5030920.html
- http://www.importnew.com/20386.html

面试总结：
- https://www.cnblogs.com/lchzls/p/6714474.html
- https://www.toutiao.com/a6317489506677309698/?tt_from=mobile_qq&utm_campaign=client_share&app=news_article&utm_source=mobile_qq&iid=5056005857&utm_medium=toutiao_ios
- https://blog.csdn.net/u012512634/article/details/72735183


### fastjson 转时间


在field上加注解，比如转ISO格式的时间
``` java
@JSONField(format="yyyy-MM-dd'T'HH:mm:ss'Z'")
```


### sun.misc.Unsafe


- http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/
- https://blog.csdn.net/anLA_/article/details/78631026
- https://blog.csdn.net/lvbaolin123/article/details/80527598


### Java String pool


[Where does Java's String constant pool live, the heap or the stack?](https://stackoverflow.com/questions/4918399/where-does-javas-string-constant-pool-live-the-heap-or-the-stack)


### Java 静态内部类和非静态内部类


[Why prefer non-static inner classes over static ones?](https://softwareengineering.stackexchange.com/questions/238782/why-prefer-non-static-inner-classes-over-static-ones)


### bridge method


- https://cn.aliyun.com/jiaocheng/330720.html
- https://docs.oracle.com/javase/tutorial/java/generics/bridgeMethods.html#bridgeMethods
- https://www.cnblogs.com/zsg88/p/7588929.html
- https://www.jianshu.com/p/250030ea9b28


### finally & return


- https://www.cnblogs.com/lanxuezaipiao/p/3440471.html


## :star: JS代码相关 

### JS 获取元素样式


``` javascript
/*
  此方法兼容IE
  获取元素的样式：
    参数1：元素
    参数2：样式名
*/
function getStyle(obj, styleName) {
  var cs = obj.currentStyle
  if (cs === undefined) {
    return getComputedStyle(obj, null)[styleName]
  } else {
    return cs[styleName]
  }
}
```


### JS 事件绑定兼容


``` javascript
/*
  事件绑定兼容
  首先要注意：
    addEventListener() 方法中的this是我们绑定的事件
    attachedEvent() 方法中的this是window

  参数：
    1、obj 要绑定的对象
    2、eventStr 绑定事件 (不要on)
    3、callback 回调函数
*/
function bindev(obj, eventStr, callback) {
  if (obj.addEventListener) {
    // 兼容大部分浏览器
    obj.addEventListener(eventStr, callback, false)
  } else {
    /*
      this是谁由调用方式决定
      由于attachEvent()的默认this是window
      为了统一this
      我们可以用下面的方式来指定this
      callback.apply(obj);
    */
    // IE
    obj.attachEvent('on' + eventStr, function () {
      callback.apply(obj)
    })
  }
}
```


### JS 滚动动画


``` javascript
/*
  md的滚动条
  去到id为elementid的元素位置
  速度是 500
*/
$('#md').animate({
  scrollTop: $('#elementid').offset().top
}, 500);
```


### JS 滚动动画改进


``` javascript
/*
  防止到了位置之后再滚动到该元素 而offset改变
*/
function scrolltoelement(elementid) {
  if ($('#' + elementid)[0].oset === undefined) {
    $('#' + elementid)[0].oset = $('#' + elementid).offset().top
  }
  $('#md').animate({
    scrollTop: $('#' + elementid)[0].oset
  }, 500);
}
```


### JS 检测页面滚动代码


``` JavaScript
$(window).scroll(function () {
  var scrollTo = $(window).scrollTop(),
  docHeight = $(document).height(),
  windowHeight = $(window).height();
  scrollPercent = (scrollTo / (docHeight-windowHeight)) * 100;
  percent.innerText = scrollPercent
})
```


### JS 小数

  

1. 丢弃小数部分,保留整数部分 `parseInt(7/2)` 

2. 向上取整,有小数就整数部分加1 `Math.ceil(7/2) `

3. 四舍五入 `Math.round(7/2) `

4. 向下取整 `Math.floor(7/2)`

5. 四舍五入 保留位数：
``` javascript
var num =2.446242342;
num = num.toFixed(2); // 输出结果为 2.45
```


### JS CSS 动态添加动画效果

  

``` javascript
  $('#searchtext').addClass('getnothing')
  setTimeout(function () {
    $('#searchtext').removeClass('getnothing')
  }, 1100)
```

``` css
.getnothing{
  animation: getnothing 1s;
}

@keyframes getnothing{
  50% {
    background-color: rgba(247, 117, 117, 0.534);
  }
}
```


### JS 控制聚焦/失焦事件

  

``` js
  $('#searchtext').focus(function () {
    $('#scriptsearcher')[0].style.opacity = '1'
  })
  $('#searchtext').blur(function () {
    $('#scriptsearcher')[0].style.opacity = '0.3'
  })
```


### AJAX设置请求超时

  

``` js
var ajaxTimeoutTest = $.ajax({
　　url:'',  //请求的URL
　　timeout : 1000, //超时时间设置，单位毫秒
　　type : 'get',  //请求方式，get或post
　　data :{},  //请求所传参数，json格式
　　dataType:'json',//返回的数据格式
　　success:function(data){ //请求成功的回调函数
　　　　alert("成功");
　　},
　　complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
 　　　　　 ajaxTimeoutTest.abort();
　　　　　  alert("超时");
　　　　}
　　}
});
```

函数写在complete中，因为无论success还是error，complete函数都会执行。


### [Async](https://github.com/caolan/async)

  

> JS Ajax JQ 同步请求库

[来源](https://segmentfault.com/q/1010000005789740)

[中文文档](https://blog.csdn.net/marujunyy/article/details/8695205)


### JS 刷新页面


#### :small_blue_diamond:手动 reload
``` js
location.reload();
```

#### :small_blue_diamond:自动定时刷新
页面自动刷新：把如下代码加入<head>区域中
``` js
<meta http-equiv="refresh" content="5">
```


### JS获取图片原始尺寸



HTML5提供了一个新属性naturalWidth/naturalHeight可以直接获取图片的原始宽高

``` javascript
   let imgw = this.naturalWidth
   let imgh = this.naturalHeight
```


### JQuery的高级选择器

  

``` javascript
jQuery.parent(expr)           //找父元素
jQuery.parents(expr)          //找到所有祖先元素，不限于父元素
jQuery.children(expr)        //查找所有子元素，只会找到直接的孩子节点，不会返回所有子孙
jQuery.contents()            //查找下面的所有内容，包括节点和文本。
jQuery.prev()                //查找上一个兄弟节点，不是所有的兄弟节点
jQuery.prevAll()             //查找所有之前的兄弟节点
jQuery.next()                //查找下一个兄弟节点，不是所有的兄弟节点
jQuery.nextAll()             //查找所有之后的兄弟节点
jQuery.siblings()            //查找兄弟节点，不分前后
jQuery.find(expr)            /*跟jQuery.filter(expr)完全不一样，jQuery.filter(expr)是从初始的
                               jQuery对象集合中筛选出一部分，而jQuery.find()的返回结果，不会有初始集中
                               筛选出一部分，而jQuery.find()的返回结果，不会有初始集合中的内容，比如：
                               $("p").find("span")是从元素开始找，等于$("p span") */
```


### js取消事件冒泡

  

``` javascript
$("form").bind("submit", function() { 
　　　　return false;
　　 }
)
```

https://www.cnblogs.com/wangking/p/6113024.html#


### JS判断字符串中是否含有Emoji表情


如果前端的字符串含有Emoji表情，那么在默认的情况下是不能存在MySQL数据库中的，因为编码的问题
原因如下：
> 本地数据库的默认编码是utf8，默认保存的是1到3个字节，但是现在的emoji表情采用4个字节保存，所以抛出异常。
引自：https://blog.csdn.net/wang704987562/article/details/54093979

JS判断：
``` javascript
function isEmojiCharacter(substring) {  
    for ( var i = 0; i < substring.length; i++) {  
        var hs = substring.charCodeAt(i);  
        if (0xd800 <= hs && hs <= 0xdbff) {  
            if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                if (0x1d000 <= uc && uc <= 0x1f77f) {  
                    return true;  
                }  
            }  
        } else if (substring.length > 1) {  
            var ls = substring.charCodeAt(i + 1);  
            if (ls == 0x20e3) {  
                return true;  
            }  
        } else {  
            if (0x2100 <= hs && hs <= 0x27ff) {  
                return true;  
            } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                return true;  
            } else if (0x2934 <= hs && hs <= 0x2935) {  
                return true;  
            } else if (0x3297 <= hs && hs <= 0x3299) {  
                return true;  
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                    || hs == 0x2b50) {  
                return true;  
            }  
        }  
    }  
}
```
引自： https://blog.csdn.net/u014520745/article/details/52947466?locationNum=8&fps=1


### Javascript使用字符串作为函数调用语句去调用

  

``` javascript
function func_abc(){
  alert('a');
}
var str = "func_abc";
eval(str+"()");//执行func_abc()函数
```

引自：https://blog.csdn.net/qq_26222859/article/details/75285784


### JS 数组排序

  

``` javascript
var arr = [23, 9, 4, 78, 3];
var compare = function (x, y) {//比较函数
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
}
console.log(arr.sort(compare));    
```


### JS 判断浏览器类型


ie那段参考自：https://www.cnblogs.com/XCWebLTE/archive/2017/06/15/7017338.html

``` javascript 
var userAgent = navigator.userAgent;
var isOpera = userAgent.indexOf("Opera") > -1;

function ievertion() {
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1; //不是ie浏览器
    }
}

function isSafari() {
    return userAgent.indexOf("Safari") > -1
}

function isFF() {
    return userAgent.indexOf("Firefox") > -1
}

function isChrome() {
    return userAgent.indexOf("Chrome") > -1
}
```


### JavaScript 解除xhr获取header的限制

  

http://www.ruanyifeng.com/blog/2016/04/cors.html

需要后端的配合


### JS锚点跳转动画

  

一般我们的锚点都长这样
``` html
<a name="xxx" class="reference-link" target="_blank"></a>
```

因此我们就根据name去索引锚点
``` javascript
var $root = $('html, body')
$('.markdown-toc a').click(function() {
    $root.animate({
        scrollTop: $('[name="xxx"]').offset().top
    }, 600)
})
```


### JS 监听元素任何变化


[mutationobserver](http://javascript.ruanyifeng.com/dom/mutationobserver.html)
[csdn blog](https://blog.csdn.net/u010419337/article/details/81474311)
``` javascript
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
let observer = new MutationObserver(function(mutationList) {
    setTimeout(function() {
        // handle change
    }, 250);
})
let article = $('#docpanel')[0]
let options = {
    'attributes': true,
    'attributeOldValue': true
};
observer.observe(article, options);
```


### JQuery UI 拖拽


https://www.runoob.com/jqueryui/example-draggable.html


### JQuery GIF播放/暂停 JS-GIF库


https://www.lanrenzhijia.com/pic/3719.html
https://github.com/buzzfeed/libgif-js


## :star: CSS相关

### CSS media设备适配样式设置


``` css
/* 
  针对iphone5 等320px的宽做出调整
*/
@media screen and (max-width: 320px){
  .friendcard {
    margin: 0 auto;
    width: 15rem;
  }
}
```


### CSS 动画库animate.css


介绍博客 : https://www.cnblogs.com/2050/p/3409129.html


### CSS 去除按钮选中蓝色边框


``` css
.className {
  border: none;
}

.className:focus{
  outline: none;
}
```

[参考](https://blog.csdn.net/qq_26222859/article/details/51516011)


### CSS 元素失焦/虚化滤镜


``` css
#idname{
   filter : blur(2px);
}
```



### CSS 文字换行


强制不换行
``` css
div{
    white-space:nowrap;
}
```

自动换行

``` css
div{ 
    word-wrap: break-word; 
    word-break: normal; 
}
```

强制英文单词断开换行

``` css
div{
    word-break:break-all;
}
```

英文单词不断开换行

``` css
div {
    word-break: keep-all;
    word-wrap: break-word;
    white-space: pre-wrap;
}
```

### CSS placeholder居位设置


``` css
/* placeholder居中 */
#postsearchtext:-moz-placeholder
{
  text-align: center;
}
#postsearchtext::-moz-placeholder
{
  text-align: center;
}
#postsearchtext:-ms-input-placeholder
{
  text-align: center;
}
#postsearchtext::-webkit-input-placeholder
{
    text-align: center;
}
```


### CSS 文字超过元素长度显示省略号



``` css
div{
  width: 75%;
  overflow:hidden; 
  white-space:nowrap; 
  text-overflow:ellipsis;
}
```


### CSS 变量设置和获取


#### :small_blue_diamond:设置
``` css 
:root{
  --main-color: #4d4e53;
  --main-bg: rgb(255, 255, 255);
  --logo-border-color: rebeccapurple;

  --header-height: 68px;
  --content-padding: 10px 20px;

  --base-line-height: 1.428571429;
  --transition-duration: .35s;
  --external-link: "external link";
  --margin-top: calc(2vh + 20px);
}
```

#### :small_blue_diamond:引用
``` css
a {
  color: var(--foo);
  text-decoration-color: var(--bar);
}
```

参考 : http://www.ruanyifeng.com/blog/2017/05/css-variables.html


### CSS 元素垂直/水平居中的骚操作


> 垂直居中就上下是0, 水平居中就左右是0,关键是margin:auto;

``` css
#sidetoccontainer {
  position: (不知道);
  margin: auto;
  bottom: 0;
  top: 0;
}
```

如果元素定位的fixed, 且如果这个骚操作用不了, 那么就给父元素加上

``` css
#father {
   transform:translate(0,0)
}
```

参考自知乎 : https://www.zhihu.com/question/24822927


### CSS3 瀑布布局


三列瀑布

``` css
.con {
  column-count: 3;
}

.todo-card {
  float: left;
  width: 100%;
}
```


### CSS 将DIV画成直角三角形


教程: https://www.cnblogs.com/v-weiwang/p/5057588.html


### CSS自定义滚动条样式


https://segmentfault.com/a/1190000012800450

特效是不会无故无效的，检查一下是不是开了inline

下面这个是coding的滚动条样式：
``` css
*::-webkit-scrollbar {
    width: 8px;
    height: 8px; 
}
*::-webkit-scrollbar-track {
    background-color: rgba(216, 221, 228, 0.3);
    border-radius: 10px; 
}
*::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #76808e; 
}
*::-webkit-scrollbar-thumb:window-inactive {
    background: #d8dde4; 
}
```


### CSS inline-block 垂直居中


https://www.cnblogs.com/olafff/p/5103775.html

https://www.cnblogs.com/hutuzhu/p/4450850.html


## :star: JS工具/框架相关

### React Native 


> 可以做桌面应用

网址: https://proton-native.js.org/#/


### Layui


> 给后端用的前端框架

[官网](http://www.layui.com)


### wangEditor 轻量级前端富文本编辑器


![image](https://user-images.githubusercontent.com/23525754/39693997-65bd7248-5218-11e8-849b-15417cd9dda2.png)

[官网](http://www.wangeditor.com/)


### KaTeX 最快的数学公式渲染库


官方link : https://khan.github.io/KaTeX/function-support.html

editor.md的Demo : http://pandao.github.io/editor.md/examples/katex.html

![image](https://user-images.githubusercontent.com/23525754/39822606-93ef96f2-53dd-11e8-9381-d3d607eaf2eb.png)


### JQuery 日期选择控件


网站：https://xdsoft.net/jqplugins/datetimepicker/


### JS 数据可视化


有哪些值得推荐的数据可视化工具？ - 李启方的回答 - 知乎
https://www.zhihu.com/question/19929609/answer/383055223


### windows下调试iOS网页设备


https://www.jianshu.com/p/73715ee54712


## :star: HTML/H5

### textarea的字数限制


``` html
<textarea 
  rows="5"  
  maxlength="200" 
  onchange="this.value=this.value.substring(0, 200)" 
  onkeydown="this.value=this.value.substring(0, 200)" 
  onkeyup="this.value=this.value.substring(0, 200)">
</textarea>
```

事实上，有了maxLength属性，textarea的输入就已经会有限制了


### input只允许输入数字


``` html
<input type="text" oninput="value=value.replace(/[^\d]/g,'')">
```

### 图片禁止拖拽

在对应标签中添加如下属性即可。

```javascript
oncontextmenu = "return false;" //禁止鼠标右键
ondragstart = "return false;" //禁止鼠标拖动
onselectstart = "return false;" //文字禁止鼠标选中
onselect = "document.selection.empty();" //禁止复制文本
```

例如：

```html
<img src="img/logo.jpg" ondragstart="return false;" />
```

> 作者：祁月笑
> 链接：https://www.imooc.com/article/20121?block_id=tuijian_wz
> 来源：慕课网

