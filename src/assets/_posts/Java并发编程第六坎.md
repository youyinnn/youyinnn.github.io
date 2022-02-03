---
title: Java并发编程第六坎
categories:
  - java
  - concurrency
  - 《艺术》与《技术》
comments: true
tags:
  - java
  - thread
  - dead-lock
  - wait/notify
  - consumer/producer
  - double-check-singleton
date: 2018-7-25 21:33:48
series: 并发
---

### 前言

不知不觉写到第六坎了，前面刀剑磨刀石内功心法都有了，感觉自己应该很厉害了，其实不是，这一个月因为考试末尾和实习，断断续续的看，反反复复的看，越看越精神，越看越心虚。

无论怎么说，短板还是得慢慢补上来，保持谦逊，虚心学习。

回到整体，前面由内到外说了 Java 并发中很基本的几件事：

- 基本的线程 API 和使用
- 基本的并发概念
- volatile 和 synchronized 和锁概念

我觉得是时候得停一下，综合一下这些东西，真刀真枪干几次，所以这篇算是我们并发游戏世界中，主人翁的**“初出茅庐”**篇，又可以叫做小试牛刀，在这篇我尝试例出并发编程中最基本的场景如：

- **死锁**
- **“等待-通知”**
- **有超时的“等待-通知”**
- **“生产者-消费者”模式**
- **双重检查锁延迟初始化的错误与正确示范**

---

### 死锁

死锁是多个以上的 process 互相等待对方释放资源而进入永久等待的一种情况，要产生死锁，就必须同时满足一下四个条件：

- **互斥条件**

  ​ 即某个资源在一段时间内只能由一个进程占有，不能同时被两个或两个以上的进程占有。这种独占资源如 CD-ROM 驱动器，打印机等等，必须在占有该资源的进程主动释放它之后，其它进程才能占有该资源。这是由资源本身的属性所决定的。如独木桥就是一种独占资源，两方的人不能同时过桥。

- **不可抢占条件**

  ​ 进程所获得的资源在未使用完毕之前，资源申请者不能强行地从资源占有者手中夺取资源，而只能由该资源的占有者进程自行释放。如过独木桥的人不能强迫对方后退，也不能非法地将对方推下桥，必须是桥上的人自己过桥后空出桥面（即主动释放占有资源），对方的人才能过桥。

- **占有且申请条件**

  ​ 进程至少已经占有一个资源，但又申请新的资源；由于该资源已被另外进程占有，此时该进程阻塞；但是，它在等待新资源之时，仍继续占用已占有的资源。还以过独木桥为例，甲乙两人在桥上相遇。甲走过一段桥面（即占有了一些资源），还需要走其余的桥面（申请新的资源），但那部分桥面被乙占有（乙走过一段桥面）。甲过不去，前进不能，又不后退；乙也处于同样的状况。

- **循环等待条件**

  ​ 存在一个进程等待序列{P1，P2，...，Pn}，其中 P1 等待 P2 所占有的某一资源，P2 等待 P3 所占有的某一源，......，而 Pn 等待 P1 所占有的的某一资源，形成一个进程循环等待环。就像前面的过独木桥问题，甲等待乙占有的桥面，而乙又等待甲占有的桥面，从而彼此循环等待。

死锁的处理可以分为：预防，避免，检测和解除

#### 死锁预防

这是一种较为简单、直观的事先预防方法，方法是破坏产生死锁的 4 个条件，就算破坏一个，死锁也不会产生。这是一种静态方法。

#### 死锁避免

系统在运行时分配资源的时候，能够对资源分配情况进行动态检查，如果结果良好，则允许分配，如果结果显示分配后会出现死锁，则不予分配。这是一种动态方法。

#### 检测和解除

- 检测

  ​ 不事先采取限制措施，也不检测系统是否进入安全区，运行系统在运行时发生死锁，但是会通过系统设置的检查机制，检测出死锁发生的地方。

- 解除

  ​ 检测到死锁地点之后，解除死锁状态

例：

```java
public class DeadLock {
    private static StringBuffer a = new StringBuffer();
    private static StringBuffer b = new StringBuffer();
    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (a){
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (b){}
            }
        }).start();
        new Thread(() -> {
            synchronized (b){
              synchronized (a){}
            }
        }).start();
    }
}
```

### “等待-通知”

> 在就餐的时候，厨师和服务员之间的交互就是一种等待通知模式：
>
> 1. 厨师需要一定的时间去做菜
> 2. 厨师没做好菜的时候，服务员就没活干了，所以服务员就有（wait）的状态
> 3. 服务员取菜的时机是取决于厨师的，只有当厨师将菜放到“台面”上，并“通知（notify）”服务员，服务员菜开始干活

#### 范式

```java
synchronized(对象) {
	while(退出等待的条件不满足){
    	对象.wait();
    }
    // 等待完后的工作
}
```

```java
synchronized(对象){
	// 改变退出等待的条件
    对象.notifyAll()；
}
```

#### 实现

```java
public class WaitNotifyParadigm {

    private static String lock = "lock";
    private static boolean wait = true;

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("T1 started to wait...");
                while (wait) {
                    try {
                        lock.wait(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("T1 stop waitting !");
            }
        }).start();
        new Thread(() -> {
            for (int i = 0; i < 3; i++) {
                System.out.println("T2 processing: " + (i + 1));
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            synchronized (lock) {
                System.out.println("T2 done process, notifyAll...");
                wait = false;
                lock.notifyAll();
            }
        }).start();
    }
}
```

结果：

```console
T1 started to wait...
T2 processing: 1
T2 processing: 2
T2 processing: 3
T2 done process, notifyAll...
T1 stop waitting !
```

#### 有超时的“等待-通知”

要搭配`wait()`的超时机制的话，就得在条件中也考虑超时，我们可以加两个变量来完成超时：

- left：表示剩余多少时间就超时
- end：表示超时时间的完整毫秒数

```java
public class WaitNotifyParadigmWithTimeout {

    private static String lock = "lock";
    private static boolean wait = true;
    private static long timeout = 5000;

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (lock) {
                System.out.println("T1 started to wait...");
                long left = timeout;
                long end = System.currentTimeMillis() + timeout;
                while (wait && left > 0) {
                    try {
                        lock.wait(left);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    left = end - System.currentTimeMillis();
                }
                System.out.println("T1 stop waitting !");
            }
        }).start();
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("T2 processing: " + (i + 1));
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            synchronized (lock) {
                System.out.println("T2 done process, notifyAll...");
                wait = false;
                lock.notifyAll();
            }
        }).start();
    }
}
```

### “生产者/消费者”

利用 wait/notify 机制，先上一段多消费者/多生产者的示例

```java
public class TestProducerConsumer2 {

    static Integer limit = 50;
    static volatile Integer stock = 0;
    static final String P_LOCK = "p";
    static final String C_LOCK = "c";

    public static void main(String[] args) {
        new Thread(new Producer2("P-1")).start();
        new Thread(new Consumer2("C-1")).start();
        new Thread(new Consumer2("C-2")).start();
    }
}

class Producer2 implements Runnable {

    private String name;

    public Producer2(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        while (true) {
            if (TestProducerConsumer2.stock < TestProducerConsumer2.limit) {
                System.out.println("Producing");
                while (TestProducerConsumer2.stock < TestProducerConsumer2.limit) {
                    synchronized (TestProducerConsumer2.P_LOCK) {
                        try {
                            Thread.sleep(10);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        TestProducerConsumer2.stock++;
                        System.out.println("Produced the " + TestProducerConsumer2.stock + " stock");
                    }
                }
                System.out.println("Produce process done");
                synchronized (TestProducerConsumer2.C_LOCK) {
                    TestProducerConsumer2.C_LOCK.notifyAll();
                }
            }
            synchronized (TestProducerConsumer2.P_LOCK) {
                try {
                    TestProducerConsumer2.P_LOCK.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

class Consumer2 implements Runnable {

    private String name;

    public Consumer2(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        while (true) {
            if (TestProducerConsumer2.stock >= TestProducerConsumer2.limit) {
                System.out.println(name + " consuming");
                while (TestProducerConsumer2.stock > 0) {
                    synchronized (TestProducerConsumer2.C_LOCK) {
                        System.out.println(name + " consumed the " + TestProducerConsumer2.stock + " stock");
                        TestProducerConsumer2.stock--;
                    }
                }
                System.out.println(name + "consume process done");
                synchronized (TestProducerConsumer2.P_LOCK) {
                    TestProducerConsumer2.P_LOCK.notifyAll();
                }
            }
            synchronized (TestProducerConsumer2.C_LOCK) {
                try {
                    TestProducerConsumer2.C_LOCK.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

```

目标 item 是 stock，我们用`volatile`来保证其在 P/C 之间的可见性

P/C 之间各通过对方的 LOCK 来唤醒对方

生产/消费到达 limit 之后，各在自己的 LOCK 上等待

消费者之间通过消费者 LOCK 保证消费同步，生产者之间通过生产者 LOCK 保证生产同步

### 双重检查锁延迟初始化的错误与正确示范

关于双重检查锁的由来就不再多说，我们看看双重检查的错误示范：

```java
public class DoubleCheckLocking {
    private static Instance instance;
    public static Instance getInstance() {
        if (instance == null) {							// 第一次检查
            synchronized(DoubleCheckLocking.class) {	// 加锁
                if (instance == null) {					// 第二次检查
                    instance = new Instance();			// 初始化：这里有坑
                }
            }
        }
        return instance;
    }
}
```

> 双重检查锁看起来很完美，但是这是一个没有考虑完整的优化！
>
> 在线程执行到 line4 的时候，代码读取到 instance 不为空，但是 instance 所引用的对象可能还没有完成对象初始化
>
> 即现在不为空的对象其实并不具备工作能力

#### 探究

代码的第七行（`instance = new Instance();`）问题就出在这里，我们可以把这句话分解为以下三行：

1. memory = allocate(); // 1 分配对象的内存空间
2. ctorInstance(memory); // 2 初始化对象
3. instance = memory; // 3 设置 instance 指向刚分配的内存地址
4. // 后续对 instance 对象的访问

上面的 2、3 行代码，在某些编译器中可能会被重排序，可能是 3 先 2 后，这就是所谓的，对象不为空，但是对象并不具备工作的可能，为什么 JMM 会允许这样的重排序？说白了，JMM 重排序，允许这样的重排序因为在单线程情况下这样的重排序并不影响程序结果，1234 无论怎样，只要保证 2 在 4 之前就好了

这样的重排序在`单线程`的情况下是能安全地起到优化作用的，但是在多线程的情况下就会出问题了，我们看一个表：

| 时间 |             线程 A             |                线程 B                |
| :--: | :----------------------------: | :----------------------------------: |
|  t1  |     A1：分配对象的内存空间     |                                      |
|  t2  | A3：设置 instance 指向内存空间 |                                      |
|  t3  |                                |      B1：判断 instance 是否为空      |
|  t4  |                                | B2：不为空，访问 instance 引用的对象 |
|  t5  |         A2：初始化对象         |                                      |
|  t6  |  A4：访问 instance 引用的对象  |                                      |

在 t4 时刻，线程 B 访问到的对象是不具备工作能力的对象，这样的对象没有意义。

我们要修正这个错误，有两种办法：

- 禁止 2 和 3 的重排序
- 允许重排序，但是禁止其他线程感知到这个重排序

#### 基于 volatile 的解决方法

```java
public class SafeDoubleCheckLocking {
    private static volatile Instance instance;
    public static Instance getInstance() {
        if (instance == null) {
            synchronized(SafeDoubleCheckLocking.class) {
                if (instance == null) {
                    instance = new Instance();
                }
            }
        }
        return instance;
    }
}
```

将 instance 声明为 volatile 变量，这样做可以**禁止 2 和 3 的重排序**

#### 基于内部类和类初始化的解决方案

在 JVM 初始化类的时候，JVM 首先会获取一个锁，保证多个线程同时初始化这个类的同步性，而类的加载和初始化工作，会准备好类中所有的静态变量

基于这个特性，我们可以有另外一种线程安全的延迟初始化方案——`Initialization On Demand Holder idiom`

```java
public class InstanceFactory {
    private statci class InstanceHolder {
        public static Instance instance = new Instance();
    }
    public static Instance getInstance() {
        return InstanceHolder.instance;	// 如果是第一次引用，那么在这个地方就会加载上面那个内部类
    }
}
```

这个方案的本质是：让其他线程看不到初始化类线程的内部重排序，只能感知到结果

等于说，我们做线程安全单例，其实只需要一个**“一次性锁”**，而类初始化的这个特性恰好就是一个**“一次性锁”**

这个锁称之为——**初始化锁（LC）**，我们来看看书里是怎么介绍的：

> Java 语言规范规定，对于每一个类或接口 C，都有一个唯一的初始化锁（LC）与之对应。从 C 到 LC 的映射，由 JVM 自由实现。JVM 在类初始化期间会获取这个初始化锁，并且每个线程至少要获取一次锁来确保这个类已经被初始化过了。
