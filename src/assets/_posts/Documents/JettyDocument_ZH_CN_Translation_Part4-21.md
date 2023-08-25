---
title: JettyDocument_ZH_CN_Translation_Part4-21
tags:
  - jetty
  - document
categories:
  - translation
series: JettyDocument_ZH_CN_Translation
date: 2018-05-07 17:30:01
---

<span id="top"></span>

### Ⅳ. Jetty 开发指南-21.嵌入式开发

- 21. [嵌入式开发](#21嵌入式开发)
  - [Jetty 的嵌入式 Hello World](#211jetty的嵌入式hello-world)
    - [下载 Jar 包](#2111下载jar包)
    - [Hello World 栗子](#2112hello-world栗子)
    - [编译 Hello World 栗子](#2113编译hello-world栗子)
    - [运行 Handler 和 Server](#2114运行handler和server)
    - [下一步](#2115下一步)
  - [Jetty 的嵌入式开发](#212jetty的嵌入式开发)
    - [概述](#2121概述)
    - [创建 Server](#2122创建server)
    - [使用 Handler](#2123使用handler)
      - [一个 Handler 的 Hello World](#21231一个handler的hello-world)
      - [运行 HelloWorldHandler](#21232运行helloworldhandler)
      - [Handler Collections 和 Wrappers](#21233handler-collections和wrappers)
      - [Scoped Handlers](#21234scoped-handlers)
      - [Resource Handler](#21235resource-handler)
    - [嵌入 Connectors](#2124嵌入connectors)
      - [一个 Connectors](#21241一个connectors)
      - [多个 Connectors](#21242多个connectors)
    - [嵌入 Servlets](#2125嵌入servlets)
    - [嵌入 Contexts](#2126嵌入contexts)
    - [嵌入 ServletContexts](#2127嵌入servletcontexts)
    - [嵌入 Web 应用程序](#2128嵌入web应用程序)
    - [像 JettyXML 一样进行嵌入式开发](#2129像jettyxml一样进行嵌入式开发)
  - [嵌入式开发的栗子](#213嵌入式开发的栗子)
    - [简单的文件服务器](#2131简单的文件服务器)
    - [可分布的文件服务器](#2132可分布的文件服务器)
    - [多 Connectors](#2133多connectors)
    - [安全方面 Handler 的 Hello World](#2134安全方面handler的hello-world)
    - [最简单的 Servlet](#2135最简单的servlet)
    - [Web Application](#2136web-application)
    - [Web Application 以及 JSP](#2137web-application以及jsp)

---

<span id="21嵌入式开发"></span>

### 21、嵌入式开发

- 21.1、[Jetty 的嵌入式 Hello World](#211jetty的嵌入式hello-world)
- 21.2、[Jetty 的嵌入式开发](#212jetty的嵌入式开发)
- 21.3、[嵌入式开发的栗子](#213嵌入式开发的栗子)

<span id="211jetty的嵌入式hello-world"></span>

#### 21.1、Jetty 的嵌入式 HelloWorld

- 21.1.1、[下载 Jar 包](#2111下载jar包)
- 21.1.2、[Hello World 栗子](#2112hello-world栗子)
- 21.1.3、[编译 Hello World 栗子](#2113编译hello-world栗子)
- 21.1.4、[运行 Handler 和 Server](#2114运行handler和server)
- 21.1.5、[下一步](#2115下一步)

<span id="2111下载jar包"></span>

##### 21.1.1、下载 Jar 包

Jetty 把整体分解为许多的 jar 包，我们可以按需导入依赖。典型的做法是使用 Maven 去管理 jar 包，然而本节教程是使用的整体 jar 包，它包含了所有的 Jetty 服务。你可以通过 curl 或者浏览器去手动下载这个完整的 jar 包`jetty-all.jar`：http://central.maven.org/maven2/org/eclipse/jetty/aggregate/jetty-all/9.4.6.v20170531/jetty-all-9.4.6.v20170531-uber.jar。

> **NOTE：**
>
> 这个地址拒绝使用 wget 去下载，你可以使用 curl 的方式下载。

> **注意：**
>
> jetty-all.jar 包只是在本节作举例假设的引用，千万不要在教程以外的地方使用。你可以在后面的 Maven 章节了解到如何使用 Maven 去管理你的项目依赖。

按照以下的方式使用 curl 下载：

```
> mkdir Demo
> cd Demo
> curl -o jetty-all-uber.jar http://central.maven.org/maven2/org/eclipse/jetty/aggregate/jetty-all/9.4.6.v20170531/jetty-all-9.4.6.v20170531-uber.jar
```

[回到顶部](#top)
<br>

<span id="2112hello-world栗子"></span>

##### 21.1.2、Hello World 栗子

这个栗子中包含了许多关于 JettyAPI 的用例，这个教程会在主函数里面用到一个简单的 Handler 的 Hello World 来运行服务器：

```
package org.eclipse.jetty.embedded;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AbstractHandler;

public class HelloWorld extends AbstractHandler
{
    @Override
    public void handle( String target,
                        Request baseRequest,
                        HttpServletRequest request,
                        HttpServletResponse response ) throws IOException,
                                                      ServletException
    {
        // Declare response encoding and types
        response.setContentType("text/html; charset=utf-8");

        // Declare response status code
        response.setStatus(HttpServletResponse.SC_OK);

        // Write back response
        response.getWriter().println("<h1>Hello World</h1>");

        // Inform jetty that this request has now been handled
        baseRequest.setHandled(true);
    }

    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);
        server.setHandler(new HelloWorld());

        server.start();
        server.join();
    }
}
```

[回到顶部](#top)
<br>

<span id="2113编译hello-world栗子"></span>

##### 21.1.3、编译 Hello World 栗子

```
> mkdir classes
> javac -d classes -cp jetty-all-uber.jar HelloWorld.java
```

<br>

<span id="2114运行handler和server"></span>

##### 21.1.4、运行 Handler 和 Server

```
> java -cp classes:jetty-all-uber.jar org.eclipse.jetty.embedded.HelloWorld
```

<br>

<span id="2115下一步"></span>

##### 21.1.5、下一步

如果你想了解更多的内容，请按照下面的步骤来：

- 跟着[21.2、Jetty 的嵌入式开发](#212jetty的嵌入式开发)继续学习。
- 探索整个[Jetty javadoc](#http://www.eclipse.org/jetty/javadoc/9.4.6.v20170531/)。
- 考虑使用[Jetty 和 Maven](#)去管理你的项目依赖。

[回到顶部](#top)

---

<span id="212jetty的嵌入式开发"></span>

#### 21.2、Jetty 的嵌入式开发

- 21.2.1、[概述](#2121概述)
- 21.2.2、[创建 Server](#2122创建server)
- 21.2.3、[使用 Handler](#2123使用handler)
- 21.2.4、[嵌入 Connectors](#2124嵌入connectors)
- 21.2.5、[嵌入 Servlets](#2125嵌入servlets)
- 21.2.6、[嵌入 Contexts](#2126嵌入contexts)
- 21.2.7、[嵌入 ServletContexts](#2127嵌入servletcontexts)
- 21.2.8、[嵌入 Web 应用程序](#2128嵌入web应用程序)
- 21.2.9、[像 JettyXML 一样进行嵌入式开发](#2129像jettyxml一样进行嵌入式开发)

Jetty 有一句口号“不要把你的应用部署到 Jetty，要把 Jetty 部署到你的应用中！”，Jetty 被设计成是可以被实例化并且拿来使用的一个组件，就像一个 Java 的 POJO 对象一样。把 Jetty 服务嵌入到你的应用中，这意味着嵌入一个 HTTP 模块进你的应用中去。

这个教程会一步步地教你如何用最简单的方式使用 Jetty 服务器去运行多个 Web 应用。栗子中的许多代码来自于 Jetty 项目的源码。

<span id="2121概述"></span>

##### 21.2.1、概述

想要嵌入 Jetty，以下是标准的步骤，在栗子里面会有详细的说明：

1. 创建 Server 实例
2. 添加/配置 Connectors
3. 添加/配置 Handlers、Contexts、Servlets
4. 开启 Server
5. 泡杯咖啡

<br>

<span id="2122创建server"></span>

##### 21.2.2、创建 Server

下面的代码会简单的向你介绍一个 JettyServer：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Server;

/**
 * The simplest possible Jetty server.
 */
public class SimplestServer
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);
        server.start();
        server.dumpStdErr();
        server.join();
    }
}
```

这会在 8080 端口运行一个 HTTP 服务器，并且没有任何服务，任何请求都会是 404。
[回到顶部](#top)
<br>

<span id="2123使用handler"></span>

##### 21.2.3、使用 Handler

- 21.2.3.1、[一个 Handler 的 Hello World](#21231一个handler的hello-world)
- 21.2.3.2、[运行 HelloWorldHandler](#21232运行helloworldhandler)
- 21.2.3.3、[Handler Collections 和 Wrappers](#21233handler-collections和wrappers)
- 21.2.3.4、[Scoped Handlers](#21234scoped-handlers)
- 21.2.3.5、[Resource Handler](#21235resource-handler)

为了对请求做出响应，Jetty 要求你在 server 里面设置一个 Handler，这个 Handler 可以：

- 检查/修改 HTTP 请求
- 生成一个完整的 HTTP 响应
- 调用另外一个 Handler（参见 API：[HandlerWrapper](http://www.eclipse.org/jetty/javadoc/9.4.6.v20170531/org/eclipse/jetty/server/handler/HandlerWrapper.html)）
- 选择一个或多个 Handler 来调用（参见 API：[HandlerCollection](http://www.eclipse.org/jetty/javadoc/9.4.6.v20170531/org/eclipse/jetty/server/handler/HandlerCollection.html)）

[回到顶部](#top)
<br>

<span id="21231一个handler的hello-world"></span>

###### 21.2.3.1、一个 Handler 的 Hello World

这是`HelloHandler.java`代码：

```
package org.eclipse.jetty.embedded;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

public class HelloHandler extends AbstractHandler
{
    final String greeting;
    final String body;

    public HelloHandler()
    {
        this("Hello World");
    }

    public HelloHandler( String greeting )
    {
        this(greeting, null);
    }

    public HelloHandler( String greeting, String body )
    {
        this.greeting = greeting;
        this.body = body;
    }

    public void handle( String target,
                        Request baseRequest,
                        HttpServletRequest request,
                        HttpServletResponse response ) throws IOException,
                                                      ServletException
    {
        response.setContentType("text/html; charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);

        PrintWriter out = response.getWriter();

        out.println("<h1>" + greeting + "</h1>");
        if (body != null)
        {
            out.println(body);
        }

        baseRequest.setHandled(true);
    }
}
```

传到 handle 方法的参数是：

- target：发起请求的目标，可以是一个 URL 或者发送者的 name 值。
- baseRequest：Jetty 的可变请求对象，这个对象是未经包装的。
- request：不可变的请求对象，这个对象可能经过 filter 或者 servlet 包装过。
- response：响应，这个对象可能经过 filter 或者 servlet 包装过。

handler 可以在响应的 body 生成之前进行响应的 status 设置、content-type 设置、把请求标记为已处理。

[回到顶部](#top)
<br>

<span id="21232运行helloworldhandler"></span>

###### 21.2.3.2、运行 HelloWorldHandler

为了 Handler 能够处理 HTTP 请求，你必须把它添加到 Server 实例中，下面这个`OneHandler.java`代码就会向你展示 Jetty 服务器如何才能使用 HelloWorldHandler：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.Server;

public class OneHandler
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);
        server.setHandler(new HelloHandler());

        server.start();
        server.join();
    }
}
```

当有一个或多个 handlers 处理所有的请求的时候，一些 hanlders 会选择其他指定的 handlers（比如，一个 ContextHandlerCollection 会根据 context path 去选择 ContextHandler）；

其他 handlers 则使用业务逻辑去生成对应的响应（比如说，ServletHandler 传递请求到一个 web 应用 Servlet）；

还有的其他 handlers 会处理一些业务无关的请求响应（比如，RequestLogHandler 或者是 StatisticsHandler）。

后面的部分会告诉你怎么才能把 handlers 连接起来组成一个切面，你可以在 Jetty 的`org.eclipse.jetty.server.handler`类中找到更多的有用的 handlers 实例。

[回到顶部](#top)
<br>

<span id="21233handler-collections和wrappers"></span>

###### 21.2.3.3、Handler Collections 和 Wrappers

一个完整的请求处理是从多个 Handlers 中建立的，你可用以多种方式将多个 Handler 连接起来，Jetty 提供了几种实现了`HandlerContainer`的实例：

> _译者文外补充：HandlerContainer 是 Handler 的容器，你可以把一套业务的 Handler 放在一个容器里面，再把这个容器添加到 Server 中，Handler 容器的本质也是一个 Handler。_

- HandlerCollection
  持有一个含有其他 Handler 的 collection，处理请求的时候会调用 collection 顺序中的每一个 handler。你可用使用它把一些作统计用的 handlers 和一些作日志用的 handlers 练成一串，统一生成响应。

- HandlerList
  持有一个含有其他 Handler 的 collection，和 HandlerCollection 不同的是，如果某个 handler 返回异常或者响应已经被确认或者`request.isHandled()`方法返回 true 的时候才会停止。你可用使用这种连接方式去连接按照条件处理的 handler，比如匹配不同的虚拟主机。

> _译者文外补充：异常就是 handler 内报错；响应被确认应该是整条链跑到底了；而 isHandled()则是某个在 handler 里面调用`baseRequest.setHandled(true)`方法。_

- HandlerWrapper
  一个 Handler 的基类，你可用它来把很多 handler 以良好的链式处理连在一起形成一个 AOP 切面。比如说一个标准的 Web 程序是由一个 context handlers、一个 session handlers、一个 security handlers 和一个 servlet handlers 组成。

> _译者文外补充：在其 Javadoc 中定义所描述：`HandlerWrapper`虽然拥有 Handler 一样的行为，但是它更加代表着 Handler 方法和`LifeCycle`接口，它不像`HandlerCollection`那样专注实现为一个 Handler 容器，这个基类常常被用来实现为具有装饰模式的容器。_

- ConetextHandlerCollection
  一个专门的 HandlerCollection，它用请求 URL 的最长的前缀来选择包含这个前缀的 ContextHandler 去处理请求。

> _译者文外补充：它是继承于`HandlerCollection`的，在其 Javadoc 中定义所描述：这个`HandlerCollection`的子类可以对 contexts 和这个容器里面包含的 handlers 基于 context path 和`ContextHandlers`类的关系生成一一对应的映射。contexts 并不需要直接装进这个容器中，你只需要把 handlers 装进去就可以了。多个 contexts 可能会有一样的 context path，它们会按照顺序被调用直到其中一个 handler 处理了这次请求。_

[回到顶部](#top)
<br>

<span id="21234scoped-handlers"></span>

###### 21.2.3.4、Scoped Handlers

许多标准 Servlet 容器，Jetty 是用`HandlerWrapper`实现的，它把很多 handler 以良好的链式处理连在一起：`ContextHandler`-`SessionHandler`-`SecurityHandler`-`ServletHandler`。然而，因为 Servlet 规范的特性，这种链式处理并不能就这么单纯的就把 handler 嵌套起来，因为外层 handler 有时候会需要内层 handler 处理过的信息。比如说当 ContextHandler 调用应用的监听器以通知有请求进到 context 的时候，ServletHandler 必须提前知道请求该转发到哪一个 servlet，这样才好返回正确的 servletPath 值。

`HandlerWrapper`是`ScopedHandler`抽象类的父类，这个抽象类提供了一个良好的链式范围。比如说一个 ServletHandler 嵌套在 ContextHandler 中，执行嵌套的顺序如下：

```
Server.handle(...)
  ContextHandler.doScope(...)
    ServletHandler.doScope(...)
      ContextHandler.doHandle(...)
        ServletHandler.doHandle(...)
          SomeServlet.service(...)
```

这样一来，当 ContextHandler 处理到请求后，在指定的 ServletHandler 里面也会处理一遍。

> _译者文外补充：`ServletHandler`和`ContextHandler`都是`ScopedHandler`的具体实现。_

[回到顶部](#top)
<br>

<span id="21235resource-handler"></span>

###### 21.2.3.5、Resource Handler

FileServer 栗子展示了如何使用 Resource Handler 去为当前工作目录下的静态资源服务：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;

/**
 * Simple Jetty FileServer.
 * This is a simple example of Jetty configured as a FileServer.
 */
public class FileServer
{
    public static void main(String[] args) throws Exception
    {
        // 创建Jetty的server到8080端口
        // 如果你设置的端口号为0 那么Jetty会随机为你选择一个当前系统可用的端口号
        // 你可以在启动的时候通过log看到随机选择的端口号
        // 或者使用测试案例来获取
        Server server = new Server(8080);

        // 创建ResourceHandler
        // 这会为给定的资源文件处理请求
        // 这是Jetty Handler对象 所以你可以把它放在链式处理过程中
        // 你可以在其他栗子中看到这个用法
        ResourceHandler resource_handler = new ResourceHandler();

        // 配置ResourceHandler
        // 设置resource base 来表明应该服务于那个目录下的文件
        // 在当前的栗子中 resource base 设置的是当前目录
        // 除此之外它还可以设置到其他任何JVM可以访问到的目录
        resource_handler.setDirectoriesListed(true);
        resource_handler.setWelcomeFiles(new String[]{ "index.html" });
        resource_handler.setResourceBase(".");

        // Add the ResourceHandler to the server.
        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[] { resource_handler, new DefaultHandler() });
        server.setHandler(handlers);

        // Start things up! By using the server.join() the server thread will join with the current thread.
        // See "http://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Thread.html#join()" for more details.
        server.start();
        server.join();
    }
}
```

你会注意到有一个 HandlerList 对象，里面链接了 ResourceHandler 和 DefaultHandler，这样 DefaultHandler 会在访问到不存在资源的情况下生成 404 响应。

[回到顶部](#top)
<br>

<span id="2124嵌入connectors"></span>

##### 21.2.4、嵌入 Connectors

- 21.2.4.1、[一个 Connectors](#21241一个connectors)
- 21.2.4.2、[多个 Connectors](#21242多个connectors)

在上一个栗子中，`Server`通过端口号在内部创建了一个默认的 Connector 来监听所有通过这个端口号进来的请求。然而，一般我们用 Jetty 作嵌入式开发的时候，正确的做法是显示地去配置一个或多个 connector 提供给`Server`实例。

<span id="21241一个connectors"></span>

###### 21.2.4.1、一个 Connectors

举个例子，`OneConnector.java`，实例化、配置、添加好了一个简单的 HTTP Connector 实例，并把这个实例添加到 server 中：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;

/**
 * A Jetty server with one connectors.
 */
public class OneConnector
{
    public static void main( String[] args ) throws Exception
    {
        // The Server
        Server server = new Server();

        // HTTP connector
        ServerConnector http = new ServerConnector(server);
        http.setHost("localhost");
        http.setPort(8080);
        http.setIdleTimeout(30000);

        // Set the connector
        server.addConnector(http);

        // Set a handler
        server.setHandler(new HelloHandler());

        // Start the server
        server.start();
        server.join();
    }
}
```

上栗的 connector 可以处理 HTTP 协议的请求，这样的实现方式是`ServerConnector`类的默认方式是一样的。

[回到顶部](#top)
<br>

<span id="21242多个connectors"></span>

###### 21.2.4.2、多个 Connectors

如果想要配置多个 connectors 的时候（比如 HTTP+HTTPS），可能需要共享一些为 HTTP 连接配置过的参数。为了做到这一点，你需要显示地使用`ConnectionFactory`实例去配置`ServerConnector`类，然后提供它们通用的 HTTP 配置。

> _译者文外补充：这里文档并没有给出示例代码，代码的下载链接也挂了，后面仅有一段关于这个多连接栗子的描述，我就不翻译了。关于这多链接的示例代码，“已往之不谏”前辈的博客里面有，大家可以在[这里](http://www.cnblogs.com/yiwangzhibujian/p/5845623.html)去参考。_

> _栗子描述原文：The ManyConnectors example, configures a server with two `ServerConnector` instances: the http connector has a `HTTPConnectionFactory` instance; the https connector has a `SslConnectionFactory` chained to a `HttpConnectionFactory`. Both `HttpConnectionFactory` are configured based on the same `HttpConfiguration` instance, however the HTTPS factory uses a wrapped configuration so that a `SecureRequestCustomizer` can be added._

[回到顶部](#top)
<br>

<span id="2125嵌入servlets"></span>

##### 21.2.5、嵌入 Servlets

Servlet 是为 HTTP 请求提供业务逻辑的标准解决方案。Servlet 除了它里面的 request 对象是不可变的之外，在其他方面和 Jetty 的 Handler 很像。在 Jetty 里面 Servlet 通过`ServletHandler`类去接入处理。这个类使用标准的路径映射去为请求匹配一个 Servlet，你还需要设置请求的`servletPath`和`pathInfo`，然后通过一些 Filters 处理之后，把请求传递到 servlet，以生成项响应。

以下的栗子展示了一个简答的 Servlet mapping 过程

```
package org.eclipse.jetty.embedded;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletHandler;

public class MinimalServlets
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);

        // ServletHandler是最最最简单的方式去创建context handler
        // 来返回一个Servlet实例
        // 这个handler需要注册Servlet对象
        ServletHandler handler = new ServletHandler();
        server.setHandler(handler);

        // 通过这个类 Jetty可以实例化一个Servlet实例并把它嵌入到给定的context path上

        // 重要：
        // 这是一个原生的Servlet
        // 不是平常的那种被`@WebServlet`或者web.xml或者其他类似方式配置过的Servlet
        handler.addServletWithMapping(HelloServlet.class, "/*");

        // 开启
        server.start();

        // server.join()方法会让当前线程join并且wait
        server.join();
    }

    @SuppressWarnings("serial")
    public static class HelloServlet extends HttpServlet
    {
        @Override
        protected void doGet( HttpServletRequest request,
                              HttpServletResponse response ) throws ServletException,
                                                            IOException
        {
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("<h1>Hello from HelloServlet</h1>");
        }
    }
}
```

[回到顶部](#top)
<br>

<span id="2126嵌入contexts"></span>

##### 21.2.6、嵌入 Contexts

一个`ContextHandler`是一个`ScopedHandler`，只有请求过来的 URL 前缀和我们设定的 context path 相匹配才会响应。请求匹配到它们对应的 context path 之后，会有它们对应的 path 方法，并且 context 范围内的资源是可用的，以下是可能的范围情况：

- 当请求到某个 context 的时候，加载这个 context 的类加载器范围是可用的。
- 通过`ServletContext`API 设置的 attribute 集合都可用被使用。
- 通过`ServletContext`API 设置的 paramenters 集合都可用被使用。
- 通过`ServletContext`API 设置的用做静态资源请求的 Resource 库中的资源都可用被使用。
- 虚拟机的名字集合都可用被使用。

下面这个栗子就是通过包装`HelloHandler`来展示如何建立 context：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;

public class OneContext
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server( 8080 );

        // 在"/hello"上添加一个handler
        ContextHandler context = new ContextHandler();
        context.setContextPath( "/hello" );
        context.setHandler( new HelloHandler() );

        // 现在可以访问 http://localhost:8080/hello

        server.setHandler( context );

        // Start the server
        server.start();
        server.join();
    }
}
```

当有许多 context 的时候，你可以嵌入一个`ContextHandlerCollection`来有效地检查请求 URI，然后选择匹配的 ContextHandler 来处理请求。下面这个栗子就是告诉你如何配置多少 context：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;

public class ManyContexts
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);

        ContextHandler context = new ContextHandler("/");
        context.setContextPath("/");
        context.setHandler(new HelloHandler("Root Hello"));

        ContextHandler contextFR = new ContextHandler("/fr");
        contextFR.setHandler(new HelloHandler("Bonjoir"));

        ContextHandler contextIT = new ContextHandler("/it");
        contextIT.setHandler(new HelloHandler("Bongiorno"));

        ContextHandler contextV = new ContextHandler("/");
        contextV.setVirtualHosts(new String[] { "127.0.0.2" });
        contextV.setHandler(new HelloHandler("Virtual Hello"));

        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(new Handler[] { context, contextFR, contextIT,
                contextV });

        server.setHandler(contexts);

        server.start();
        server.join();
    }
}
```

[回到顶部](#top)
<br>

<span id="2127嵌入servletcontexts"></span>

##### 21.2.7、嵌入 ServletContexts

`ServletContextHandler`的`ContextHandler`的一个重要子类，它支持标准的 Servlet 和 sessions 机制。接下来的栗子实例化了一个`DefaultServlet`来为/tmp/目录下的静态资源服务，还有一个`DumpServlet`，它负责创建 session 和传储请求中的一些基本细节：

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class OneServletContext
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);

        ServletContextHandler context = new ServletContextHandler(
                ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        context.setResourceBase(System.getProperty("java.io.tmpdir"));
        server.setHandler(context);

        // Add dump servlet
        context.addServlet(DumpServlet.class, "/dump/*");
        // Add default servlet
        context.addServlet(DefaultServlet.class, "/");

        server.start();
        server.join();
    }
}
```

<br>

> _译者文外补充：这里的`DumpServlet`只是示例，不是 JettyAPI 提供的实例。这里的`setResourceBase()`方法很重要，这跟我们一般使用 Tomcat 服务器，而我们的资源路径默认就是项目下的 webapp 目录是一样的，我们需要靠这个来设置 Jetty，以达到同样的效果。_

[回到顶部](#top)
<br>

<span id="2128嵌入web应用程序"></span>

##### 21.2.8、嵌入 Web 应用程序

一个`WebAppContext`是一个`ServletContextHandler`的拓展，它使用标准布局和`web.xml`来配置使用注解或者在 web.xml 中配置的 Servlet、filters 和其他功能。下面这个栗子配置了一个 Jetty 的测试 webapp。Web 应用可以使用容器提供的资源，在这个栗子里面的`LoginService`正是这样配置的：

```
package org.eclipse.jetty.embedded;

import java.io.File;
import java.lang.management.ManagementFactory;

import org.eclipse.jetty.jmx.MBeanContainer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AllowSymLinkAliasChecker;
import org.eclipse.jetty.webapp.WebAppContext;

public class OneWebApp
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);

        // 设置JMX
        MBeanContainer mbContainer = new MBeanContainer(
                ManagementFactory.getPlatformMBeanServer());
        server.addBean(mbContainer);

        // WebAppContext对象是用来控制它自己赖以生存的环境的。
        // 在这个栗子里面，context path设置为“/”
        // 这样它就可以处理根context下的请求了
        // 我们还可以看到它设置了war的位置
        // 整个host的其他配置都是可用的可配置的
        // 你可用配置注解扫描的支持（需要通过PlusConfiguration）
        // 还可用选择webapp在哪里自动解压
        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/");
        File warFile = new File(
                "../../tests/test-jmx/jmx-webapp/target/jmx-webapp");
        webapp.setWar(warFile.getAbsolutePath());

        // 一个WebAppContext是一个ContextHandler
        // 所以它也需要被配置到server里面这样server才会知道请求将被送往哪里
        server.setHandler(webapp);

        // Start things up!
        server.start();

        server.dumpStdErr();

        server.join();
    }
}
```

<br>

> _译者文外补充：栗子中的 JMX 是一种额外组件，不是 Jetty 的服务。你可以准备一些 war 包自己测试。也可以不使用 war 包，直接使用有标准 web 应用布局的目录。如果你想要 Jetty 支持 Servlet 注解配置，你可以在[这里]()了解到更多。_

<br>
<span id="2129像jettyxml一样进行嵌入式开发"></span>
##### 21.2.9、像JettyXML一样进行嵌入式开发

典型的 Jetty 服务器配置的做法是通过 Jetty.xml 文件进行配置。然而 Jetty XML 配置只是一个简单的渲染，它在起到配置作用的同时还向你展示了在代码里面是如何配置的。照着 jetty.xml 的做法，你很简单就可以在代码里面配置 JettyServer。

> _译者文外补充：文档后面这贴出了代码展示如何在代码像 JettyXML 配置一样做 JettyServer 的配置，这里对我的学习价值不大，所以我就不贴了，大家有兴趣自己去原文看。_

<br>

[回到顶部](#top)

---

<span id="213嵌入式开发的栗子"></span>

#### 21.3、嵌入式开发的栗子

Jetty 在各种各样的应用中有着非常丰富的嵌入式开发历史。这个部分我们会向你介绍一些简单应用的嵌入式开发的栗子。你也可以在我们的[git 仓库](https://github.com/jetty-project?utf8=%E2%9C%93&q=&type=&language=)找到许多的 Jetty 嵌入式开发的示例项目。

- 21.3.1、[简单的文件服务器](#2131简单的文件服务器)
- 21.3.2、[可分布的文件服务器](#2132可分布的文件服务器)
- 21.3.3、[多 Connectors](#2133多connectors)
- 21.3.4、[安全方面 Handler 的 Hello World](#2134安全方面handler的hello-world)
- 21.3.5、[最简单的 Servlet](#2135最简单的servlet)
- 21.3.6、[Web Application](#2136web-application)
- 21.3.7、[Web Application 以及 JSP](#2137web-application以及jsp)

<span id="2131简单的文件服务器"></span>

##### 21.3.1、简单的文件服务器

这个栗子展示了如何使用 Jetty 创建一个简单的文件服务器。这对于你想要一个具有获取文件功能的服务器来说是一个非常适合的栗子，它可以非常简单的就配置好并且为指定资源目录下的文件进行服务。你需要注意的是，这里没有任何的业务逻辑来做文件缓存，同样服务器设置和响应头里面也没有。

```
package org.eclipse.jetty.embedded;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;

/**
 * Simple Jetty FileServer.
 * This is a simple example of Jetty configured as a FileServer.
 */
public class FileServer
{
    public static void main(String[] args) throws Exception
    {
        Server server = new Server(8080);

        // 创建ResoueceHandler
        // 这个对象会处理对资源文件的请求
        // 这是Jetty的Handler对象 所以它可以和其它Handler在一起做链式处理
        ResourceHandler resource_handler = new ResourceHandler();

        // 配置ResoueceHandler
        // 设置资源的base来表明服务器要服务于哪个路径下的文件
        // 本例是设置为当前目录 你可以设置jvm可以访问到的任何地方
        resource_handler.setDirectoriesListed(true);
        resource_handler.setWelcomeFiles(new String[]{ "index.html" });
        resource_handler.setResourceBase(".");

        // Add the ResourceHandler to the server.
        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[] { resource_handler, new DefaultHandler() });
        server.setHandler(handlers);

        server.start();
        server.join();
    }
}
```

然后打开 8080 网页你就可以看到当前目录的情况了。

这里你会使用到的 Maven 依赖坐标：

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-server</artifactId>
  <version>${project.version}</version>
</dependency>
```

> _译者文外补充：栗子中设置的 index.html 是来搞笑的，没什么卵用。当然如果你当前目录下有这个文件，代码里面就正好把这个文件配置为欢迎页面，但是即使你没使用代码设置为欢迎页面，只要你当前目录下有这个页面，也会默认刷这个页面，所以我建议目录下最好不要有 index.html 文件，然后`setWelcomeFiles(null)`，这样就会直接进入文件系统。_

[回到顶部](#top)
<br>

<span id="2132可分布的文件服务器"></span>

##### 21.3.2、可分布的文件服务器

这个栗子是基于上栗来向你展示如何把多个`ResourceHandler`链式处理到一起，让你可以集中多个目录下的文件到一个 context path 下，还向你展示了如何使用`ContextHandlers`把这些 path 连在一起：

```
package org.eclipse.jetty.embedded;

import java.io.File;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.toolchain.test.MavenTestingUtils;
import org.eclipse.jetty.util.resource.Resource;

/**
 * A {@link ContextHandlerCollection} handler may be used to direct a request to
 * a specific Context. The URI path prefix and optional virtual host is used to
 * select the context.
 */
public class SplitFileServer
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8090);
        server.setConnectors(new Connector[] { connector });

        // 创建一个Context Handler 和ResourceHandler
        // ContextHandler设置为“/” 但你可以设置其它你想要的路径
        // 你需要注意的是我们设置ResourceBase使用的是maven testing utilities工具
        // 来获取资源的目录 你可以不需要这样做 你可以简单的提供一个能找得到的路径就可以了
        ResourceHandler rh0 = new ResourceHandler();

        ContextHandler context0 = new ContextHandler();
        context0.setContextPath("/");
        File dir0 = MavenTestingUtils.getTestResourceDir("dir0");
        context0.setBaseResource(Resource.newResource(dir0));
        context0.setHandler(rh0);

        // 重复上述的工作 指定一个不同的目录
        ResourceHandler rh1 = new ResourceHandler();

        ContextHandler context1 = new ContextHandler();
        context1.setContextPath("/");
        File dir1 = MavenTestingUtils.getTestResourceDir("dir1");
        context1.setBaseResource(Resource.newResource(dir1));
        context1.setHandler(rh1);

        // 创建一个ContextHandlerCollection
        // 把context handler 设置进去
        // jetty程序会把context和对应的内容相匹配
        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(new Handler[] { context0, context1 });

        server.setHandler(contexts);

        // Start things up!
        server.start();

        // 转储服务器状态
        System.out.println(server.dump());
        server.join();
    }
}
```

这里你会使用到的 Maven 依赖坐标：

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-server</artifactId>
  <version>${project.version}</version>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty.toolchain</groupId>
  <artifactId>jetty-test-helper</artifactId>
  <version>2.2</version>
</dependency>
```

> _译者文外补充：熟悉 handler 的人马上就知道这些配置是怎么肥事了。里面还有个`server.dump()`我也不知道怎么肥事。_

[回到顶部](#top)
<br>

<span id="2133多connectors"></span>

##### 21.3.3、多 Connectors

这部分展示如何使用多连接来处理不同的请求，如 http 和 https。

> _译者文外补充：这部分我的学习需求不大，代码也就不贴了不翻译了，可能日后有需求了会再来补充的，大家有需要去的去参阅[原文](http://www.eclipse.org/jetty/documentation/9.4.6.v20170531/embedded-examples.html)。_

[回到顶部](#top)
<br>

<span id="2134安全方面handler的hello-world"></span>

##### 21.3.4、安全方面 Handler 的 Hello World

这个栗子展示了如何使用一个负责安全的 handler 来包装另外一个 handler。这里有一个简单的 Hello Handler，它返回一句问候语，但是在这之前你必须先通过身份验证。另一个需要注意的是这个栗子是使用的`ConstraintSecurityHandler`，它可以在 servletAPI 中提供安全映射支持，我们简单的展示了一下它的用法，但是`Constraint`还可以提供更强大的功能。如果你不需要，那么你可以不使用它而仅仅使用`SecurityHandler`。

> _译者文外补充：这部分我的学习需求不大，代码也就不贴了不翻译了，可能日后有需求了会再来补充的，大家有需要去的去参阅[原文](http://www.eclipse.org/jetty/documentation/9.4.6.v20170531/embedded-examples.html)。_

[回到顶部](#top)
<br>

<span id="2135最简单的servlet"></span>

##### 21.3.5、最简单的 Servlet

这个栗子展示了最简单最简单的在 Jetty 中部署 servlet 的方式。你需要注意到的是，这里使用的是一个严格意义上的 servlet，并不是 web 应用的 context 中的 servlet，这种会在后面提到。这是一个单纯的 servlet，它仅仅是部署和挂载在 context 上，让我们可以请求而已。这个栗子完美的展现了当你有一个简单的 servlet，而你正需要对他进行单元测试的时候，你只需要把它挂载到 context 中，然后使用你最喜欢的 http 客户端库去发起请求。（可以参考 Jetty 的 HTTP Client）

```
package org.eclipse.jetty.embedded;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletHandler;

public class MinimalServlets
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server(8080);

        ServletHandler handler = new ServletHandler();
        server.setHandler(handler);

        // 通过这个类实例你可以把servlet挂载到context里

        // 重要:
        // 这是一个原生的servlet，不是像以前那种被web.xml或者注解配置的servlet
        handler.addServletWithMapping(HelloServlet.class, "/*");

        server.start();
        server.join();
    }

    @SuppressWarnings("serial")
    public static class HelloServlet extends HttpServlet
    {
        @Override
        protected void doGet( HttpServletRequest request,
                              HttpServletResponse response ) throws ServletException,
                                                            IOException
        {
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("<h1>Hello from HelloServlet</h1>");
        }
    }
}
```

通过这个栗子，你可以非常简单的就配置一个 servlet 到 http 服务器中，作为简单的测试单元。

这里你会使用到的 Maven 依赖坐标：

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-servlet</artifactId>
  <version>${project.version}</version>
</dependency>
```

[回到顶部](#top)
<br>

<span id="2136web-application"></span>

##### 21.3.6、Web Application

这里会向你展示如何使用一个嵌入式的 Jetty 服务器去部署一个简单的 web 应用。这对你想要以编程的方式管理服务器的生命周期非常有帮助，不管是生产项目或者是部署和调试一个完整规模的应用也好。当你控制住 classpath 之后，那么在许多方面，Jetty 的这种部署方式要比传统的部署方式要简单得多。

> _译者文外补充：这里贴的代码和[上面](#2128嵌入web应用程序)是一样的。_

这里你会使用到的 Maven 依赖坐标：

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-webapp</artifactId>
  <version>${project.version}</version>
</dependency>
```

[回到顶部](#top)
<br>

<span id="2137web-application以及jsp"></span>

##### 21.3.7、Web Application 以及 JSP

这个栗子和上一个栗子非常像，因为它只是支持了内嵌 web 应用可以使用 jsp 而已。从 Jetty9.2 以来，我们一直使用的是 Apache 的 JSP 引擎，这种做法需要`ServletContainerInitializer`去实例化它自己以支持 Servlet3.1 规范。为了让 Jetty 做到这些，你需要开启注解处理机制：

```
package org.eclipse.jetty.embedded;

import java.io.File;
import java.lang.management.ManagementFactory;

import org.eclipse.jetty.jmx.MBeanContainer;
import org.eclipse.jetty.security.HashLoginService;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;

public class OneWebAppWithJsp
{
    public static void main( String[] args ) throws Exception
    {
        Server server = new Server( 8080 );

        // Setup JMX
        MBeanContainer mbContainer = new MBeanContainer(
                ManagementFactory.getPlatformMBeanServer() );
        server.addBean( mbContainer );

        // WebAppContext对象是用来控制它自己赖以生存的环境的。
        // 在这个栗子里面，context path设置为“/”
        // 这样它就可以处理根context下的请求了
        // 我们还可以看到它设置了war的位置
        // 整个host的其他配置都是可用的可配置的
        // 你可用配置注解扫描的支持（需要通过PlusConfiguration）
        // 还可用选择webapp在哪里自动解压
        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath( "/" );
        File warFile = new File(
                "../../jetty-distribution/target/distribution/demo-base/webapps/test.war" );
        if (!warFile.exists())
        {
            throw new RuntimeException( "Unable to find WAR File: "
                    + warFile.getAbsolutePath() );
        }
        webapp.setWar( warFile.getAbsolutePath() );
        webapp.setExtractWAR(true);

        // 这个webapp会使用jsp和jstl
        // 我们需要激活AnnotationConfiguration
        // 这样才能正确的设置jsp容器
        Configuration.ClassList classlist = Configuration.ClassList
                .setServerDefault( server );
        classlist.addBefore(
                "org.eclipse.jetty.webapp.JettyWebXmlConfiguration",
                "org.eclipse.jetty.annotations.AnnotationConfiguration" );

        // 设置ContainerIncludeJarPattern
        // 这样jetty才会去检查container path 的jar
        // 这样才好为顶级域名以及web片段服务
        // 如果你省略了包含jstl和域名的jar jsp引擎会来扫描它们
        webapp.setAttribute(
                "org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern",
                ".*/[^/]*servlet-api-[^/]*\\.jar$|.*/javax.servlet.jsp.jstl-.*\\.jar$|.*/[^/]*taglibs.*\\.jar$" );


        server.setHandler( webapp );

        // Configure a LoginService.
        // Since this example is for our test webapp, we need to setup a
        // LoginService so this shows how to create a very simple hashmap based
        // one. The name of the LoginService needs to correspond to what is
        // configured in the webapp's web.xml and since it has a lifecycle of
        // its own we register it as a bean with the Jetty server object so it
        // can be started and stopped according to the lifecycle of the server
        // itself.
        HashLoginService loginService = new HashLoginService();
        loginService.setName( "Test Realm" );
        loginService.setConfig( "src/test/resources/realm.properties" );
        server.addBean( loginService );

        // Start things up!
        server.start();
        server.dumpStdErr();
        server.join();
    }
}
```

你会用到的 Maven 依赖坐标：

```
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-annotations</artifactId>
  <version>${project.version}</version>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>apache-jsp</artifactId>
  <version>${project.version}</version>
</dependency>
<dependency>
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>apache-jstl</artifactId>
  <version>${project.version}</version>
</dependency>
```

[回到顶部](#top)

---
