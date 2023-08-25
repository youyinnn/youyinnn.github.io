---
title: Log4j2_HelloWorld
tags:
  - log4j2
comments: true
date: 2017-11-17 16:13:21
series: Log4j2
---

{% cq %}

Lo4j2 是啥就不解释了，之前无论是使用 log4j 还是 log4j2，同样只是简单的各种百度然后复制粘贴没有系统的总结一下，今天把一个小小的 Ajax 的测试程序放服务器上面都不知道怎么查错，然后想写一下 log 来看看哪错了吧，发现还是不会独立配置 log4j，于是想总结一波。基本的思路是总结官方文档和官方推荐的中文文档，尽量简洁表达出原理以及应用。

{% endcq %}

<!-- more -->

---

### 准备工作

#### Maven 依赖

```xml
<dependencies>
  <dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.9.1</version>
  </dependency>
  <dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.9.1</version>
  </dependency>
</dependencies>
```

认准这俩依赖

#### 默认配置文件(如果配置文件缺省的情况下，也会是这样的配置)

配置文件需要放在 classpath 的根目录下（一般的项目是 src，maven web 项目则是推荐在 resource 下），以 log4j2.xml 命名，配置文件还有其他的配置形式如 json 和 yaml，我习惯使用 xml。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="OFF">
    <appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </appenders>
    <loggers>
        <root level="error">
            <appender-ref ref="Console"/>
        </root>
    </loggers>
</configuration>
```

#### HelloWord

```java
public class Main {
    public static void main(String[] args) {
        Logger logger = LogManager.getLogger(LogManager.ROOT_LOGGER_NAME);
        logger.trace("trace level");
        logger.debug("debug level");
        logger.info("info level");
        logger.warn("warn level");
        logger.error("error level");
        logger.fatal("fatal level");
    }
}
```

---

### 运行 HelloWorld

运行上面的代码之后会出现如下的 log

```cmd
13:34:41.070 [main] ERROR mylog - error level
13:34:41.072 [main] FATAL mylog - fatal level
```

你会很奇怪，为什么我们写了这么多 log，却只出现两行 log 信息，我们去看看我们的配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="OFF">
  <!-- 这里定义了一个appenders -->
    <appenders>
      <!-- appenders里面配置了一个Console -->
        <Console name="Console" target="SYSTEM_OUT">
          <!-- 这是输出格式 -->
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </appenders>

    <!-- 然后就是定义loggers -->
    <loggers>
      <!-- 这是根logger 是所有自定义logger的父logger -->
        <root level="error">
            <appender-ref ref="Console"/>
        </root>
    </loggers>
</configuration>
```

首先看我们的 Java 代码：

```java
Logger logger = LogManager.getLogger(LogManager.ROOT_LOGGER_NAME);
```

这一行是获取我们在配置文件中配置好的 root logger，然后使用这个 logger 去打印了 6 条日志。

然后解释一下单词含义（my style~）：

> Appender：
> _n._ 附着器,输出目的地,输出源；

它的子元素 Console，代表的是控制台，所以很明显就是，我们配置了一个以控制台作为输出源的输出源；并将这个输出源命名为`Console`，然后配置了这个控制台输出源的输出 Pattern。

然后我们在`loggers`里面配置了一个 logger：`root`，这个节点代表所有 logger 的根 logger，然后 log 级别定为`error`，意思是**只输出 error 级别以下包括 error 的日志信息**，之后这个根 log 的输出源引用的是`name`值为`Console`的 Appender，也即我们配置的唯一一个 Appender。

那么 error 以下是哪些信息？

> ---
>
> log4j 规定了默认的几个级别：`trace < debug < info < warn < error < fatal`等。这里要说明一下：
>
> 1. 级别之间是包含的关系，意思是如果你设置日志级别是 trace，则大于等于这个级别的日志都会输出。
>
> 1. 基本上默认的级别没多大区别，就是一个默认的设定。你可以通过它的 API 自己定义级别。你也可以随意调用这些方法，不过你要在配置文件里面好好处理了，否则就起不到日志的作用了，而且也不易读，相当于一个规范，你要完全定义一套也可以，不用没多大必要。
>
> ---
>
> - trace： 是追踪，就是程序推进以下，你就可以写个 trace 输出，所以 trace 应该会特别多，不过没关系，我们可以设置最低日志级别不让他输出。
>
> - debug： 调试么，我一般就只用这个作为最低级别，trace 压根不用。是在没办法就用 eclipse 或者 idea 的 debug 功能就好了么。
>
> - info： 输出一下你感兴趣的或者重要的信息，这个用的最多了。
>
> - warn： 有些信息不是错误信息，但是也要给程序员的一些提示，类似于 eclipse 中代码的验证不是有 error 和 warn。
>
> - error： 错误信息。用的也比较多。
>
> - fatal： 级别比较高了。重大错误，这种级别你可以直接停止程序了，是不应该出现的错误么！不用那么紧张，其实就是一个程度的问题。
>
> ---

到这里我们就知道，为什么会只打印两条 log 了，打印的两条 log 分别是：error 级别以及 fatal 级别的 log。

---

_参考：http://www.cnblogs.com/leo-lsw/p/log4j2tutorial.html_

_参考：https://my.oschina.net/xianggao/blog/523401_
