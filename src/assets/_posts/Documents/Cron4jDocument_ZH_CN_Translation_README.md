---
title: Cron4jDocument_ZH_CN_Translation_README
tags:
  - cron4j
  - scheduler
  - readme
series: Cron4jDocument_ZH_CN_Translation
date: 2018-05-07 17:12:01
---

# Cron4j : A pure Java cron-like scheduler

创立时间：2017 年 8 月 20 日 13:35:01

官方文档地址：http://www.sauronsoftware.it/projects/cron4j/

---

Maven 依赖：

```
<dependency>
    <groupId>it.sauronsoftware.cron4j</groupId>
    <artifactId>cron4j</artifactId>
    <version>2.2.5</version>
</dependency>
```

---

#### 前言：

> 这是一篇针对 cron4j 官方英文文档的翻译。
>
> 虽然官方文档并不难看懂，但是本着高尚的自学精神，再加上暑假有点无聊，我尝试着翻译这篇 Java 工具包的技术文档。
>
> 该翻译并不是来自官方的，仅仅是自学用的翻译，如有翻译错误，请在 issue 中指出。
>
> 本人并仅仅英语四级压线水平，所以文档并没有严格按照语法规范翻译，首先遵从本人自己的理解（如有理解错误也请在 issue 中指出），再尽量翻译成通俗的语句，要求的是能根据本文快速掌握 cron4j 工具。一切以实践为标准，我在学习的时候也会先实践，再结合实践翻译到文档中。
>
> 在 JavaWeb 开发中，一些后台业务场景会有需要定时任务的需求，这些定时任务如果人工去执行的话就会显得非常蠢，所以就有了定时任务工具包/框架的出现。
>
> 其实流行的定时任务框架就像 Quartz 这样的，应该是运用到生产环境中比较好的选择，但是 Quartz 的官方文档结构有点蛋疼（也可能是我没细看），并不能简明直接的让开发者循序渐进的掌握它。而在一些博客中对比也谈到 Quartz 比 Cron4j 臃肿一些，这也是增加学习成本的原因之意。它们的性能对比不知道怎么样，不过我猜应该是 Quartz 要好一点，毕竟持续到近两个月前 Quartz 还在继续维护当中，而 Cron4j 最近的发布时间是：28-Dec-2011（膜拜）。
>
> 我为什么选择 cron4j，是因为最近在学 JFinal3.2，里面插件扩展的章节介绍到了 cron4j，之前也有思考过定时任务的解决方案，恰好再此了解到它。在学习 cron4j 的过程中也确实感受到了它的“pure”之意，所以我也愿意花一些时间来去翻译它的官方文档和学习它。
>
> 在完成文档的过程中有一点比较难受的是，我每次实践都至少要等上一分钟才能验证结果...

---

#### Overview 部分：

cron4j 是 Java 平台的一个调度器（也就是任务调度工具/框架），它非常像 UNIX 系统下的具有进程守护的定时任务工具 cron。

有了 cron4j，你可以在你规定好的时间内在 Java 应用程序中执行你指定的任务，而这只需要你制定一些简单的规则。

虽然 Java 平台已经内置了一个由`java.util.Timer`类实例化的调度器，但是 cron4j 走的是和前者不同的另一条路子。

你可以说`java.util.Timer`调度器是

> “从现在开始过 5 分钟后启动这个任务”

或者说

> “从现在开始过 5 分钟后执行这个任务，然后每 10 分钟重复执行它”。

这就是`java.util.Timer`。

而 cron4j 调度器会让你稍微多做一些复杂的事情，
比如：

> “在每个周一的 12 时执行这个任务”
>
> “每隔 5 分钟执行这个任务，但是周末期间可以不执行”
>
> “在 8：00am 到 8：00pm 之间的每个小时执行一次任务，而在 8：00pm 到 8：00am 之间的每 5 分钟执行一次任务”
>
> “除了 7 月和 8 月之外的月份内并且在一周内除了周日之外，每天都执行一次任务”

这些蜜汁操作，想要实现它们你只需要简单的写一小行代码就可以 Duang 出来。

把 cron4j 使用到你的项目里面其实非常简单，你只需要掌握一些常用 API 就足够了。启动定时任务的启动规则必须是一个字符串表达式，它被称为**scheduling pattern（调度模式）**，它的语法等同于 UNIX 系统中 crontab 所使用的语法一样。如果你了解过 UNIX 中 crontab 的操作，那么恭喜你，你已经掌握本工具的一大半了。如果你不会，don't worry：crontab 的调度模式你只需要花上几分钟就能掌握（骗人！），再说了，后面还有 documentation 给你学习呢。

---

运行要求：

你可以在任何 Java 平台使用它。

License:

```
cron4j is Free Software and it is licensed under LGPL (you will find a copy of the license bundled into the downloadable software distribution).
```

Feedback

...

Make a donation

...

---

翻译进度：

> 第一阶段
>
> 时间：2017 年 8 月 20 日 21:03:12
>
> 内容：Overview、doc 的前三节

> 第二阶段
>
> 时间：2017 年 8 月 21 日 00:01:13
>
> 内容：doc 第四、五节 第六节的大部分

> 第三阶段
>
> 时间：2017 年 8 月 21 日 22:15:33
>
> 内容：doc 第七到末节

[正文](https://youyinnn.github.io/article/1ngl1pm.html)
