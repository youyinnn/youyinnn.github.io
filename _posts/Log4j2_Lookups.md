---
title: Log4j2_Lookups
categories:
  - note
  - toolslearning
  - log4j2
comments: true
tags:
  - log4j2
  - learning
abbrlink: 244cf139
date: 2017-12-09 15:28:15
series: Log4j2
---

{% cq %}

Lookups：让你的配置更灵活

{% endcq %}

<!-- more -->

### Lookups

Lookups使得我们可以自由地在Log4j2配置文件中添加某些值（使用占位符设置变量），它们是一种特殊类型的插件，并且实现了StrLookup接口。

#### ContextMap Lookup

ContextMapLookup使得我们可以在Log4j2的ThreadContext Map中保存值，并在Log4j2的配置文件中可以取得值。

**引用方法：`$${ctx:KEY}`**

代码中写：
``` java
ThreadContext.put("aaa", "bbb");
```

配置示例：
``` xml
<PatternLayout pattern="$${ctx:aaa} %d{HH:mm:ss.SSS} [%t] %-5level - %msg%n" />
```

输出：
``` console
bbb  log4j2test.Main 19 15:20:07.859 [main] INFO  - info level
```

#### Date Lookup

DateLookUp跟其它lookups不太一样，它并非根据一个关键字变量去获取一个值的，但它可以利用关键字来指定一种格式，且为SimpleDateFormat合法的格式。以下示例表示当前日志事件产生的时间：

**引用方法：`$${date:SimpleDateFormat}`**

配置示例：
``` xml
<PatternLayout pattern="$${ctx:aaa} $${date:HH:mm:ss.SSS} [%t] %-5level - %msg%n" />
```

#### Environment Lookup

输出系统中的环境变量，无论是全局变量文件`/etc/profile`中的，还是运行时定义的变量。

**引用方法：`$${env:KEY}`**

配置示例：
``` xml
<PatternLayout pattern="$${env:USER} [%t] %-5level - %msg%n" />
```

#### Java Lookup

输出一些JVM信息：

- version：Java版本
- rentime：Java运行时版本信息
- vm：虚拟机版本
- os：操作系统版本
- locale：一些硬件信息如：default locale: en_US, platform encoding: Cp1252
- hw：一些硬件信息如：processors: 4, architecture: amd64-64, instruction sets: amd64

**引用方法：`$${java:KEY}`**

配置示例：
``` xml
<PatternLayout header="${java:runtime} - ${java:vm} - ${java:os}">
  <Pattern>%d %m%n</Pattern>
</PatternLayout>
```

#### System Properties Lookup

获取系统属性的值

**引用方法：`$${sys:KEY}`**

配置示例：
``` xml
<Appenders>
  <File name="ApplicationLog" fileName="${sys:logPath}/app.log"/>
</Appenders>
```
