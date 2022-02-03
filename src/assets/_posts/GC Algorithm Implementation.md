---
title: GC Algorithm Implementation
categories:
  - java
  - jvm
  - gc
tags:
  - gc
  - gc-algorithm
date: 2019-04-05 13:11:00 +8
---

### Introduction

前面说了挺多关于 GC 的算法思路，接下来这篇说说在 JVM 里实际实现的 GC 算法，翻译、参考自[plumbr.io](https://plumbr.io/handbook/garbage-collection-algorithms-implementations)

我们首先要清楚地认识到一个事情：除了 G1 回收器以外，垃圾回收算法分为**“针对新生代”**，**“针对老年代”**两种

每种垃圾回收算法又有不同的实现，然后你可以随意组合，下面这张表展示了在 Java8 下常用的四种 GC 算法的组合

| **Young**             | **Tenured**      | **JVM options**                              |
| :-------------------- | :--------------- | :------------------------------------------- |
| **Serial**            | **Serial**       | **-XX:+UseSerialGC**                         |
| **Parallel Scavenge** | **Parallel Old** | **-XX:+UseParallelGC -XX:+UseParallelOldGC** |
| **Parallel New**      | **CMS**          | **-XX:+UseParNewGC -XX:+UseConcMarkSweepGC** |
| **G1**                |                  | **-XX:+UseG1GC**                             |

实际上还有其他搭配，但是这些搭配要么是不支持了，要么是不实用了，所以接下来我们只关注这四种

### Serial GC

**Serail GC**使用[标记-复制](./jhpq7e.html?hash=14c983ac)算法回收年轻代，使用[标记-整理]()算法回收老年代

和它的名字一样，串行收集器在这两个区域只能**串行地**收集，这两个区域的收集也会触发**大暂停**

所以这个收集器并不能利用多核 CPU 的优势，它在工作的时候就只会使用一个 CPU，要开启这个收集器，需要在 JVM 启动的时候加上一行参数：

```
java -XX:+UseSerialGC com.mypackage.MyClass
```

选择这个收集器的话，最好是在 JVM 只运行小几百兆的堆内存的时候，并且运行在单核机器上的时候才好，因为大半数的服务端机器都会有很高的配置，如果使用**串行**收集的话，意味着你的系统没有发挥最大的机器性能

#### GC Log

##### Minor GC

下面是一次**Serial GC**的 Minor GC 的快照：

Following snippet contains the information about a GC event cleaning the Young Generation:

`2015-05-26T14:45:37.987-0200`:`151.126`:\[`GC`(`Allocation Failure`) 151.126: \[`DefNew`:`629119K->69888K` `(629120K)`, 0.0584157 secs]`1619346K->1273247K ` `(2027264K)`,`0.0585007 secs`]`[Times: user=0.06 sys=0.00, real=0.06 secs]`

1. **2015-05-26T14:45:37.987-0200** – Time when the GC event started.

2. **151.126** – Time when the GC event started, relative to the JVM startup time. Measured in seconds.

3. **GC** – Flag to distinguish between Minor & Full GC. This time it is indicating that this was a Minor GC.

4. **Allocation Failure** – Cause of the collection. In this case, the GC is triggered due to a data structure not fitting into any region in the Young Generation.

5. **DefNew** – Name of the garbage collector used. This cryptic name stands for the single-threaded mark-copy stop-the-world garbage collector used to clean Young generation.

6. **629119K->69888K** – Usage of the Young Generation before and after collection.

7. **(629120K)** – Total size of the Young Generation.

8. **1619346K->1273247K** – Total used heap before and after collection.

9. **(2027264K)** – Total available heap.

10. **0.0585007 secs** – Duration of the GC event in seconds.

11. **[Times: user=0.06 sys=0.00, real=0.06 secs]**

    – Duration of the GC event, measured in different categories:

    - user – Total CPU time that was consumed by the garbage collector threads during this collection
    - sys – Time spent in OS calls or waiting for system event
    - real – Clock time for which your application was stopped. As Serial Garbage Collector always uses just a single thread, real time is thus equal to the sum of user and system times.

下图是这次 log 的内存图变化：

![Serial GC Young Gen Java](https://plumbr.io/app/uploads/2015/06/serial-gc-in-young-generation.png)

从快照结果中我们可以看出年轻代的对象要么被清理掉了，要么存活下来进入 S2 了，要么被 promoted 到了老年代

##### Full GC

`2015-05-26T14:45:59.690-0200`: `172.829`:[GC (Allocation Failure) 172.829:[`DefNew: 629120K->629120K(629120K), 0.0000372 secs`]172.829:[`Tenured`: `1203359K->755802K` `(1398144K)` ,`0.1855567 secs`] `1832479K->755802K` `(2027264K)`,`[Metaspace: 6741K->6741K(1056768K)]` `[Times: user=0.18 sys=0.00, real=0.18 secs]`

1. **2015-05-26T14:45:59.690-0200** – Time when the GC event started.

2. **172.829** – Time when the GC event started, relative to the JVM startup time. Measured in seconds.

3. **DefNew: 629120K->629120K(629120K), 0.0000372 secs** – Similar to the previous example, a minor garbage collection in the Young Generation happened during this event due to Allocation Failure. For this collection the same DefNew collector was run as before and it decreased the usage of the Young Generation from 629120K to 0. Notice that JVM reports this incorrectly due to buggy behavior and instead reports the Young Generation as being completely full. This collection took 0.0000372 seconds.

4. **Tenured** – Name of the garbage collector used to clean the Old space. The name Tenured indicates a single-threaded stop-the-world mark-sweep-compact garbage collector being used.

5. **1203359K->755802K** – Usage of Old generation before and after the event.

6. **(1398144K)** – Total capacity of the Old generation.

7. **0.1855567 secs** – Time it took to clean the Old Generation.

8. **1832479K->755802K** – Usage of the whole heap before and after the collection of the Young and Old Generations.

9. **(2027264K)** – Total heap available for the JVM.

10. **[Metaspace: 6741K->6741K(1056768K)]** – Similar information about Metaspace collection. As seen, no garbage was collected in Metaspace during the event.

11. **[Times: user=0.18 sys=0.00, real=0.18 secs]**

    – Duration of the GC event, measured in different categories:

    - user – Total CPU time that was consumed by Garbage Collector threads during this collection
    - sys – Time spent in OS calls or waiting for system event
    - real – Clock time for which your application was stopped. As Serial Garbage Collector always uses just a single thread, real time is thus equal to the sum of user and system times.

内存变化：

![Java Old Generation SerialGC](https://plumbr.io/app/uploads/2015/06/serial-gc-in-old-gen-java.png)

### Parallel GC

**Parallel GC**使用[标记-复制](./jhpq7e.html?hash=14c983ac)算法回收年轻代，使用[标记-整理]()算法回收老年代，这点两个收集器都一样

和它的名字一样，并行收集器在这两个区域可以**并行地**收集，开始工作前也会触发**大暂停**，说并行是指它会用多个线程同时进行垃圾回收，这样做会大大减少回收的耗时

相关参数：

- 指定多线程收集使用的线程数，默认是操作系统的核心数

  ```
  -XX:ParallelGCThreads=NNN
  ```

- 指定使用并行收集器

  ```
  java -XX:+UseParallelGC com.mypackages.MyExecutableClass
  java -XX:+UseParallelOldGC com.mypackages.MyExecutableClass
  java -XX:+UseParallelGC -XX:+UseParallelOldGC com.mypackages.MyExecutableClass
  ```

如果你想提高系统的吞吐量的话，那么你可以在多核 CPU 的机器环境使用这个收集器，它能更高效地利用系统的资源进行工作：

- 因为快速的原因，**大暂停**的时间也会缩短；
- 在垃圾回收期间，**收集器都不会消费任何资源（？）**；

但是另一方面来说，所有的收集器都必须在无打扰的情况下工作，所以它们非常容易受到长时间暂停的线程的影响，如果你对延迟很在意的话，你可以继续看下一组垃圾收集

**GC log：**

```
2015-05-26T14:27:40.915-0200: 116.115: [GC (Allocation Failure) [PSYoungGen: 2694440K->1305132K(2796544K)] 9556775K->8438926K(11185152K), 0.2406675 secs] [Times: user=1.77 sys=0.01, real=0.24 secs]
2015-05-26T14:27:41.155-0200: 116.356: [Full GC (Ergonomics) [PSYoungGen: 1305132K->0K(2796544K)] [ParOldGen: 7133794K->6597672K(8388608K)] 8438926K->6597672K(11185152K), [Metaspace: 6745K->6745K(1056768K)], 0.9158801 secs] [Times: user=4.49 sys=0.64, real=0.92 secs]
```

**Minor GC：**

![Java ParalleGC](https://plumbr.io/app/uploads/2015/06/ParallelGC-in-Young-Generation-Java.png)

**Full GC：**

![ParallelGC Java](https://plumbr.io/app/uploads/2015/06/Java-ParallelGC-in-Old-Generation.png)

### Concurrent Mark and Sweep（CMS）

CMS 收集器的官方名称是“Mostly Concurrent Mark and Sweep Garbage Collector”，它在年轻代使用**并行**收集器一样的行为：**大暂停、并行、标记-复制**，然后在老年代区使用**CMS**

这个算法被设计成用于**避免在回收老年代的时候有长暂停**，它有两个含义：

1. 它并不对老年代进行紧凑整理，而是用一个**'free-lists'**来管理回收空间；
2. 它主要的工作是在**标记-回收**阶段用**额外的线程**和应用程序**并发地进行**，这意味着在这个阶段工作的时候，它不会触发**大暂停**，因此！它会和程序的线程竞争 CPU 时间，默认的情况下它能调用的线程数是物理核心的 1/4；

你可以用下面这行参数来启动它

```
java -XX:+UseConcMarkSweepGC com.mypackages.MyExecutableClass
```

如果你的目的是为了减少延迟的话，那么**CMS**在多核环境下是一个很好的选择，但是由于它会占用程序之外的额外资源，所以它会削弱系统的整体吞吐量

#### GC Log

##### Minor GC

```
2015-05-26T16:23:07.219-0200: 64.322: [GC (Allocation Failure) 64.322: [ParNew: 613404K->68068K(613440K), 0.1020465 secs] 10885349K->10880154K(12514816K), 0.1021309 secs] [Times: user=0.78 sys=0.01, real=0.11 secs]
```

![Java ParalleGC](https://plumbr.io/app/uploads/2015/06/ParallelGC-in-Young-Generation-Java.png)

##### Full GC

```
2015-05-26T16:23:07.321-0200: 64.425: [GC (CMS Initial Mark) [1 CMS-initial-mark: 10812086K(11901376K)] 10887844K(12514816K), 0.0001997 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
2015-05-26T16:23:07.321-0200: 64.425: [CMS-concurrent-mark-start]
2015-05-26T16:23:07.357-0200: 64.460: [CMS-concurrent-mark: 0.035/0.035 secs] [Times: user=0.07 sys=0.00, real=0.03 secs]
2015-05-26T16:23:07.357-0200: 64.460: [CMS-concurrent-preclean-start]
2015-05-26T16:23:07.373-0200: 64.476: [CMS-concurrent-preclean: 0.016/0.016 secs] [Times: user=0.02 sys=0.00, real=0.02 secs]
2015-05-26T16:23:07.373-0200: 64.476: [CMS-concurrent-abortable-preclean-start]
2015-05-26T16:23:08.446-0200: 65.550: [CMS-concurrent-abortable-preclean: 0.167/1.074 secs] [Times: user=0.20 sys=0.00, real=1.07 secs]
2015-05-26T16:23:08.447-0200: 65.550: [GC (CMS Final Remark) [YG occupancy: 387920 K (613440 K)]65.550: [Rescan (parallel) , 0.0085125 secs]65.559: [weak refs processing, 0.0000243 secs]65.559: [class unloading, 0.0013120 secs]65.560: [scrub symbol table, 0.0008345 secs]65.561: [scrub string table, 0.0001759 secs][1 CMS-remark: 10812086K(11901376K)] 11200006K(12514816K), 0.0110730 secs] [Times: user=0.06 sys=0.00, real=0.01 secs]
2015-05-26T16:23:08.458-0200: 65.561: [CMS-concurrent-sweep-start]
2015-05-26T16:23:08.485-0200: 65.588: [CMS-concurrent-sweep: 0.027/0.027 secs] [Times: user=0.03 sys=0.00, real=0.03 secs]
2015-05-26T16:23:08.485-0200: 65.589: [CMS-concurrent-reset-start]
2015-05-26T16:23:08.497-0200: 65.601: [CMS-concurrent-reset: 0.012/0.012 secs] [Times: user=0.01 sys=0.00, real=0.01 secs]
```

CMS 的**Full GC**有点讲头，它分为 7 个阶段

###### Phase 1: Initial Mark

这里会有 CMS 会触发的两次暂停之一，这个阶段的主要目标就是将老年代中的**GC Root**和有**被存活年轻代引用**的，后面这个目标很重要，因为老年代是分代收集的

![CMS initial mark](https://plumbr.io/app/uploads/2015/06/g1-06.png)

###### Phase 2: Concurrent Mark

在这个阶段里，GCor 会遍历老年代然后**标记上所有存活的对象**，遍历过程是从上一个阶段标记好的**GC Root**开始，但是这个过程不会触发大暂停，而是和程序**并发地**进行，需要注意的是，并不是所有的老年代都会被标记，因为程序运行过程中会改变一些引用关系

![CMS concurrent marking](https://plumbr.io/app/uploads/2015/06/g1-07.png)

###### Phase 3: Concurrent Preclean

这个阶段还是和应用程序并行的。虽然在上一个并发阶段里，有些引用被改变了，我们称这些对象为**“脏的（dirty）”**，如果出现这种情况的话，JVM 会将包含这些脏对象的堆区域划出一个范围，称为**卡（card）**，这就是我们前面提到过的[卡标记（_card-marking_）](./wlvrl9.html?hash=76a3fb27)

![CMS dirty cards](https://plumbr.io/app/uploads/2015/06/g1-08.png)

卡标记有两种状态，一种在脏状态，一种是干净状态，本阶段需要针对脏状态的对象进行处理，脏对象被视为占用状态，然后**将卡标记对象引用的对象也标记好**，标记好之后，脏对象就变为干净对象了

![CMS concurrent preclean](https://plumbr.io/app/uploads/2015/06/g1-09.png)

额外的，在这个阶段中还会进行一些内部处理，为最后的**重标记（Remark Phase）**阶段做准备

###### Phase 4: Concurrent Abortable Preclean

这个阶段还是**并发阶段**，这个阶段的目标是尽可能地减少整个回收工作中最后一次大暂停的重标记阶段的工作量，这个阶段所用的时间取决于很多因素，因为它仅仅只是迭代地去做同一个事情，但是打断它的迭代的因素有很多种

所以这个阶段对即将到来的大暂停阶段影响非常大，而且这个阶段有很多**配置项**和**失败模式**

###### Phase 5: Final Remark

这个阶段是 CMS 垃圾回收的第二个**大暂停**阶段，目的是为了最后一次对老年代区域进行**存活标记**，这是由于 Preclean 阶段是并发地进行的，它可能跟不上程序改变引用的速度，所以这次大暂停就需要解决这个考验

通常来说 CMS 会试着在**年轻代尽可能空着**的情况下执行这次**Final Remark**，目的是消除不断出现大暂停的情况发生

在 5 个 Marking 阶段之后，老年代中的所有存活对象都已经被标记好了，这时候 GCor 们就会开始干活，用 Sweep 的方式**清除（reclaim）**掉所有无用的对象

###### Phase 6: Concurrent Sweep

这个阶段就是和应用程序并发地进行，就是要清理掉不要的对象

![CMS concurrent sweep](https://plumbr.io/app/uploads/2015/06/g1-10.png)

###### Phase 7: Concurrent Reset

和程序并发地进行，目的是为了重置 CMS 收集器中记录的一些内部数据，为下一次 CMS 收集做准备

总而言之，CMS 收集器能利用程序暂时用不到的线程，和程序并发地进行，尽可能的减少大暂停的时长

而在这个需求上，它很好地完成它了的工作

但是它还是有一定的缺点的，其中最需要注意的是它会在一定程度上造成老年代的碎片空间，而且它还缺乏对暂停的预测判断，这点在堆比较大的时候会很明显

### G1 – Garbage First

你也许已经注意到，最开始的速查表中的 G1 并没有区分老年代和新生代，这是有原因的，而不是作者忘了

G1 收集器有一个很重要的目标就是，利用 GC 的可配置性和可预测性，让大暂停具有**持续（duration）**和**分布（distribution）**的特点，事实上，**Garbage-First**是一个**软实时（_soft real-time_）**的垃圾收集器，这意味着你可以为它设置**特定的性能目标**，比如你可以设置大暂停在多少毫秒的时间范围内执行时长不超过多少多少毫秒，G1 会尽它的努力去达到这个目标（所以也不是绝对能满足你的设置，这叫做**_hard real-time_**）

为了达到要设置的目标，G1 收集器建立了一套自己的概念：

1. 堆内存不必划分为新生代和老年代，而是分为若干个（一般可以是 2046 个）相同大小的小区域（**_regions_**），这些区域用来存放若干个对象，每一种区域又可以分为：Eden Region、Survivor Region、Old Region。

   因为不同种类的区域之间并不紧靠在一起，所以物理上它们不都在一个连续的空间，但是我们可以将它们逻辑上组成年轻代和老年代，这和之前的概念一致，只不过并不是连续划分空间了

   ![G1 Heap Regions](https://plumbr.io/app/uploads/2015/06/g1-011.png)

   这能让 GCor 们避免每次都清理整片堆内存，反而每次只需要清理一些被视为**待回收集合（collection set）**的部分区域就行了，每次大暂停的时候，都会清理所有的年轻代区域，顺带包括一些老年代区域

   ![G1 Collection Set](https://plumbr.io/app/uploads/2015/06/g1-02.png)

2. G1 另外一个新奇的地方就是，它会对每一个区域中包含的存活数据进行评估，用于建立起**待回收集合（collection set）**，包含越多垃圾的区域将会被越先处理，这也是**Garbage First**名称的来由

要使用 G1 收集器，可以包含参数：

```
java -XX:+UseG1GC com.mypackages.MyExecutableClass
```

#### Evacuation Pause: Full Young

在程序生命周期的最开始，G1 并没有为还未被执行的并发阶段预置一些额外信息，所以最开始这些区域都是**纯年轻模式（fully-young-mode）**

当年轻代被填满的时候，应用程序线程被停止了，然后年轻代区中的存活对象被复制到 Survivor 区，或者一个未被使用但是即将称为 Servivor 区域的自由区域

这个过程叫做**撤离（Evacuation）**，然后这个阶段的工作就和前面介绍过的一类年轻代收集器差不太多，但是整个撤离阶段的 log 相当大**（rather large）**，[原文](https://plumbr.io/handbook/garbage-collection-algorithms-implementations#evacuation-pause-fully-young)有详细的 log 分析，我这里就不展开了

#### Concurrent Marking

G1 收集器是基于前一节的 CMS 收集器的许多概念之上的，所以在继续往下了解之前你得好好看一下 CMS 到底是啥玩意，虽然在这个阶段 G1 收集器还是有一些和 CMS 不一样的地方，但是它们的目标是一致的

G1 的并发标记阶段使用了一种叫做**“事前快照（Snapshot-At-The-Beginning）”**的方式来在本阶段开始之前就标记好所有的对象，尽管它们中有的会马上变为垃圾，那个对象**“是存活的”**这个信息会代表每个区域的活跃度，这会提高之后判定待回收集的效率

之后这个信息被用于在老年代进行 GC：

- 如果一个区域中全部都是垃圾，那么它可以完全和程序并发进行
- 如果一个区域中既有垃圾又有存活对象，那么就需要在老年代区的撤离暂停中进行

G1 的并发标记过程的触发时机是堆区域整体被占用足够大的时候，默认情况下是 45%，但你可以用 JVM 参数调它

和 CMS 一样，G1 的并发标记过程有好几个阶段它们之中有些可以并发进行，有些则需要大暂停

##### Phase 1: Initial Mark

这个阶段会标记所有**GC Root**能够摸到的对象，和 CMS 不同的是，CMS 需要额外来一次大暂停，但是 G1 的这个阶段是捎带在撤离暂停之后的，所以它的开销非常小

##### Phase 2: Root Region Scan

这个阶段会标记所有从**Root Region**能 reach 到的存活对象，比如说一些非空的区域，我们必须得在标记环节的中期就进行收集，因为如果我们在后面的**并发标记**阶段的时候进行对象移动的话，可能会造成一些不可控的问题，所以这个阶段会在下一次撤离暂停开始之前完成，如果撤离暂停得提前开始的话，它会提前终止正在进行的**Root Region Scan**，然后等这次撤离暂停结束

在现在的实现中，Root Region 是 Survivor 区，它们属于年轻代区的一部分，并且下次撤离暂停中**一定会被回收**

##### Phase 3: Concurrent Mark

这个阶段和 CMS 中的非常相似，它仅仅是简单地过一遍对象图，然后在一个专门的比特图中标记上必要的对象

为了保证**“事前快照（Snapshot-At-The-Beginning）”**的出现，G1 GC 要求对对象图的并发更新得是应用程序的线程来断开引用的时候才有效

要完成这个事情，还是要有一个**预写屏障（pre-wirte barriers）**,它的功能在于无论什么时候你要写一个数据，只要并发标记处于激活状态，它都会存储之前的引用关系在一个交日志流的地方

##### Phase 4: Remark

这个之前的 CMS 的大暂停一样，在这个阶段最终完成标记工作

而对于 G1 来说，它会短暂地停止应用程序线程和停止并发更新日志流，并且做完日志流剩余的工作，然后标记完剩下的没有被标记的存活对象

这个阶段也会执行一些可选的清理回收工作，比如引用的处理和类的卸载

##### Phase 5: Cleanup

最后一个阶段为即将到来的撤离暂停做准备，对堆内存中所有的存活对象进行计数，并且将这些区域按照期望的 GC 效率高低进行排序，它还会做一些内部工作比如标记一些内部状态，为了下一次的并发标记做准备

最后再提一点，包含非存活对象的区域在这个阶段都会被清理掉，但是这个阶段中有些部分是并发的比如说回收一些空区域和一些活跃度比较高的区域；也会有要求大暂停的区域

#### Evacuation Pause: Mixd

理想的情况下，可能在并发 Cleanup 阶段就已经把老年代区域对象都清理掉了，但也不会 100%都这样

在并发标记完全完成的时候，G1 收集器会安排一次**混合收集（mix collection）**，它不仅收集年轻代的垃圾，它还收集老年代的垃圾

一次针对两个区域的撤离暂停并不总是马上就在并发标记完成之后就开始，而是有一定的规则的，比如说如果这时候有可能一次性就清理掉大部分的老年区中的对象的话，那么就可以触发这个

所以在并发标记和混合撤离暂停之间，很可能会有一次针对年轻代的撤离暂停

需要被加入到回收集合的老年代对象的准确数量，以及它们被添加的准确顺序，也都是根据选好的规则来定的，这些规则正是**软实时（_soft real-time_）**机制为程序定制的目标，比如活跃度、并发标记过程中判定为有效 GC 的地方还有一些 JVM 的配置指标。所以这个过程和针对年轻代的撤离暂停过程没什么区别，只是它还包括老年代

**记忆集合（Remembered set）**是允许来自不同堆区域的各自的回收结果，比如说：当回收集合中的对象有来自 A、B、C 三个区域的，于是我们必须知道这些对象是否有引用到 D 和 E 区域中的对象，并以此来判断它们的活跃度

但如果遍历整个堆区域的话，会比较麻烦，也会毁掉我们设置回收集合的意义，于是 JVM 采用了一个方法，它和之前说过的**卡区域（card-table）**有点类似，所以在 G1 里面和它对应的就是**记忆集合（Remembered set）**

和下图展示的一样：每个区域都有一个列出**指向这个区域的引用**的列表作为记忆集合在旁边，这些引用会被认为是可选的**GC Root**，需要注意的是，在并发标记阶段被视为垃圾的老年区对象不会被列入这个记忆集合中，即使有外部引用指向它们，因为在这样的情况下，这些外部引用也已经被标记为垃圾了

![Mixed Evacuation Pause: beginning](https://plumbr.io/app/uploads/2016/01/g1-03.png)

接下来发生的事情就比较简单了：GCor 们决定哪些对象是存活的，哪些对象是垃圾

![Mixed Evacuation Pause: determining live objects](https://plumbr.io/app/uploads/2016/01/g1-04.png)

最后，存活下来的对象会被移动到 survivor 区域，清空出来的新区域又会重新投入一些对象进去

![g1-05-v2](https://plumbr.io/app/uploads/2016/01/g1-05-v2.png)

为了维护一个记忆集合，**后写屏障（post-write barrier）**会在一个数据被写入的时候出现。如果一个跨区域引用关系出现了，有关系的引用之间会被记录在各自的记忆集合中。为了减少这个写屏障的开销，放置记录在记忆集合中的这个过程是异步的，并且还有其他的优化功能

但归结起来就是写屏障会在写数据的时候往本地缓存中放置一个**脏卡（dirty card）**，脏卡的概念可以结合之前说的，然后特定的 GC 线程会找到这个卡然后将之记录在相关的记忆集合中

#### Summary

我们应该给出一个充分又基本的认识给 G1，虽然还有很多细节没有提到过比如对[大量堆积的对象](https://plumbr.io/handbook/gc-tuning-in-practice#humongous-allocations)的处理，但是总和所有东西而言，G1 是**HotSpot**里非常有技术含量的并且充分为生产环境而准备的收集器，在这之中，还是归功于 HotSpot 工程师们对它不留面子地进行无情优化，为了让新版本的 Java 不至于一丶东西都拿不出手

看了这么多下来我们发现，G1 解决了 CMS 的大部分问题，从暂停可预测性开始到堆内存的碎片，它让用户不再受 CPU 组合的限制，虽然它对一些特定操作的延迟非常敏感，但这并不妨碍它称为 HotSpot 用户最好的选择，尤其是更新版本的 Java 用户

然而这些针对延迟而进行的优化还是需要相应代价的，G1 的写屏障对吞吐量开销来说是一个大头，它还会增加更多的后台线程，所以如果程序主要是做吞吐量工作的或者 100%吃满 CPU 性能的并且完全不关心延迟的话，还是选择 CMS 更好一点
