---
title: CLH Lock Queue
tags:
  - algorithm
  - clh-lock-queue
date: 2018-12-30 16:35:00
---

### Introduction

在学习 Java 并发中的同步器源码的时候，注释中有提到过 AQS 的 Node 结构是参考 CLH 的一种变体：

> The wait queue is a variant of a "CLH" (Craig, Landin, and Hagersten) lock queue.
>
> CLH locks are normally used for spinlocks. We instead use them for blocking synchronizers, but use the same basic tactic of holding some of the control information about a thread in the predecessor of its node. A "status" field in each node keeps track of whether a thread should block.
>
> A node is signalled when its predecessor releases. Each node of the queue otherwise serves as a specific-notification-style monitor holding a single waiting thread. The status field does NOT control whether threads are granted locks etc though.
>
> A thread may try to acquire if it is first in the queue. But being first does not guarantee success; it only gives the right to contend. So the currently released contender thread may need to rewait.
>
> **To enqueue into a CLH lock, you atomically splice it in as new tail.**
>
> **To dequeue, you just set the head field.**
>
>  <pre class="nhi">
>       +------+  prev +-----+       +-----+
>  head |      | &lt;---- |     | &lt;---- |     |  tail
>       +------+       +-----+       +-----+
>  </pre>
>
> Insertion into a CLH queue requires only a single atomic operation on "tail", so there is a simple atomic point of demarcation from unqueued to queued. Similarly, dequeuing involves only updating the "head".
>
> However, it takes a bit more work for nodes to determine who their successors are, in part to deal with possible cancellation due to timeouts and interrupts.

CLH 锁即 Craig, Landin, and Hagersten (CLH) locks，CLH 锁是一个自旋锁，能确保无饥饿性，提供先来先服务的公平性

CLH 锁也是一种基于链表的可扩展、高性能、公平的自旋锁，申请线程只在本地变量上自旋，它不断轮询前驱的状态，如果发现前驱释放了锁就结束自旋

CLH Lock 是一种比较简单的自旋锁算法之一，因为锁的 CAS 操作涉及到了硬件的锁定(锁总线或者是锁内存)所以性能和 CPU 架构也密不可分

CLH Lock 是独占式锁的一种，并且是不可重入的锁

### Implement

```java
public class ClhSpinLock implements Lock{
    private final ThreadLocal<Node> prev;
    private final ThreadLocal<Node> node;
    private final AtomicReference<Node> tail = new AtomicReference<Node>(new Node());

    public ClhSpinLock() {
        this.node = new ThreadLocal<Node>() {
            protected Node initialValue() {
                return new Node();
            }
        };

        this.prev = new ThreadLocal<Node>() {
            protected Node initialValue() {
                return null;
            }
        };
    }

    /**
     * 1.初始状态 tail指向一个node(head)节点
     * +------+
     * | head | <---- tail
     * +------+
     *
     * 2.lock-thread加入等待队列: tail指向新的Node，同时Prev指向tail之前指向的节点
     * +----------+
     * | Thread-A |
     * | := Node  | <---- tail
     * | := Prev  | -----> +------+
     * +----------+        | head |
     *                     +------+
     *
     *             +----------+            +----------+
     *             | Thread-B |            | Thread-A |
     * tail ---->  | := Node  |     -->    | := Node  |
     *             | := Prev  | ----|      | := Prev  | ----->  +------+
     *             +----------+            +----------+         | head |
     *                                                          +------+
     * 3.寻找当前node的prev-node然后开始自旋
     *
     */
    public void lock() {
        final Node node = this.node.get();
        node.locked = true;
        Node pred = this.tail.getAndSet(node);
        this.prev.set(pred);
        // 自旋
        while (pred.locked);
    }

    public void unlock() {
        final Node node = this.node.get();
        node.locked = false;
        this.node.set(this.prev.get());
    }

    private static class Node {private volatile boolean locked;}
}
```

CLH 的算法定义

> the list, the application thread spin only on a local variable, it constantly polling the precursor state, if it is found that the pre release lock end spin.

基于 list，线程仅在一个局部变量上自旋，它不断轮询前一个节点状态，如果发现前一个节点释放锁结束.

所以在 java 中使用了 ThreadLocal 作为具体实现,AtomicReference 为了消除多个线程并发对 tail 引用 Node 的影响，核心方法 lock()中分为 3 个步骤去实现

1. 初始状态 tail 指向一个 node(head)节点

   ```
   private final AtomicReference<Node> tail = new AtomicReference<Node>(new Node());
   ```

2. thread 加入等待队列: tail 指向新的 Node，同时 Prev 指向 tail 之前指向的节点，在 java 代码中使用了 getAndSet 即 CAS 操作使用

   ```
   Node pred = this.tail.getAndSet(node);
   this.prev.set(pred);
   ```

3. 寻找当前线程对应的 node 的前驱 node 然后开始自旋前驱 node 的 status 判断是否可以获取 lock

   ```
   while (pred.locked);
   ```

同理 unlock()方法，获取当前线程的 node，设置 lock status，将当前 node 指向前驱 node(这样操作 tail 指向的就是前驱 node 等同于出队操作).至此 CLH Lock 的过程就结束了

---

更多的关于简单的自旋锁或者 MCS 锁可以参考：https://coderbee.net/index.php/concurrent/20131115/577

本文整理自：

1. https://segmentfault.com/a/1190000007094429
2. https://blog.csdn.net/bingjing12345/article/details/17789613
3. https://www.programering.com/a/MjM5gTNwATE.html
