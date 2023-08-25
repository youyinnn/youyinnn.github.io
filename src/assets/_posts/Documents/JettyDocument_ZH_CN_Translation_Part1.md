---
title: JettyDocument_ZH_CN_Translation_Part1
tags:
  - jetty
  - document
categories:
  - translation
series: JettyDocument_ZH_CN_Translation
date: 2018-05-07 17:30:01
---

### Ⅰ.开始使用 Jetty

<span id="top"></span>

- 1. [关于 Jetty 的介绍](#1关于jetty的介绍)
  - [什么是 Jetty](#11什么是jetty)
  - [我应该使用哪个版本](#12我应该使用哪个版本)
  - [Jetty 和 JavaEE 的 Web 规范](#13jetty和javaee的web规范)
  - [在 Maven 里面找到 Jetty](#14在maven里面找到jetty)
- 2. [使用 Jetty](#2使用jetty)
  - [下载 Jetty](#21下载jetty)
  - [运行 Jetty](#22运行jetty)
    - [Demo Base](#221demo-base)
    - [创建 Jetty Base](#222创建jetty-base)
    - [更改 Jetty 的端口号](#223更改jetty的端口号)
    - [为 HTTPS 和 HTTP2 添加 SSL](#224为https和http2添加ssl)
    - [更改 HTTPS 的端口号](#225更改https的端口号)
    - [获取更多的 start.jar 选项](#226获取更多的startjar选项)
  - [部署 Web 应用](#23部署web应用)
- 3. [关于 Jetty Configuration 的介绍](#3关于jetty-configuration的介绍)
  - [如何配置 Jetty](#31如何配置jetty)
    - [使用 POJO 的方法配置](#311使用pojo的方法配置)
    - [使用 Start 配置文件配置](#312使用start配置文件配置)
    - [其他配置文件](#313其他配置文件)
    - [Jetty 的 IoC XML 的形式配置](#314jetty的ioc-xml的形式配置)
  - [可以在 Jetty 里面配置什么](#32可以在jetty里面配置什么)
    - [配置 Server](#321配置server)
    - [配置 Connectors](#322配置connectors)
    - [配置 Contexts](#323配置contexts)

---

<span id="1关于jetty的介绍"></span>

### 1、关于 Jetty 的介绍

- 1.1、[什么是 Jetty](#11什么是jetty)
- 1.2、[我应该使用哪个版本](#12我应该使用哪个版本)
- 1.3、[Jetty 和 JavaEE 的 Web 规范](#13jetty和javaee的web规范)
- 1.4、[在 Maven 里面找到 Jetty](#14在maven里面找到jetty)

<span id="11什么是jetty"></span>

#### 1.1、什么是 Jetty

Jetty 是一个开源的项目，它可以作为 HTTP 服务器，HTTP 客户端，和 Servlet 容器来使用。

这个指南总共分为以下 5 个部分：

> - 第一部分，告诉你怎么开始使用 Jetty。 它提供了 Jetty 的相关信息以及你可以在哪里下载到它，以及你可以在哪些仓库源中找到它，比如 Maven 的中央仓库。它还提供了一个 Quick Start，告诉你如何启动和运行 Jetty，以及一个关于如何配置 Jetty 和 Jetty 可以配置些什么的概述。

> - 第二部分，更加详细的给予你配置 Jetty 的指南。它解释了 Jetty 如何去部署一个 Web 应用，如何配置上下文和连接，以及如何实现 SSL 和其他的安全措施。

> - 第三部分，这是如何管理 Jetty 的重点指南。它从服务器的启动到 session 的管理，日志记录，HTTP/2 的支持，再到 Jetty 的优化，这些章节会帮助管理者学到很多 Jetty 实例以外的知识。这个部分当然也会告诉你怎么配置和其他 servlet 容器一样都会有的许多配置，比如 JNDI 和 JMX。

> - 第四部分，这个部分注重的是 Jetty 的开发，是给更高级的 Jetty 用户准备的。里面很大一部分是告诉你如何在一个现有项目里面去使用嵌入式 Jetty。它还包含了几个栗子，里面讲述了许多 Jetty 架构之外的东西。这个部分也会告诉你如何使用 Maven 中的 Jetty 插件，同时也会介绍如何 debugJetty。

> - 第五部分，这部分是一些参考内容，包括一些 Jetty 架构的指南、JettyXML 的语法、Jetty 的分布式指南和一些常见问题的排查。同样会告诉你怎么才可以参与到 Jetty 社区中，参与贡献。

[回到顶部](#top)

---

<span id="12我应该使用哪个版本"></span>

#### 1.2、我应该使用哪个版本

> _这里使用表格介绍了 Jetty 版本对应的发布年、持有者、支持的 JDK 版本、支持的协议、servlet 规范版本、JSP 规范版本、以及是否是稳定还是已经被遗弃。_
>
> _Markdown 作表格实在是太蛋疼了我就不搞了，大家可以在[这里](http://www.eclipse.org/jetty/documentation/9.4.6.v20170531/what-jetty-version.html)去参照。_

> _大致说一下，Jetty8 之前的版本都已经被弃用（Deprecated）了，更不要说是远古时期甚至是神话时期了（官网就这么描述的，好中二），从 9.2 开始就是稳定版了。92 是 jdk7、93 以上就是 jdk8 了。_

[回到顶部](#top)

---

<span id="13jetty和javaee的web规范"></span>

#### 1.3、Jetty 和 JavaEE 的 Web 规范

> _这里介绍的也是 Jetty 对 JavaEE 规范的支持程度，值得一提的是，Jetty 并没有实现完整的规范，部分规范需要以 Jetty 插件的形式去支持。_
>
> _表格我也不搞了，大家可以在[这里](http://www.eclipse.org/jetty/documentation/9.4.6.v20170531/jetty-javaee.html)去参照。_

[回到顶部](#top)

---

<span id="14在maven里面找到jetty"></span>

#### 1.4、在 Maven 里面找到 Jetty

> _就是告诉你 Jetty 的 maven 坐标，但是官网在这里比较坑，文档中说，Jetty 是从项目成立初始就把项目发布到 maven 上了，由于历史原因，它的坐标变动了很多次，但是文档给出的示例代码也太不负责任了：_

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-project</artifactId>
  <version>${project.version}</version>
</dependency>
```

> _如果是`jetty-project`这个 A 值你能找到东西就有鬼了。_

> _我在 README 中给出了依赖的模板，大家去参照那个。_

> _然后还给出了一个 Changelogs 的坐标，这个没啥卵用。_

[回到顶部](#top)

---

<span id="2使用jetty"></span>

### 2、使用 Jetty

- 2.1、[下载 Jetty](#21下载jetty)
- 2.2、[运行 Jetty](#22运行jetty)
- 2.3、[部署 Web 应用](#23部署web应用)

<span id="21下载jetty"></span>

#### 2.1、下载 Jetty

##### 独立版本：

独立的 Jetty 版本你可以在 eclipse 公司主页上下载：

**Jetty** https://www.eclipse.org/jetty/download.html

它包含了 zip 和 gzip 两种格式，去下载一个最适合你系统的版本吧。让你下载好并且解压好之后，你会得到一个`jetty-distribution-VERSION`的目录。

把这个目录放在你常用的位置，文章后面的部分会引用到这个目录，我们使用`JETTY_HOME`或者`${jetty.home}`来在环境变量和 Java 程序中引用它。

> **注意**
>
> 你必须要知道的一点是：只有稳定版（stable releases）才能使用在生产环境。如果是被舍弃版本（deprecated）或者是里程碑版本（Milestones）即 M 版，或者是候选版（Release Candidates）即 RC 版，并不适合在生产环境中使用，因为它们可能会造成安全隐患或者是功能不完善等问题。

目录包含的内容：

> license-eplv10-aslv20.html
>
> 这是 Jetty 的开源许可文件

> README.txt
>
> 包含一些快速开始的指南

> VERSION.txt
>
> 版本信息

> bin/
>
> 帮助 Jetty 运行的 shell 程序

> demo-base/
>
> Jetty Base 的演示目录

> etc/
>
> Jetty 的 XML 配置文件目录

> lib/
>
> Jetty 运行所必须 jar 包

> logs/
>
> 请求日志目录

> modules/
>
> 模块定义的目录

> notice.html
>
> 开源许可介绍和注意事项

> resources/
>
> 包含额外的资源、配置

> start.ini
>
> 包含有效的命令行参数的启动文件（模块、配置、xml 配置文件）

> start.jar
>
> 运行 Jetty 的 jar 文件

> webapps/
>
> 包含在 Jetty 默认配置下运行的 web 项目

##### 家用版

> _这个我也不知道怎么介绍，官网的意思是说，这个是较小的 Jetty 版本，适合对 Jetty 比较熟悉了的高级的 Jetty 用户使用，下载地址和目录说明我就不写了，大家有能力自己去了解。_

[回到顶部](#top)

---

<span id="22运行jetty"></span>

#### 2.2、运行 Jetty

- [2.2.1、Demo Base](#221demo-base)
- [2.2.2、创建 Jetty Base](#222创建jetty-base)
- [2.2.3、更改 Jetty 的端口号](#223更改jetty的端口号)
- [2.2.4、为 HTTPS 和 HTTP2 添加 SSL](#224为https和http2添加ssl)
- [2.2.5、更改 HTTPS 的端口号](#225更改https的端口号)
- [2.2.6、获取更多的 start.jar 选项](#226获取更多的startjar选项)

##### 2.2.0、一个 HelloWorld：

你可以使用一下命令来启动 Jetty，默认使用 8080 端口，在这之前你得把 Jetty 的根目录配置到环境变量中：

```
> cd $JETTY_HOME
> java -jar start.jar

2015-06-04 10:50:44.806:INFO::main: Logging initialized @334ms
2015-06-04 10:50:44.858:WARN:oejs.HomeBaseWarning:main: This instance of Jetty is not running from a separate {jetty.base} directory, this is not recommended.  See documentation at http://www.eclipse.org/jetty/documentation/current/startup.html
2015-06-04 10:50:44.995:INFO:oejs.Server:main: jetty-9.3.0.v20150601
2015-06-04 10:50:45.012:INFO:oejdp.ScanningAppProvider:main: Deployment monitor [file:///opt/jetty-distribution-9.3.0.v20150601/webapps/] at interval 1
2015-06-04 10:50:45.030:INFO:oejs.ServerConnector:main: Started ServerConnector@19dfb72a{HTTP/1.1,[http/1.1]}{0.0.0.0:8080}
2015-06-04 10:50:45.030:INFO:oejs.Server:main: Started @558ms
```

然后你可以在浏览器地址栏上输入 http://localhost:8080 。当然，当前目录下没有任何有效的 web 项目，所以你访问任何 url 都是 404 页面

从警告信息中我们可以看到，它告诉我们，我们的命令并不是执行在`{jetty.base}`目录中，这样的做法是不被推荐的。

[下面](#创建jetty-base)会告诉你如何创建 Jetty Base 目录。

<span id="221demo-base"></span>

##### 2.2.1、Demo Base

在标准 Jetty 目录中，有一个名为`demo-base`的目录，它演示了不在`JETTY_HOME`目录下运行 Jetty Base 项目的推荐做法：

```
> cd $JETTY_HOME/demo-base/
> java -jar $JETTY_HOME/start.jar

2015-06-04 10:55:24.161:INFO::main: Logging initialized @308ms
2015-06-04 10:55:24.431:WARN::main: demo test-realm is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:24.434:INFO:oejs.Server:main: jetty-9.3.0.v20150601
2015-06-04 10:55:24.457:INFO:oejdp.ScanningAppProvider:main: Deployment monitor [file:///opt/jetty-distribution-9.3.0.v20150601/demo-base/webapps/] at interval 1
2015-06-04 10:55:24.826:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@c038203{/,file:///opt/jetty-distribution-9.3.0.v20150601/demo-base/webapps/ROOT/,AVAILABLE}{/ROOT}
2015-06-04 10:55:24.929:WARN::main: test-jaas webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:24.978:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@46238e3f{/test-jaas,file:///tmp/jetty-0.0.0.0-8080-test-jaas.war-_test-jaas-any-9105214562680121772.dir/webapp/,AVAILABLE}{/test-jaas.war}
2015-06-04 10:55:25.162:WARN::main: async-rest webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:25.208:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@6b67034{/async-rest,[file:///tmp/jetty-0.0.0.0-8080-async-rest.war-_async-rest-any-1023939491558622183.dir/webapp/, jar:file:///tmp/jetty-0.0.0.0-8080-async-rest.war-_async-rest-any-1023939491558622183.dir/webapp/WEB-INF/lib/example-async-rest-jar-9.3.0.v20150601.jar!/META-INF/resources],AVAILABLE}{/async-rest.war}
2015-06-04 10:55:25.311:WARN::main: test-jndi webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:25.386:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@8b96fde{/test-jndi,file:///tmp/jetty-0.0.0.0-8080-test-jndi.war-_test-jndi-any-1692053319754270133.dir/webapp/,AVAILABLE}{/test-jndi.war}
2015-06-04 10:55:25.508:WARN::main: test-spec webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:25.594:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@69930714{/test-spec,[file:///tmp/jetty-0.0.0.0-8080-test-spec.war-_test-spec-any-5518740932795802823.dir/webapp/, jar:file:///tmp/jetty-0.0.0.0-8080-test-spec.war-_test-spec-any-5518740932795802823.dir/webapp/WEB-INF/lib/test-web-fragment-9.3.0.v20150601.jar!/META-INF/resources],AVAILABLE}{/test-spec.war}
2015-06-04 10:55:25.781:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@3eb7fc54{/proxy,file:///tmp/jetty-0.0.0.0-8080-xref-proxy.war-_xref-proxy-any-3068657547009829038.dir/webapp/,AVAILABLE}{/xref-proxy.war}
2015-06-04 10:55:25.786:INFO:oejsh.ContextHandler:main: Started o.e.j.s.h.MovedContextHandler@59662a0b{/oldContextPath,null,AVAILABLE}
2015-06-04 10:55:25.951:WARN::main: test webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 10:55:26.248:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@4f83df68{/test,file:///tmp/jetty-0.0.0.0-8080-test.war-_test-any-5238659347611323540.dir/webapp/,AVAILABLE}{/test.war}
2015-06-04 10:55:26.255:INFO:oejs.ServerConnector:main: Started ServerConnector@5a9c4ad9{HTTP/1.1,[http/1.1]}{0.0.0.0:8080}
2015-06-04 10:55:26.259:INFO:oejus.SslContextFactory:main: x509={jetty.eclipse.org=jetty} wild={} alias=null for SslContextFactory@23941fb4(file:///opt/jetty-distribution-9.3.0.v20150601/demo-base/etc/keystore,file:///opt/jetty-distribution-9.3.0.v20150601/demo-base/etc/keystore)
2015-06-04 10:55:26.269:INFO:oejs.ServerConnector:main: Started ServerConnector@5d908d47{SSL,[ssl, http/1.1]}{0.0.0.0:8443}
2015-06-04 10:55:26.270:INFO:oejs.Server:main: Started @2417ms
```

同样，你可以访问 8080 网站去查看这个项目。上面部署了一些简单的页面和 demo。

你还可以使用以下命令，来查看这个 demo-base 的运行配置：

```
> cd $JETTY_HOME/demo-base/
> java -jar $JETTY_HOME/start.jar --list-modules
...

> java -jar %JETTY_HOME/start.jar --list-config
...
```

`--list-modules`命令会返回一张完整的列表，这个列表包含了服务器可用的并且正在使用的模块，它同时还会显示模块所在的目录，以及它们是怎样、用什么命令实现的，当前项目所依赖的模块，以及相关的 jar 包等。

`--list-config`命令会显示一些关于服务器重要信息。包含 Java 和 Jetty 和环境变量、配置命令、任何的 JVM 参数或者系统变量设置、基础服务器配置、全列的 Jetty 服务器的类路径、被激活使用的 JettyXML 配置文件。

[回到顶部](#top)
<br>

<span id="222创建jetty-base"></span>

##### 2.2.2、创建 Jetty Base

上述 demo-bases 目录给我们展示了 Jetty 的 Jetty Base 机制。一个 Jetty Base 目录允许使用单独的配置并且可以在 Jetty 目录以外的地方建立一个 Jetty 服务器实例，这样一来可以减小升级带来的代价。Jetty 的默认配置是基于以下两个配置项：

**jetty.home**：用来定义 Jetty 根目录的位置的配置项，根目录包含：libs、默认模块、默认 XML 文件（具体的如 start.jar、lib、etc）。
**jetty.base**：用来定义一个 Jetty 服务器的特殊实现，这个目录同时包含：它的配置文件、日志文件、web 项目（具体如 start.d/\*.ini 文件，logs、webapps）。

> **注意**
>
> 你必须认真对待 JettyHome 目录和保持它不变。如果你需要变动一些目录或者配置，你应该在 JettyBase 目录中进行。

`jetty.home`和`jetty.base`可以使用命令行去显示的配置，或者它们可以从环境变量中判断该使用什么配置，你可以这样写命令：

```
> cd $JETTY_BASE
> java -jar $JETTY_HOME/start.jar
```

下面的命令会创建一个 base 目录，这个目录支持 HTTP 连接和 web 项目的部署模块，然后把 demo 项目复制到我们创建的这个目录下部署：

```
> JETTY_BASE=/tmp/mybase
> mkdir $JETTY_BASE
> cd $JETTY_BASE
> java -jar $JETTY_HOME/start.jar

WARNING: Nothing to start, exiting ...

Usage: java -jar start.jar [options] [properties] [configs]
       java -jar start.jar --help  # for more information

> java -jar $JETTY_HOME/start.jar --create-startd
INFO : Base directory was modified
> java -jar $JETTY_HOME/start.jar --add-to-start=http,deploy

INFO: server          initialised (transitively) in ${jetty.base}/start.d/server.ini
INFO: http            initialised in ${jetty.base}/start.d/http.ini
INFO: security        initialised (transitively) in ${jetty.base}/start.d/security.ini
INFO: servlet         initialised (transitively) in ${jetty.base}/start.d/servlet.ini
INFO: webapp          initialised (transitively) in ${jetty.base}/start.d/webapp.ini
INFO: deploy          initialised in ${jetty.base}/start.d/deploy.ini
MKDIR: ${jetty.base}/webapps
INFO: Base directory was modified

> cp $JETTY_HOME/demo-base/webapps/async-rest.war webapps/ROOT.war
> java -jar $JETTY_HOME/start.jar

2015-06-04 11:10:16.286:INFO::main: Logging initialized @274ms
2015-06-04 11:10:16.440:INFO:oejs.Server:main: jetty-9.3.0.v20150601
2015-06-04 11:10:16.460:INFO:oejdp.ScanningAppProvider:main: Deployment monitor [file:///tmp/mybase/webapps/] at interval 1
2015-06-04 11:10:16.581:WARN::main: async-rest webapp is deployed. DO NOT USE IN PRODUCTION!
2015-06-04 11:10:16.589:INFO:oejw.StandardDescriptorProcessor:main: NO JSP Support for /, did not find org.eclipse.jetty.jsp.JettyJspServlet
2015-06-04 11:10:16.628:INFO:oejsh.ContextHandler:main: Started o.e.j.w.WebAppContext@1a407d53{/,[file:///tmp/jetty-0.0.0.0-8080-ROOT.war-_-any-4510228025526425427.dir/webapp/, jar:file:///tmp/jetty-0.0.0.0-8080-ROOT.war-_-any-4510228025526425427.dir/webapp/WEB-INF/lib/example-async-rest-jar-9.3.0.v20150601.jar!/META-INF/resources],AVAILABLE}{/ROOT.war}
2015-06-04 11:10:16.645:INFO:oejs.ServerConnector:main: Started ServerConnector@3abbfa04{HTTP/1.1,[http/1.1]}{0.0.0.0:8080}
2015-06-04 11:10:16.646:INFO:oejs.Server:main: Started @634ms
```

<br>

> _译者文外补充：第一行命令是在当前运行时环境变量中添加一条环境变量，把`JETTY_BASE`目录指定为`/tmp/mybase`，第二行创建这个目录，第三行是进入到这个目录，第四行是尝试运行这个目录，但是提示失败因为目录里啥也没有。然后使用`--create-startd`命令和`--add-to-start=http,deploy`命令去初始化和添加 HTTP 连接和 Web 部署模块，然后把之前 demo-base 目录中的一个 war 包复制过来，最后启动项目_

[回到顶部](#top)
<br>

<span id="223更改jetty的端口号"></span>

##### 2.2.3、更改 Jetty 的端口号

```
> cd $JETTY_BASE
> java -jar $JETTY_HOME/start.jar jetty.http.port=8081
...
```

当项目运行的时候，就会在 8081 端口中运行，你需要注意的是，使用命令行配置只对当次的 JettyBase 中的 web 项目有效，如果你想永久地改变当前 JettyBase 的 web 项目运行的端口号，你可以修改 start.d 目录中 http.ini 文件的配置。

> _译者文外补充：前提是你为这个 JettyBase 添加了 HTTP 连接模块_

> **NOTE：**
>
> 配置通过以下的链来生效：
>
> - `start.d/http.ini`文件是有效执行的命令行的一部分，它还包含了`--modules-http`参数，这个参数会激活 http 模块。
>
> - `modules/http.mod`文件定义了 http 模块，这个模块规定了它所使用的 etc/jetty-http.xml 配置文件和 template.ini 文件。
>
> - `jetty.http.port`这个配置是被在`etc/jetty.http.xml`文件中的`PropertyXML`对象把端口设置注入到`ServerConnector`实例中去的。
>
> 你可以在后面的章节中学到配置的更详细的说明。

[回到顶部](#top)
<br>

<span id="224为https和http2添加ssl"></span>

##### 2.2.4、为 HTTPS 和 HTTP2 添加 SSL

在上面的栗子中，我们可以为服务器激活附加的 HTTPS 模块和 HTTP2 模块。你可以使用以下命令添加：

```
> java -jar $JETTY_HOME/start.jar --add-to-start=https,http2

ALERT: There are enabled module(s) with licenses.
The following 1 module(s):
 + contains software not provided by the Eclipse Foundation!
 + contains software not covered by the Eclipse Public License!
 + has not been audited for compliance with its license

 Module: alpn-impl/alpn-8
  + ALPN is a hosted at github under the GPL v2 with ClassPath Exception.
  + ALPN replaces/modifies OpenJDK classes in the sun.security.ssl package.
  + http://github.com/jetty-project/jetty-alpn
  + http://openjdk.java.net/legal/gplv2+ce.html

Proceed (y/N)? y
INFO  : alpn-impl/alpn-1.8.0_92 dynamic dependency of alpn-impl/alpn-8
INFO  : alpn            transitively enabled, ini template available with --add-to-start=alpn
INFO  : alpn-impl/alpn-8 dynamic dependency of alpn
INFO  : http2           initialized in ${jetty.base}/start.d/http2.ini
INFO  : https           initialized in ${jetty.base}/start.d/https.ini
INFO  : ssl             transitively enabled, ini template available with --add-to-start=ssl
MKDIR : ${jetty.base}/lib/alpn
DOWNLD: http://central.maven.org/maven2/org/mortbay/jetty/alpn/alpn-boot/8.1.8.v20160420/alpn-boot-8.1.8.v20160420.jar to ${jetty.base}/lib/alpn/alpn-boot-8.1.8.v20160420.jar
MKDIR : ${jetty.base}/etc
COPY  : ${jetty.home}/modules/ssl/keystore to ${jetty.base}/etc/keystore
INFO  : Base directory was modified

> java -jar $JETTY_HOME/start.jar
[...]
2017-05-22 12:48:23.271:INFO:oejs.AbstractConnector:main: Started ServerConnector@134d0064{SSL,[ssl, alpn, h2, http/1.1]}{0.0.0.0:8443}
[...]
```

`--add-to-start`为 ini 文件添加了一行有效的命令行命令，它可以运行一个支持 HTTPS 和 HTTP2 的 SSL 连接，下面是过程参照：

- 过渡性地激活 SSL 模块，这会在`etc/jetty-ssl.xml`和`etc/jetty-ssl-context.xml`文件中添加有效的命令行，这样就给服务器配置好了 SSL 连接。

- 过渡性地激活 APLN 模块，这会在`etc/jetty-alpn.xml`文件中添加有效的命令行，这样就为 SSL 连接配置好了应用层协议。

- 在`etc/jetty-https.xml`文件中添加有效的命令行，这会创建`start.d/https.ini`，这样就为 SSL 连接配置上了 HTTPS 协议。

- 在`etc/jetty-http2.xml`文件中添加有效的命令行，这会创建`start.d/http2.ini`，这样就为 SSL 连接配置上了 HTTP/2 协议。

- 检查是否存在`etc/keystore`文件，如果不存在，就联网下载一个示范用的 keystore 文件。

[回到顶部](#top)
<br>

<span id="225更改https的端口号"></span>

##### 2.2.5、更改 HTTPS 的端口号

你可以通过命令：

```
> cd $JETTY_BASE
> java -jar $JETTY_HOME/start.jar jetty.ssl.port=8444
```

除此之外，你还可以在`start.ini`或者`start.d/*.ini`中设置有效的命令行去修改 ssl 端口号，你可以在“[Start.ini vs Start.d]()”中了解到更多。

[回到顶部](#top)
<br>

<span id="226获取更多的startjar选项"></span>

##### 2.2.6、获取更多的 start.jar 选项

`start.jar`的工作有：

- 解释 start.ini 和 start.d 目录下的配置文件的命令行来建立 Java 类路径环境。

- 罗列出所有配置和配置文件并通过 JettyXML 配置机制的主类去加载到环境中。

> _原文这两段话如下：_ The job of the start.jar is to interpret the command line, start.ini and start.d directory (and associated .ini files) to build a Java classpath and list of properties and configuration files to pass to the main class of the Jetty XML configuration mechanism.

你可以通过以下命令行去获取更多的选项：

```
> java -jar $JETTY_HOME/start.jar --help
```

[回到顶部](#top)

---

<span id="23部署web应用"></span>

#### 2.3、部署 Web 应用

一个配置了 deploy 模块的 Jetty 服务器实例（即一个 JettyBase）会有一个 web 应用部署器在 webapps 目录，它支持对 web 应用的热部署。按照下面的协定方式把标准的 WAR 文件和 Jetty 配置文件放置在 webapps 目录下你就可以在服务器上实现热部署了。

- 一个名为`example/`的目录作为将要被部署的 Web 应用，它需要包含`WEB-INF`子目录，不然这个应用就会被当作静态内容。一般的情况下路由路径会是`http://localhost:8080/example/`，除非你的目录名为`ROOT`，这样你的路径就会是`http://localhost:8080/`。如果目录名以.d 结尾，那么它将被忽略（它可以作为额外的配置文件的放置目录使用）

- 一个名为`example.war`的文件会作为标准 web 应用被部署，路径如上，如果名为`ROOT.war`路径也如上。如果`example.war`和`example/`同时存在，则会部署 war 文件（就会部署 war 中未解压的 wab 项目）。

- 一个 example.xml 文件，会被配置为上下文环境（context）。文件中必须设置上下文环境的路径（context path）。如果 xml 文件和 war 文件同时存在，则会部署 xml 文件对应的 web 项目（就会部署里面配置的 war 文件）。

在 demo-base/wabapps 中示例了多种目录以及多种部署方式。

[回到顶部](#top)

---

<span id="3关于jetty-configuration的介绍"></span>

### 3、关于 Jetty Configuration 的介绍

- 3.1、[如何配置 Jetty](#31如何配置jetty)
- 3.2、[可以在 Jetty 里面配置什么](#32可以在jetty里面配置什么)

#### 3.1、如何配置 Jetty

- [3.1.1、使用 POJO 的方法配置](#311使用pojo的方法配置)
- [3.1.2、使用 Start 配置文件配置](#312使用start配置文件配置)
- [3.1.3、其他配置文件](#313其他配置文件)
- [3.1.4、Jetty 的 IoC XML 的形式配置](#314jetty的ioc-xml的形式配置)

<span id="311使用pojo的方法配置"></span>

##### 3.1.1、使用 POJO 的方法配置

Jetty 的核心组件就是 POJO，配置的过程就是实例化的 POJO、给 POJO 装配属性的过程。你可以通过以下的方法实现：

- 在嵌入式开发中，把 Jetty 对象写在 Java 代码里。

- 使用 JettyXML 配置机制，这是一种实现了 IoC 机制的框架，会把配置好的 XML 对象作为 Jetty 对象装配好。`etc/jetty.xml`文件是主要的 JettyXML 配置文件，但是在 Jetty 目录中也有许多其他的类似`etc/jetty-__feature__.xml`文件。

- 使用第三方的 IoC 框架，比如 Spring，来实例化 Jetty 成 JavaBean。

因为 Jetty 的主要配置是通过 IoC 来完成的，所以你可以在“[Jetty API 文档]()”中参考最终的完整的配置。

[回到顶部](#top)
<br>

<span id="312使用start配置文件配置"></span>

##### 3.1.2、使用 Start 配置文件配置

Jetty 使用以下的配置文件去实例化，通过 start.jar 机制去注入和启动服务器。

- **ini 文件：**
  Jetty 的启动机制是使用命令行来完成的，`$JETTY_BASE/start.ini`或者是`$JETTY_BASE/start.d/*.ini`文件写好了有效的命令行参数来启动 Jetty，这些参数可能是：
  - > 模块的激活：`--modules=name`
  - > 配置参数：`name=value`可以在 JettyIoC 中使用
  - > 在 JettyXML 中或者 Spring 中的 XML 文件
  - > 标准的 Java 配置文件
  - > 其他`start.jar`的配置选项（详见 java -jar start.jar --help）
  - > 一些 JVM 的选项
    > **NOTE：**
    >
    > 只有在 JettyBase 目录（如果 JettyBase 目录不是 JettyHome 目录）下的 ini 文件，才能特别的更改配置。
    >
    > _文档原文：It is the ini files located in the Jetty base directory (if different from Jetty home) that are typically edited to change the configuration (e.g. change ports)._

[回到顶部](#top)
<br>

- **mod 文件：**
  `$JETTY_HOME/modules/*.mod`文件定义了可使用的模块，你可以用`--modules=name`配置去激活它们。每一个 mod 都定义了：

  - > 模块依赖的命令和激活指令
  - > 模块需要添加到类路径中的库文件
  - > 模块需要加载到有效启动命令行的 XML 文件
  - > 模块启动所需要的必要文件
  - > 模板 ini 文件的内容，你可以使用`--add-to-start=name`命令选项添加 ini 文件到你的 JettyBase/start.d/目录中

    我们提供的 module 文件尽量不要编辑，除非是在一些重要的构建变更的时候。mod 文件通常被默认放置在`$JETTY_HOME/modules/`目录下，但是你可以在`$JETTY_BASE/modules/`中添加额外的 mod 配置文件。如果需要改变模块，你最好从`$JETTY_HOME/modules/`目录中复制特定的 mod 文件到`$JETTY_BASE/modules/`中去，然后再对其进行修改。

<br>

- **XML 文件：**
  在[Jetty IoC XML 形式]()或者 Spring IoC 形式中的 XML 文件。
  后面的我就不翻译了，有需要的自己看，就一段话，并没有说明如何配置。
  > _文档原文：_
  > XML files in Jetty IoC XML format or Spring IoC format are listed either on the command line, in ini files, or are added to the effective command line by a module definition.
  >
  > The XML files instantiate and inject the actual Java objects that comprise the server, connectors and contexts. Because Jetty IoC XML files use properties, most common configuration tasks can be accomplished without editing these XML files and can instead be achieved by editing the property in the corresponding ini files.
  >
  > XML files are normally located in `$JETTY_HOME/etc/`, but extra or edited XML files may be added to `$JETTY_BASE/etc/`. Note If XML configuration changes are required, it is best practice to copy the XML file from `$JETTY_HOME/etc/` to `$JETTY_BASE/etc/` before being modified.

下图描述了 Jetty 的各种各样的配置文件是如何联系起来的：

![Jetty_Configuration_File_Relationships](https://github.com/youyinnn/JettyDocTranslation/raw/master/doc/img/Jetty_Configuration_File_Relationships.png)

[回到顶部](#top)
<br>

<span id="313其他配置文件"></span>

##### 3.1.3、其他的配置文件

- **Context XML 文件**
- **web.xml 文件**
- **properties 文件**

关于这三种配置文件的介绍内容就不再翻译，有需要的同学可以去[原文](http://www.eclipse.org/jetty/documentation/9.4.6.v20170531/quick-start-configure.html#quickstart-config-how)学习。

[回到顶部](#top)
<br>

<span id="314jetty的ioc-xml的形式配置"></span>

##### 3.1.4、Jetty 的 IoC XML 的形式配置

你可以在 Java 代码里面启动服务器：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class ExampleServer
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server();

        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8080);
        server.setConnectors(new Connector[] { connector });

        ServletContextHandler context = new ServletContextHandler();
        context.setContextPath("/");
        context.addServlet(HelloServlet.class, "/hello");
        context.addServlet(AsyncEchoServlet.class, "/echo/*");

        HandlerCollection handlers = new HandlerCollection();
        handlers.setHandlers(new Handler[] { context, new DefaultHandler() });
        server.setHandler(handlers);

        server.start();
        server.join();
    }
}
```

你也可以使用 Jetty IoC XML 的形式去配置一个一模一样的服务器，完全不用写任何代码：

```
<?xml version="1.0"?>
<!DOCTYPE Configure PUBLIC "-//Jetty//Configure//EN" "http://www.eclipse.org/jetty/configure_9_3.dtd">

<Configure id="ExampleServer" class="org.eclipse.jetty.server.Server">

  <Set name="connectors">
    <Array type="org.eclipse.jetty.server.Connector">
      <Item>
        <New class="org.eclipse.jetty.server.ServerConnector">
          <Arg><Ref refid="ExampleServer"/></Arg>
          <Set name="port">8080</Set>
        </New>
      </Item>
    </Array>
  </Set>

  <New id="context" class="org.eclipse.jetty.servlet.ServletContextHandler">
    <Set name="contextPath">/hello</Set>
    <Call name="addServlet">
      <Arg>org.eclipse.jetty.embedded.HelloServlet</Arg>
      <Arg>/</Arg>
    </Call>
  </New>

  <Set name="handler">
    <New class="org.eclipse.jetty.server.handler.HandlerCollection">
      <Set name="handlers">
        <Array type="org.eclipse.jetty.server.Handler">
          <Item>
            <Ref refid="context" />
          </Item>
          <Item>
            <New class="org.eclipse.jetty.server.handler.DefaultHandler" />
          </Item>
        </Array>
      </Set>
    </New>
  </Set>
</Configure>
```

<br>

> _译者文外补充：JettyIOC 的注入方式的使用非常蠢，不建议使用。_

[回到顶部](#top)

---

<span id="32可以在jetty里面配置什么"></span>

#### 3.2、可以在 Jetty 里面配置什么

- [配置 Server](#321配置server)
- [配置 Connectors](#322配置connectors)
- [配置 Contexts](#323配置contexts)

这一部分会给出一些之前的章节没有介绍过的配置机制的概述。在整个文档的最后一部分中的“[Jetty Architecture]()”章节会为你解释 Jetty 服务器的整体架构，这对于你了解 Jetty 的运行机制会非常有帮助，如果你还想修改 Jetty 默认的架构的话，你可以得到一些非常重要的指导。当然，Jetty 的默认架构已经满足绝大部分的需求了。

<span id="321配置server"></span>

##### 3.2.1、配置 Server

Server 实例是 Jetty 服务器的中央协调对象（central coordination object），它提供了所有 Jetty 服务器组件所需要的服务以及生命周期的管理。在标准的 Jetty 发行版里面，核心的 server 服务的配置是在`etc/jetty.xml`文件中，但是你可以混合其他的服务器配置，可配置内容如下：

> ThreadPool
>
> Handlers
>
> Server Attributes
>
> Server fields
>
> Connectors
>
> Services

[回到顶部](#top)
<br>

<span id="322配置connectors"></span>

##### 3.2.2、配置 Connectors

Jetty 服务器连接器是一个网络端点接受连接一个或多个协议产生 Jetty 服务器的请求或消息。在标准 Jetty 服务器中，可以通过额外的文件增加 Jetty 服务器支持的协议，例如 http.ini，https.ini 和 jetty-http2.xml，连接的配置一般都是典型的，如下：

> Port
>
> Host
>
> Idle Timeout
>
> HTTP Configuration
>
> SSL Context Factory

[回到顶部](#top)
<br>

<span id="323配置contexts"></span>

##### 3.2.3、配置 Contexts

常见的 Context 配置：

> contextPath
>
> virtualHost
>
> classPath
>
> attributes
>
> resourceBase

你可以通过 API 去配置 Context：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;

public class OneContext
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server( 8080 );

        // Add a single handler on context "/hello"
        ContextHandler context = new ContextHandler();
        context.setContextPath( "/hello" );
        context.setHandler( new HelloHandler() );

        // Can be accessed using http://localhost:8080/hello

        server.setHandler( context );

        // Start the server
        server.start();
        server.join();
    }
}
```

<br>

> _译者文外补充：_
>
> 后面还有使用 JettyIoC 去配置的示例代码我也不贴了。
>
> 这三种配置我并没有翻译在哪里配置以及每个配置项的具体含义，有需要的可以自己查看原文去配置，原文是有的。
>
> 后面还有一些关于 web 的配置介绍、ContextPath 的配置介绍、Web 应用的部署规则、认证 Realm 的设置等等，我感觉都不是什么有用的干活，也就不再翻译下去了。

[回到顶部](#top)

---
