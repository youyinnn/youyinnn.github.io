---
title: Log4j2_Filters
categories:
  - java
  - lib
  - log4j
comments: true
tags:
  - log4j2
  - learning
date: 2017-12-09 12:41:20
series: Log4j2
---

{% cq %}

Filters：过滤你的日志信息

{% endcq %}

<!-- more -->

### 重要概念

#### 枚举值

Filters可以用来对日志事件进行过滤，过滤器会返回一个枚举类型的值，枚举值包含三个：ACCEPT、DENY和NEUTRAL。

- ACCEPT：时会跳过这一级别的其它过滤器,进入下个级别的过滤器；

- DENY：时会直接终止事件的传递；

- NEUTRAL：时会继续交给同级别的其它过滤器处理（若已经是同级别最后一个过滤器，那么将日志事件传递给下个级别）。

#### 过滤位置

可以在以下四个位置配置过滤器：

- 上下文范围有效的过滤器直接在<Configuration>标签里配置，被这种过滤器拒绝的日志事件不再会向后传递。一旦日志事件被一个上下文范围有效的过滤器判定为ACCEPT时，其它上下文有效的过滤器将不会对日志事件进行过滤，日志事件将会继续呗Logger和Appender的过滤器过滤。

- Logger过滤器配置在一个特定的Logger上面。这些过滤器会在上下文范围有效的过滤器之后发挥作用，被这些过滤器拒绝的日志事件将会被丢弃，也不管additivity的配置如何，不会将日志传递给父亲Logger。

- Appender过滤器用于决定一个指定的Appender是否应该处理和发布日志事件。

- Appender引用过滤器用于决定Logger是否应该将日志事件路由到一个Appender。

### 我常用的过滤器

#### CompositeFilter

组合过滤器，使用一个`Filters`元素组合多个Filter，这个元素没有其他参数。

``` xml
<Filters>
  <MarkerFilter marker="EVENT" onMatch="ACCEPT" onMismatch="NEUTRAL"/>
    <DynamicThresholdFilter key="loginId" defaultThreshold="ERROR"
                          onMatch="ACCEPT" onMismatch="NEUTRAL">
    <KeyValuePair key="User1" value="DEBUG"/>
  </DynamicThresholdFilter>
</Filters>
```

#### ThresholdFilter

根据输出的日志级别过滤日志

##### Level
``` js
FATAL < ERROR < WARN < INFO < DEBUG < TRACE
```

##### Filter Rule
``` js
if (输出日志级别 <= 过滤器配置级别) return 'onMatch'
else return 'onMismatch';
```

##### Parameter
- level：string：需要匹配的日志级别
- onMatch：string：指定匹配到的LogEvents的过滤策略
- onMismatch：string：指定不匹配的LogEvents的过滤策略

比如，如果ThresholdFilter配置的级别为ERROR，日志事件级别为DEBUG，那么onMismatch值就会返回。只有ERROR或级别更低的FATAL级别到日志事件的到来，才会返回onMatch。

``` xml
<File name="infoFile" fileName="logs/info/info.log">
    <Filters>
        <ThresholdFilter level="warn" onMatch="DENY" onMismatch="NEUTRAL"/>
        <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY"/>
    </Filters>
    <PatternLayout>
        <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
    </PatternLayout>
</File>
```

上面这个例子就把仅为INFO级别的日志信息输出到特定的地方

我们看第一个过滤器：
``` xml
<ThresholdFilter level="warn" onMatch="DENY" onMismatch="NEUTRAL"/>
```
warn即warn以下（fatal、error）的级别被拒绝了，warn以上的级别被传递到下一个过滤器；

第二个过滤器：
``` xml
<ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY"/>
```
info即info以下（warn、fatal、error）的级别被接受了，info以上的级别被拒绝；

#### RegexFilter

根据日志内容来使用正则表达式去过滤日志信息

##### Parameter
- regex：stirng：正则表达式
- onMatch：string：指定匹配到的LogEvents的过滤策略
- onMismatch：string：指定不匹配的LogEvents的过滤策略

``` xml
<RegexFilter regex=".* test .*" onMatch="ACCEPT" onMismatch="DENY"/>
```

上面这个例子只使出含有test字样的日志。
