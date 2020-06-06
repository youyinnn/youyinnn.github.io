---
title: Java并发编程第七坎-2
categories:
  - java
  - concurrency
  - 《艺术》与《技术》
comments: true
tags:
  - java
  - thread
  - AQS
date: 2018-12-30 12:58:48
series: 并发
---



### Introduction

上节我们介绍了Java并发编程的一个新的阶段——Java并发包中的`Lock`接口以及`AbstractQueuedSynchronizer`的配合使用

并且尝试实现了一个简单的独占锁Mutex，借此我们了解到，并发编程还能如此灵活与优雅

本节还是属于第七坎，因为第七坎应该是关于整个Java并发包的基础内容，所以会分成多节进行

在上节的最后我们运用`Lock`和`AbstractQueuedSynchronizer`去简单地实现了一个独占锁，本节我们紧接着要分析一下`AbstractQueuedSynchronizer`的部分方法的实现原理，了解同步器为什么能如此强大

本篇参考书本上，试图分析**独占式同步状态的获取和释放/共享式同步状态的获取和释放**的源码

观察源码之前我们需要回顾一下：

>  对于同步器中的方法，我们需要实现的是：**对同步状态的“尝试”获取/释放**的一类方法
>
> - try方法只返回是否获取同步状态成功（独占式）/获取到了1个以上的同步状态（共享式）
> - 这类方法被模板方法第一次尝试调用：
>     - 若成功，则线程获取到锁；
>     - 若失败，则模板方法继续管理同步队列
> - 在线程成为结点加入到同步队列的过程中，结点在自旋的时候也在不断地try获取同步状态

### SynchronizedQueue

同步器依赖内部实现的一个同步队列来完成**同步状态的管理**，当前线程获取同步状态失败的时候，同步器会将当前线程以及等待状态等信息构造成一个结点（Node）并将其加入到同步队列的尾部，**同时阻塞当前线程**

同步队列中的结点用来保存同步状态获取失败的线程引用、等待状态以及前驱和后继结点，我们来看一下Node结构，值得一提的是，Node的结构是CLH队列锁的一个变体，CLH队列锁是一种自旋锁，有兴趣可以参考[这里][clh]来学习一下，推荐学习Node之前看一下CLH队列锁

```java
static final class Node {
    /** Marker to indicate a node is waiting in shared mode */
    static final Node SHARED = new Node();
    /** Marker to indicate a node is waiting in exclusive mode */
    static final Node EXCLUSIVE = null;
    
    // 在同步队列中等待的线程如果超时或者被中断了，则会转变为此状态，且以后不会再发生状态变化
    static final int CANCELLED =  1;
    // 后继结点如果处于等待（park）状态，而当前结点的线程如果释放了同步状态或者被取消了的话，就会唤醒(unpark)后继结点
    static final int SIGNAL    = -1;
    // 结点在等待队列中，结点等带在Condition上，如果其他线程调用了Condition的signal()方法，则该结点会从等待队列中转移到同步队列中，加入到同步状态的获取中
    static final int CONDITION = -2;
    // 表示下一次共享式同步状态的获取会被无条件地传播下去
    static final int PROPAGATE = -3;
    volatile int waitStatus;

    // 前驱节点
    volatile Node prev;
    // 后继结点
    volatile Node next;
    // 要获取同步状态的线程
    volatile Thread thread;
    // 等待队列中的后继结点
    Node nextWaiter;

    final boolean isShared() {
        return nextWaiter == SHARED;
    }
    final Node predecessor() throws NullPointerException {
        Node p = prev;
        if (p == null)
            throw new NullPointerException();
        else
            return p;
    }
    Node() {    // Used to establish initial head or SHARED marker
    }
    Node(Thread thread, Node mode) {     // Used by addWaiter
        this.nextWaiter = mode;
        this.thread = thread;
    }
    Node(Thread thread, int waitStatus) { // Used by Condition
        this.waitStatus = waitStatus;
        this.thread = thread;
    }
}
```

结点是构成**同步队列**和**等待队列**的基础，等待队列的概念会在后面几节介绍，它和Condition对象有关；

我们看到最前面两个变量都是Node类型的，分别代表结点的共享式和独占式两种模式，然后就是结点的状态以及前驱后继结点的引用，关于`nextWaiter`的意义我们后面说到等待队列的时候再细说

同步器拥有头节点head和尾结点tail，没有成功获取到同步状态的线程会称为结点加入到队列的尾部，其结构大概是：

<pre class="nhi">
    	 AQS        setHead(Node update)
    -------------    /
    |           |   /     Node         Node         Node         Node
    |  { head }-|------&gt;{ prev }&lt;----{-prev }&lt;----{-prev }&lt;----{-prev }
    |           |       { next-}----&gt;{ next-}----&gt;{ next-}----&gt;{ next }
    |  { tail }-|-------------------------------------------------^
    |           |        \
    -------------      compareAndSetTail(Node expect, Node update)
</pre>


把**当前结点（刚获取同步状态失败的线程构成的结点）**到尾部的过程必须用CAS的方式去做，**保证每个并发加入的结点最终能够串行成队列**，它需要传入当前线程“认为”的尾结点和当前结点

同步队列也遵从FIFO，首节点是获取同步状态成功的结点，首节点线程在释放同步状态的时候，会唤醒后继结点，而后继结点会在**获取同步状态成功的那一刻**将自己设置为首节点，因为设置首节点的前提是**获取到同步状态**，<u>由于只有一个线程获取到同步状态</u>，所以设置首节点的方法并不需要使用CAS来保证，它只需要将首节点设置成原首节点的后继，并且断开原首节点的next引用即可

> 这里就有一个疑问，如果是共享式锁的情况下，同步状态回被多个线程获取到，那又该怎么办呢？
> 
> 疑问解决：看完后面的shared节点的获取过程之后，我们就能知道，在同步状态足够的情况下，unpark是会传递下去的

#### Exclusive acquire & release

##### acquire

通过调用同步器的`acquire(int arg)`方法可以获取到同步状态

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

在获取同步状态的时候，首先调用`tryAcquire(int arg)`方法，这个方法是我们需要实现的模板方法之一，我们需要保证该方法能够线程安全地获取同步状态，方法尝试获取一次同步状态，如果获取成功，则`acquire(int arg)`方法结束；如果获取失败，首先调用`addWaiter`方法将获取同步状态失败的线程构建为Node结点（Node.EXCLUSIVE），然后加入到队尾，最后调用`acquireQueued`方法，让这个结点以“死循环”的方式不断获取同步状态**（实际上也就循环了2次，之后就会被park掉）**，若是获取失败，则阻塞结点持有的线程，等到结点被前驱结点唤醒的时候（一般是前驱结点已经获取到同步状态并且打算释放了的时候），或者阻塞线程被中断了的时候

##### addWaiter

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```

如注释所说，Node.EXCLUSIVE是独占式结点，Node.SHARED是共享式结点，我其实很好奇为什么要用Node对象来表示结点的mode，也许在后面的共享式结点中有什么出彩的操作吧，后面再继续研究这个事

注释里也说了，line：10-17行只是一个`enq`的快速版本，如果是第一个要addWaiter的结点，这时候AQS里面的tail是为null的；如果AQS里已经有tail了，那么可以在这段代码中尝试快速设置tail（如注释中所说）

##### enq

```java
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) { // Must initialize
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

这part其实是很欢乐的，死循环里的逻辑：如果tail为null，证明这是第一个获取同步状态失败的线程的结点，所以call`compareAndSetHead`，刚开始肯定是走的这里，将一个新的结点设置为AQS的head

> 这个方法实际上是调用`sun.misc.Unsafe`类的`compareAndSwapObject`方法，更底层的就没必要深入了，作用是以CAS的方式设置AQS的head字段，同理`compareAndSetTail`也一样
>
> `compareAndSwapXXX`系列的方法都是一样的参数列表，比如SwapInt就是`(Object o, long offset, int expected, int update)`，Object o就是要设置字段的对象，offset值同样可以通过`Unsafe`类的`objectFieldOffset`方法获取，比如在AQS中就是：
>
> ```java
> private static final Unsafe unsafe = Unsafe.getUnsafe();
> private static final long headOffset;
> // ...
> static {
>     try {
>         headOffset = unsafe.objectFieldOffset
>             (AbstractQueuedSynchronizer.class.getDeclaredField("head"));
> 		// ...
>     } catch (Exception ex) { throw new Error(ex); }
> }
> ```
>
> 然后`compareAndSetHead`方法里面：
>
> ```java
> private final boolean compareAndSetHead(Node update) {
>     return unsafe.compareAndSwapObject(this, headOffset, null, update);
> }
> ```
>
> 值得一提的是，unsafe对象并不能直接使用，它是单例模式，只有有限的几个类加载器才能够获取它的单例

anyway，在设置好head了之后，又把tail设置为head，也就是说这个时候tail和head都是这个`new Node()`，这还没结束，还得再循环一遍，这一遍来，就是走else的时候了，还记得从`enq`进来的node嘛？这里用到了！我们称它为入队结点

``` java
// ...
// t = tail
else {
    node.prev = t;
    if (compareAndSetTail(t, node)) {
        t.next = node;
        return t;
    }
}
```

之前的`new Node()`作为入队结点的前驱（prev），然后`compareAndSetTail`，将入队结点设置为AQS的tail字段，然后t的后继指向入队结点，然后返回t，这时候AQS的结构如：

<pre class="nhi">
         AQS       
    -------------   
    |           |      new Node()     入队结点
    |  { head }-|------>{ prev }&lt;----{-prev }
    |           |       { next-}----&gt;{ next }
    |  { tail }-|------------------------^
    |           |        
    ------------- 
</pre>

这时候的`new Node()`是没有什么意义的，然后入队结点还系着获取同步状态失败的线程，后面如果再有入队的结点的话，就直接走else，尝试不断地将新入队结点设置为tail，直到成功的时候才返回，虽然`enq`的返回值没有被用到

##### aquireQueued

结点进入同步队列之后，就进入了一个自旋的过程并阻塞结点持有的线程，每个结点会自我审查，当条件满足，获取到同步状态的时候，就会从自旋中退出

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

接上面的内容，当我们从`addWaiter`的`enq`方法返回之后，`addWaiter`也就结束了，返回入队结点，然后入队结点进入到`aquireQueued`方法，其中通过死循环来自审：

- 获取**当前入队结点**的前驱，如果前驱是head的话，那么**当前入队结点**就不断地尝试获取同步状态（line:15 `tryAcquire`）

    - 如果尝试成功，则将**当前入队结点**设置为头节点，并且断开引用便于GC

        > 这里也指明了，头节点在不同的时候具有不同的涵义：头节点最开始或许是一个无用的`new Node()`，但是当下一个入队结点成获取同步状态了之后，这个入队结点会称为新的head

- 然后如果前驱节点并不是head，即使是也没有获取到同步状态的话，就到了`shouldParkAfterFailedAcquire`方法
    ```java
    /**
     * Checks and updates status for a node that failed to acquire.
     * Returns true if thread should block. This is the main signal
     * control in all acquire loops.  Requires that pred == node.prev.
     *
     * @param pred node's predecessor holding status
     * @param node the node
     * @return {@code true} if thread should block
     */
    private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
        int ws = pred.waitStatus;
        if (ws == Node.SIGNAL)
            /*
             * This node has already set status asking a release
             * to signal it, so it can safely park.
             */
            return true;
        if (ws > 0) {
            /*
             * Predecessor was cancelled. Skip over predecessors and
             * indicate retry.
             */
            do {
                node.prev = pred = pred.prev;
            } while (pred.waitStatus > 0);
            pred.next = node;
        } else {
            /*
             * waitStatus must be 0 or PROPAGATE.  Indicate that we
             * need a signal, but don't park yet.  Caller will need to
             * retry to make sure it cannot acquire before parking.
             */
            compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
        }
        return false;
    }
    ```

    - 如果已经设置过状态，并且状态是处于SIGNAL中的话，则返回true

    - 如果最开始的结构是`new Node()-->当前入队结点`的话，入队结点的前驱`new Node()`的waitStatus是0，这时候走line: 33，然后返回false接着继续死循环

        > 但是这里比较关键，第二次再到这里的时候，pred的waitStatus已经是SIGNAL了，所以这趟出去之后会返回true，线程会park掉，除非被中断或者被前驱unpark

    - 如果前驱的状态大于零，意味着这个前驱已经被cancel掉了，所以在line:23-26的时候做出的处理是断开这些前驱的引用，一直到找到一个没有被cancel了的前驱为止，然后返回false；

- 如果`shouldParkAfterFailedAcquire`返回true，则意味着**当前入队结点**的线程应该被**“park（停置）”**掉，所以进入`parkAndCheckInterrupt`方法，这个方法暂停线程并且返回线程的中断标志；这个中断标志的返回关系到最开始的`acquireQueued`方法是否会返回true，并且调用`selfInterrupted`方法

简单来说，`aquireQueued`方法让入队的线程进入一个自旋过程，我们可以展开一下它的结构与过程：

<pre class="nhi">
                                     node.prev=head && tryAcquire(arg)
    	 AQS       might get sync state             /
    -------------         /      ┌------v       ┌------v       ┌------v
    |           |       Node     |     Node     |     Node     |   Node
    |  { head }-|----&gt;{ prev }&lt;--|---{-prev }&lt;--|---{-prev }&lt;--|---{-prev }
    |           |     { next-}---|--&gt;{ next-}---|--&gt;{ next-}---|--&gt;{ next }
    |  { tail }-|----------------|------|-------|------|-------|------^
    |           |                └------┘       └------┘       └------┘
    -------------
注意：并不是所有结点都在无时无刻地自旋当中，结点在第二次for循环中，就都是处于park状态，
     因为一次for循环中的shouldParkAfterFailedAcquire就已经把前驱设置为SIGNAL了，
     直到第二个结点称为新的头节点，并且unpark原来的第三个结点，以此...
</pre>



如结构里展示的一样，除了获取到同步状态的头节点之外，后面的结点都在排队park中，这个结论我已经debug过了，确实是这样的，**这样看来，排队中的各个结点线程它们之间获取锁的顺序，是“公平的”**，

最后，给出独占锁`acquire`方法的流程图：

``` flow
st=>start: start
getsycn=>condition: 获取同步状态
gennode=>operation: 生成入队结点
addwaiter=>operation: 加入同步队列尾部(CAS)
preishead=>condition: 前驱是头节点
getsycn2=>condition: 获取同步状态
twait=>operation: 线程进入等待状态
behead=>operation: 当前结点设置为头节点
exit=>operation: 退出
e=>end: end

st->getsycn
getsycn(yes)->exit
getsycn(no)->gennode
gennode->addwaiter
addwaiter->preishead
preishead(yes)->getsycn2
preishead(no)->twait
getsycn2(no)->twait
twait(right)->preishead
getsycn2(yes)->behead
behead(left)->exit(right)
exit->e
```

*流程图可以知道里的线条还需要注意一个，‘线程进入等待状态’到‘前驱是头节点’这里，意义是：线程被中断或者前驱结点被释放*

##### release

```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

方法执行的时候，会唤醒头节点的后继结点，然后在自旋中的后继结点会有机会获取到同步状态，然后进行上面的流程图；

#### Shared acquire & release

共享式的源码阅读真是**一道大坎**，网上的要么没说到重点，要么一通胡说，而且网上的版本大多都是1.7的，虽然相较1.8，也仅仅在`setHeadAndPropagate`中某处多了2个condition，但就是这个方法都没人能搞清楚到底**“propagate”**的含义是什么，甚至我觉得1.8多的那2个condition是用来迫不得已去修1.7时留下来的bug才加上去的，*Daug Lea*前辈的思想确实精巧高深

##### tryAcquireShared

分析`acquireShared`之前，我们首先分析一下`tryAcquireShared`方法，这个方法的返回值对前者影响非常大，关键是注释：

这是第一段：

```
* Attempts to acquire in shared mode. This method should query if
* the state of the object permits it to be acquired in the shared
* mode, and if so to acquire it.
*
* This method is always invoked by the thread performing
* acquire.
* If this method reports failure, the acquire method
* may queue the thread, if it is not already queued, until it is
* signalled by a release from some other thread.
```

> 这个方法尝试在共享模式下获取同步状态，方法应该在同步器支持共享模式的情况下才能被使用
>
> 方法应该在线程请求获取同步状态的时候（即call`acquire`）被调用
>
> 如果方法返回错误，那么`acquire`方法会让线程进入同步队列

第二段是关于参数和返回值

```
* @param arg the acquire argument. This value is always the one
*        passed to an acquire method, or is the value saved on entry
*        to a condition wait.  The value is otherwise uninterpreted
*        and can represent anything you like.
* @return a negative value on failure; zero if acquisition in shared
*         mode succeeded but no subsequent shared-mode acquire can
*         succeed; and a positive value if acquisition in shared
*         mode succeeded and subsequent shared-mode acquires might
*         also succeed, in which case a subsequent waiting thread
*         must check availability. (Support for three different
*         return values enables this method to be used in contexts
*         where acquires only sometimes act exclusively.)  Upon
*         success, this object has been acquired.
```

> **参数arg：**这个值也许是1，或者是保存在condition（某个地方- -）的一个值，或者你可以设置为任意你喜欢的值
>
> **返回值：**
>
> - 如果获取失败了的话，就返回复数
> - 在共享模式下获取成功，但是后继的共享模式获取同步状态没有成功（很迷吧？），返回0
> - 共享模式下获取成功，后期的共享模式也获取成功，返回正数
>
> 这里说支持3种情况，但是老爷子自己在写的时候也没太多想，实际上运用当作一般只支持负数代表不成功，非负数代表成功，所以和boolean没什么区别- -

##### acquireShared

```java
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)
        doAcquireShared(arg);
}

private void doAcquireShared(int arg) {
    final Node node = addWaiter(Node.SHARED);
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head) {
                int r = tryAcquireShared(arg);
                if (r >= 0) {	// 这里就是，非负数就是代表成功了
                    setHeadAndPropagate(node, r);
                    p.next = null; // help GC
                    if (interrupted)
                        selfInterrupt();
                    failed = false;
                    return;
                }
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

首先`addWaiter`，添加的是SHARED模式的结点，这种结点的mode对象是一个`new Node`

一直到line: 25，进入自旋阶段：

1. 如果前驱是head，则try一次同步状态：

    1. 如果try到了`arg`个同步状态，那么就设置这个刚刚获取同步状态成功的结点为，head并且**“Propagate”**：

        ```java
        private void setHeadAndPropagate(Node node, int propagate) {
            Node h = head; // Record old head for check below
            setHead(node);
            /*
             * Try to signal next queued node if:
             *   Propagation was indicated by caller,
             *     or was recorded (as h.waitStatus either before
             *     or after setHead) by a previous operation
             *     (note: this uses sign-check of waitStatus because
             *      PROPAGATE status may transition to SIGNAL.)
             * and
             *   The next node is waiting in shared mode,
             *     or we don't know, because it appears null
             *
             * The conservatism in both of these checks may cause
             * unnecessary wake-ups, but only when there are multiple
             * racing acquires/releases, so most need signals now or soon
             * anyway.
             */
            if (propagate > 0 || h == null || h.waitStatus < 0 ||
                (h = head) == null || h.waitStatus < 0) {
                Node s = node.next;
                if (s == null || s.isShared())
                    doReleaseShared();
            }
        }
        ```

        这段其实也很迷，首先用`h`记录旧头，然后设置新头，如果说

        - 上一步的`tryAcquireShared`拿到了1以上的同步状态的话
        - 旧头是null的话
        - 旧头的`waitStatus`是SIGNAL/CONDITION/PROPAGATE的话
        - `(h = head) == null`这段更不知所云，变成新头了之后，新头还能为null嘛？
        - 新头`waitStatus`是SIGNAL/CONDITION/PROPAGATE的话

        后面2个条件是1.8新加的，1.7没有这样的，但是真的不是很懂为什么会判断后面2个条件，也许是为了处理并发，如果是这样的话，那我越发觉得shared这段的代码写的很不严谨了，应该有直接的方法去处理shared锁的

        anyway，总之如果说满足上面的条件的话，代表着这个时候应该从队中`doReleaseShared`结点了，

        ```java
        /**
         * Release action for shared mode -- signals successor and ensures
         * propagation. (Note: For exclusive mode, release just amounts
         * to calling unparkSuccessor of head if it needs signal.)
         */
        private void doReleaseShared() {
            /*
             * Ensure that a release propagates, even if there are other
             * in-progress acquires/releases.  This proceeds in the usual
             * way of trying to unparkSuccessor of head if it needs
             * signal. But if it does not, status is set to PROPAGATE to
             * ensure that upon release, propagation continues.
             * Additionally, we must loop in case a new node is added
             * while we are doing this. Also, unlike other uses of
             * unparkSuccessor, we need to know if CAS to reset status
             * fails, if so rechecking.
             */
            for (;;) {
                Node h = head;
                if (h != null && h != tail) {
                    int ws = h.waitStatus;
                    if (ws == Node.SIGNAL) {
                        if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                            continue;            // loop to recheck cases
                        unparkSuccessor(h);
                    }
                    else if (ws == 0 &&
                             !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                        continue;                // loop on failed CAS
                }
                if (h == head)                   // loop if head changed
                    break;
            }
        }
        ```

        这个`doReleaseShared`的含义是：头结点的后继结点或许已经park了，这时候我们需要unpark它，让这个后继**重新开始死循环以尝试获取同步状态**因，为**在park状态的无法回到自旋中尝试继续获取同步状态的！！！**这些结点也许是SHARED模式的，但是它们必须被unpark之后，重新开始自旋之后，才能够尝试获取新的同步状态！

        **`acquireShared/setHeadAndPropagate/doReleaseShared`这三个方法加一起这才是Propagate的含义**

        > 同一时间有3个同步状态被释放，队列中有A、B、C三个共享结点被park掉，A的前驱最后释放的时候，会unparkA结点，当A获取到了同步状态的时候，A经过`acquireShared`，进入`setHeadAndPropagate`，将A设置为head，然后验证B是shared模式了之后，进入`doReleaseShared`，这时候在A结点线程中通过死循环的方式最终unparkB，A返回到线程继续作业；
        >
        > 于是B又尝试获取同步状态，然后将自己设置为头，然后验证C是shared了之后，然后死循环unparkC，以此类推....
        >
        > 这也是和独占不一样的地方，独占每次只需要unpark头结点的后继就行了，共享是尽可能地从队伍开始，往后unpark更多的SHARED结点！

        此外，这个方法还有另外一层含义，这个下面马上说到

2. 如果不是head，则应该park当前线程，直到被前驱唤醒

##### releaseShared

```java
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {
        doReleaseShared();
        return true;
    }
    return false;
}
```

`doReleaseShared`在这里体现出的含义是：确保同步状态被**线程安全地释放（归还）**，可以看到，方法内部通过CAS加循环的方式做这个确保，因为释放操作会同时来自多个线程

### Conclusion

这篇应该是字数最多的blog了，分析了很很久时间，花费的精力也比较多，老爷子总是在高层次的地方设计逻辑，如果不多处一起看代码，估计很难理解逻辑设计的用意

特别是有的时候，即使是畅销书都不太会和你分析深一些的道理和结构逻辑，比如share部分就没太分析，网上也有许多同行尝试进行分析，但是也没讲出**Propagate**的真正含义

------
[clh]: ./vywf17.html
