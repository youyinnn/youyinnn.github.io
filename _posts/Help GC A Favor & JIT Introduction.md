---
title: Help GC A Favor & JIT Introduction
categories:
  - java
  - jvm
  - gc
tags:
  - JVM
  - GC
  - JIT
  - OOM
date: 2019-03-04 04:19:00
---



### Introduction

之前我们了解过GC的很多行为和特点了，也大致知道OOM发生的地点和原因，然后还深入了解了Java中的Reference

接下来我们简单说一下如何避免OOM，帮GCor们一个小忙

### Help GC

#### Make Object Eligible For GC

1. **Object Inside A Method**

    之前有提到过一嘴*“对象分配在堆上变得不是那么绝对了”*，对，对象并不都是分配在堆，对象还可以直接分配在每个线程的栈空间中，这个事情后面再说

    我们在**方法内定义的新对象**，在没有指派方法外的强引用引用这些对象的时候，**等到方法结束之后，这些对象就变为了匿名对象**，转变为不可达状态，于是它们成为了GCor的关注对象之一

2. **Reassigning reference variable**

    重新指派引用，一个对象没有其他引用引用它了，那它也就凉了

3. **Nullifying reference variable**

    将引用置空，原来它指派的对象如果没有其他引用引用的时候，也凉

4. **Anonymous object**

    匿名对象，差不多只能存活在方法栈桢当中，和第一个一样

#### Java OOM

除了程序计数器之外，JVM的其他运行时数据区都有可能发生OOM

##### Heap Overflow

Java堆用于存储对象实例，只需要不停的创建对象，并且保证GCRoots到对象之间有可达路径来避免垃圾回收清理掉对象，那么在对象数量达到最大堆容量之后就会产生内存溢出异常

溢出异常有两种情况：

- 内存泄漏（**Memory Leak**）：泄露出来的对象都是不需要了的对象，是应该被回收掉的，但是还有可达路径能够访问到这些对象，所以**导致这些垃圾对象无法被回收**，一直占着空间，于是JVM没办法有去申请新的空间，不够了就OOM；
- 内存溢出（**Memory Overflow**）：内存溢出就是物理内存不够了，这时候需要通过增大虚拟机内存配置或者检查是否有过长生命周期的对象，在代码中尽早断开和这些对象的之间的可达路径，让它被回收；

于是在堆上出现OOM，就要判断内存中的对象是否还有必要存在，有可能是程序没写好，没有将垃圾对象即使处理，最终导致OOM；也有可能是实际上需要的对象内存不够了，直接导致的OOM；

###### Heap Overflow Solution

- 修改JVM启动参数，直接增加内存

    - **-Xms**:初始堆大小
    - **-Xmx**:最大堆大小
    - **-Xmn**:设置年轻代大小

- 检查错误日志，查看**OOM错误前**是否有其它异常或错误

- 对代码进行走查和分析，找出可能发生内存溢出的位置

    重点排查以下几点：

    1. 检查对**数据库查询**中，是否有一次获得全部数据的查询。一般来说，如果一次取十万条记录到内存，就可能引起内存溢出。这个问题比较隐蔽，在上线前，数据库中数据较少，不容易出问题，上线后，数据库中数据多了，一次查询就有可能引起内存溢出。因此对于数据库查询尽量采用分页的方式查询。
    2. 检查代码中是否有**死循环**或**递归**调用
    3. 检查是否有**大循环重复产生新对象**实体
    4. 检查**List、MAP等集合对象是否有使用完后，未清除**的问题。List、MAP等集合对象会始终存有对对象的引用，使得这些对象不能被GC回收

- 使用内存查看工具动态查看内存使用情况

##### Stack Overflow

栈容量可以由`-Xss`设置

- `StackOverflowError`：线程请求栈深达到虚拟机最大允许栈深；
- `OutOfMemoryError`：扩展栈的时候无法申请到内存；

栈深度溢出这个很好理解，一个递归方法可能无限递归下去，这时候就会出现栈深度不够导致溢出；

而在栈内存要出现OOM，多数情况下是在多线程开发的时候，无法申请到更多的线程，而导致栈空间的OOM；

整个内存其实是由各运行时数据区瓜分的，其他数据区分完了之后，剩下的就是栈内存，如果说线程数量总是多到栈内存OOM的时候，而且不能减少线程数量或者增大内存的时候，可以考虑调小其他运行时数据区的内存，从而让栈分配到更多的内存，以申请更多的线程数

##### Method Area & Constant Pool Overflow

我们知道方法区也叫永久代（至少在Java 8之前是这么叫的），所以在Java 8之前我们能够通过`-XX:PermSize`和`-XX:MaxPermSize`来调整方法区的大小

- 运行时常量池在常量存放过多的时候会溢出，比如无限产生随机字符串；
- 因为方法区用来存放类相关信息，所以我们只需要产生大量的类就可以造成方法区内存溢出；



#### The 8 symptoms that surface OOM

上面我们根据运行时数据区来大致为OOM做出分类，接下来我们按照情况来进一步了解常用的OOM，一次偶尔写出：

```java
new int[Integer.MAX_VALUE]
```

这样的语句的时候，我发现它抛出了一个`java.lang.OutOfMemoryError: Requested array size exceeds VM limit`异常，这个异常之前没有提到过，我就知道，OOM还有东西可以挖，然后在网上找参考，第一篇就是[Java内存溢出(OOM)异常完全指南](https://www.jianshu.com/p/2fdee831ed03)，而它是[https://plumbr.io](https://plumbr.io/outofmemoryerror)的一篇技术blog的译文，于是我尝试参考原文，一下是原文引言：

> The many thousands of java.lang.OutOfMemoryErrors that I’ve met during my career all bear one of the below eight symptoms. This handbook explains what causes a particular error to be thrown, offers code examples that can cause such errors, and gives you solution guidelines for a fix. The content is all based on my own experience.
>
> **Nikita Salnikov-Tarnovski**
> Plumbr Co-Founder and VP of Engineering

##### 1. Java-Heap-Space

这个OOM之前已经很熟悉了，我们也知道是因为堆内存爆掉了才会出现这个OOM，然而之前我们分析原因的时候有提到过，主要原因是内存溢出或者内存泄漏导致的内存溢出，而文中还更进一步地详细地描述了这两个方面：

- **Spikes in usage/data volume**. The application was designed to handle a certain amount of users or a certain amount of data. When the number of users or the volume of data suddenly spikes and crosses that expected threshold, the operation which functioned normally before the spike ceases to operate and triggers the *java.lang.OutOfMemoryError: Java heap space* error.
- **Memory leaks**. A particular type of programming error will lead your application to constantly consume more memory. Every time the leaking functionality of the application is used it leaves some objects behind into the Java heap space. Over time the leaked objects consume all of the available Java heap space and trigger the already familiar *java.lang.OutOfMemoryError: Java heap space* error.

激增就是并没有泄漏，而是瞬时增加的内存需求峰值高出预取而直接导致的堆爆；泄漏就不再解释了；

##### 2. GC overhead limit exceeded

> The *java.lang.OutOfMemoryError: GC overhead limit exceeded* error is displayed when **your application has exhausted pretty much all the available memory and GC has repeatedly failed to clean it**.

![](https://image.youyinnn.top/20190317135716.png)

其根本原因就是你写的程序创造出太多难以GC的对象了，导致GC效率非常低，于是GCor们都不干了；

默认的情况下，如果JVM花费了**98%**的时间，却只回收了**2%**不到的内存的话，那么就就抛出这个OOM；

##### 3. Permgen space

我们之前了解过永久代的事情，也清楚它在Java8中到底变成什么样子了，更多就不再赘述了，原文和译文里有很多参考

##### 4. Metaspace

虽然永久代已经被无默认限制的Metaspace替代了，但是主机上Metaspace还是有限制的，它一样能被打爆，而且它被打爆的后果可能就是主机宕机，关于这个可以参考：[Java PermGen 去哪里了?](http://ifeve.com/java-permgen-removed/)

![](https://image.youyinnn.top/20190317143413.png)

##### 5. Unable to create new native thread

JVM的线程也是需要消耗空间的，当你的线程过多而还在不断地申请线程的时候，OS对进程是会有默认的线程申请现在的，如果超过这个限制，OS就不会分配线程给你了，这时候就会报这个OOM，

![](https://image.youyinnn.top/20190317144032.png)

我们虽然可以增大这个限制，但我觉得你还是重新考虑一下优化你的程序，不要再给JVM甚至是OS压力了

##### 6. Out of swap space?

本质上是OS的交换空间被其他进程消耗了，可能的原因有：

- The operating system is configured with **insufficient swap space**.
- **Another process on the system** is consuming all memory resources.
- Application fails due to **a native leak**, for example, if application or library code continuously allocates memory but does not release it to the operating system.

##### 7. Requested array size exceeds VM limit

![](https://image.youyinnn.top/20190317145042.png)

请求数组长度过长，一般来说，数组长度限制是根据主机自身的可寻址限制不同而不同的，所以申请这么大的数组之前，首先考虑好是否需要这么多的空间；

Java中数组的索引范围是`Integer.MAX_VALUE`，即2^31 - 1，一个int占4 byte，于是2^31 个4 byte大约是**8G**，加上数组其他额外需要的元数据，一个这么大的数组就会要8G以上的内存，JVM可不会允许你干这样的事；

##### 8. Kill process or sacrifice child

为了理解这个错误，我们需要补充一点操作系统的基础知识。

操作系统是建立在进程的概念之上，这些进程在内核中作业，其中有一个非常特殊的进程，名叫“内存杀手（Out of memory killer）”。当内核检测到系统内存不足时，OOM killer被激活，然后选择一个进程杀掉。哪一个进程这么倒霉呢？选择的算法和想法都很朴实：谁占用内存最多，谁就被干掉。



#### Request A GC

1. **Using System.gc() method** : System class contain static method *gc()* for requesting JVM to run Garbage Collector.
2. **Using Runtime.getRuntime().gc() method** : [Runtime class](https://www.geeksforgeeks.org/java-lang-runtime-class-in-java/) allows the application to interface with the JVM in which the application is running. Hence by using its gc() method, we can request JVM to run Garbage Collector.

**Note :**

1. There is **no guarantee** that any one of above two methods will definitely run Garbage Collector.
2. The call *System.gc()* is **effectively equivalent** to the call : *Runtime.getRuntime().gc()*

### JIT

{% cq %}

The just-in-time (JIT) compiler is the heart of the Java Virtual Machine. Nothing in the JVM affects performance more than the compiler, and choosing a compiler is one of the first decisions made when running a Java application—whether you are a Java developer or an end-user.

{% endcq %}

这句话摘自[《Java Performance》Chapter 4. Working with the JIT Compiler](https://www.oreilly.com/library/view/java-performance-the/9781449363512/ch04.html)，可见JIT对JVM的重要性！

在早期的一些商用虚拟机，Java代码最初是通过解释器（**Interpreter**）解释执行的，它将代码翻译成JVM能读懂的字节码（**bytecode**），但是这些字节码要运行起来，JVM需要花费时间去解释，并且重复的热点代码可能会重复解释，于是为了提高效率，JIT就出现了

Just In Time Compiler，即时编译器，它负责在JVM运行的时候对特定的代码进行编译**（有针对性的优化编译）**，将它们编译成机器码，下次再运行这段逻辑的时候，直接执行机器码，提高运行时效率，这项技术大大地提高了Java程序的运行速度

![](https://image.youyinnn.top/20190305203935.png)

需要声明的一点是，JIT只在运行时适当地编译部分运行频率很高的代码

那么为什么不一开始就编译执行呢？因为有的代码只运行一次，也即是说，JVM是经过运行时分析过后，才用JIT对代码进行优化，它不立即编译代码，这么做的原因主要有两个：

- 如果代码只运行一次，那么还不如直接翻译，因为编译耗费的时间比翻译执行多很多
- JIT的最终目的是**优化代码**，然后编译为本地机器码，所以只有循环过多次的code，JVM才能更了解code的结构，才能进行针对性的分析，编译出优化的code

#### Optimizations

##### 0. Register & Main Memory

寄存器和主存的读取策略优化，很多时候，比如循环中的code，一个连加的code，当sum存于主存的时候，频繁从主存中读取是有点浪费的，经过编译优化之后会将sum存在寄存器中，在寄存器中做完运算再返回给主存，这样的code执行效率非常高

当然这里还涉及寄存器在线程之间同步的线程安全问题，这里略

##### 1. Client & Server

JIT 编译器在运行程序时有两种编译模式可以选择，并且其会在运行时决定使用哪一种以达到最优性能。这两种编译模式的命名源自于命令行参数（eg: -client 或者 -server）

JVM Server 模式与 client 模式启动，最主要的差别在于：-server 模式启动时，速度较慢，但是一旦运行起来后，性能将会有很大的提升

- 当虚拟机运行在-client 模式的时候，使用的是一个代号为 C1 的轻量级编译器
- 而-server 模式启动的虚拟机采用相对重量级代号为 C2 的编译器。C2 比 C1 编译器编译的相对彻底，服务起来之后，性能更高

##### 2. More

更多的优化策略可以继续参考：[深入浅出 JIT 编译器](https://www.ibm.com/developerworks/cn/java/j-lo-just-in-time/index.html)

##### +. Escape Analysis

在Hollis前辈的一篇文章[对象并不一定都是在堆上分配内存的](https://mp.weixin.qq.com/s?__biz=MzI3NzE0NjcwMg==&mid=2650121307&idx=1&sn=5526473d0248cca8385d2a18ba6b25af&chksm=f36bb97ac41c306c354ebf0335cd2fd77cac03f3434894e4e5b44a01754a5494b04350d26d14&scene=21#wechat_redirect)中提到：

> 逃逸分析(Escape Analysis)是目前Java虚拟机中比较前沿的优化技术。这是一种可以有效减少Java 程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。通过逃逸分析，Java Hotspot编译器能够分析出一个新的对象的引用的使用范围从而决定是否要将这个对象分配到堆上。
>
> 逃逸分析的基本行为就是分析对象动态作用域：当一个对象在方法中被定义后，它可能被外部方法所引用，例如作为调用参数传递到其他地方中，称为方法逃逸。
>
> ....
>
> 使用逃逸分析，编译器可以对代码做如下优化：
>
> 1. 同步省略。如果一个对象被发现只能从一个线程被访问到，那么对于这个对象的操作可以不考虑同步。
>
> 2. 将堆分配转化为栈分配。如果一个对象在子程序中被分配，要使指向该对象的指针永远不会逃逸，对象可能是栈分配的候选，而不是堆分配。
> 3. 分离对象或标量替换。有的对象可能不需要作为一个连续的内存结构存在也可以被访问到，那么对象的部分（或全部）可以不存储在内存，而是存储在CPU寄存器中。

于是说，为什么《深入理解Java虚拟机》中会有一句：*“但是，随着JIT编译期的发展与逃逸分析技术逐渐成熟，栈上分配、标量替换优化技术将会导致一些微妙的变化，所有的对象都分配到堆上也渐渐变得不那么“绝对”了。”*

背后的含义就明白了，关于更多JIT和逃逸分析的参考于：

- https://dzone.com/articles/escape-analysis
- https://www.beyondjava.net/escape-analysis-java
- https://www.oreilly.com/library/view/java-performance-the/9781449363512/ch04.html