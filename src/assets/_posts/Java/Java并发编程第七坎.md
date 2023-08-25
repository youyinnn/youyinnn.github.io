---
title: Java并发编程第七坎
categories:
  - java
  - concurrency
  - 《艺术》与《技术》
comments: true
tags:
  - java
  - thread
  - AQS
  - Lock-Api
date: 2018-12-25 22:22:48
series: 并发
---

### Introduction

> 事前吐槽：*Doug Lea*老爷子的注释可真难读，也许是我英语太菜鸡了- -（本来还挺自信的，现在哭着学英语）

接下来我们进入 Java 并发编程的一个崭新的阶段

前面我们对于锁的实现和同步的编程，都是基于`synchronized`关键字的实现，现在开始接触到的，是 Java 并发包中提供的锁相关的 API，首先可以了解到的是，我们可以通过 API 的方式去实现**“获取锁”**和**“释放锁”**，从而更灵活的去进行并发编程

至此，以后我们再谈起**“Java 中的锁”**，它可能指的是多个意义上的，讨论之前先要明确一个方向：

- `synchronized`/`volatile`关键字的使用
- 锁的几种**等级**和区别
- 锁的几种**类型**和使用场景
- **Lock API**的使用以及和`synchronized`的区别

### Lock 接口

在 Lock 之前，Java 是靠`synchronized`关键字去实现锁的，Java5 之后，并发包中新增了 Lock 接口

它提供了同步功能，需要使用者**显式**地去获取锁和释放锁：

```java
Lock lock = new ReentrantLock();
lock.lock();
try {}
finally { // 保证获取锁之后，最终能够被释放掉
    lock.unlock();
}
```

虽然不比关键字便捷，但是它的使用非常灵活，不一定要先获取锁才能够释放锁，拥有了更方便的可操作性、可中断性和**超时获取锁**等关键字不具备的特点

|        特性        |                                                        描述                                                        |
| :----------------: | :----------------------------------------------------------------------------------------------------------------: |
|    非阻塞获取锁    |                                      无论有没有获取成功，都会从获取动作返回；                                      |
| 能够被中断地获取锁 | 和`synchronized`不同，线程在获取锁的过程中能够响应中断，当获取到锁的线程被中断的时候，中断异常会抛出，同时释放锁； |
|      超时获取      |                                    在指定的时间内获取到锁，否则从获取动作返回；                                    |

上面这三个点都有一些值得玩味的地方，我们一一去解开，首先我们看第二点，我们先来验证一下之前使用`synchronized`的时候的一个细节：`synchronized`与中断

```java
public static void main(String[] args) throws InterruptedException {
    String lockA = "A";
    Thread t1 = new Thread(() -> {
        synchronized (lockA) {
            System.out.println("T1 get LockA");
            while (true) {
            }
        }
    });
    Thread t2= new Thread(() -> {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("T2 trying to get LockA");
        synchronized (lockA) {
            System.out.println("T2 get LockA");
        }
    });
    t1.start();
    t2.start();
    TimeUnit.SECONDS.sleep(3);
    while (t2.isAlive() && t1.isAlive()) {
        TimeUnit.MILLISECONDS.sleep(300);
        if (!t1.isInterrupted()) {t1.interrupt();}
        if (!t2.isInterrupted()) {t2.interrupt();}
        System.out.println("T1 Alive: " + t1.isAlive() + ", isInterrupted: " + t1.isInterrupted() + ", State: " + t1.getState());
        System.out.println("T2 Alive: " + t2.isAlive() + ", isInterrupted: " + t2.isInterrupted() + ", State: " + t2.getState());
    }
}
```

```java
T1 get LockA
T2 trying to get LockA
T1 Alive: true, isInterrupted: true, State: RUNNABLE
T2 Alive: true, isInterrupted: true, State: BLOCKED
T1 Alive: true, isInterrupted: true, State: RUNNABLE
T2 Alive: true, isInterrupted: true, State: BLOCKED
// ....
```

我们发现，在`synchronized`的过程中，T2 是等待获取锁被 BLOCKED 住的线程，这时候是无法响应中断的，**即使线程的已经打了中断标志！**而在 T1 中，是可以根据中断标志去响应中断的，或者能够短睡眠去响应中断异常；

也就是，在`synchronized`外面 BLOCKED 住的线程：**只能是阻塞；无法被中断；没有超时；**

而 Lock 就更为灵活

| 方法名称                                                                | 描述                                                                                                |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| void lock()                                                             | 等阻塞获取锁，获取到锁之后，从该方法返回；否则一直在该方法中等待（此时线程的状态是 WATING）         |
| void lockInterruptibly() `throws InterruptedException`                  | 可中断地获取锁，在锁的获取过程中，其它线程可以中断这个过程                                          |
| boolean tryLock()                                                       | 非阻塞式地获取锁，如果获取成功，则返回 true，获取失败，则返回 false                                 |
| boolean tryLock(long time, TimeUnit unit) `throws InterruptedException` | 超时获取：若在限定时间内获取到锁，则返回 true；若获取过程中被中断，则抛出异常；若超时，则返回 false |
| void unlock()                                                           | 释放锁                                                                                              |
| Condition newCondition()                                                | 获取等待通知组件，改组件和当前的锁绑定，当前线程只有获取到锁了，才能调用改组件的`wait()`方法        |

看了下上面的 API，我们对于 Lock 和`synchronized`的区别就清楚了

### 队列同步器

Lock 接口的实现依赖队列同步器 AbstractQueuedSynchronizer，它用来构建同步框架的基础

**原理：**它使用一个 int 成员变量来表示**同步状态（state）**，对锁的获取其实就是对该 state 的获取，对于同步状态的获取和改变，同步器提供了线程安全的方法；另外它还通过一个内置的 FIFO 的队列来完成资源获取线程的排队。

> **同步状态**的概念，如果学过操作系统的都知道，在 PV 问题中会有一个值来代表当前可以访问临界资源的资格，这里的同步状态大概也是这么个意思
>
> 基本上 state 如果是 0 就代表无法获取，如果大于 0 就代表能够获取一次，比如说如果现在 AQS 的 state 是 2，你还能 acquire2 次，每次 acquire(1)，因为是只有 1 个线程在 acquire 嘛，等到 state 不够了的时候，就开始排队了

同步器的使用主要是通过**继承**的方式，实现 Lock API 的时候，推荐同时在里面写一个静态内部类来实现同步器，同步器没有实现任何同步接口，仅是定义了若干同步状态的获取和释放方法来提供自定义组件去使用，并且同步器支持独占式和共享式的实现，所以它可以为多种不同的同步组件去服务（`ReentrantLock`、`ReentrantReadWriteLock`、`CountDownLatch`）

它和 Lock 的关系就像前后端的关系一样：

- Lock 是面向锁使用者的，它定义了使用者所需要的锁的方法，隐藏了实现细节
- 同步器是面向锁实现者的，它简化了锁的实现，屏蔽了同步状态管理、线程排队、等待和唤醒等底层操作

**锁和同步器很好地隔离了使用者和实现者锁关注的领域，又增强了锁的可操作性和降低了锁的实现难度**

#### 接口与示例

同步器的设计是基于模板方法模式的，锁的实现者需要继承同步器并重写指定的方法，然后使用了这个同步器的自定义同步组件会调用这个同步器提供的同步方法，而这些方法就是实现者重写的方法

##### 状态相关方法

重写模板方法的时候，需要用到同步器提供的状态相关方法

- `getState()`：获取同步状态
- `setState()`：设置当前同步状态
- `compareAndSetState()`用 CAS 设置同步状态，该方法保证设置动作的原子性

##### 实现同步器需要重写的方法

| 方法                                      | 描述                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `protected boolean tryAccquire(int arg)`  | 独占式获取同步状态，这个方法需要查询同步状态是否符合预期，然后再使用 CAS 设置新的同步状态 |
| `protected boolean tryRelease(int arg)`   | 独占式释放同步状态                                                                        |
| `protected int tryAcquireShared(int arg)` | 共享式获取同步状态，若返回大于 0 的值则表示获取成功，否则获取失败                         |
| `protected int tryReleaseShared(int arg)` | 共享式释放同步状态                                                                        |
| `protected boolean isHeldExclusively()`   | 当前同步器是否在独占模式下被线程占用，一般用来表示是否被当前线程独占                      |

##### 同步器提供的模板方法

| 方法                                              | 描述                                                                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `void acquire(int arg)`                           | 独占式获取同步状态，如果同步状态获取成功，则从该方法返回，否则进入同步队列等待，该方法会调用重写的`tryAcquire`方法                                      |
| `void acquireInterruptibly(int arg)`              | 和`acquire`相同，但是这个方法能够响应中断，当前线程如果没获取到同步状态而进入到同步队列中等待的时候，这时候中断这个线程，它就会从队列中退出并且抛出异常 |
| `boolean tryAcquireNanos(int arg, long nanos)`    | 在`acquireInterruptibly`的基础上加了超时限制，如果在限时内获取到同步状态了就返回 true，否则返回 false                                                   |
| `void acquireShared(int arg)`                     | 共享式获取同步状态，也就是同一时间允许有多个线程获取到同步状态，该方法会调用重写的`tryAcquireShared`方法                                                |
| `void acquireSharedInterruptibly(int arg)`        | 共享式可中断获取同步状态                                                                                                                                |
| `boolean acquireSharedNanos(ing arg, long nanos)` | 共享式可中断有超时获取同步状态，限时内获取到就返回 true，否则返回 false                                                                                 |
| `boolean release(int arg)`                        | 独占式释放同步状态，并唤醒在同步队列中等待的第一个线程，该方法会调用重写的`tryRelease`方法                                                              |
| `boolean releaseShared(int arg)`                  | 共享式释放同步状态，该方法会调用重写的`tryReleaseShared`方法                                                                                            |
| `Collection<Thread> getQueuedThreads()`           | 获取等待在同步队列上的线程集合                                                                                                                          |

可以看到，模板方法分为三类：独占式获取和释放、共享式获取和释放、同步队列线程集合

### 尝试实现一个独占锁

```java
class Mutex implements Lock {
    static class Q extends AbstractQueuedSynchronizer {
        // 查看是否处于占用状态
        @Override
        protected boolean isHeldExclusively() {return getState() == 1;}
        @Override
        public boolean tryAcquire(int acquire) {
            // 状态为0的时候获取锁
            if (compareAndSetState(0, acquire)) {
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }
        @Override
        protected boolean tryRelease(int release) {
            if (getState() == 0) {
                throw new IllegalMonitorStateException();
            }
            // 释放锁并将状态设置为0
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }
        // 返回一个Condition对象 每一个conditionObject都包含了一个condition队列
        Condition newCondition() {return new ConditionObject();}
        // 返回当前持有本锁的线程对象
        public Thread getOwnerThread() {return getExclusiveOwnerThread();}
    }
    private final Q q = new Q();
    @Override
    public void lock() {q.acquire(1);}
    @Override
    public void lockInterruptibly() throws InterruptedException {
        q.acquireInterruptibly(1);
    }
    @Override
    public boolean tryLock() {return q.tryAcquire(1);}
    @Override
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
        return q.tryAcquireNanos(1, unit.toNanos(time));
    }
    @Override
    public void unlock() {q.release(1);}
    @Override
    public Condition newCondition() {return q.newCondition();}
    // 可以额外附加的实现
    public boolean isLocked() {return q.isHeldExclusively();}
    public boolean hasQueuedThreads() {return q.hasQueuedThreads();}
    public Thread getExclusiveOwnerThread() {return q.getOwnerThread();}
}
```

我们要实现一个 Mutex，首先实现`Lock`接口，然后写一个内部类并继承`AbstractQueuedSynchronizer`，在 Mutex 中实例化一个同步器对象，并把同步器对象的方法代理为，Lock 接口的方法的实现

值得注意的是，`AbstractQueuedSynchronizer`类本身就提供了很多方法作为实现同步组件的有力工具，比如在`tryAcquire(int acquire)`方法的实现里，就用到了`compareAndSetState`尝试设置同步状态，并且如果设置成功的话，就代表当前线程已经获取到该锁了，随后就把当前线程和该同步器进行绑定，即通过`setExclusiveOwnerThread`方法将该线程设置为锁的持有者

其他诸如获取 Queue 中的线程集合、判断是锁是否被锁上、获取锁的持有线程等等这些方法，都能通过同步器提供的方法去灵活实现，在这样灵活的同步器的帮助下，能够实现符合很多场景的同步组件

最后，我们还注意到有一个`newCondition`方法，这个方法返回的对象有什么用，我们以后再慢慢研究
