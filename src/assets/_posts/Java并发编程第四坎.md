---
title: Java并发编程第四坎
categories:
  - java
  - concurrency
  - 《艺术》与《技术》
comments: true
tags:
  - java
  - thread
  - volatile
  - synchronized
date: 2018-7-18 14:16:48
series: 并发
---



### 前言

这回说说Java并发编程第四坎，最常用的**volatile和synchronized关键字**，这两个关键字是理解java同步编程的第一步，特别是**synchronized关键字**

而在*《Java多线程编程核心技术》*的第2.1节中，作者不经意的道出了**线程同步的真谛之一：避免脏读**

- **关键字的解说**
  - **volatile的含义、底层实现和使用**
  - **synchronized的含义、底层实现和使用**
    - Java中的几种锁
    - Java中的锁到底是什么？
  - **两个关键字的对比**

------

### 关键字的解说

关键字的解说分别从三个方面进行，首先解释关键字的基本含义，然后上一些基本使用的代码，最后结合两本书来说说关键字的底层实现。

以下两段摘自*《艺术》P96*

> **关键字volatile**可以用来修饰字段（成员变量），就是告知程序任何对该变量的访问均需要从共享内存中获取，而对它的改变必须同步刷新回共享内存，它能保证所有线程对变量访问的**可见性**。

>**关键字synchronized**可以修饰方法或者同步块，它主要保证多线程在同一时刻，只能有一个线程处于同步块或者同步方法中，它保证了线程对变量访问的**可见性**和**排他性**。

#### volatile的含义、底层实现和使用

##### volatile的含义

> Java语允许线程访问共享变量，为了确保共享变量可以被准确和一致地更新，线程应该确保通过**排他锁**单独获取这个变量。

如果一个变量被声明为volatile，Java线程内存模型确保所有的线程看到这个变量的值是一致的。

关于Java内存模型我们放到以后再说，总的来说，使用`volatile`声明了的变量，可以说任何对该变量的读写都是上了锁的，这种锁只针对改变量，是一种轻量级的锁

共享变量是什么概念呢？我们知道，线程运行的时候，很多时候是使用自己创建的私有线程栈空间去操作数据的，那么每个线程都操作的自己的栈空间，导致同一个意义的值在不同的线程中可能有不同的值，所以volatile变量强制让线程只从共享内存的意义上去操作变量，保证了**可见性**

![](https://image.youyinnn.top/TIM%E5%9B%BE%E7%89%8720180717215051.png)

##### 底层实现

让我们来看看在对volatile变量进行写操作的时候，CPU会干哪些事：

Java代码：

``` java
instance = new Singleton()	//instance是volatile变量
```

转变为底层汇编代码：

``` assembly
0x01a3deld: movb $0*0,0*1104800(%esi); 
0x01a3de24: lock addl $0*0,(%esp);
```

需要注意的是第二行代码，有volatile修饰的变量进行写操作的时候会多出第二行汇编代码，关键是里面的**lock**前缀的指令，在多核处理器下会有：

1. 将当前处理器缓存行的数据写回到系统内存
2. 这个写回内存的操作会使**其他CPU里缓存了该内存地址的数据无效**

因为要提高处理速度，处理器并不直接和内存通信，而是先把系统内存的数据读到内部缓存后再进行操作，但是操作完之后何时将数据写到内存是不确定的。

如果对生命了volatile的变量进行写操作，JVM就会向处理器发出一条**lock前缀指令**，将这个变量所在的缓存行写回到内存，但是就算写回内存，其他处理器的缓存行的值还是旧值，所以需要一种机制：

**缓存一致性协议：为了保证各个处理器的缓存是一致的，每个处理器通过嗅探在总线上传播的数据来检查自己的数据是否过期，如果过期则将自己缓存行中的值设置为无效，等待下次时机再去内存中取有效值。**

上面的两条规则也是实现volatile关键字的两条原则：

1. Lock前缀指令让处理器缓存写回内存
2. 步骤1后，通过缓存一致性协议，让其他处理器的缓存行中的该值无效

##### 使用

volatile的使用非常简单，有volatile修饰的变量天然是一个**“受保护”**的临界资源，对于变量的赋值和访问天然上锁

``` java
    private volatile int mutex = 0;
    public void setMutex(int mutex){
		this.mutex = mutex;
    }
    public int getMutex(){
		return mutex;
    }
```

但是我们需要注意的是，**volatile关键字只能对一个原子操作保持同步！**

常见的陷阱是：

``` java
	i++;	// i是volatile变量
```

这行代码是否线程安全，答案是否定的，i++这行代码是分两步进行的：

``` java
	int temp = i + 1;
	i = temp;
```

这样的两步操作有可能会引发线程安全问题，有可能就在这两行代码中间有多个线程进行操作，i可能变成了脏数据



#### synchronized的含义、底层实现和使用

对于这个关键字，在并发里也是非常重要了，在Java SE1.6之前，很多人把它称之为重量级锁，但是在1.6之后，很多情况下它变得不是那么重量了，为了减少获取锁和释放锁带来的性能消耗，Java SE1.6引入了**偏向锁**和**轻量级锁**，在本节中间会讨论锁的存储和升级

##### synchronized的含义

> Java中的每个对象都可以作为**“锁”**，使用synchronized关键字可以表现为：
>
> - 可以修饰在在方法上，则锁是当前调用方法的对象
> - 可以在修饰在静态方法上，锁是当前类的Class对象
> - 可以作为同步方法快，锁是括号里配置的对象
>
> 当一个线程视图要访问同步代码的时候，它首先要获得锁，**退出锁范围或者抛出异常的时候，必须要释放锁**

##### 底层实现

JVM规范中说明了synchronized的实现原理：JVM基于进入和退出Monitor对象来实现方法同步和代码块同步，但是两者的实现细节不一样。

代码块同步是使用`monitor.enter`和`monitor.exit`指令实现的，而方法同步虽然实现不一样，但是也可以用这样的方法去实现。

`monitor.enter`指令是在编译后插入到同步代码块的开始位置，而`monitor.exit`是插入到方法结束或者异常处，JVM要保证每个`monitor.enter`都要有`monitor.exit`和之匹配，任何对象都有一个monitor与之关联，当一个monitor被线程持有之后，它就会锁定，其他不相干的线程无法一同持有该锁

##### Java中的锁到底是什么

接下来这节是重点重点重点重点重点重点重点！！！

基于上面的机制，我们可以来说说Java中的锁到底是什么

以下摘自*《艺术》P96-98*

> 首先我们看一段代码：
>
> ``` java
> public class Syn{
>     public static void main(Stirng[] args){
>         // syn代码块
>         synchronized(Syn.class){}
>         // 静态同步方法
>         m();
>     }
>     public static synchronized void m(){}
> }
> ```
>
> 在Syn.class同级目录执行`javap-v Syn.class`，部分输入如下：
>
> ``` java
> public static void main(java.lang.String[]);
> 	Code:
> 		stack=2, locals=1, args_size=1
>         0: ldc
>         2: dup
>         3: monitorenter	// 这个地方监视器进入
>         4: monitoreit	// 监视器退出
>         5: invokestatic // m()
>         8: return
>     
>     public static synchronized void m();
> 	flags: ACC_PUBLIC, ACC_STATIC, ACC_SYNCHRONIZED
> 		Code:
> 			stack=0, locals=0, args_size=0
>             0: return
> ```
>
> 上面的class信息中，同步块是使用使用`monitor.enter`和`monitor.exit`指令实现的
>
> 而同步方法则是使用`ACC_SYNCHRONIZED`修饰符完成的
>
> 无论是那种方法，本质都是对一个对象的监视器进行获取，这个获取的过程是**排他的**

之前反复强调**“锁”、“监视器”**，我们模糊地知道**“锁”**是干嘛的，但什么是**“监视器”**？*《艺术》*告诉你答案！

> 任意一个对象都拥有自己的<u>监视器</u>，当这个对象由同步块或者这个对象的同步方法调用的时候，执行方法的线程必须先获取到对象的监视器才能够进入同步块或者同步方法中，而没有获取到监视器（执行该方法）的线程会被阻塞在同步块和同步方法的入口处，进入**BLOCKED**状态

引用书上的图来说明：

![](https://image.youyinnn.top/monitor.png)

如图所示，**监视器负责坚定的维护一个同步队列，所有尝试获取监视器而失败的线程，都会在该监视器维护的同步队列后面排队，直到被唤醒或者出现意外情况**

所以从这个意义上来说，监视器可以说是一把钥匙，拿到钥匙（监视器）的人才可以进屋搞事情，没钥匙的人得先在门外（锁外）排队等，完事了的人（上一个拿到监视器的人退出锁区）出门走的时候，把钥匙交给当前正在排队的队伍最前面的人

所以优先级什么的，可以说是插队，意外情况比如抛异常可以说是中途离队

于是我们需要清楚的认识：**门可以有多个，但是锁只有一把，一把锁一条队！要使用这把锁，上一个锁持有者没释放锁之前，你就去排队吧！**

##### 锁的升级和实现

Java SE1.6以后，锁一共有四个状态，从低到高一共是：无锁状态、偏向锁状态、轻量级锁状态和重量级锁状态

这几个状态会根据竞争的激烈情况逐渐升级，但是要注意：<u>锁可以升级但是不能降级</u>

###### 偏向锁

**偏向锁的含义：**如果总是同一线程某时段多次访问同步数据，则锁的意义不大。

**偏向锁的实现：**当一个线程访问同步块并获取到锁的时候，会在对象头和栈帧中的锁记录里存储偏向锁的线程ID，以后在没有争夺的时间段里，该线程获进入和退出同步块的时候不需要进行CAS操作来加锁和解锁

**偏向锁的撤销：**偏向锁使用了一种<u>等到有竞争</u>的时候才解锁的机制

我将持有偏向锁的线程称为偏向线程，偏向锁的撤销机制指的是：当偏向线程执行过程中，有其他线程尝试竞争锁的时候，<u>偏向锁首先会暂停偏向线程，然后检查偏向线程是否存活，如果不存活，则对象头设置为无锁状态；如果存活，会执行偏向锁的栈，遍历偏向锁的竞争记录，最后偏向锁要么重新偏向于其他线程，要么恢复到无锁状态或者升级锁；这波操作做完之后，再唤醒原来的偏向线程</u>

偏向锁要注意的事情：

1. 偏向锁机制的启动有延迟，一般是Java程序启动的几秒之后才启动这个机制，可以使用JVM参数来关闭延迟
2. 还可以用JVM参数来关闭偏向锁，那么程序默认都会使用轻量级锁

###### 轻量级锁

**轻量级锁的含义：**出现竞争的时候，线程并不阻塞，而是企图使用自旋的方式来继续尝试获取锁

**轻量级锁的加锁：**

1. 线程在执行同步块的之前，JVM首先在<u>当前线程的栈帧</u>中创建用于存储锁记录的空间，并把对象头中的Mark Word复制到锁记录中，这部操作官方叫**Displaced Mark Word**
2. 然后线程要获取锁的时候，会尝试使用CAS将对象头中的Mark Word替换为指向锁记录的指针，如果成功，则获取到锁，如果失败，则表示有其他线程在使用锁或者先你一步竞争锁，则当前线程尝试使用**自旋（用一个合理的永真循环来不停的试着获取锁）**来获取锁

**轻量级锁的解锁：**解锁的时候，会使用CAS操作将**Displaced Mark Word**替换回对象头，如果成功，则表示没有发生竞争，如果失败，表示当前锁存在竞争，<u>锁就会膨胀成重量级锁</u>

书里有一张图描述了膨胀的过程，我简单总结一下：两个线程AB分别访问同步块，同时尝试<u>**分配栈空间、复制Mark Word到栈**</u>，加入线程A比B快，则线程A成功<u>**使用CAS操作将Mark Word替换为轻量级锁，并执行同步块；**</u>此时线程B<u>**尝试自旋获取锁，一段时间后未果，将锁修改为重量级锁，线程B阻塞；**</u>再回去看线程A，线程A执行完同步语句块之后，<u>**尝试CAS替换会Mark Word，但是已经被线程B修改了，所以失败，线程A释放锁并唤醒线程B**</u>；线程B重新竞争同步语句块；

在线程B**自旋失败，打算膨胀的那一刻起，锁就已经升级了！**

##### 锁的优缺点对比

|    锁    |                             优点                             |                    缺点                    |             适用场景             |
| :------: | :----------------------------------------------------------: | :----------------------------------------: | :------------------------------: |
|  偏向锁  | 同线程的加锁解锁不需要消耗，和执行非同步方法相比速度相差纳秒级别 | 如果线程存在竞争，会带来额外的锁撤销的消耗 | 适用于只有一个线程访问同步块场景 |
| 轻量级锁 |                竞争线程不会阻塞，提高相应速度                |   如果始终得不到锁，会消耗大量的CPU资源    |  追求响应时间，同步块执行速度快  |
| 重量级锁 |                       不用自旋，消耗少                       |              线程阻塞，响应慢              |   追求吞吐量，同步块执行时间长   |

#### Synchronized关键字使用须知

上面说了很多原理性的东西，现在.....我们还是来说原理，现在主要是说一些该关键字的使用的注意事项

##### 1. 脏读的情况

什么是脏读？脏读就是程序读到了不完整的数据，这是**读取操作没有同步处理的原因**

什么又是不完整的数据？也就是在一次原子的更新过程中，程序在更新过程还没有完成的时候就读取了整个数据

比如我们的一个线程意图是将**A（1，2，3）**更新为**A（4，5，6）**的，虽然更新操作实现了同步，同一时刻只能保证一个程序对数据进行更新，但是读取操作没有进行同步，有可能有更新操作更新到一部分的时候**A（4，5，3）**，数据被错误地读取到了，这个脏读值是无效的

如何避免脏读？**保证读取方法也被包含在同步块中或者方法本身就是同步方法，最重要的一点是，读取方法和更新方法所面向的监视器得的同一个监视器！不要排错队了！**

##### 2. 锁重入

锁重入的概念挺简单：

``` java
synchronized(obj a){
    // some code before
    synchronized(the same obj a){
        // another code in here
    }
    // blablabla
}
```

当然上面的代码是一个错误的示范，重入不是这么重入的，这样的重入没有意义，但实际上，有意义的锁重入从方法栈的角度来说，确实就是这样的，比如：

``` java
synchronized public void a(){
    // a code
    b();
}

synchronized public void b(){
    // b code
    c();
}

synchronized public void c(){
    // c code
}
```

为什么可以说这种锁重入是有意义的呢？我觉得也没什么意义，一旦某个线程拿到a方法的执行权之后，该对象下所有的同步方法，是无法被其他线程调用的，这里的意义只是，abc三个方法需求的是同一个锁，也就是三个门用的是同一把钥匙，你既然已经拿到钥匙了，那么三个门你想怎么开就怎么开

##### 3. 有异常 则放锁

基本的机制，贯彻整个同步知识，但是容易忽略掉

##### 4. 代码块之间的同步性

在使用同步块的情况下，如果有多个同步块持有的是同一个锁，在其中一个同步块被访问的时候，该锁就被该线程持有了，那么该锁的同步块无法被其他线程锁访问，说白了：**钥匙只有一把！谁拿到钥匙，谁开锁进门！**

##### 5. 对象的同步方法之间的同步性

多个线程调用同一对象中不同的同步方法或者synchronized(this)方法块的时候，多线程的调用效果是同步的，因为：**拿的是一把锁，排的是一条队！**

##### 6. Class锁

Class锁可以对改类的所有对象实例起同步作用，基于上述反复强调的原理，<u>同步synchronized（class）代码块的作用和synchronized static方法的作用是一样的</u>

##### 7. 常量池对象作为锁的注意事项

String因为有常量池去管理，所以有可能两个变量引用的是同一个String常量对象，尽量不要使用String直接量作为锁，宁可new一个作为锁



#### Volatile和Synchronized的对比

|    关键字    |                   性能                   |   响应   |                       安全性                       |               场景               |
| :----------: | :--------------------------------------: | :------: | :------------------------------------------------: | :------------------------------: |
|   volatile   |                    快                    | 不会阻塞 |         只能保证数据可见性，不能保证原子性         |  解决变量在多个线程之间的可见性  |
| synchronized | 虽然没volatile快，但是速度还是可以接受的 |  会阻塞  | 可以保证操作的原子性，**也可以间接保证数据可见性** | 解决多个线程之间访问资源的同步性 |

然而对于synchronizrd**可以间接保证数据可见性**，暂时需要找个合适的方法去验证



### * 关于synchronized间接保证数据同步性的问题

首先我们准备一个类作为验证区：

``` java
class BService {
	private boolean continueRun = true;
	public void runMethod() {
		while(continueRun == true) {
			try {Thread.sleep(10);
			} catch (InterruptedException e) {e.printStackTrace();}
		}
		System.out.println("停下来了！");
	}
	public void stop() {continueRun = false;}
}
```

可以看到，该类有一个run，一旦执行方法，只有等到`continueRun`被置否的时候，也就是说对象调用stop的时候，才会停下来，而我们在run方法里面，尝试睡眠10ms

然后我们把这个类对象放到多线程场景当中去：

``` java
class ThreadA extends Thread {
	private BService service;
	public ThreadA(BService service) {this.service = service;}
	@Override
	public void run() {service.runMethod();}
}

class ThreadB extends Thread {
	private BService service;
	public ThreadB(BService service) {this.service = service;}
	@Override
	public void run() {service.stop();}
}
```

线程A负责跑，线程B负责停，然后是我们的main方法：

``` java
	public static void main(String[] args) throws InterruptedException {
		BService service = new BService();
		ThreadA a = new ThreadA(service);
		a.start();
		Thread.sleep(1000);
		ThreadB b = new ThreadB(service);
		b.start();
		System.out.println("已经发起停止命令了！");
	}
```

需要注意的是，这里AB线程虽然用的是同一个对象，但是因为线程私有栈的原因，每个线程虽然用的是同一个对象去调用方法，但是对象中的值在各自线程中有自己的副本，所以B线程置否了`continueRun`变量，但是线程A并不知道这个情况，除非**B置否的变量被同步到共享内存，而线程A放弃自己的副本值，采用共享内存的值**

#### 空闲CPU同步内存？

上面加粗的内容就是**内存可见性**的保证，在当前试验区类中，并没有做明显的保证线程安全的举措，但是当你运行程序你会发现，B线程是可以停止A线程的，这是为什么？我在一篇博客中看到了一个有意思的想法：

> 实际上，JVM对于现代的机器做了最大程度的优化，也就是说，最大程度的保障了线程和主存之间的及时的同步，也就是相当于虚拟机尽可能的帮我们加了个volatile，但是，当CPU被一直占用的时候，同步就会出现不及时，也就出现了后台线程一直不结束的情况。 
>
> *参考：https://www.cnblogs.com/cookiezhi/p/5774583.html*

所以，当我们的线程在沉睡了10ms的时候，CPU就有空闲时间去进行内存同步了，于是就有了线程A看见了线程B置否了变量

#### 无意义的synchronized块保证同步内存？

来看看为什么我不认同*《技术》*一书上说的**“syn块具有同步功能”**，首先上他所说的，没有内存可见的主体代码：

``` java
public class BThreadTest {
	public static void main(String[] args) throws InterruptedException {
		BService service = new BService();
		ThreadA a = new ThreadA(service);
		a.start();
		Thread.sleep(1000);
		ThreadB b = new ThreadB(service);
		b.start();
	}
}

class BService {
	private boolean continueRun = true;
	public void runMethod() {
		while(continueRun) {}
		System.out.println("停下来了！");
	}
	public void stop() {continueRun = false;}
}

class ThreadA extends Thread {
	private BService service;
	public ThreadA(BService service) {this.service = service;}
	@Override
	public void run() {service.runMethod();}
}

class ThreadB extends Thread {
	private BService service;
	public ThreadB(BService service) {this.service = service}
	@Override
	public void run() {service.stop();}
}
```

四个类大致和上面的例子差不多，这样的代码运行起来永远也不会停止，

而书上说，只需要将`runMethod`方法改为：

``` java
	public void runMethod() {
		String anyString = new String();
		while(continueRun) {
			synchronized(anyString) {}
		}
		System.out.println("停下来了！");
	}
```

确实，这样做是可以停下来，但是书上的解释是：

> 关键字synchronized可以保证在同一时刻，只有一个线程可以执行某一个方法或者某一个代码块。
>
> 它包含两个特征：互斥性和可见性。
>
> 同步synchronized不仅可以解决一个线程看到对象处于不一致的状态，还可以保证进入同步方法或者同步代码块的每个线程，都看到由同一个锁保护之前所有的修改效果。

这句话，歧义扉多，而且和演示程序完全搭不上边，线程A的锁完全没有任何同步意义，线程B也完全不会和线程A进入同一个锁，甚至线程B根本就不会进入任何一个锁，在这样的意义下，无法验证synchronized影响到了两个线程的`continueRun`变量的同步

但事实上这个程序确实是可以停止的，至于为什么，我的猜测是：**同步代码块虽然没有意义，但是它有一定的时长消耗性，在这样的情况下CPU出现了空闲，于是由上一个例子的结论可知，CPU在空闲的时候对两个线程的本地变量进行了同步！！**

后面这节多是我自己的推断。

