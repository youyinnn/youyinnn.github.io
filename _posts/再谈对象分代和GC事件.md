---
title: 再谈对象分代和GC事件
categories:
- note
- thinking
- GC
tags:
- gc
- gc-event
- generation-type
date: 2019-03-18 20:46:00
---



### Introduction

之前在搜OOM的时候，无意中发现了[https://plumbr.io/](https://plumbr.io/)这个网站，它们的产品就是做内存监控工具之类的，于是官网上也有很多关于JVM的GC方面的技术博客，简直和挖到宝藏了一样- -

本篇主要是针对对象在堆上的分代和GC事件再做一些细致的了解，主要也是参考网站里的内容

### Object Generation

从我们熟悉的开始，堆内存大致可以分为三个区域，Young——新生代、Turned——老年代、PermGen——永久代

其中新生代里又默认以8：1：1分为Eden：Survivor：Survivor

![](https://image.youyinnn.top/20190318213039.png)

#### Eden

在以前一篇[关于JVM的对象创建与访问](./18669ga.html)里提到过的TLAB（Thead Local Allocatipn Buffer），它主要用于解决对象分配的时候需要先划定一些内存空间，一个内存空间仅允许一个线程进行操作，这样就可以避免用同步的**高耗时**代价去保证对象分配的正常进行

于是Eden空间进一步划分一个或者多个TLAB区域，并且保留一块公共区域，当TLAB空间不够分配对象的时候，会选择到公共区域继续分配，如果这里也没有空间了的话，那就会出发一次年轻代的GC，也就是**Minor GC**

这里有个GC的细节，也是之前没提到过的，我们说GC的基本操作是，扫描引用链，然后清除掉和根引用无关的对象，但是我们需要知道，对象之间的引用是可以跨代的，比如新生代对象可以挂在老年代对象上，所以一次直白的**Reachability Analysis**，可能会跨代进行

![](https://image.youyinnn.top/20190318214251.png)

但是这样做的话，**分代GC**就没有意义了，于是JVM在这里使用了一个小伎俩：*card-marking*，详细可以参考[The JVM Write Barrier - Card Marking](http://psy-lob-saw.blogspot.com/2014/10/the-jvm-write-barrier-card-marking.html)，JVM用这个算法粗略地将Eden区的有可能有跨代引用的对象进行标记，然后把它们移到Survivor区，然后剩下的对象就容易清理掉了——是不是很眼熟？这就是**标记-复制**算法

#### Survivor

紧接着Eden，是两个Survivor区，这两个区域也各自拥有姓名，**"from"**和**"to"**，前面也提到过了，其中一个区域应该总是空的，所以实际上Eden区能用的最大空间是分配的**90%**

当年轻代开始GC的时候，所有存活的年轻代会从Eden和from区域复制到to区域，有的年轻代对象也会从from区域直接分配到老年代，因为在这存活了15次，然后原先的from和to会互换身份；

![](https://image.youyinnn.top/20190318223935.png)

再提一嘴，15次是默认值，可以用参数调整，然后大对象会更早的进入老年代，不受age限制，这个在前面也说过了

#### Old Generation

这部分的对象大多数长期存活的，或者是占用空间有点大的对象，而这里的GC算法也并不能简单地进行**标记-复制**，而是尽可能的用移动去减小对象之间的碎片空间

老年代的回收算法通常是根据不同的基础去确定的，但是原理上都是如下步骤：

- 根据GC Root，为对象标记可达性检测；
- 删除不可达对象；
- 压缩这些存活对象，让他们尽量靠近彼此，靠近空间的开端；

#### PermGen & Metaspace

这两个就不再解释了，之前研究字符串的时候，有写过相关的：[The Revelation of Java String](./46bhg0.html)

### GC Events

#### Minor GC

**Minor GC**发生在年轻代，它的概念和意图其实也就这么简单，但是还有一些细节需要我们了解一下：

1. **Minor GC**发生在新对象无法分配内存的时候，所以在对象创建频率高的时候，**Minor GC**也更频发；
2. 老年代到新生代的引用会被视为**GC Root**，新生代到老年代的引用会被忽略掉，然后移动到Survivor区；
3. 需要明确的是：**Minor GC**也会触发**“大暂停”**，会停止所有的线程，但是一般来说，如果绝大部分对象都被视为垃圾而不必进行复制的话，那么这个暂停延迟基本上可以忽略不记，反之需要在复制的过程中多消耗一些延迟

#### Major GC vs Full GC

虽然没有明确的文档或者规范定义出**Major GC**和**Full GC**，但我们还是可以参照**Minor GC**的定义方向，定义出这两种事件：

- **Major GC**：清理老年代；
- **Full GC**：清理整个Heap，新老年代；

但我们还是不能完全将他们分开来，在很多情况下，**Major GC**都是由**Minor GC**触发的；但是另一方面，现代的GC算法比如**G1**，就是只进行了**“部分清理”**；

所以在这个问题上，我们的重心应该从**“这个是Major GC还是Full GC”**变为**“是否会触发大暂停，还是这次GC能和程序同步进行”**

