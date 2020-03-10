---
title: Log4j2_Appenders
comments: true
tags:
  - log4j2
  - learning
categories:
  - note
  - toolslearning
  - log4j2
date: 2017-11-17 16:37:18
series: Log4j2
---

{% cq %}

上篇介绍了使用Log4j2之前的准备工作和简单介绍了一个HelloWorld

现在我们来了解配置中的第一个关键配置：Appenders

{% endcq %}

<!-- more -->

官方文档给出的可用的Appender非常多：有Async（异步输出）、Console（控制台输出）、File（文件输出）、甚至还有JDBC和HTTP等24种输出源方式，然而我日常使用的就几个：Console、RollingFile；一个作为本地host调试的时候log，一个作为远程主机调试的时候写log。其他的我就不仔细去研究了。

- - -

### ConsoleAppender

`ConsoleAppender`，使用的是`System.out`或者`System.err`作为输出源，把log打印在控制台上，默认的情况下使用的是`System.out`。

``` xml
<Console name="Console" target="SYSTEM_OUT">
    <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
</Console>
```

#### 常用属性

- name ：string：appender的名字
- target：string：指定输出对象：可选`SYSTEM_OUT`或`SYSTEM_ERR`，默认是前者。

- - -

### FileAppender

FileAppender是一个输出流输出源，它可以根据你指定的文件命名去创建一个文件。FileAppender使用FileManager（继承自`OutputStreamManager`）来执行文件输入输出。

#### 常用属性

- name ：string：appender的名字
- append：boolean：默认为true，此时输出记录会被添加在原有文件的文末，否则会清空之前的log重新输出。
- fileName：string：输出文件的名字

还有一些属性包括：缓冲流的设置、文件在linux系统下的组、用户、权限等。

``` xml
<File name="MyFile" fileName="logs/app.log">
  <PatternLayout>
    <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
  </PatternLayout>
</File>
```

- - -

### RandomAccessFileAppender

RandomAccessFileAppender和标准的FileAppender很像，只不过RandomAccessFileAppender总是以缓冲的形式输出（并且不能关闭缓冲流），在其内部实现中，它使用`ByteBuffer + RandomAccessFile`去代替了`BufferedOutputStream`。它的性能比FileAppender能高出20%~200%。

#### 常用属性

- name ：string：appender的名字
- append：boolean：默认为true，此时输出记录会被添加在原有文件的文末，否则会清空之前的log重新输出。
- fileName：string：输出文件的名字
- bufferSize：ingeger：默认是256*1024 btyes

``` xml
<RandomAccessFile name="MyFile2" fileName="logs/app2.log">
    <PatternLayout>
        <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
    </PatternLayout>
</RandomAccessFile>
```

- - -

### RollingFileAppender（重点）

RollingFileAppender是最常用的输出流，它可以根据`TrggeringPolicy(触发策略)`和`RolloverPolicy(切换策略)`来切换不同的日志文件，以达到可定制度更高的分类日志文件输出。

RollingFileAppender要求指定`TriggeringPolicy`和`RolloverStrategy`。触发策略决定了当切换策略定义好如何切换的时候，是否执行切换。如果没有指定切换策略，那么RollingFileAppender会使用默认的切换策略。

#### 常用属性

- name ：string：appender的名字
- append：boolean：默认为true，此时输出记录会被添加在原有文件的文末，否则会清空之前的log重新输出。
- fileName：string：输出文件的名字
- filePattern：string：切换日志文件时使用的文件名模式，默认的切换策略会使用时间和日期以及一个int标号，其中日期pattern可以参考[SimpleDateFormat](http://download.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)，标号使用`%i`匹配。模式同样支持获取运行时的值，所以任何实时取值的Lookups（比如[DateLookup](https://logging.apache.org/log4j/2.x/manual/lookups.html#DateLookup)）
- filePermissions：string：文件权限，POSIX格式，例如“rw-------”
- fileOwner：string：文件所有者
- fileGroup：string：文件所属组

#### Triggering Policies 触发策略
##### Composite Triggering Policy 复合触发策略

这种触发策略连接了多个触发策略，如果其中一项策略返回true，则整个复合触发策略返回true，CompositeTriggeringPolicy可以使用一个`Policies`元素来简单配置。

```xml
<Policies>
  <OnStartupTriggeringPolicy />
  <SizeBasedTriggeringPolicy size="20 MB" />
  <TimeBasedTriggeringPolicy />
</Policies>
```

##### Cron Triggering Policies Cron触发策略

使用cron表达式来进行切换触发

属性：
- schedule：string：cron表达式
- evaluateOnStartup：boolean：在项目启动的时候，cron表达式会对日志文件最后的修改时间戳进行评估，看是否立即切换日志文件。

##### On Startup Triggering Policy 启动触发策略

项目JVM启动的时候即触发策略

属性：
- mixSize：integer：必须切换的最小文件size，如果是0，则立即切换；默认的值是1，防止在当前日志文件为空的时候切换。

##### SizeBased Triggering Policy 文件体积触发策略

根据文件大小切换

属性：
- size：integer：到了某个size之后即切换，需要使用KB、MB、GB等后缀描述，如`20MB`

##### TimeBased Triggering Policy 时间触发策略

根据时间切换，这种切换会在 date/time 模式无法运用在当前激活的文件的时候生效。这个策略接受一个`interval`属性，这个属性回根据当前的time pattern以及`modulate`这个布尔属性来决定切换文件的频繁程度。

属性：
- interval：integer：根据date pattern里特定的时间单位决定多久切换一次日志文件。比如date pattren里最精确的单位是hour，然后增量是4，那么会每4小时切换一次，默认的值是1。
- modulate：boolean：决定当下一次切换时间出现在时间间隔的边缘的时候，是否校正时间间隔。比如，如果是hour，当前时间是3am，然后interval是4，那么下一次切换时间是4am，再下一次就是8am，再就是午时等等。
- maxRandomDelay：integer：决定延迟切换的最大延迟秒数。默认是0，没有延迟。当服务器中有多个项目配置了同一时间输出日志的时候会非常有用，这会减缓io压力，加快io速度。

#### Rollover Strategies 切换策略
##### Default Rollover Strategy 默认的切换策略

默认的切换策略可以同时接收date/time pattern以及一个从filePattern属性中指定的integer参数。如果提供了date/time pattern，则会被替换为日期和时间值。如果pattern里有integer值，那么每次切换就会增加1。pattern里还可以写gz、zip、bz2等后缀。

属性：
- fileIndex：string：如果设置了max属性，大的index值的文件会比小index值的文件新。如果设置了min，文件重命名以及index计数器会跟随"[fixed window](https://logging.apache.org/log4j/2.x/manual/appenders.html#RolloverStrategies)"策略。
- min：integer：计数器的最小值，默认值是1
- max：integer：计数器的最大值，如果达到了这个值，那么会删除掉最早创建的那一个日志文件，默认值是7
- compressionLevel：integer：压缩等级，针对压缩文件而言，取值0-9，0则无压缩，1是最快的速度生成压缩文件，9是最好的压缩率
- tempCompressedFilePattern：string：在压缩期间生成的log文件名pattern

*后面还有更多的自定义策略细节，我就不一一说了，我感觉更详细的日志定制方案比如定时删除和执行script等，没有什么必要，可能是我当前能接触到的场景规模有限。*

和FileAppender一样，RollingFileAppender也有对应的缓冲流版本。

- - -

### RollingRandomAccessFileAppender（最常用）

这个就是RollingFileAppender的升级版，也是最常用的版本，它的属性、策略和前面的RollingFileAppender以及RandomAccessFileAppender一致，参考前面的就好了。

#### 例子

##### 1
``` xml
<RollingRandomAccessFile name="RollingFile" fileName="logs/a.log"
             filePattern="logs/$${date:yyyy-MM}/a-%d{yyyy-MM-dd-HH-mm}-%i.log">
    <PatternLayout>
        <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
    </PatternLayout>
    <Policies>
        <TimeBasedTriggeringPolicy />
        <SizeBasedTriggeringPolicy size="250 MB"/>
    </Policies>
</RollingRandomAccessFile>
```
触发策略：

1、按照时间切换：由于`filePattern`属性中配置的最精确的time pattern是`mm`即Minute in hour，且这条触发策略没有指定interval，那么默认是1分钟切换一次。

2、根据size切换，如果按照上一条的策略，在1分钟内产生超过250MB的日志，则切换，且`%i`加一。

切换策略：

``` js
filePattern="logs/%d{yyyy-MM}/a-%d{yyyy-MM-dd-HH-mm}-%i.log"
```

在logs文件夹下，`%d{yyyy-MM}`按照月份建立一级文件夹，一月一个文件夹，然后月份里按照触发策略的约束去执行切换策略进行日志文件的切换。

##### 2

``` xml
<RollingRandomAccessFile name="RollingFile" fileName="logs/a.log"
             filePattern="logs/$${date:yyyy-MM}/a-%d{yyyy-MM-dd-HH-mm}-%i.log">
    <PatternLayout>
        <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
    </PatternLayout>
    <Policies>
        <TimeBasedTriggeringPolicy />
        <SizeBasedTriggeringPolicy size="250 MB"/>
    </Policies>
    <DefaultRolloverStrategy max="20"/>
</RollingRandomAccessFile>
```

比1多指定了一个默认切换策略属性`max`：最大保留20个log文件

- - -

### SMTPAppender

能给你发邮件的Appender，这个也挺有意思的，[参考](https://logging.apache.org/log4j/2.x/manual/appenders.html#SMTPAppender)。

- - -

常用的Appender就介绍这么多，下一节介绍Layout pattern。
