---
title: Java并发编程第二坎
categories:
  - java
  - concurrency
  - 《艺术》与《技术》
comments: true
tags:
  - java
  - thread
  - interrupt
  - stop&suspend&resume
date: 2018-7-15 10:53:22
series: 并发
---



### 前言

前一篇基本说了线程的基本概念和如何创建一个线程，以及非常基本的几个线程方法，接下来我们说说线程的前几个控制相关的方法，包括和暂停一个线程（PAUSE）、让暂停的线程恢复（RESUME）、让线程终止（STOP）

这篇我们但是这几个方法不能直接去用，因为这些方法都**过期了**！下面就着Java官方的文档解释，说说为什么过期这几个方法，以及贴出官方给的模板方法去实现这几个过期方法，具体的实现会在后面有例子

-------


#### 中断线程

我们现在已经可以跑起来一个线程了，但是对于线程的控制力度还不够，我们希望在处理线程子任务的时候，碰到需要暂停任务的情况的时候，我们有能力马上就退出

但是停止线程的任务并不简单，总的来说，停止线程的方式有这么三种：

- **让run方法执行完**，线程就停了
- **使用stop方法**，但是这个方法**绝对不能够使用**，因为不安全而被列为**过期方法**
- **使用interrupt方法去中断线程**

这么看来，如果要在线程任务中间去停止线程，只能使用**interrupt方法**，但是这个方法也**不是说停就停**的



##### interrupt()

我们来看看方法的源码介绍，方法注释就不解释了，注释里主要说的是一些异常信息，其实这个方法的本质**只是在当前线程中打了一个中断标志，并不是真正地停止线程！**

```java
public void interrupt() {
    if (this != Thread.currentThread())
        checkAccess();

    synchronized (blockerLock) {
        Interruptible b = blocker;
        if (b != null) {
            interrupt0();           // Just to set the interrupt flag
            b.interrupt(this);
            return;
        }
    }
    interrupt0();
}
```



##### 判断线程中断

**Thread类**中有两个方法可以用于判断线程是否中断，分别是：

1. **Thread.interrupted()：测试当前线程是否已经中断**
2. **this.isInterrupted()：测试线程是否已经中断**

很明显，这两个方法是有区别的，区别就在于**“当前线程”**是谁了，当前线程指的是运行**Thread.interrupted()**方法的代码段所在的线程

我们看源码：

```java
public static boolean interrupted() {
    return currentThread().isInterrupted(true);
}
public boolean isInterrupted() {
    return isInterrupted(false);
}
private native boolean isInterrupted(boolean ClearInterrupted);
```

可以看到，**interrupted()**其实也是调用的**本地方法isInterrupted(boolean clearInterrupted)**，而且是**当前线程（currendThread）去调用**，所以这个方法是静态方法，而**isInterrupted()**同样也是调用**本地方法isInterrupted(boolean clearInterrupted)**，只是这个调用是通过this去调用的

还需要注意的是，**interrupted()会清楚中断标识，而isInterrupted()不会**



##### 有效中断的方法

前面我们说了，**interrupted()**方法只是设置中断flag，到底怎么真正停止线程呢？

**方法1：**

我们就可以使用上面的**判断中断方法+程序流程设计**去实行有效地中断

```java
int i = 0;

@Test
public void testEffectedInterrupt() throws InterruptedException {
    Runnable run = () -> {
        System.out.println(Thread.currentThread().getName());
        while (true) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("interrupted!");
                break;
            }
            System.out.println(Thread.currentThread().isInterrupted());
            System.out.println(i++);
        }
    };
    Thread t = new Thread(run, "runThread");
    t.start();
    Thread.sleep(10);
    t.interrupt();
}
```

**runThread**一直在跑，只不过在跑之前会判断一下自身线程的**中断标志**，如果被设置了**中断标志**，那while就break，也就是说方法已经执行完毕了，**线程自然死亡**

当然这里是在main线程里面调用**runThread**的中断方法，**runThread**内部也可以不依靠中断方法去break语句，这里只是示例外部中断

**方法2：**

也许你可以使用**interrupt()方法+return语句**，和上面的break差不多骚，都是为了到达run方法的底部

> 2018年7月9日 13点12分 补充如下：
>
> 我在Servlet中尝试使用interrupt()设置中断标识的方法去中断线程，但是很遗憾的是失败了，但是单独写在Main数中，或者在Android代码中去验证却是可以，不太清楚是不是Servlet对线程有什么影响，所以中断线程可以用官方给的模型去中断，即用一个volatile布尔变量去设置`run(){while()}`的run方法的while循环退出条件
>
> 搞懂为什么失败了，我在线程run方法中有**Thread.sleep()**方法，虽然我while循环最开始就有isInterrupt()方法做判断，但是大部分时间线程是在sleep()方法中的`TIMED_WAITING`状态下，在这个状态下使用interrupt()方法去中断线程会在sleep方法被调用处抛出`InterruptedException`异常，如果在catch语句中没有跳出循环的语句的话，下次while循环中的isInterrupt()仍然是false，因为一旦抛出`InterruptedException`异常就会**清除线程的中断标志**
>
> 我们看看sleep的源码说明：
>
> ``` java
>     /**
>      * Causes the currently executing thread to sleep (temporarily cease
>      * execution) for the specified number of milliseconds, subject to
>      * the precision and accuracy of system timers and schedulers. The thread
>      * does not lose ownership of any monitors.
>      *
>      * @param  millis
>      *         the length of time to sleep in milliseconds
>      *
>      * @throws  IllegalArgumentException
>      *          if the value of {@code millis} is negative
>      *
>      * @throws  InterruptedException
>      *          if any thread has interrupted the current thread. The
>      *          <i>interrupted status</i> of the current thread is
>      *          cleared when this exception is thrown.
>      */
>     public static native void sleep(long millis) throws InterruptedException;
> ```
>
> 之前实验的时候，使用到了sleep，使用interrupt怎么都测不到isInterrupted()为true，然后catch语句块里也没有做任何处理，所以线程始终无法停止，搞得我以为哪里出错了
>
> 关于怎么写stop、suspend、resume方法的代码贴在后面

##### 关于stop()强制停止

关于这个作废的方法，我们还是要说一下为什么这方法被作废了，当然最权威的介绍还是官方解释了*[Why are Thread.stop, Thread.suspend and Thread.resume Deprecated?](https://docs.oracle.com/javase/8/docs/technotes/guides/concurrency/threadPrimitiveDeprecation.html)*

官方给出的**stop()过期解释**：

> 强制性地使用**stop()**方法会**释放当前线程所持有的所有锁（监控器会因为ThreadDeath异常被抛到方法栈的最上层而解锁）**，有的锁并不是我们期望释放掉的，所以这样会**导致某些同步数据在并发且不完全锁上**的情况下被修改，如果在这种**状态**不一致的情况下，事先有任何对象被这些监视器所保护着的话，其他的对象也会看到这些不一致的**状态**，我们可以认为，这些对象已经被**破坏（damaged）**了，再用这些对象去执行任务已经没有意义了
>
> 而且上述的影响很微妙，短时间内是无法检测出来的，因为不像其他**非受检异常（unchecked exceptions）**，**ThreadDeath**异常是一种**静默异常**，因此，如果程序因为这个异常而出错，用户通常是不会收到任何警告的，可能过个几个小时或者几天，程序才会因为最开始的**强制停止**所带来的长久影响而抛出某个业务中的异常

官方解释中说明了，虽然从理论上，你可以抓取**ThreadDeath**异常去尝试修复被破坏的对象，**但是这样的做法是不现实的：**因为你需要非常严谨的逻辑去处理整个子任务，在这个严谨的过程中你还需要更严谨地去处理强制中断的破坏修复，这样的做法得不偿失，甚至代价超过任务本身，而且**ThreadDeath**这个异常在任何地方、任何时间都可以抛，你不确定这个异常是不是你想要的那个

最终官方给出了一个**简单且有效**的方法去实现线程停止：

```java
private volatile Thread blinker;

public void stop() {
    blinker = null;
}

public void run() {
    Thread thisThread = Thread.currentThread();
    while (blinker == thisThread) {
        try {
            Thread.sleep(interval);
        } catch (InterruptedException e){
        }
        repaint();
    }
}
```

如代码里面所示，线程一旦开启，就进入到**run()**方法的**while循环**里面，**while循环**退出的点是**blinker等于当前线程**的时候，我们只需要简单的**在外部将这个同步变量置空**，这样线程就会**结束while循环——方法结束——退出线程**，达到暂停线程的效果

但是这个方法还不够强，如果说，我们要让一个**陷入长时间wait的线程中断的话（陷入wait就意味着线程卡在某个代码段那不继续往下执行了，而是等着抢资源）**这个时候你就别指望说线程会跑到**line：9**去判断了

所以这里就该是我们的**interrupt()方法**登场了~

官方称，**interrupt()**方法就是为了这一刻而诞生的，上述例子的**blinker = null**也是一种有效的**“基于状态”的信号机制**，**interrupt()**方法也差不多是这个概念，它甚至可以中断等待

```java
public void stop() {
    Thread moribund = waiter;
    waiter = null;
    moribund.interrupt();
}
```

>  这个机制，对于在任何**捕获到中断异常并且还没有准备好马上重新断言异常**的方法来说很重要，我们常说**宁可重新断言一个异常也不要抛出这个异常**，因为重新抛出异常的做法并不总是好的
>
> 如果一个方法捕获到了**没有声明过的中断异常**，你应该让这个线程**再中断它自己一次**
>
> ```java
> Thread.currentThread().interrupt();
> ```
>
> 以保证它尽可能及时地发出中断异常



##### 在sleep()里中断线程

没什么说的，**sleep()**的调用需要捕获中断异常，如果在**sleep()**的过程中中断异常的话，就会抛出**中断异常**，在**catch语句块中处理中断的后续逻辑**就好了，**<u>请一定要在catch块中做出中断处理！！！（原因见sleep的注意事项）</u>**



#### 暂停/恢复线程

同样的，因为不安全，**suspend()和resume()**方法也都过期了，禁止使用，在和**stop()**被过期的官方介绍中同样介绍了原因：

> **Thread.suspend**方法有天生的死锁倾向
>
> 如果目标线程持有一个**非常重要的系统资源的锁**的时候，如果我们使用**Thread.suspend**去试图暂停这个线程的话，没有任何其它的线程可以访问到这个**系统资源**，除非再调用**Thread.resume**方法，线程执行完毕才有可能重新竞争这个资源
>
> 如果这个想要恢复已经暂停了的目标线程的线程**试图要在监视器的锁内**调用**Thread.resume**方法，这就是一个死锁，因为你把钥匙锁里面了
>
> 这种类型的死锁线程就是典型的**“冻结”程序**

官方也给出了安全实现暂停和恢复线程的示例：

比如说，你的应用程序中包含这个鼠标点击事件的事件处理器，这个处理器会出发一个交**blinker**的线程

```java
private boolean threadSuspended;

Public void mousePressed(MouseEvent e) {
    e.consume();

    if (threadSuspended)
        blinker.resume();
    else
        blinker.suspend();  // DEADLOCK-PRONE!

    threadSuspended = !threadSuspended;
}
```

上面这样的程序就会出现死锁倾向，**自己暂停自己，自己又怎么能恢复自己呢？**所以官方给出的解决代码是

##### 官方“恢复”代码

```java
public synchronized void mousePressed(MouseEvent e) {
    e.consume();

    threadSuspended = !threadSuspended;

    if (!threadSuspended)
        notify();
}
```

然后在线程的run循环里面加上：

```java
synchronized(this) {
    while (threadSuspended)
        wait();
}
```

因为**wait()**方法会抛出**中断异常**，所以得包在try-catch语句中，你不妨在这里顺便睡上一小段时间，给程序一些缓冲时间好让线程在**“恢复”**之后可以马上执行**repaint()方法（这里的repaint方法代表恢复之后要做的事情）**

```java
public void run() {
    while (true) {
        try {
            Thread.sleep(interval);
            synchronized(this) {
                while (threadSuspended)
                    wait();
            }
        } catch (InterruptedException e){
        }
        repaint();
    }
}
```
特别注意到：**notify()和wait()**方法都被包在**同步块（synchronized block）**中，这是Java语法要求这么做的，以保证这两个方法是**绝对串行**地工作，然而，保证同步的代价确实有点大，为了减小同步带来的代价，我们可以简单的用一些伎俩去优化上述的两段代码，这个伎俩也很简单，在进**同步块**之前，先判断一次**threadSuspended**

```java
if (threadSuspended) {
    synchronized(this) {
        while (threadSuspended)
            wait();
    }
}
```

这样一来，我们得保证**threadSuspended**也得是**线程安全**的，我们可以用**volatile**关键字去修饰它

##### 官方”暂停“代码

```java
private volatile boolean threadSuspended;

public void run() {
    while (true) {
        try {
            Thread.sleep(interval);

            if (threadSuspended) {
                synchronized(this) {
                    while (threadSuspended)
                        wait();
                }
            }
        } catch (InterruptedException e){
        }
        repaint();
    }
}
```



#### 实例

为了有多线程效果，把例子装在了servlet中用网页请求去运行

``` java
package mythread;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/xixi")
public class AThreadTest extends HttpServlet {
	
	private static Thread timer;
	private volatile boolean stoped = false;
	private volatile boolean suspended = false;
	
	@Override
	public void init() throws ServletException {
		timer = new Thread() {
			private int count = 0;
			
			@Override
			public void run() {
				if (!timer.getName().equals("Timer")) {					
					timer.setName("Timer");
				}
				System.out.println(Thread.currentThread() + " started");
				while (!stoped) {
					if (timer.isInterrupted()) {
						System.out.println("interrupted break");
						break;
					}
					try {
						if (!stoped && !suspended) {
							count += 1;
							System.out.println(Thread.currentThread() +  " " + count);
							if (suspended) {
								synchronized (timer) {
									while (suspended) {
										timer.wait();
									}
								}															
							}
						}
						Thread.sleep(1000);
					} catch (Exception e) {
						System.out.println("exception because the interrupt when thread was in sleeping");
						return;
					}
				}
			}
		};
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String act = request.getParameter("act");
		switch (act) {
		case "start":
			if (timer == null) {
				init();
			}
			timer.start();
			break;
		case "stop":
			stop();
			break;
		case "pause":
			pause();
			break;
		case "resume":
			resume();
			break;
		case "state":
			state();
			break;
		default:
			break;
		}
		response.sendRedirect("/Learning_zoom");
	}

	public void stop() {
		timer.interrupt();
//		stoped = true;
		System.out.println("stop");
	}
	
	public void pause() {
		suspended = true;
		System.out.println("pause");
	}
	
	public void resume() {
		suspended = false;
		if (!suspended) {
			synchronized (timer) {
				timer.notify();
				System.out.println("resume");
			}
		}
	}
	
	public void state() {
		System.out.print("status: ");
		if (timer == null) {
			System.out.println("null");
		} else {			
			System.out.println(timer.getState());			
		}
	}
	
}

```

网页如下，线程过程中顺便还可以监控线程的状态

``` html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

HelloWorld!

<hr>
Timer Test<br>

    <a href="http://localhost:8080/Learning_zoom/xixi?act=start">Start</a><br>
    <a href="http://localhost:8080/Learning_zoom/xixi?act=stop">Stop</a><br>
    <a href="http://localhost:8080/Learning_zoom/xixi?act=pause">Pause</a><br>
    <a href="http://localhost:8080/Learning_zoom/xixi?act=resume">Resume</a><br>
    <a href="http://localhost:8080/Learning_zoom/xixi?act=state">State</a><br>

<hr>

</body>
</html>
```

上面的例子中对于暂停的做法有三个处理，因为有45行的sleep代码，所以线程大多数时候都是处于sleep状态，这时候你想要用中断标志去停止线程是有点不太可能，所以我们需要在catch块中对sleep中断错误的处理进行停止的逻辑，比如可以直接return

如果想要看中断标志去停止线程的效果，可以把45行的sleep注掉，然后就可以看到用29-32行的那种中断标志+break的方式去中断了，当然你可能还会注意到还有一个volatile变量：stoped

你可以把84行的注释打开，这样可以用和暂停一样的思想去做中断，效果也是一样的

--------

好了**第二坎**就到这啦，神兵利器已经准备好啦！开始修炼内功！