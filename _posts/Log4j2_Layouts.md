---
title: Log4j2_Layouts
categories:
  - note
  - toolslearning
  - log4j2
comments: true
tags:
  - log4j2
  - learning
date: 2017-12-08 14:39:16
series: Log4j2
---

{% cq %}

Layout：定制你的输出模式

{% endcq %}

<!-- more -->

[Layouts](https://logging.apache.org/log4j/2.x/manual/layouts.html)里提到了许多种Layout方式，我最常用的是PatternLayout。

### Pattern Layout 模式输出

是一种通过pattern字符串来配置的灵活的输出方式。

属性：
- charset：string：所使用的字符集
- pattern：string：定制你的输出模式
- header：string：这是一个可选项，它会包含在每个log文件的开头
- footer：string：这是一个可选项....

#### Patterns

##### Logger Name模式

`c{precision}`
`logger{precision}`

用例：

![class pattern](https://image.youyinnn.top/0c7bcdb7e018e47007e1f94164a2b626.png)

#### Class模式

`C{precision}`
`class{precision}`

##### Date模式

`d{pattern} & date{pattern}`

用例：

![date pattern](https://image.youyinnn.top/782b42701d03650c07a92766558d225f.png)

#### Line模式

`%L`：输出报出issue的logger的行数
`%l`：输出更详细的行数信息

#### Message信息模式

`%msg`：输出logger的信息

#### Method模式

`%M`：输出logger所在的方法

#### n模式

`%n`：输出系统支持的行分隔符，比如`\n`或者`\r\n`

#### N模式

`%N`：输出调用Log事件时的:`System.nanoTime()`

#### pid模式

`%pid`：输出程序的pid

#### level模式

`p|level{level=label, level=label, ...}`：指定每个级别的别名
`p|level{lowerCase=true|false}`：指定级别是否小写


#### Thread模式

`%t`:  输出调用Log事件时所处的线程名
`%tid`:  输出调用Log事件时所处的线程id

#### Context模式

`%X{key[,key2...]}`: 输出存在ThreadContext里的键所对应的值
