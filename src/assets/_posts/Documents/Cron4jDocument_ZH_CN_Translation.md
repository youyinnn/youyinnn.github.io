---
title: Cron4jDocument_ZH_CN_Translation
tags:
  - cron4j
  - scheduler
series: Cron4jDocument_ZH_CN_Translation
date: 2018-05-07 17:25:01
---

# Cron4j

一些必要的单词解释：

1. schedule 安排、调度（安排在有主语的时候使用 调用在没主语的时候使用）
2. scheduler 调度器
3. scheduling pattern 调度模式
4. reschedule 重新调度、安排
5. action/task 动作/任务
6. deschedule 脱离调度、安排
7. Daemon threads 守护线程 （其实 daemon 本意就有守护进程的意思 加个 threads 应该是强调线程而非进程）
8. Predictor 先知（故意翻译为这个中二的名字哈哈）、预报器（这才是常规翻译）
9. Crontab/Cron 定时任务工具
10. status tracking 状态跟踪
11. executor 执行器
12. collector 收集器

---

<span id="1快速开始"></span>

### 1、快速开始：

cron4j 的主要实体是‘scheduler’，实例化`it.sauronsoftware.cron4j.Scheduler`之后，你可以在一年当中任意的时间段执行任意的任务（Task）。

要使用 cron4j scheduler 你需要做下面四步：

1. new 一个 Scheduler 实例
2. 安排（schedule）你的动作（action）。你需要告诉 scheduler 对象你要做的事情是什么并且是在什么时候发生的。你可以指定（specify）一个实现了`java.lang.Runnable`接口的实例对象或者使用 cron4j 提供的`it.sauronsoftware.con4j.Task`类来实例一个对象来告诉它你要做什么事情，然后你可以使用一个`it.sauronsoftware.cron4j.SchedulingPattern`类的实例或者是一个字符串来代表指定的‘scheduling pattern’来告诉它你要在什么样的时间执行你的 action。
3. 开启（start）你的 scheduler 实例。
4. 当你不再需要它的时候，停止（stop）它。

```
import it.sauronsoftware.cron4j.Scheduler;

public class Quickstart {

	public static void main(String[] args) {
		// 第一步创建实例
		Scheduler s = new Scheduler();
		// 安排一个每分钟执行一次的任务
		s.schedule("* * * * *", new Runnable() {
			public void run() {
				System.out.println("Another minute ticked away...");
			}
		});
		// 开启你的调度器
		s.start();
		// 10分钟后执行之后的代码
		try {
			Thread.sleep(1000L * 60L * 10L);
		} catch (InterruptedException e) {
			;
		}
		// 10分钟后停止你的调度器
		s.stop();
	}

}
```

上面的代码会每隔一分钟执行一次 run 方法并打印出"Another minute ticked away..."句子。

你需要知道一些关键的概念：

- 你可以安排任意数量的任务。
- 你可以在任意时间安排任务，即使是在调度器（scheduler）已经被开启过之后。
- 你可以改变已经安排过的任务的‘scheduling pattern（调度模式）’，即使是当调度器正在运行的时候（reschedule operation 重新调度操作）。
- 你可以移除之前安排过的任务，即使是当调度器正在运行的时候（deschedule operation 脱离调度操作）。
- 你可以任意次开启或停止调度器。
- 你可以使用文件配置来安排任务。
- 你可以从任意文件源配置中安排任务。
- 你可以提供一个监听器（listener）给调度器，用来接收执行过的任务的事件。
- 你可以控制任何一个正在进行的任务。
- 你可以不使用任何的‘scheduling pattern'就可以手动启动任务。
- 你可以改变调度器工作的时区。
- 你可以在你的‘scheduling pattern’使用到调度器之前验证它的工作模式。
- 你可以预报出你的‘scheduling pattern’可能造成的任务异常。

---

<span id="2调度模式-scheduling-pattern"></span>

### 2、调度模式 scheduling pattern

'scheduling pattern'是一个 UNIX 的类定时任务模式，由一个以空格分隔为五个部分的字符串组成。每个部分代表着：

分钟子模式（Minutes sub-pattern）：

> 规定一小时中的哪个分钟会执行任务，取值范围为 0-59。

小时子模式（Hour sub-pattern）：

> 规定一天中的哪个小时会执行任务，取值范围为 0-23。

日期子模式（Days of mouth sub-pattern）：

> 规定一个月中的哪一号会执行任务，取值范围为 1-31，特殊值“L”可以代表当月的最后一天。

月份子模式（Months sub-pattern）：

> 规定一年中的哪一月会执行任务，取值范围从 1（January）-12（December），这个子模式也允许月份英文缩写如：jan、feb、mar、...、dec。

周几子模式（Days of week sub-pattern）：

> 规定一周中的周几会执行任务，取值范围 0（sunday）-6（monday），这个子模式同样允许英文缩写（是否忽略大小写 并未做考究 请按照官方举例 首字母大写）：sun、mon、...、sat。

模式还允许使用星号通配符来代表：小时中的每分钟、日中的每小时、月中的每一天、年中的每一月、一周中的每一天。

一旦调度器被开启，任务会在每一个调度模式匹配为 true 的时候执行一次。

下面是一些举例：

> 5 \* \* \* \*
>
> 每小时的过五分执行一次（1：05、2：05 etc）

> \* \* \* \* \*
>
> 每分钟执行一次

> \* 12 \* \* Mon
>
> 每周一的 12 时内的每分钟都执行一次

> \* 12 16 \* Mon
>
> 每月的 16 号的 12 时内的每分钟都执行一次

每个子模式都可以包含一个或多个逗号来分隔模式值

> 59 11 \* \* 1,2,3,4,5
>
> 每周一、周二、周三、周四、周五的 11:59am 会执行一次

取值间隔也可以使用“-”号

> 59 11 \* \* 1-5
>
> 和上面的结果一样

斜杠也可以运用到子模式当中，用来识别子模式取值范围内的分步值。

它有两种运用方式：

- \*/c
- a-b/c

第一种会匹配到子模式范围 0 到最大值中的每个 c 增值 包含 0 值

第二种会匹配到范围 a 到 b 中的每个 c 增值 包含 a 值

> \*/5 \* \* \* \*
>
> 每小时内从 0 分开始每过 5 分钟就执行一次（0：00、0：05、0：10、...）

> 3-18/5 \* \* \* \*
>
> 每小时中从 3 分到 18 分中每过 5 分钟就执行一次（0：03、0：08、0：13、0：18、1：03、...）

> \*/15 9-17 \* \* \*
>
> 每天的 9 时到 17 时中从 0 分开始每过一刻钟就执行一次（9：00、9：15、...、最后一次执行会是在 17：45 分）

上述所有规则都可以混合使用

> \* 12 10-16/2 \* \*
>
> 每月的 10 号到 16 号中每过两天中当天 12 时中的每分钟执行一次（也即 10、12、14、16 号中...）

> \* 12 1-15,17,20-25 \* \*
>
> 每月的 1 到 15 号、17 号、20 到 25 号当天中的 12 时中的每分钟执行一次

cron4j 允许你使用“|”符号连接多个调度模式组成一个调度模式

> 0 5 \* \* _|8 10 _ \* _|22 17 _ \* \*
>
> 每天的 5：00、10：08、17：22 执行一次

<br>

> _译者文外补充：文后其他地方会使用到`SchedulingPattern`对象，这个对象的创建非常简单，只需要在它的构造函数中传入调度模式即可。_

---

<span id="3如何调度-schedule重新调度-reschedule脱离调度-deschedule一个任务task"></span>

### 3、如何调度 schedule、重新调度 reschedule、脱离调度 deschedule 一个任务（Task）

##### （1）调度

创建 Task 的最简单最常用的方法就是实现`java.lang.Runnable`接口，任务创建好的时候，它可以被`it.sauronsoftware.cron4j.Scheduler.schedule(String, Runnable)`方法安排进调度器中，如果调度模式有格式异常，将会抛出`it.sauronsoftware.cron4j.InvalidPatternException`异常。

创建 Task 的另一种方法就是继承抽象方法`it.sauronsoftware.cron4j.Task`，这种方式比上一种方式更加强大，它可以使开发者访问一些 cron4j 提供的特性。你可以在“[建立自定义的任务 Task](#6)”小节中了解到更多相关用法。Task 的实例可以被`schedule(String, Task)`方法和`schedule(SchedulingPattern, Task)`方法安排进调度器中。

##### （2）重新调度/脱离调度

在调度器对象的调度方法`schedule`会返回一个 ID 值（String 类型）用来识别和检索已经安排过的操作。

这个 ID 可以被用来之后做：

- 重新调度该任务（需要改变它的调度模式）
- 把该任务脱离调度（把任务从调度器中移除）

可以调用这两个方法取重新调度该任务：

- `reschedule(String, String)`
- `reschedule(String, SchedulingPattern)`

可以调用这个方法让任务脱离调度：

- `deschedule(String)`

---

<span id="4如何调度系统程序"></span>

### 4、如何调度系统程序

- 使用类`ProcessTask`可以很简单的完成系统程序的调度

```
ProcessTask task = new ProcessTask("C:\\Windows\\System32\\notepad.exe");
Scheduler scheduler = new Scheduler();
scheduler.schedule("* * * * *", task);
scheduler.start();
// ...
```

- 多个程序参数可以作为字符串数组去代替一条参数

```
String[] command = { "C:\\Windows\\System32\\notepad.exe", "C:\\File.txt" };
ProcessTask task = new ProcessTask(command);
// ...
```

- 程序的环境变量可以作为第二组字符串数组参数传入，其中的对象必须是‘NAME=VALUE’的形式

```
String[] command = { "C:\\tomcat\\bin\\catalina.bat", "start" };
String[] envs = { "CATALINA_HOME=C:\\tomcat", "JAVA_HOME=C:\\jdks\\jdk5" };
ProcessTask task = new ProcessTask(command, envs);
// ...
```

- 默认工作目录可以通过传入第三组参数去改变

```
String[] command = { "C:\\tomcat\\bin\\catalina.bat", "start" };
String[] envs = { "CATALINA_HOME=C:\\tomcat", "JAVA_HOME=C:\\jdks\\jdk5" };
File directory = "C:\\MyDirectory";
ProcessTask task = new ProcessTask(command, envs, directory);
// ...
```

- 如果你只想改变工作目录而不想使用环境变量，你可以在 envs 位置传入 null 值

```
ProcessTask task = new ProcessTask(command, null, directory);
```

当 evns 为 null 的时候，程序会继承当前 JVM 环境下工作的所有环境变量。

环境变量和工作目录也可以通过调用`setEnvs(String[])`和`setDirectory(java.io,File)`方法来设置

程序的标准输出和标准错误输出管道可以通过`setStdoutFile(java.io.File)`和`setStderrFile(java.io.File)`方法重定向到指定文件

```
ProcessTask task = new ProcessTask(command, envs, directory);
task.setStdoutFile(new File("out.txt"));
task.setStderrFile(new File("err.txt"));
```

同样的标准输入管道可以从已存在的文件中读取，通过调用方法`setStdinFile(java.io.File)`

```
ProcessTask task = new ProcessTask(command, envs, directory);
task.setStdinFile(new File("in.txt"));
```

---

<span id="5如何从调度配置文件中调度程序"></span>

### 5、如何从调度配置文件中调度程序

cron4j 调度器可以从调度配置文件中调度一系列的程序流程

你需要准备一个调度配置文件，这和 UNIX 中 crontab 的用法非常相似，并且把文件通过`scheduleFile(File)`方法注册到调度器里面。

调度配置文件也可以通过`deschedule(File)`方法来脱离调度。

已经调度过的调度配置文件可以调用`getScheduledFiles()`方法来检索到。

已经注册过的调度配置文件会每分钟都被解析一次，调度器会根据调度配置文件去运行所有调用‘scheduling pattern（调度模式）’来正确声明的、匹配当前系统时间的程序。

cron4j 的调度配置文件的声明规则可以从“[Cron 解析器](#14cron解析器)”小节中了解到。

---

<span id="6创建自定义的任务-task"></span>

### 6、创建自定义的任务 Task

一个`java.lang.Runnable`对象是一个简单的 Task，但是为了获得对整个任务的控制权你还需要继承`it.sauronsoftware,cron4j.Task`类（注意这是一个抽象类）。

有两种比较简单的创建形式：
（1）实现 Runnable 接口的时候：任务就是 run 方法所执行的语句。
（2）继承 Task 抽象类的时候：任务就是需要实现的`execute(TaskExecutionContext)`方法所执行的语句。

execute(TaskExecutionContext)方法提供了一个`it.sauronsoftware.cron4j.TaskExecutionContext`实例对象，这是在 run 方法中所没有的。

你可以用这个对象做这些事情来操作当前任务：

- status tracking 状态跟踪

  > 任务可以和它的执行器进行通信，可以通过文本描述来向外通知它的 internal state（内部状态）
  >
  > 如果你想要你的任务支持这个功能的话，你可以重载`supportsStatusTracking()`方法，这个方法仅需要实现一个 true 为返回值就可以表示开启该功能。
  >
  > 当你重载过这个方法之后，在`execute(TaskExecutionContext)`方法里面就可以调用`context.setStatusMessage(String)`方法，这会给该任务的执行器发一条状态消息。这个状态消息，通过执行器，可以被外部用户索引到（具体看“[执行器 Executors](#9执行器-executors)”小节）。

- completeness tracking 完成度跟踪

  > 任务可以和它的执行器进行通信，可以通过数字值来向外通知它的 completeness level（完成度），
  >
  > 如果你想要你的任务支持这个功能的话，你可以重载`supportsCompletenessTracking()`方法，这个方法仅需要实现一个 true 为返回值就可以表示开启该功能。
  >
  > 当你重载过这个方法之后，在`execute(TaskExecutionContext)`方法里面就可以调用`context.setCompleteness(double)`方法，这个方法需要传递一个 0~1 之间的 double 值，这会给该任务的执行器发一个完成度值。这个完成度值，通过执行器，可以被外部用户索引到（具体看“[执行器 Executors](#9执行器-executors)”小节）。

- paused 被暂停

  > 任务可以根据情况而暂停。
  >
  > 如果你想要你的任务支持这个功能的话，你可以重写`canBePaused()`方法，这个方法仅需要实现一个 true 为返回值就可以表示开启该功能。
  >
  > 当你重载过这个方法之后，你需要定期地（原文此处为：you have to periodically call the...）调用`context.pauseIfRequested()`方法，这会暂停任务的执行，直到被外部用户恢复或者终止当前任务。

- stopped 被终止

  > 任务可以根据情况而终止。
  >
  > 如果你想要你的任务支持这个功能的话，你可以重载`canBeStopped()`方法，这个方法仅需要实现一个 true 为返回值就可以表示开启该功能。
  >
  > 当你重载过这个方法之后，你需要定期地（...）调用`context.isStopped()`方法，当被外部用户命令终止的时候，这会返回一个 true 值（具体看“[执行器 Executors](#9执行器-executors)”小节）。这时候你有义务处理好这个任务在执行时所反馈出来的事件结果，好让它在正在运行的状态下平稳地（原文：gently）结束。

- 索引调度器

  > 通过 context 对象，你可以通过`getScheduler()`索引到调度本身调度器。

- 索引执行器
  > 通过 context 对象，你可以通过`getTaskExecutor()`索引到调度本身调度器。

一个自定义的任务可以被任务收集器（task collector）所立即调度、运行、或者返回。

<br>

> _译者文外补充：可以查看 Task 类的源码，不难发现，上述所要重载的方法在源码中也仅仅只是返回 false 值，也即默认是关闭这些功能的，我们只有重载为 true 才能开启和使用它们。_

[回到索引](#index)

---

<span id="7创建自定义的收集器-collector"></span>

### 7、创建自定义的收集器 Collector

通过任务收集器提供的 API，你可以在调度器里面创建和插入你自己的任务源（task source）。

cron4j 调度器支持注册一个或多个`it.sauronsoftware.cron4j.TaskCollector`实例，你只需要调用`addTaskCollector(TaskCollector)`方法即可。

被注册的收集器可以被调度器对象调用`getTaskCollectors`方法索引到，之前的收集器可以调用`removeTaskCollector(TaskCollector)`方法从调度器中移除。

收集器可以在任意的时间被添加（注册）、查询（索引）、移除，即使是在调度器正在运行的状态下也可以。

每一个被注册过的收集器每隔一分钟都会被调度器去索引一次，调度器会调用收集器的`collector.getTasks()`方法。这个实现方法会返回一个`it.sauronsoftware,cron4j.TaskTable`实例，我们把这个实例称为任务表。

每一个任务表都包含了本收集器中所有的任务实例和该任务对应的调度模式实例。一旦该表被检索到，调度器就会检查被记录（原文使用 reported）到的对象，然后执行所有使用‘scheduling pattern（调度模式）’来正确声明的、匹配当前系统时间的任务。

一个自定义的收集器可以配合外部任务源来约束调度器的行为，比如数据库、或者 xml 文件，这些同样支持在运行时更改和管理的源。

<br>

> _译者文外补充：在[下面](#1collector-exp)贴出译者实践演示代码，代码中演示了如何向一个调度器中注册、移除收集器，并且查看收集器的信息，同时在代码运行的过程中也演示了调度器每分钟索引收集器 task 的过程。_
>
> _读者可以自行研究代码，花上 4 分钟体会一下。读者也可以从`TaskController`类的源码开始阅读下去，特别是`TaskTable`类中，仅仅只有几个简单易懂的 API，了解过后你会发现这套流程其实并不难走通。_

---

<span id="8创建自定义的监听器来监控你的调度器"></span>

### 8、创建自定义的监听器来监控你的调度器

cron4j 提供了`it.sauronsoftware,cron4j.SchedulerListener`类，我们可以使用它的 API 来对调度器的事件进行监听。

调度监听器需要实现以下方法：

```
taskLaunching(TaskExecutor)
这个方法会在每个调度任务启动的时候被调度器调用

taskSucceeded(TaskExecutor)
这个方法会在每个任务成功地执行完毕的时候被调用

taskFailed(TaskExecutor, Throwable)
这个方法会在每个任务执行失败的时候被调用
```

你可以从“[执行器 Executors](#9执行器-executors)”小节中了解到更多的信息。

当你准备好一个调度监听器（SchedulerListener）的时候，你可以调用调度器的`addSchedulerListener(SchedulerListener)`方法将这个监听器注册到该调度器中。

你可以调用`removeSchedulerListener(SchedulerListener)`方法移除已经注册的监听器。

你可以调用`getSchedulerListeners()`方法获取到所有在本调度器注册的监听器。

调度监听器可以在任何时候被注册或者移除，即使是在调度器正在运行的时候。

---

<span id="9执行器-executors"></span>

### 9、执行器 Executors

每当调度器被开启并且运行的时候，你可以通过方法索引到它的执行器。

执行器非常像一个线程，它是被调度器用来执行任务的利器。

你可以调用`Scheduler.getExecutingTasks()`方法来获得当前正在运行的执行器。

你也可以通过调度监听器来获得执行器（见“[8、创建自定义的监听器来监控你的调度器](#8创建自定义的监听器来监控你的调度器)”小节）。

每一个执行器，代表着一个`it.sauronsoftware.cron4j.TaskExecutor`实例，执行不同的任务。

执行器中的任务可以被`TaskExecutor.getTask()`方法索引到。

执行器的状态可以通过`TaskExecutor.isAlive()`方法来检查：如果当前执行器正在运行则返回 true。

如果执行器处于运行状态，那么一直到整个执行过程完毕之前，你都可以通过`join()`方法来暂停当前线程

- 关于 status tracking 状态跟踪

  > 你可以调用`TaskExecutor.supportsStatusTracking()`方法，如果它会返回一个 true 值，则表示当前正在执行的任务支持状态跟踪功能。这意味着任务可以和它的执行者进行沟通，当然只能传递字符串。当前的状态信息可以被执行器调用`TaskExecutor.getStatusMessage()`方法索引到。

- 关于 completeness tracking 完成度跟踪

  > 你可以调用`supportsCompletenessTracking()`方法来检查当前正在执行的任务是否支持完成度跟踪。如果支持，那么你可以调用`TaskExecutor.getCompleteness()`方法来索引任务完成度值，它会返回一个 0（未开始）~1（已完成）之间的数值。

- 关于 paused 暂停

  > 你可以调用`TaskExecutor.canBePaused()`方法来检查当前正在执行的任务是否支持运行时暂停执行的功能。如果支持，那么你可以你可以调用`TaskExecutor.paused()`方法来暂停当前任务的执行。你还可以调用`TaskExecutor.isPaused()`方法来检查当前任务是否处于暂停状态。被暂停的执行器可以通过`TaskExecutor.resume()`方法来恢复运行。

- 关于 stopped 终止

  > 你可以调用`TaskExecutor.canBeStopped()`方法来检查当前正在执行的任务是否支持运行时终止执行的功能。如果支持，那么你可以你可以调用`TaskExecutor.stop()`方法来终止当前任务的执行。同样你可以调用`TaskExecutor.isStopped()`方法去检查当前执行器是否被终止。
  >
  > **注意：被终止过的执行器不能再恢复运行。**

- 其他 API
  > `TaskExecutor.getStartTime()`
  >
  > 它会返回一个时间标记（time stamp）来告诉你执行器启动的时间，或者一个小于 0 的值来表示执行器还没开始启动。

> `TaskExecutor.getScheduler()`
>
> 它会返回当前执行器所属的调度器对象。

> `TaskExecutor.getGuid()`
>
> 它会返回当前执行器所唯一对应的纯文本的 GUID 值。

- 关于事件驱动

> 执行器同时也提供了它自己的事件驱动 API，你可以通过`it.sauronsoftware.cron4j.TaskExecutorListener`类来访问它们。
>
> 你可以分别调用：
>
> `addTaskExecutorListener(TaskExecutorListener)`
>
> `removeTaskExecutorListener(TaskExecutorListener)`
>
> `getTaskExecutorListeners()`
>
> 方法来注册、移除、索引到执行监听器。
>
> 一个执行监听器需要实现以下方法：
>
> ```
> executionPausing(TaskExecutor)
> 该方法会在执行器被请求暂停正在运行的任务时调用。传入的参数代表着被请求暂停任务执行的执行器对象。
>
> executionResuming(TaskExecutor)
> 该方法会在执行器被请求恢复正在被暂停的任务时调用。传入的参数代表着被请求恢复任务执行的执行器对象。
>
> executionStopping(TaskExecutor)
> 该方法会在执行器被请求终止任务执行时调用。传入的参数代表着被请求的执行器对象。
>
> executionTerminated(TaskExecutor, Throwable)
> 该方法会在执行器将任务执行完毕的时候被调用。传入的第一个参数代表着该执行器对象，第二个参数是可选项，代表着迫使执行器终止执行任务的异常，如果任务正确的执行成功的话，该对象值为null。
>
> statusMessageChanged(TaskExecutor, String)
> 该方法会在每次运行时任务的状态信息发生改变的时候调用。传入的第一个参数代表着该执行器对象，第二个参数则是新发布的任务状态信息。
>
> completenessValueChanged(TaskExecutor, double)
> 该方法会在每次运行时任务的完成度值发生改变的时候调用。传入的第一个参数代表着该执行器对象，第二个参数则是取值范围为0~1之间的新发布的完成度值。
> ```

<br>

> _译者文外补充：正如官方文档所说的一样，执行器非常像一个线程，所以它提供的 API 也相对线程性细致和线程性复杂，这也是 cron4j 的唯一的重难点，使用的时候一定要考虑周全，同时还要分清楚调度器和执行器的关系，以及调度监控器和执行监控器的事件监听方法的调用时机。_

[回到索引](#index)

---

<span id="10手动启动任务"></span>

### 10、手动启动任务

如果调度器以及开启并且处于运行中，你是有可能手动启动一个任务的，你甚至可以不用安排调度模式。

你可以使用`Scheduler.launch(Task)`方法，任务就会立马被执行，这个方法会返回该任务的 TaskExecutor（执行器）实例，你可以使用它来控制整个任务的执行过程。

---

<span id="11在指定时区下运行"></span>

### 11、在指定时区下运行

在默认的情况下，调度器会在系统默认的时区中运行。换句话说，一个“ 0 2 \* \* \* ”的调度模式会根据系统时区在当地时间每天的 2（am）时执行任务。

你可以为调度器设置不同于系统默认时区的时区作为它的工作时区。

调用`Scheduler.setTimeZone(TimeZone)`方法和`Scheduler.getTimeZone()`方法就可以控制这个属性。

一旦调度器的默认时区被改变，系统当前运行时会在解释调度模式的时候去区适应你所提供的时区。那么结果会在你指定的时区中按照你指定的调度模式去执行任务。假设有以下的情况：

系统时间：10：00
系统时区：GMT+1
调度器设置时区：GMT+3

调度器会把调度模式和系统时间进行比较，然后把 GTM+1 时区下的 10:00 转换到 GTM+3，这意味着 10：00 变成了 12：00，这个结果会被运用到调度器中去执行任务。所以，在给定的设置下，任务会在模式“ 0 12 \* \* _ ”中执行，而不是模式“ 0 10 _ \* \* ” 。

---

<span id="12守护线程-daemon-threads"></span>

### 12、守护线程 Daemon threads

JVM 只有在当前运行线程全部都是守护线程的时候才会退出，cron4j 调度器可以被配置为只生产守护线程。为了控制这个特性，你需要调用`Scheduler.setDaemon(boolean)`方法，这个方法必须在调度器被开启之前调用，方法的默认值是 false，你可以调用`Scheduler.isDaemon()`方法来检测当前调度器生成的线程是否是守护线程。

<br>

> _译者文外补充：这小节的意思是，如果你启动了一个调度器，在它执行到特定状态的时候让它自己关闭（注意是关闭调度器）的话，在默认的情况下它是不会退出程序的，不信你可以写一个简单的 demo 来测试一下。_

---

<span id="13预报器-predictor"></span>

### 13、预报器 Predictor

`it.sauronsoftware.cron4j.Predictor`类可以预测你的调度模式什么时候会被匹配到。

假如你想知道调度器在使用模式“ 0 3 jan-jun,sep-dec mon-fri ”的情况下什么时候会执行任务，你可以使用预报器对象去预测接下来 n 次任务的执行时间：

```
String pattern = "0 3 * jan-jun,sep-dec mon-fri";
Predictor p = new Predictor(pattern);
for (int i = 0; i < n; i++) {
	System.out.println(p.nextMatchingDate());
}
```

<br>

> _译者文外补充：当 n 等于 5 的时候结果如下：_
>
> ```
> Fri Sep 01 03:00:00 CST 2017
> Mon Sep 04 03:00:00 CST 2017
> Tue Sep 05 03:00:00 CST 2017
> Wed Sep 06 03:00:00 CST 2017
> Thu Sep 07 03:00:00 CST 2017
> ```

---

<span id="14cron解析器"></span>

### 14、Cron 解析器

`it.sauronsoftware.cron4j.CronParser`类可以被用来解类 crontab 形式的文件以及字符流。

如果你想根据类 crontab 形式的文件去安排一系列的任务，你可以不需要使用 Cron 解析器，你只需要调用`Scheduler.scheduleFile(File)`方法把文件添加到调度器里面就可以了。

如果`Scheduler.scheduleFile(File)`方法还不能够满足你的需求的话，你可以考虑使用 Cron 解析器去安排任务。

举个栗子，如果你想从远程源获取任务安排表，可是远程源并不支持`java.io.File`对象去操作的话（比如远程服务器上的文档、数据库中的数据设置等等），这时候你可以自己实现`it.sauronsoftware.cron4j.TaskCollector`类，好让 Cron 解析器更方便的去解析任何类 crontab 内容。

你可以解析整个文件或者整个流，也可以只解析其中一句。

每一行可以是空行、注释、或者是可调度行。

没有任何字符或者仅仅包含空格符的行会被认为是空行。

第一个字符为非空格符而且是一个‘#’符的行会被认为是注释。

解析器会忽略空行和注释行。

任何其他类别的行都会被解析为可调度行。

一个有效的可调度行应该遵循以下结构（注意四个部分之间有空格）：

> scheduling-pattern [options] command [args]
>
> 调度模式 [选项] 命令 [提供的参数]

**scheduling-pattern**：必须是根据`it.sauronsoftware.cron4j.SchedulingPattern`类所给定义的有效的调度模式。

**options**：是一个可选选项的列表，它告诉 cron4j 该什么样的环境来执行任务。稍后会作详细的说明。

**command**：是有效的系统命令，比如一个可执行的调用。

**args**：是提供给系统命令的参数列表。

在调度模式之后，其他的部分需要使用空格符或者双引号来界定。

使用双引号的好处是你可以使用以下转义字符：

```
\" - quotation mark
\\ - back slash
\/ - slash
\b - back space
\f - form feed
\n - new line
\r - carriage return
\t - horizontal tab
\ufour-hex-digits - the character at the given Unicode index
```

<br>

对于**options**部分的子集可以包含一个或多个以下的对象：

> IN：一个文件路径，重定向命令的标准输入通道到指定的文件位置。
>
> OUT：一个文件路径，重定向命令的标准输出通道到指定的文件位置。
>
> ERR：一个文件路径，重定向命令的标准报错输出通道到指定的文件位置。
>
> ENV：名值对（name=value），在命令作用域中定义环境变量。
>
> DIR：一个目录位置，设置命令的工作目录，这要求你的 JVM 环境至少是 1.3。

你还可以安排一个在解析器的类加载器作用域内的 Java 类的方法调用。这个方法必须是静态方法并且它的参数列表只能是唯一的一个 String 数组，为了调用这个方法，你的调度行结构需要这么写：

> scheduling-pattern java:className#methodName [args]
>
> 方法名部分可以被省略，这时解析器会调用类中的 main 方法（如果存在的话）。

你需要注意的是，静态方法会在和调度器一样的 JVM 环境中执行，并不会产生任何的外部程序！因此这时候**options**部分不可选！

非法的调度行将会被抛弃，不会阻断解析过程，但会在程序的标准错误输出通道中发送一条错误信息。

以下是一些合法的调度行栗子：

```
0 5 * * * sol.exe
0,30 * * * * OUT:C:\ping.txt ping 10.9.43.55
0,30 4 * * * "OUT:C:\Documents and Settings\Carlo\ping.txt" ping 10.9.43.55
0 3 * * * ENV:JAVA_HOME=C:\jdks\1.4.2_15 DIR:C:\myproject OUT:C:\myproject\build.log C:\myproject\build.bat "Nightly Build"
0 4 * * * java:mypackage.MyClass#startApplication myOption1 myOption2
```

把上述文档作 txt 保存之后，可以在程序中这样调用：

```
public class Main {

	public static void main(String[] args) {
		// Declares the file.
		File file = new File("cron4jtab.txt");
		// Creates the scheduler.
		Scheduler scheduler = new Scheduler();
		// Schedules the file.
		scheduler.scheduleFile(file);
		// Starts the scheduler.
		scheduler.start();
		// Stays alive for five minutes.
		try {
			Thread.sleep(5L * 60L * 1000L);
		} catch (InterruptedException e) {
			;
		}
		// Stops the scheduler.
		scheduler.stop();
	}

}
```

---

- <br>
  <br>
  <br>
  <br>

# 部分实践演示代码

<span id="1collector-exp"></span>

### 1、Collector exp

```
public class CollectorExp {

    public static void main(String[] args) {
        Scheduler scheduler = new Scheduler();

        TaskCollector c1 = new TaskCollector() {
            @Override
            public TaskTable getTasks() {
                System.out.println("过了一分钟 调度器又来索引我啦");
                TaskTable taskTable = new TaskTable();
                taskTable.add(new SchedulingPattern("* * * * *"), new MyTask("one"));
                taskTable.add(new SchedulingPattern("*/2 * * * *"), new MyTask("two"));
                return taskTable;
            }
        };

        TaskCollector c2 = () ->{
            System.out.println("过了一分钟 调度器又来索引我啦");
            TaskTable taskTable = new TaskTable();
            taskTable.add(new SchedulingPattern("* * * * *"), new MyTask("three"));
            taskTable.add(new SchedulingPattern("*/2 * * * *"), new MyTask("four"));
            return taskTable;
        };

        scheduler.addTaskCollector(c1);
        scheduler.addTaskCollector(c2);

        showController(scheduler);

        scheduler.start();

        try {
            Thread.sleep(2000L * 60L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("两分钟到 移除c1");
        scheduler.removeTaskCollector(c1);
        showController(scheduler);

    }

    static void showController(Scheduler scheduler){
        TaskCollector[] taskCollectors = scheduler.getTaskCollectors();
        System.out.println("|----当前调度器中有"+taskCollectors.length+"个收集器");
        for (int i = 0 ; i < taskCollectors.length ; ++i){
            System.out.println("|----|----当前显示第"+(i+1)+"个收集器的信息");
            TaskCollector now = taskCollectors[i];
            TaskTable tasks = now.getTasks();
            System.out.println("|----|----|----当前收集器有"+tasks.size()+"个任务");
            for (int j = 0 ; j < tasks.size() ; ++j){
                System.out.println("|----|----|----|----当前显示第"+(j+1)+"个任务信息");
                System.out.println("|----|----|----|----Task:["+tasks.getTask(j)+"] and scp:["+tasks.getSchedulingPattern(j)+"]");
            }
        }
    }

}

class MyTask extends Task{

    private String num;

    MyTask(String num) {
        this.num = num;
    }

    @Override
    public void execute(TaskExecutionContext taskExecutionContext) throws RuntimeException {
        LocalTime now = LocalTime.now();
        System.out.println("This is Task "+num+" ! [ " + now.getHour() + " : " + now.getMinute() + " ]");

    }
}
```

---
