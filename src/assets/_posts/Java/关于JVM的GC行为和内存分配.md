---
title: 关于JVM的GC行为和内存分配
categories:
  - java
  - jvm
  - gc
comments: true
date: 2018-11-17 15:35:00
tags:
  - jvm
  - generation-type
  - gc
  - gc算法
  - root-point
  - saft-point
  - safe-area
series: JVM
---

### 对象分代和朝生夕灭

对象所在的内存区按照对象存活的时间长久会简单分为：新生代、老年代

**Garbage Collector**的行为和对象内存所在的区域有很大关系，所以在分析**Collector**之前，我们得先了解一下对象内存的分区

我们需要清楚的是，Java 中**98%**的对象都是**朝生夕灭**的，所以新生代区往往是 GC 要重点照顾的区域

这是书上提到的，也是我们容易想象得到的，书上 P92 页还提到**两种**GC 事件（实际上是三种）

按照 GC 位置的不同，我们先讲 GC 的事件分为：

- **Minor GC：**即发生在新生代的 GC，这部分的 GC 速度很快，但是在 GC 之前，会检查一下**空间分配担保**
- **Major GC/Full GC：**发生在老年代的 GC，一般至少伴随着一次 Minor GC，因为回收的是老年代，回收策略比较严谨，所以 Major GC 的速度会非常慢

> **空间分配担保**：
>
> 在**Minor GC**之前，虚拟机会检查老年代**最大可用连续空间**，是否能够容纳下新生代区的所有对象：
>
> - 若可以：则代表这次 GC 是安全的
> - 若不可：则需要检查是否设置了允许**担保失败**：
>   - 若允许：那么继续检查老年代**最大可用连续空间是否大于历次晋升到老年代对象的平均大小**
>     - 如果大于：则可以尝试进行一次**本次 Minor GC**，该次 GC 有**“风险”**
>     - 如果小于：则需要将本次 GC 改为**Major GC**
>   - 若不许：则需要将本次 GC 改为**Major GC**
>
> 为什么会有风险？因为这里统计**历次|平均**，如果某次**Minor GC**需要担保的空间远超过平均值，则会发生**担保失败**，如果担保失败，那么之后会进行一次**Major GC**

实际上，选择不同的**Collector**对内存的分配是有关联的，甚至可能根据情况的不同而变化，**Collector**相关的概念，后面有时间再说

本篇主要总结一下算法回收的基本思想，以及在《深入理解 Java 虚拟机中》提到了几条最普遍的内存分配规则

### 垃圾回收的基本算法思想

#### 1. Mark-Sweep

1. Mark：标记出所有要回收的对象
2. Sweep：回收标记过的对象

缺点：

- Mark 和 Sweep 的效率都不高
- Sweep 过后剩下的空间不连续，容易形成碎片空间，对大对象的内存分配不友好，有时候大对象可能因为找不到空间，再来一次 GC

![Java GC sweep](https://plumbr.io/app/uploads/2015/06/GC-sweep.png)

#### 2. Mark-Copy

为了提高效率，可以将空间切成两块：

- **Eden 区：**一块正常分配对象内存
- **Survivor 区：**当**Eden 区**内存满了的时候，就将还存活的对象复制到这里，然后再把**Eden 区**一次性清理掉，两块内存区身份互换，这样每次都是清理另一块的内存，然后按序分配到自己这里，不用考虑碎片

![Java GC Mark and Copy Collector](https://plumbr.io/app/uploads/2015/06/GC-mark-and-copy-in-Java.png)

这样的方法有牺牲一块空间的代价，最初的做法是对半分，但是因为对象的朝生夕死，所以存活的对象其实并不多，HotSpot 虚拟机的做法是：**将内存区分成 8：1：1 的 Eden：Survivor：Survivor 区，每次只使用 Eden 和其中一块 Survivor，当 GC 发生的时候，将 Eden 和使用的 Survivor 中存活的对象分配到另一个 Survivor 中，然后清理掉前面两个区域**

也就是说，实际上 HotSpot 可用的内存是分配内存的**90%**

#### 3. Mark-Compact

复制算法会牺牲一部分空间，并且**如果系统存在许多存活时间长的对象的时候，算法的效率会降低**，而且很明显的是老年代使用这种算法的效率很低

标记整理算法就是针对老年代的收集算法，它先将存活对象标记起来，然后将存活对象**向一边移动**，移动完后**从最后一个存活对象往后开始清理空间**

![Java GC mark sweep compacting](https://plumbr.io/app/uploads/2015/06/GC-mark-sweep-compact.png)

### 存活判断

GC 要工作的时候，它要如何判断对象是否已经死亡呢？通过什么来界定对象死亡呢？从技术层面来说，系统中没有任何一个地方要引用到这个对象，那么可以判定这个对象已经废弃了，这时候就具备了回收的条件了

问题是怎么判断对象是否废弃呢？常见有两种方法：引用计数、可达性分析

#### Reference Count

比较简单，对象自己管理一个 counter，当有地方引用对象的时候，counter+1，断开引用了就-1，当进行 GC 的时候，只要对象的 counter 不为 0，就不回收这个对象。

实际上，这个方法确实简单高效，很多主流应用都使用它去做引用计数，但是 Java 里面却不这么做，因为它只是半个解决方案，比如说，当 A 和 B 两个对象互相引用的时候，除此之外没有其他地方用到这两个对象，这就形成了一个引用闭环，counter 都是 1，是垃圾却无法回收。

#### Reachability Analysis

主流的语言都是使用 RA 来判断对象存活的，甚至古老的 Lisp 也是。算法的基本思想是预置固定的**“GC Root”对象**作为起点，以树状逻辑开始从 root 向下索引，结点关系就是引用关系，索引到的对象就说明该对象至少还有一条 Reference Chain 可以达到 GC Root，则说明这个对象仍被系统使用

没有 Reference Chain 可达的对象，则基本可以宣告作废了

![](../../img/20181114235352.png)

如图，灰色 chain 已经没有 GC Root 可达了，所以这些对象会在下次 GC 的时候被考虑回收

常见的 GC Root 有：

- System class

  A class that was loaded by the bootstrap loader, or the system class loader. For example, this category includes all classes in the rt.jar file (part of the Java™ runtime environment), such as those in the java.util.\* package.

- JNI local

  A local variable in native code, for example user-defined JNI code or JVM internal code.

- JNI global

  A global variable in native code, for example user-defined JNI code or JVM internal code.

- Thread block

  An object that was referenced from an active thread block.

- Thread

  A running thread.

- Busy monitor

  Everything that called the wait() or notify() methods, or that is synchronized, for example by calling the synchronized(Object)method or by entering a synchronized method. If the method was static, the root is a class, otherwise it is an object.

- Java local

  A local variable. For example, input parameters, or locally created objects of methods that are still in the stack of a thread.

- Native stack

  Input or output parameters in native code, for example user-defined JNI code or JVM internal code. Many methods have native parts, and the objects that are handled as method parameters become garbage collection roots. For example, parameters used for file, network, I/O, or reflection operations.

- etc...

[reference](https://www.ibm.com/support/knowledgecenter/en/SS3KLZ/com.ibm.java.diagnostics.memory.analyzer.doc/gcroots.html)

### HotSpot 算法实现

#### 枚举根节点

枚举**GC Roots**的时候，作为**GC Roots**的对象会有很多，连同这些**Roots**的引用链全部扫描一遍的话，会耗费大量的时间

而且 GC Roots 的扫描意味着你需要**“停顿”**你的系统，这里的停顿是真的停顿（Sun 将这件事情称之为“Stop the world”），为了保持引用的一致性，你不能在进行引用链检查的时候还不停的有引用关系在变更，这样做会让为你工作的 GCor 们很尴尬

虽然说无论如何都需要进行**“停顿”**，但是我们并不需要对每一个引用位置都进行检查，因为目前主流虚拟机都有**“准确式 GC”**的机制，所以虚拟机是有办法直接知道哪些地方存放着对象引用的

> **准确式 GC：**
>
> Exact VM 时代出现了 Exact Memory Management，它可以知道内存中某个位置的数据**具体是什么类型**

在 HotSpot 的实现中，有一个`OopMaps`的数据结构在完成这个工作，在类加载完成的时候，HotSpot 就把对象内**什么偏移量上是什么数据类型**计算出来，在 JIT 的过程中，HotSpot 也会在**特定的**位置记录下栈和寄存器中哪些位置是引用

> **JIT：Just In Time Compiler**，一般翻译为即时编译器，这是是针对解释型语言而言的，而且并非虚拟机必须，是一种优化手段，Java 的商用虚拟机 HotSpot 就有这种技术手段，Java 虚拟机标准对**JIT**的存在没有作出任何规范，所以这是虚拟机实现的自定义优化技术。
>
> HotSpot 虚拟机的执行引擎在执行 Java 代码是可以采用【解释执行】和【编译执行】两种方式的，如果采用的是编译执行方式，那么就会使用到**JIT**，而解释执行就不会使用到**JIT**，所以，早期说 Java 是解释型语言，是没有任何问题的，而在拥有**JIT**的 Java 虚拟机环境下，说 Java 是解释型语言严格意义上已经不正确了。
>
> HotSpot 中的编译器是**javac**，他的工作是将源代码编译成字节码，这部分工作是完全独立的，完全不需要运行时参与，所以 Java 程序的编译是半独立的实现。有了字节码，就有解释器来进行解释执行，这是早期虚拟机的工作流程，后来，虚拟机会将执行频率高的方法或语句块通过**JIT**编译成本地机器码，提高了代码执行的效率，至此你已经了解了**JIT**在 Java 虚拟机中所处的地位和工作的主要内容。
>
> ---
>
> https://blog.csdn.net/tales522/article/details/80874325

#### 安全点

因为`OopMaps`，HotSpot 可以快速且准确地完成 GC Roots 枚举，但是如果每一条指令都记录为`OopMaps`的话，这样会需要大量的额外空间

前面提到过，是在**特定的位置**记录信息，这个位置称之为安全点（Safepoint），因为程序并不是说停就停的，只有达到安全的地方才能够暂停，Safepoint 不能太少，以至于让 GC 等待太久，也不能太多，然程序停的次数太多而增大运行时负荷

所以 Safepoint 一般选在**“能够长时间运行的指令”**，一般的执行指令都非常快，所以具备这个特点指令大多数都为方法调用、循环跳转、异常跳转等等

我们还要再提一个事情就是——各线程到达最近安全点这件事如何实现，有两种做法：

- 停止所有线程，没有到达安全点的线程就恢复它，让它跑到安全点再停下来
- 为安全点加一个标志（中断），线程执行的时候会轮询当前指令是否有标志，如果有就停下来

#### 安全区

虽然有了安全点，可以保证大部分线程能够安全停下来等待 GC 了，但是有的线程可不是说停就停的，如果线程没有分配到 CPU，比如在 Sleep 或者 Blocked 状态的话，线程是无法响应中断然后“走”到安全的地方的，JVM 在做 GC 的时候也不太可能会等待你重新被分配到 CPU 的

针对这样的情况，会设置一个安全区（Safe Region）：在安全区内，引用关系不会发生变化，在安全区内任意地方开始 GC 都是安全的

当线程进入安全区的时候，会标识自己**已经进入安全区**，在 GC 过程中，虚拟机先不处理这些自我标识的线程，等到其他线程处理完之后，再来处理这些进入安全区的线程

处理过程：让线程要离开安全区的时候，会检查**系统是否完成了 GC Roots 的枚举或者已经完成了 GC**，如果没有，则需要等待前面的操作完成了，线程才能安全离开

### 基本内存分配规则

1. **对象优先分配在新生代**：大多数情况下，对象都会在新生代 Eden 区分配，**当虚拟机没有足够的内存分配 Eden 空间的时候，虚拟机将发起一次 Minor GC**
2. **大对象直接进入老年代**：比如长字符串和长数组
3. **长期存活的对象进入老年代**：虚拟机会给对象定义一个 Age 计数器，对象在 Eden 区熬过一次**Minor GC**的话，age+1，并且进入 Survivor 区，每在 Survivor 熬过一次**Minor GC**，age 就+1 直到达到一定程度（默认 15），就会进入老年代
4. **同年龄对象若占空间超过一半直接进入老年代**：不用等到阈值年龄

更详细的补充见[再谈对象分代和 GC 事件](./wlvrl9.html?hash=93aa08bf)
