---
title: Java并发编程第一坎
comments: true
tags:
  - java
  - thread
  - wait/notify
date: 2018-6-5 22:09:00
series: 并发
---

### 前言

本**系列**文章主要是为 Java 并发入门做铺垫，集中清点：

- **Thread 的基本概念**
- **生命周期**
- **创建和使用**
- **线程的魅力所在**
  - **从线程不同步到线程安全**
    - **锁**
    - **死锁情况**
  - **从线程各自独立到线程通信**
    - **停止线程**
    - **唤醒线程**
    - **通信**
- **Java 中的并发编程**
- **并发和单例模式的那些事**

本系列除了参考*《Java 并发编程的艺术》*和*《Java 多线程编程核心技术》*这两本书之外，还会参考 JDK 的源码和[API 文档](https://docs.oracle.com/javase/8/docs/api/)，**会翻译文档中部分重要的说明，比如过期方法为什么过期和官方解决办法等等**

本篇主要介绍一下三部分

- **Thread 的基本概念：**线程是什么，什么是线程，Java 的线程优先级
- **生命周期：**生命周期的状态、转换、相关方法
- **创建和使用：**线程的创建的两种方法、常用方法如 sleep，yield，状态获取等

---

### Thread 基本概念

**程序(program)：**是为完成特定任务、用某种语言编写的一组指令的集合。即指一段静态的代码，静态对象

**进程(process)：**是程序的一次执行过程，或是正在运行的一个程序。动态过程：有它自身的产生、存在和消亡的过程。程序是静态的，进程是动态的

**线程(thread)：**进程可进一步细化为线程，是一个程序内部的一条执行路径。若一个程序可同一时间执行多个线程，就是支持多线程的

Java 语言的 JVM 允许程序运行多个线程，它通过 java.lang.Thread 类来实现。

#### 进程和线程的区别

一个进程包含多个线程，线程是进程的一个子任务

#### Java 的线程优先级

优先级的意义就是优先级越高，越有可能先获得 CPU 资源，或者更多的 CPU 资源

特点：

- **继承性：**子线程持有和父线程一样的优先级
- **概率性：**高优先级仅仅是提高获取资源的概率，而不是绝对优先，换句话说，JVM 只是把你设置的优先级作为参考，实际执行还是看 JVM 自己的选择，大部分情况下 JVM 都会参考你的优先级

#### 守护线程（Daemon Thread）

从我的理解来看，线程的分类可以根据线程的服务对象来分为：

- **用户线程：**直接为业务服务的线程
- **守护线程：**直接为线程服务的线程或者间接为业务服务的线程

守护线程的意义在于**“守护”**，当线程中不存在用户线程了，守护线程就自动销毁，对于守护线程，*《Java 多线程编程核心技术》*一书说了一个很好的比喻：

> 任何一个守护线程就想一个保姆一样守护着整个 JVM 中所有的用户线程（原话是非守护线程），只要当前 JVM 里面还有一个用户线程没有结束，守护线程就得一直工作。只有当最后一个用户线程结束的时候，守护线程才自动随着 JVM 一同结束工作。Daemon 线程的作用就是为其他线程的运行提供便利。
>
> 守护线程典型的代表就是 GC，当程序里面没有用户线程了，也就没有垃圾回收的必要了，执行 GC 的线程自动销毁。

### 生命周期

| 状态名称      | 说明                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------- |
| NEW           | 初试状态，刚刚 new 出线程，但是还没有调用 start 方法                                             |
| RUNNABLE      | 运行状态，Java 线程中将操作系统中的“RUNNING”和“READY”两个状态统称为“RUNNABLE”                    |
| BLOCKED       | 阻塞状态，线程阻塞于锁                                                                           |
| WAITING       | 等待状态，表示线程进入无时间限制的等待，线程需要其他线程做一些通知或者中断动作                   |
| TIMED_WAITING | 超时等待状态，表示线程进入有时间限制的等待，在时间限制内可以进行中断或者通知操作，超时则自行返回 |
| TERMINATED    | 终止状态，线程已经执行完毕                                                                       |

![](../../img/TIM图片20180710172525.png)

### 线程创建与使用

#### 创建

**线程的实现方法：**

1. 继承 Thread 类
2. 实现 Runnable 接口并实现 run()方法

##### 方式 1：继承 Thread 类

```java
public class testThread {
    public static void main(String[] args) {
        //3、创建子类独对象
        SubThread subThread = new SubThread();
        //4、调用线程start方法 启动线程 调用run方法
        //5、run方法 并不启动线程
        subThread.start();
    }
}

//1、创建一个继承Thread类的子类
class SubThread extends Thread{
    //2、重写Thread类的run方法，方法内实现这个线程需要做的功能。
    @Override
    public void run() {
        super.setName("子线程");
        for (int i = 0; i< 10 ; ++i){
            System.out.println(Thread.currentThread().getName()+":线程方法");
        }
    }
}
```

##### 方式 2：实现 Runnable 接口

```java
public class testImplRunnable {
    public static void main(String[] args) {
        PrintNumber printNumber = new PrintNumber();
        //启动线程 执行Thread对象构造时传入的对象的run方法
        Thread thread = new Thread(printNumber);
        thread.start();

        Thread thread2 = new Thread(printNumber);
        thread2.start();
    }
}

class PrintNumber implements Runnable{

    @Override
    public void run() {
        for (int i = 0 ; i < 10 ; ++i){
            System.out.println(i);
        }
    }
}
```

##### 两种方式的对比

- **继承方式**让类在继承上面的选择受限，**接口实现方式**则很随意
- **继承方式**让类拥有一些**线程内建的方法**例如`yield()`，**接口实现方式**则没有

##### start() 和 run()的区别

1. 是否创建新线程：

   ```java
   public class testThread {
       public static void main(String[] args) {
           SubThread subThread = new SubThread();
           // start方法  创建新线程    由新线程去调用run方法
           subThread.start();
           // run方法    并不启动新线程 由当前线程调用run方法
           subThread.run();
       }
   }
   class SubThread extends Thread{
       @Override
       public synchronized void start() {
           super.start();
           System.out.println(Thread.currentThread().getName() + " start");
       }
       @Override
       public void run() {
           for (int i = 0; i< 3 ; ++i){
               System.out.println(Thread.currentThread().getName()+":线程方法");
           }
       }
   }
   ```

   Output:

   ```console
   main start
   main:线程方法
   Thread-0:线程方法
   Thread-0:线程方法
   Thread-0:线程方法
   main:线程方法
   main:线程方法
   ```

2. start 只能调用 1 次，而 run 可以调用无数次，就像调用一般的对象方法一样；

3. start 方法是 Thread 类实现的，而 run 方法是来自于 Runnable 接口的；

4. 如果你重写了 start 方法，那么 start 方法中的当前线程是父线程，而不是新线程；

#### 使用

##### currentThread()方法

这个方法获取正在调用当前代码段的线程的**线程对象**，获取到线程对象，我们可以获取线程的**名字、状态、ID 号、线程优先级、是否处于终端、是否处于活动状态**等信息，这些 API 在后面我们会一个个讲到

```java
@Test
public void testCurr(){
    System.out.println(Thread.currentThread().getName()); //main
    System.out.println(Thread.currentThread().isAlive()); //true
    System.out.println(Thread.currentThread().getState()); //RUNNABLE
    System.out.println(Thread.currentThread().getPriority()); //5
}
```

##### isAlive()方法

作用是判断当前线程是否**存活**，这个存活的界定是：**如果线程处于正在运行或者准备开始运行的状态，则判定线程存活**

##### sleep()方法

让当前线程睡上**n 毫秒**

```java
@Test
public void testSleep() throws InterruptedException {
    Runnable sleep = () -> {
        try {
            System.out.println(Thread.currentThread().getName() + " sleep");
            Thread.sleep(10 * 1000);
            System.out.println("sleep done");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    };
    Thread t = new Thread(sleep, "sleepThread");
    t.start();
    //t.run();
    Thread.sleep(1000);
    System.out.println(t.getState() + "  " + t.getName());
}
```

在**line：13-14**，我们需要注意：

- t.**start()方法**是以**新开一个线程**的方式运行**sleep.run()**
- start.**run()方法**是直接在**当前线程**中运行**sleep.run()**

所以当我们以**start 方式**去启动程序的时候，输出结果为：

```console
sleepThread sleep
TIMED_WAITING  sleepThread
```

可以看到线程名字为**sleepThread**，需要注意的是：

- 这个程序还有另外一个目的就是为了**检测睡眠中的线程到底是处于什么状态**，从结果得知，是**TIMED_WAITING 状态**
- 为了可以检测到睡眠线程，我们**在 main 线程中也睡了 1 秒**，原因是**sleepThread**只是**main 线程**的一个**子线程**，**如果 main 线程挂了，则其子线程也就跟着挂**，所以理论上来说，整个程序并不会看到**line：7**所输出的语句

当我们以**run 方式**启动线程的时候，输出为：

```console
main sleep
sleep done
NEW  sleepThread
```

可以看到，执行**sleep.run**方法的确实是**main 线程**，而且整个程序在输出第一行的时候，是睡了 10 秒再输出接下来的，然后我们的**sleepThread**也是没有运行，还是处于**NEW 状态**

###### 注意

> 在线程的**sleep**的过程中，如果调用了线程的中断方法`interrupt()`，则在 sleep 代码处会抛出`InterruptedException`异常，这个异常会**清除线程的中断标识**，所以你之前调用`interrupt()`方法设置的中断标识可能没用了，也就是说，如果要在有**sleep**代码的线程中使用中断标识去有效地进行终端操作的话，那么`catch(){}`语句块里就不能什么也不做，必须在`catch(){}`中有中断的逻辑，否则可能达不到中断的效果。

##### join()方法

在当前线程中调用`someThread.join()`方法，就是暂停当前线程，启动 someThread，只有当 someThread 执行完毕或者这个方法会被`interrupt()`打断，而抛出中断异常。

`join()`还有`join(long timeout)`，其内部实现如：

```java
public final synchronized void join(long millis) throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;
    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }
    if (millis == 0) {
        while (isAlive()) {
            wait(0);
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```

可以看到，join 方法就是如果本线程还存活，就无限等待自己，给别的线程让出机会

##### yield()方法

这个方法的作用是**放弃当前的 CPU 资源**，将它让给其他的任务去占用 CPU 执行，**但是放弃的时间不确定，有可能刚一放弃，马上就抢回来了，有点不要脸！**

##### getState()方法

获取一个 State 对象，表示当前线程的生命周期

### Object 方法

#### wait(long timeout)

作用是使当前执行代码的**线程（as T）**进入等待状态，由于`wait()`方法是 Object 类的方法，用来将**当前线程（T）**置入“等待队列”中。所以需要显式地使用**synchronized**块包裹起来，在 synchronized 块中再次获取**该锁（调用`wait()`的对象的对象锁，as OL）**，才能调用`wait()`方法，否则会抛出`java.lang.IllegalMonitorStateException`异常

> 注意：
>
> 1. 只有线程在获取了该锁对象的锁之后（在该锁对象的 synchronized 块或者方法中），才能调用该对象的`wait()`方法，否则抛出异常；
> 2. 在哪个锁对象上调用`wait()`方法，就释放哪个锁对象；
> 3. 无论 timeout 为多少，总是需要等到该同步区域再次竞争到锁对象时才能解除等待，如果其他同步区域一直不放弃该锁对象，那么前同步区域也一直获取不到该锁对象；

调用`wait()`方法之后，当前线程**马上（从 wait 那一行开始马上放锁，而不是直到退出 sync 块）**释放**该锁（OL）**，并进入等待队列**（对象锁对应对象的等待队列）**，此时线程进入 suspend 状态

如果 timeout 设置为 0 的话则没有超时时间，一直等到 notify

若要**线程 T**从`wait()`中返回：

- **其他线程**，获取到**OL**，并且调用该对象的`notify()`方法，并且**线程 T**，在等待队列中**随机地（arbitrarily）**被选中唤醒
- **其他线程**，获取到**OL**，并且调用该对象的`notifyAll()`方法
- **其他线程**，调用了**线程 T**的`interrupt()`方法，所以需要处理中断异常
- 除非 timeout 不是 0，到期超时自己返回

**线程 T**被**唤醒（notify）**之后，仍然和其他线程在通常的情况下，再次竞争**OL**，以获取进入同步的权力，一旦获取到权力，**线程 T**就会恢复到 wait 时候完全一样的状态，继续工作。

等待状态中的线程也可以不必被其他线程唤醒、打断、或者等待超时，我们可以自行**检测**唤醒的条件，满足条件就不再等待，换句话说，我们推荐你在使用`wait()`的时候使用以下这样的 loop：

```java
synchronized (obj) {
 while (<condition does not hold>)
     obj.wait(timeout);
 ... // Perform action appropriate to condition
}
```

需要注意的是，**线程 T**在`wait()`的过程中，仅释放**OL**锁，线程原来持有的锁仍会随着线程进入 wait 状态，我们可以做个简单的测试：

```java
public class WaitTest {

    private static String lockA = "la";
    private static String lockB = "lb";

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (lockA) {
                System.out.println("T1 got locak A");
                synchronized (lockB) {
                    System.out.println("T1 got locak B");
                    try {
                        System.out.println("T1 wait, released lockA for now");
                        lockA.wait(5000);
                        System.out.println("T1 come back from wait, and got lockA again");
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("T1 released lockB");
            }
            System.out.println("T1 released lockA finally");
        }).start();
        new Thread(() -> {
            System.out.println("T2 sleep 3 seconds");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (lockA) {
                System.out.println("T2 got lockA, and sleep 6 sec");
                try {
                    Thread.sleep(6000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("T2 released lockA");
        }).start();
        new Thread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("T3 wanna get lockB");
            synchronized (lockB) {
                System.out.println("T3 got lockB");
            }
            System.out.println("T3 released lockB");
        }).start();
    }
}
```

输出：

```console
T1 got locak A
T2 sleep 3 seconds
T1 got locak B
T1 wait, released lockA for now
T3 wanna get lockB
T2 got lockA, and sleep 6 sec
T2 released lockA
T1 come back from wait, and got lockA again
T1 released lockB
T1 released lockA finally
T3 got lockB
T3 released lockB
```

我们需要注意 2 点：

1. 在 14 行虽然设置了超时时间是 5 秒，但是仍旧等待了 6 秒，因为 t2 占有了 lockA6 秒之久
2. 虽然 t1 在某时刻释放了 lockA，但是 t1 持有的 lockB 还没释放，最后 t3 还是得等到 t1 释放了 lockB 之后才能获取到 lockB

总结一下时间线，按照绝对时间来说：

- 0 秒开始不久：

  - T1 拿到 A 锁，随后拿到 B 锁，然后在 A 锁上 wait，并且超时 5 秒；
  - T2 开始沉睡 3 秒
  - T3 开始沉睡 1 秒

  > 这时 A 锁已经释放，B 锁被 T1 抓住

- 1 秒时：

  - T3 醒来，在 B 锁的门前 BLOCK 住，因为这时候 B 锁被 T1 抓住着；
  - T2 还在睡，还有 2 秒；
  - T1 在等待 A 锁超时，还剩 4 秒；

- 2 秒时：

  - T1 在等待 A 锁超时，还剩 3 秒；
  - T2 还在睡，还有 1 秒；
  - T3 仍在等 B 锁；

- 3 秒时：

  - T2 醒来，拿到 A 锁，并沉睡 6 秒；
  - T1 在等待 A 锁超时，还剩 2 秒；
  - T3 仍在等 B 锁；

- 5 秒时：

  - T1 等待 A 锁超时结束，但是 A 锁被 T2 抓住睡觉了，还剩 1 秒，所以 T1 BLOCK 住；
  - T2 还有 1 秒苏醒；
  - T3 快哭了；

- 6 秒时：

  - T2 醒来，放开 A 锁；
  - T1 拿到 A 锁，没事干了，放开 B 锁，放开 A 锁；
  - T3 终于拿到 B 锁了；

#### notify()

唤醒在该对象**等待队列**中的一个等待线程，在队列中等待的线程是被**随机选取**唤醒的，且必须是由调用该对象`wait()`方法而进入的等待队列

被唤醒的线程会和其他线程一样，在同样的情况下一起竞争该**对象的同步锁（as OL）**

> 细节说明：
>
> 1. 被 notify 通知的对象，并不是马上就获取**OL**，而是还需要积极竞争
> 2. notify 之后，和 wait 不一样的是，并不是马上放锁，而是直到退出 sync 区域之后才释放锁

本方法只能在当前线程**持有该对象锁的时候，才能调用该对象的`notify()`方法**：

- By executing a synchronized instance method of that object.
- By executing the body of a `synchronized` statement that synchronizes on the object.
- For objects of type `Class,` by executing a synchronized static method of that class.

否则会抛出`java.lang.IllegalMonitorStateException`异常

#### notifyAll()

唤醒在该对象**等待队列**中的所有等待线程，且必须是由调用该对象`wait()`方法而进入的等待队列

被唤醒的所有线程会和其他线程一样，在同样的情况下一起竞争该**对象的同步锁（as OL）**

#### 讨论一下 wait 的风险

这是在几个月前顺丰科技面试的时候，一面面试官问我的问题，当时我没答上，因为当时准备的很不充分，连 wait 和 sleep 的区别都没看，估计是因为这个原因，面试官以为又摸到我的上限了，顺丰科技还是挺想去的

今天看了一下 wait 和 notify 之后，感觉能回答出这个问题了

1. 因为 wait 并**不会释放线程占有的其他锁**，如果忽略掉这个问题的话，会隐形地制造一些**死锁**，当然，这属于**设计上**的问题

   ```java
   new Thread(() -> {
       synchronized (lockA) {
           synchronized (lockB) {
               try {
                   String lock = lockA;
                   lock.wait(10000);
               } catch (InterruptedException e) {}
           }
       }
   }).start();
   new Thread(() -> {
       try {Thread.sleep(300);} catch (InterruptedException e) {}
       synchronized (lockA) {
           synchronized(lockB) {}
       }
   }).start();
   ```

   当线程 1 放弃了 LockA 并且进入阻塞的情况下，线程 B 获取到了 LockA 并且在获取 LockB 的时候阻塞，然后线程 A 也进入了阻塞状态，因为要从 wait 返回的条件是竞争到 LockA，而这时候 LockA 已经被别的线程获取了；

   在这种状态下，超时就无效了，发起中断也无效，因为发起中断只是打了标志，线程 A 仍然需要获取到 LockA 才能返回；

   而使用`Lock`API 就能够很好地解决这个问题，因为它能够提供**非阻塞式、有超时**的获取锁获取不到就超时返回；

2. 因为 wait 的唤醒机制还是重新去竞争锁，如果竞争不顺利的话，会一直返回不了**等待前的状态**，导致这个线程进入**饥饿状态**

3. 同样的 notify 的唤醒是随机的，如果运气不好的话，线程会一直在等待队列中没有被选中，也进入了一种**饥饿状态**
