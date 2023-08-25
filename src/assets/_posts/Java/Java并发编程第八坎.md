---
title: Java并发编程第八坎
comments: true
tags:
  - java
  - thread
  - Lock-Api
  - reentrantLock
  - reentrantReadWriteLock
date: 2019-01-07 22:46:48
series: 并发
---

### Introduction

我们对 Lock 和 AQS 有了一定的了解了之后，可以尝试着接触一些 Lock+AQS 的基本实现了，本篇会了解到最基本的同步组件`ReentrantLock`和`ReentrantReadWriteLock`，前者提供了排他锁的实现，并且支持重入，后者在前者的基础上，支持锁的分级，写锁排他读锁共享。特别的，重入锁的获取还有公平和非公平之分，我们先从这部分入手。

#### Fair Lock & Nonfair Lock

公平锁：锁的获取次序和请求锁的时间顺序一致，即在绝对的时间里，等待时间越久的线程越先获取到锁。

非公平锁：锁的获取和瞬间的竞争有关，一瞬间谁运气好就能获取到锁，而且锁的获取即同步状态的获取，刚获取到同步状态的线程，再次获取到状态的机会比较大。

说明：虽然非公平锁可能会造成“饥饿”情况，但是大多数情况下还是非公平锁用的多，因为公平锁在释放锁又再获取锁的时候，总是会**切换线程**，而非公平锁一段时间内很可能总是那一个线程不停放锁持锁，**线程切换的开销小就意味着——吞吐量大**

再说多一点，公平性和非公平性是**“针对未入队结点”**和**“已入队结点”**而言，上一篇文章已经提到过，**同步队列**中的结点都是公平获取锁的，遵从 FIFO，至于具体的体现，继续往下读，读到 FairSync 的`tryAcquire`和`hasQueuedPredecessors`方法就知道了

#### ReentrantLock

重入锁可以通过构造器来决定公平机制，默认是非公平锁：

```java
public ReentrantLock() {
    sync = new NonfairSync();
}
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

ReentrantLock 中有 3 个简单的内部类，`FairSync`/`NonfairSync`以及`Sync`，后者是前两个的父类，

```java
abstract static class Sync extends AbstractQueuedSynchronizer {
    private static final long serialVersionUID = -5179523762034025860L;

    abstract void lock();

    final boolean nonfairTryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0) // overflow
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }

    protected final boolean tryRelease(int releases) {
        int c = getState() - releases;
        if (Thread.currentThread() != getExclusiveOwnerThread())
            throw new IllegalMonitorStateException();
        boolean free = false;
        if (c == 0) {
            free = true;
            setExclusiveOwnerThread(null);
        }
        setState(c);
        return free;
    }

    // other method..
}
```

一个抽象的 lock 方法，以及一个非公平的`tryAcquire`和`tryRelease`，可以在这看到，在重入锁中：**state 代表占锁的线程重入次数（用层数应该更好理解）**

观察`nonfairTryAcquire`方法，当 state 为 0 的时候，代表没有线程获取到锁，但是同时可能有多个线程在竞争同步状态，所以使用 CAS 来设置 state，设置成功的线程会设置 AQS 的独占线程为当前线程，此时 state 为 1；下次再来的时候，如果是自己获取自己，那么现在的 state 加上 aquire 数量，设置为新的 state，并且此时没有竞争，所以常规设置 state 即可；

即在某一绝对时刻，如果 state 为 0，任何线程都能够和同步队列中的头结点竞争 state，一旦竞争到了就获取到了锁，不用入队；

观察`tryRelease`方法，如果不是持锁线程掉用的话，则什么都不干，否则现在的 state 减去 releases 数量，直到为 0 的时候，才移除 AQS 的独占线程；

再来看看`Sync`的子类之一：`NonfairSync`

```java
static final class NonfairSync extends Sync {
    private static final long serialVersionUID = 7316153563782823691L;

    final void lock() {
        if (compareAndSetState(0, 1))
            setExclusiveOwnerThread(Thread.currentThread());
        else
            acquire(1);
    }

    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires);
    }
}
```

非常简单的实现，并且在`lock`方法中会尝试一次快速地获取同步状态，获取到就贼赚，获取不到就乖乖`acquire` 去，`tryAcquire`则是直接调用父类提供的非公平`nonfairTryAcquire`，如果获取不到，下场一样是进入同步队列尾部排队

最后是`FairSync`

```java
static final class FairSync extends Sync {
    private static final long serialVersionUID = -3000897897090466540L;

    final void lock() {
        acquire(1);
    }

    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}
```

我们只需要注意到，它的`tryAcquire`方法和父类的非公平获取几乎如出一撤，仅是在 CAS 竞争之前，先要判断一下当前线程所在队列中的结点是否有前驱（`hasQueuedPredecessors`），如果没有就可以开始 CAS 获取，保证总是最早入队的结点有权获取同步状态；

我们再深入一下`hasQueuedPredcessors`

```java
public final boolean hasQueuedPredecessors() {
    // The correctness of this depends on head being initialized
    // before tail and on head.next being accurate if the current
    // thread is first in queue.
    Node t = tail; // Read fields in reverse initialization order
    Node h = head;
    Node s;
    return h != t &&
        ((s = h.next) == null || s.thread != Thread.currentThread());
}
```

判断 head 是否等于 tail：

1. 若等于，则条件结束，方法返回 fasle

   > 等于的含义有 2 层，一是队列里没有任何结点的时候，head=tail=null，这时候方法返回 false，代表进入方法的线程是整个系统第一次访问该锁的线程，则可以获取同步状态；
   >
   > 二是队列中只有一个结点，这个结点即是 head 又是 tail；

2. 若不等于，则看 head 是否有后继：

   1. 若没有后继，则条件结束，方法返回 true，回到上层方法，`tryAcquire`返回 false；
   2. 若有后继，如果 head 的后继不是当前线程的话，方法返回 true，回到上层方法，`tryAcquire`返回 false；
   3. 若有后继，且 head 后继是当前线程，则方法返回 false，回到上层方法，当前线程可以尝试获取同步状态；

##### Real meaning of "fair"

读完上面的方法之后，接下来这句话非常重要：为什么之前说，公平性和非公平性是**“针对未入队结点”**和**“已入队结点”**而言？因为**已入队的结点之间不存在竞争**，竞争仅仅是队列前几个结点和未入队的新线程而言：

- 如果是公平锁，未入队的新线程在`hasQueuePredecessors`方法之后，肯定是 false，导致`tryAcquire`方法必定返回 false，导致这个新线程必定组成结点然后入队排队，**即不入队的线程没有参与同步资源竞争的权利**；
- 如果是非公平锁，未入队的新线程有机会和已入队的一起竞争同步资源；所以才叫非公平！

所以不要误解非公平锁的情况下，后排队的结点线程也能很**“不公平”**地比先排队的结点线程先获得同步状态，这是不可能的；

#### ReentrantReadWriteLock

在 Lock 接口之前，我们使用等待通知的设计机制可以简单地实现一个读写场景，当写线程开始的时候，所有后续读写线程都进入等待，写操作完成之后，通知唤醒等待中的其他线程；而当有一个读线程在读取的时候，写线程进入等待；

基于这样的逻辑，才能避免脏读

所以读写锁的基本思想是：**写锁的优先度高于读锁，可以多读，只能单写；**

**换句话说，写锁是独占锁，读锁是共享锁**，而上面说的`ReentrantLock`则是排他锁，在一般场景下，读写锁的性能会比排他锁好，因为绝大部分场景是读操作远多于写操作的；

使用读写锁的时候，只需要在读操作的时候获取读锁，写操作的时候获取写锁就可以了，比`synchronized`关键字加等待通知方法更加简单明了

`ReentrantReadWirteLock`是读写锁的一种，其特性如：

- 可重入
- 公平性选择
- 遵循获取写锁、获取读锁再释放写锁的顺序，写锁可降级称为读锁

另外它还提供了外部监控内部锁状态的方法：

| 方法                      | 描述                                                                                                                                                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int getReadLockCount()`  | **返回当前读锁被获取到的次数**，该次数不等于获取读锁的线程数，比如仅一个线程连续重入了 n 次，则返回 n；该方法会返回**所有线程持有的当前读锁的层数**，比如线程 A 获取 3 次，释放 1 次，线程 B 获取 5 次释放 2 次，则该方法会返回 3-1+5-2=**5 层**；        |
| `int getReadHoldCount()`  | **返回当前线程获取到读锁的次数**，该方法在 Java6 之后加入，通过**ThreadLocal**实现；该方法返回**当前线程持有该锁的层数**，比如线程 A 获取该锁 5 次释放**2 层**，则在 A 锁该方法返回 3，同时 B 线程获取该锁 4 次释放 4 次，则在 B 线程该方法返回**0 层**； |
| `boolean isWirteLocked()` | **判断写锁是否被获取到；**                                                                                                                                                                                                                                |
| `int getWriteHoldCount()` | **判断当前写锁被获取的次数；**                                                                                                                                                                                                                            |

##### Read Write State Design

我们来思考一下，对于一个读写锁来说，它应当将读写分离为 2 把锁，但是读写锁的排队应该排在同一队，所以读写锁的 AQS 应该是同一个实例，所以问题来了，如何在一个 AQS 实例上的一个 state 变量中表示读与写两种同步状态？老爷子给出了这样的答案：

<pre class="nhi">
    int value
    |&lt;-----------------------------32------------------------------&gt;|
    ┌---------------------------------------------------------------┐
    |0|0|0|0|0|0|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|1|1|
    └---------------------------------------------------------------┘
                    |                                 ↓
                    |                ┌-------------------------------┐
                    ↓                |0|0|0|0|0|0|0|0|0|0|0|0|0|0|1|1|
    ┌-------------------------------┐└-------------------------------┘
    |0|0|0|0|0|0|0|0|0|0|0|0|0|0|1|0|               低16位表示写状态 = 3
    └-------------------------------┘
                   高16位表示读状态 = 2
</pre>

通过位运算，假设当前同步状态值为 S，那么写状态就等于 S & 0x0000FFFF（高 16 位清零），读状态等于 S >>> 16（无符号补位 0 右移 16 位）

当写状态要增加 1 的时候，直接 S + 1，当读状态要增加 1 的是，直接 S + 0x00010000 就行

##### Structure

```java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {

    private final ReentrantReadWriteLock.ReadLock readerLock;
    private final ReentrantReadWriteLock.WriteLock writerLock;
    final Sync sync;

    public ReentrantReadWriteLock() {this(false);}
    public ReentrantReadWriteLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
        readerLock = new ReadLock(this);
        writerLock = new WriteLock(this);
    }

    public ReentrantReadWriteLock.WriteLock writeLock() { return writerLock; }
    public ReentrantReadWriteLock.ReadLock  readLock()  { return readerLock; }

    // ...
}
```

这是重入读写锁的整体结构，可以看到 ReentrantReadWriteLock 仅仅只是实现了 ReadWriteLock 接口而已，这个接口仅定义了获取 ReadLock 和 WriteLock 的方法，真正的锁实现是`ReentrantReadWriteLock.ReadLock`和`ReentrantReadWriteLock.WriteLock`，而这两个锁实现，用的是同一个`Sync`实例，`Sync`实例即实现了 AQS 的公平锁或者非公平锁

##### Fair & NonFair

我们先来看非公平锁和公平锁的实现：

```java
static final class NonfairSync extends Sync {
    private static final long serialVersionUID = -8159625535654395037L;
    final boolean writerShouldBlock() {
        return false; // writers can always barge
    }
    final boolean readerShouldBlock() {
        return apparentlyFirstQueuedIsExclusive();
    }
}

static final class FairSync extends Sync {
    private static final long serialVersionUID = -2274990926593161451L;
    final boolean writerShouldBlock() {return hasQueuedPredecessors();}
    final boolean readerShouldBlock() {return hasQueuedPredecessors();}
}
```

读写锁中的公平性主要体现在是否要阻塞读写线程这方面，对于公平锁而言，无论读写线程，都要判断`hasQueeudPredecessors`这个方法我们上面讲过了，关键是非公平锁，对于写锁是否应该 block 来说，它总是不应该被 block 住，而读锁则需要判断`apparentlyFirstQueuedIsExclusive`方法，

```java
final boolean apparentlyFirstQueuedIsExclusive() {
    Node h, s;
    return (h = head) != null &&
        (s = h.next)  != null &&
        !s.isShared()         &&
        s.thread != null;
}
```

如果队列中的第一个等待结点明显是是独占式锁的结点的话，就返回 true，两个方法连起来的意思是，如果队列中的第一个结点是写锁（独占锁）的话，读锁应该被 Block 住

##### Sync in ReentrantReadWriteLock

```java
abstract static class Sync extends AbstractQueuedSynchronizer {
    static final int SHARED_SHIFT   = 16;
    static final int SHARED_UNIT    = (1 << SHARED_SHIFT);
    static final int MAX_COUNT      = (1 << SHARED_SHIFT) - 1;
    static final int EXCLUSIVE_MASK = (1 << SHARED_SHIFT) - 1;

    static int sharedCount(int c)    { return c >>> SHARED_SHIFT; }
    static int exclusiveCount(int c) { return c & EXCLUSIVE_MASK; }

    Sync() {
        readHolds = new ThreadLocalHoldCounter();
        setState(getState()); // ensures visibility of readHolds
    }

    abstract boolean readerShouldBlock();
    abstract boolean writerShouldBlock();

    // .. HolderCounter 相关方法暂时略

    protected final boolean tryRelease(int releases) {
        // ..
    }
    protected final boolean tryAcquire(int acquires) {
        // ..
    }
    protected final boolean tryReleaseShared(int unused) {
        // ..
    }
    protected final int tryAcquireShared(int unused) {
        // ..
    }
    final int fullTryAcquireShared(Thread current) {
        // ..
    }
    final boolean tryWriteLock() {
        // ..
    }
    final boolean tryReadLock() {
        // ..
    }

    // .. 锁状态 相关方法暂时略

    final int getCount() { return getState(); }
}
```

重入读写锁中的`Sync`类提供的功能比较多，它同时实现了读锁和写锁的管理操作，我们先分析这部分，略去的部分我在注释中说明了

读写状态的管理就是通过位运算去实现的，读写锁的层数也是通过位运算 state 变量算出来的，这里不再赘述；写锁的 tryRelease 方法和`ReentrantLock`基本一致；

我们接着看写锁的 try：

```java
protected final boolean tryAcquire(int acquires) {
    Thread current = Thread.currentThread();
    int c = getState();
    int w = exclusiveCount(c);
    if (c != 0) {
        // (Note: if c != 0 and w == 0 then shared count != 0)
        if (w == 0 || current != getExclusiveOwnerThread())
            return false;
        if (w + exclusiveCount(acquires) > MAX_COUNT)
            throw new Error("Maximum lock count exceeded");
        // Reentrant acquire
        setState(c + acquires);
        return true;
    }
    if (writerShouldBlock() ||
        !compareAndSetState(c, c + acquires))
        return false;
    setExclusiveOwnerThread(current);
    return true;
}
```

老爷子特地写下了一段 WalkThrough 注释，指出了本方法要处理的情况：

1. 如果读写状态都不为零，且当前线程不是该 AQS 的独占线程，则不能获取写锁；
2. 如果状态满值了，也获取不了写锁；
3. 如果不是上面 2 种情况，则该线程应该在公平性的指导下`writerShouldBlock`合法竞争独占锁；

再来看读锁的，再看读锁之前，我们要了解一下`Sync`的几个变量和类：

```java
static final class HoldCounter {
    int count = 0;
    // Use id, not reference, to avoid garbage retention
    final long tid = getThreadId(Thread.currentThread());
}

static final class ThreadLocalHoldCounter extends ThreadLocal<HoldCounter> {
    public HoldCounter initialValue() {return new HoldCounter();}
}

private transient ThreadLocalHoldCounter readHolds;

private transient HoldCounter cachedHoldCounter;

private transient Thread firstReader = null;
private transient int firstReaderHoldCount;
```

有一个`HoldCounter`类，用于存储每个线程自己的读层数，然后通过 ThreadLocal 来管理

- `readHolds`：一个 ThreadLocal 实例，保存了所有读线程的 HoldCounter
- `cachedHoldCounter`：表示最后一个成功 acquire 到 readLock 的线程的 holdCount
- `firstReader`：是第一个 acquire 到读锁的线程
- `firstReaderHoldCount`：是`firstReader`的 holdCount

然后是读 try：

```java
protected final int tryAcquireShared(int unused) {
    Thread current = Thread.currentThread();
    int c = getState();
    if (exclusiveCount(c) != 0 &&
        getExclusiveOwnerThread() != current)
        return -1;
    int r = sharedCount(c);
    if (!readerShouldBlock() &&
        r < MAX_COUNT &&
        compareAndSetState(c, c + SHARED_UNIT)) {
        if (r == 0) {
            firstReader = current;
            firstReaderHoldCount = 1;
        } else if (firstReader == current) {
            firstReaderHoldCount++;
        } else {
            HoldCounter rh = cachedHoldCounter;
            if (rh == null || rh.tid != getThreadId(current))
                cachedHoldCounter = rh = readHolds.get();
            else if (rh.count == 0)
                readHolds.set(rh);
            rh.count++;
        }
        return 1;
    }
    return fullTryAcquireShared(current);
}
```

WalkThrough：

1. 如果写锁被其它线程获取了，则不能获取读锁；
2. 否则就在公平性的指导下`writerShouldBlock`，如果允许竞争，则判断是否超量读，如果没超量，则尝试 CAS 设置读状态，这三个条件过了之后，line:11~line:24 是快速地进行 tryAcquireShared，它并没有检查重入情况下的 acquire，所以它将完整地 holdCount 检查等工作推迟到了`fullTryAcquireShared`中去了，因为典型的情况下都是非重入地使用；
3. 如果前 2 步都不对，那么就开始完整的`fullTryAcquireShared`，它将会处理之前的 CAS 失败，已经第二步没有处理好的读重入的情况；

关于`fullTryAcquireShared`的更详细的逻辑，我觉得比较复杂，不太想深究，到此为止

最后回到`Sync`类最后 2 个方法：

- `tryWriteLock`：和`tryAcquire`相比仅仅少了`writerShouldBlock`
- `tryReadLock`：和`tryAcquire`相比仅仅少了`readerShouldBlock`

##### ReadLock & WriteLock in ReentrantReadWirteLock

大致读下了上面的`Sync`之后，剩下的`ReadLock `& `WriteLock `其实就很简单了

```java
public static class ReadLock implements Lock, java.io.Serializable {
    private final Sync sync;
    protected ReadLock(ReentrantReadWriteLock lock) {
        sync = lock.sync;
    }
    public void lock() {sync.acquireShared(1);}
    public boolean tryLock() {return sync.tryReadLock();}
    public void unlock() {sync.releaseShared(1);}

    // 其余release、中断acquire、超时、状态相关方法略
}

public static class WriteLock implements Lock, java.io.Serializable {
    private final Sync sync;
    protected WriteLock(ReentrantReadWriteLock lock) {
        sync = lock.sync;
    }
    public void lock() {sync.acquire(1);}
    public boolean tryLock() {return sync.tryWriteLock();}
    public void unlock() {sync.release(1);}

    // 其余release、中断acquire、超时、状态相关方法略
}
```

##### Write Lock Degradation

虽然写锁在被某一个线程持有的时候，其他线程的读锁请求和写锁请求都会被阻塞，但是同一线程的读写锁请求是不会被阻塞的；

而读写锁中的**锁降级**是指：同一个线程在持有写锁的情况下，同时获取读锁，再释放写锁；

这样做是**保证数据可见性**，因为当 A 线程在持有写锁的时候，这时候其他线程的读写操请求都会被阻塞，这时候 A 线程再获取读锁然后释放写锁，那么在 A 线程持有读锁的情况下，A 线程最后一次修改过的数据就对其他线程可见（其他线程的读请求会被唤醒）

```java
readLock.unLock();
writeLock.lock();
try{
    // update
    data.update();
    readLock.lock();
} finally {
    writeLoce.unLock();
}
```

### Conclusion

上一篇文章我们在分析`SynchronizedQueue`的时候同时也分析了共享式获取和释放等方法，这些方法就是就是给读写锁来实现写锁的

关于重入锁和读写锁的原理方面，我觉得要注意以下几点：

1. `Lock`接口、`AbstractSynchronizedQueue`的关系；
2. CAS 更改 State；
3. 同步队列的原理
   1. 结构；
   2. 自旋、等待；
   3. 共享式锁的**_Propagation_**；
4. 锁重入的过程；
5. 公平/非公平的原理；
6. 读锁写锁的工作流程于应用设计；
7. 写锁的降级；

虽然*《艺术》*书上没有关于读写锁的更多源码讲解，但是有了之前重入锁的讲解分析经历，还是能自己把读写锁的源码分析了一遍
