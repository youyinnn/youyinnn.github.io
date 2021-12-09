## Java

### Java8系列文章


http://www.importnew.com/11908.html



### 牛客 HttpServletRequest. getParameter


![image](https://user-images.githubusercontent.com/23525754/40235928-620a249c-5ade-11e8-9b07-7dd6254daea3.png)

>  编码格式由浏览器决定，浏览器根据html中指定的编码格式进行编码，tomcat根据指定的格式进行解码, tomcat默认的解码方式是ISO8859-1



### Java Spliterator


参考1: https://segmentfault.com/q/1010000007087438
参考2: https://blog.csdn.net/lh513828570/article/details/56673804


### 牛客 Integer的拆箱装箱


![image](https://user-images.githubusercontent.com/23525754/40236440-22aec3b4-5ae0-11e8-8c36-740673df8f06.png)

![image](https://user-images.githubusercontent.com/23525754/40236420-137a4490-5ae0-11e8-91ae-c75518a5806c.png)

- 基本数据类型和包装类==比较的时候, 基本数据类型会拆箱, 所以是值比较
- valueOf()的取值还有IntegerCached的概念, 在[-127,127]之间的数会从池里面找, 有就返回同样的引用


### 牛客 getDeclaredMethods()的范围


![image](https://user-images.githubusercontent.com/23525754/40236595-ae2525f0-5ae0-11e8-89bb-c0649f2ba2b1.png)

Doc:
> public Method[] getDeclaredMethods()
>
> Returns an array containing Method objects reflecting all the declared methods of the class or interface represented by this Class object, 
>
> including public, protected, default (package) access, and private methods, **but excluding inherited methods**.



### 牛客 sleep()和wait()


![image](https://user-images.githubusercontent.com/23525754/40236826-52947b72-5ae1-11e8-8483-c867082dece0.png)

**Java中的多线程是一种抢占式的机制，而不是分时机制。抢占式的机制是有多个线程处于可运行状态，但是只有一个线程在运行**

##### :small_orange_diamond:共同点 ： 
1. 他们都是在多线程的环境下，都可以在程序的调用处阻塞指定的毫秒数，并返回。 
2. wait()和sleep()都可以通过interrupt()方法 打断线程的暂停状态 ，从而使线程立刻抛出InterruptedException
如果线程A希望立即结束线程B，则可以对线程B对应的Thread实例调用interrupt方法。如果此刻线程B正在wait/sleep/join，则线程B会立刻抛出InterruptedException，在catch() {} 中直接return即可安全地结束线程。 
需要注意的是，InterruptedException是线程自己从内部抛出的，并不是interrupt()方法抛出的。对某一线程调用 interrupt()时，如果该线程正在执行普通的代码，那么该线程根本就不会抛出InterruptedException。但是，一旦该线程进入到 wait()/sleep()/join()后，就会立刻抛出InterruptedException 。 

##### :small_orange_diamond:不同点 ：  
1. 每个对象都有一个锁来控制同步访问。Synchronized关键字可以和对象的锁交互，来实现线程的同步sleep方法没有释放锁，而wait方法释放了锁，使得其他线程可以使用同步控制块或者方法。 

2. wait，notify和notifyAll只能在同步控制方法或者同步控制块里面使用，而sleep可以在任何地方使用

3. sleep必须捕获异常，而wait，notify和notifyAll不需要捕获异常 

4. sleep是线程类（Thread）的方法，导致此线程暂停执行指定时间，给执行机会给其他线程，但是监控状态依然保持，到时后会自动恢复。调用sleep不会释放对象锁。

5. wait是Object类的方法，对此对象调用wait方法导致本线程放弃对象锁，进入等待此对象的等待锁定池，只有针对此对象发出notify方法（或notifyAll）后本线程才进入对象锁定池准备获得对象锁进入运行状态。


### Java static方法中的变量是否存在线程安全问题

我们在知道, 静态字段(static field)和静态方法(static method)的调用是通过类来调用。静态方法不对特定的实例操作，只能访问静态成员。实例方法可对特定的实例操作，既能访问静态成员，也能访问实例成员。

那么,在多线程中使用静态方法是否有线程安全问题?这要看静态方法是是引起线程安全问题要看在静态方法中是否使用了静态成员。

因为，在多线程中使用同一个静态方法时，每个线程使用各自的实例字段(instance field)的副本，而共享一个静态字段(static field)。所以说，如果该静态方法不去操作一个静态成员，只在方法内部使用实例字段(instance field)，不会引起安全性问题。但是，如果该静态方法操作了一个静态字段，则需要静态方法中采用互斥访问的方式进行安全处理。

``` java
public class Test
{
   public static String hello(String str)
   {
       String tmp = "";
       tmp = tmp + str;
       return tmp;
   }
}
```
hello方法会不会有多线程安全问题呢？没有！

> 静态方法如果没有使用静态变量，则没有线程安全问题。
>
> 为什么呢？因为静态方法内声明的变量，每个线程调用时，都会新创建一份，而不会共用一个存储单元。比如这里的tmp,每个线程都会创建自己的一份，因此不会有线程安全问题。
>
> 注意:静态变量，由于是在类加载时占用一个存储区，每个线程都是共用这个存储区的，所以如果在静态方法里使用了静态变量，这就会有线程安全问题！


### Java多线程参考


https://www.cnblogs.com/yjd_hycf_space/p/7526608.html
http://www.importnew.com/21136.html
http://www.importnew.com/21089.html


### Java字符串压缩


``` java
public class StringCompress {
	public static final byte[] compress(String paramString) {
		if (paramString == null)
			return null;
		ByteArrayOutputStream byteArrayOutputStream = null;
		ZipOutputStream zipOutputStream = null;
		byte[] arrayOfByte;
		try {
			byteArrayOutputStream = new ByteArrayOutputStream();
			zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
			zipOutputStream.putNextEntry(new ZipEntry("0"));
			zipOutputStream.write(paramString.getBytes());
			zipOutputStream.closeEntry();
			arrayOfByte = byteArrayOutputStream.toByteArray();
		} catch (IOException localIOException5) {
			arrayOfByte = null;
		} finally {
			if (zipOutputStream != null)
				try {
					zipOutputStream.close();
				} catch (IOException localIOException6) {
			}
			if (byteArrayOutputStream != null)
				try {
					byteArrayOutputStream.close();
				} catch (IOException localIOException7) {
			}
		}
		return arrayOfByte;
	}
 
	@SuppressWarnings("unused")
	public static final String decompress(byte[] paramArrayOfByte) {
		if (paramArrayOfByte == null)
			return null;
		ByteArrayOutputStream byteArrayOutputStream = null;
		ByteArrayInputStream byteArrayInputStream = null;
		ZipInputStream zipInputStream = null;
		String str;
		try {
			byteArrayOutputStream = new ByteArrayOutputStream();
			byteArrayInputStream = new ByteArrayInputStream(paramArrayOfByte);
			zipInputStream = new ZipInputStream(byteArrayInputStream);
			ZipEntry localZipEntry = zipInputStream.getNextEntry();
			byte[] arrayOfByte = new byte[1024];
			int i = -1;
			while ((i = zipInputStream.read(arrayOfByte)) != -1)
				byteArrayOutputStream.write(arrayOfByte, 0, i);
			str = byteArrayOutputStream.toString();
		} catch (IOException localIOException7) {
			str = null;
		} finally {
			if (zipInputStream != null)
				try {
					zipInputStream.close();
				} catch (IOException localIOException8) {
				}
			if (byteArrayInputStream != null)
				try {
					byteArrayInputStream.close();
				} catch (IOException localIOException9) {
				}
			if (byteArrayOutputStream != null)
				try {
					byteArrayOutputStream.close();
				} catch (IOException localIOException10) {
			}
		}
		return str;
	}
}
```

参考：https://blog.csdn.net/isea533/article/details/8199848

### Servlet和CGI的区别

#### CGI (Common Gateway Interface 公共网关接口)

1. 定义：

   CGI(Common Gateway Interface 公共网关接口)是HTTP服务器与你的或其它机器上的程序进行“交谈”的一种工具，其程序须运行在网络服务器上。

2. 功能：

   绝大多数的CGI程序被用来解释处理杰自表单的输入信息，并在服 务器产生相应的处理，或将相应的信息反馈给浏览器。CGI程序使 网页具有交互功能。

3. 运行环境：

   CGI程序在UNIX操作系统上CERN或NCSA格式的服务器上运行。 在其它操作系统（如：windows NT及windows95等）的服务器上 也广泛地使用CGI程序，同时它也适用于各种类型机器。

4. CGI处理步骤：

   1. 通过Internet把用户请求送到服务器。
   2. 服务器接收用户请求并交给CGI程序处理。
   3. CGI程序把处理结果传送给服务器。
   4. 服务器把结果送回到用户。

#### Servlet

Servlet是一种服务器端的Java应用程序，具有独立于平台和协议的特性,可以生成动态的Web页面。 它担当客户请求（Web浏览器或其他HTTP客户程序）与服务器响应（HTTP服务器上的数据库或应用程序）的中间层。 Servlet是位于Web 服务器内部的服务器端的Java应用程序，与传统的从命令行启动的Java应用程序不同，Servlet由Web服务器进行加载，该Web服务器必须包含支持Servlet的Java虚拟机。

工作模式：客户端发送请求至服务器；服务器启动并调用Servlet，Servlet根据客户端请求生成响应内容并将其传给服务器；服务器将响应返回客户端。

 

#### Java Servlet与CGI的比较

与传统的CGI和许多其他类似CGI的技术相比，Java Servlet具有更高的效率，更容易使用，功能更强大，具有更好的可移植性，更节省投资。在未来的技术发展过程中，Servlet有可能彻底取代CGI。

在传统的CGI中，每个请求都要启动一个新的进程，如果CGI程序本身的执行时间较短，启动进程所需要的开销很可能反而超过实际执行时间。而在Servlet中，每个请求由一个轻量级的Java线程处理(而不是重量级的操作系统进程)。

在传统CGI中，如果有N个并发的对同一CGI程序的请求，则该CGI程序的代码在内存中重复装载了N次；而对于Servlet，处理请求的是N个线程，只需要一份Servlet类代码。在性能优化方面，Servlet也比CGI有着更多的选择。
　　* 方便 　
　　Servlet提供了大量的实用工具例程，例如自动地解析和解码HTML表单数据、读取和设置HTTP头、处理Cookie、跟踪会话状态等。
　　* 功能强大
　　在Servlet中，许多使用传统CGI程序很难完成的任务都可以轻松地完成。例如，Servlet能够直接和Web服务器交互，而普通的CGI程序不能。Servlet还能够在各个程序之间共享数据，使得数据库连接池之类的功能很容易实现。
　　* 可移植性好
Servlet用Java编写，Servlet API具有完善的标准。因此，为IPlanet Enterprise Server写的Servlet无需任何实质上的改动即可移植到Apache、Microsoft IIS或者WebStar。几乎所有的主流服务器都直接或通过插件支持Servlet。

转自：https://www.cnblogs.com/MuyouSome/p/3938203.html


### Java HashMap好文


源码解析：
- https://www.cnblogs.com/xrq730/p/5030920.html
- http://www.importnew.com/20386.html

面试总结：
- https://www.cnblogs.com/lchzls/p/6714474.html
- https://www.toutiao.com/a6317489506677309698/?tt_from=mobile_qq&utm_campaign=client_share&app=news_article&utm_source=mobile_qq&iid=5056005857&utm_medium=toutiao_ios
- https://blog.csdn.net/u012512634/article/details/72735183


### fastjson 转时间


在field上加注解，比如转ISO格式的时间
``` java
@JSONField(format="yyyy-MM-dd'T'HH:mm:ss'Z'")
```


### sun.misc.Unsafe


- http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/
- https://blog.csdn.net/anLA_/article/details/78631026
- https://blog.csdn.net/lvbaolin123/article/details/80527598


### Java String pool


[Where does Java's String constant pool live, the heap or the stack?](https://stackoverflow.com/questions/4918399/where-does-javas-string-constant-pool-live-the-heap-or-the-stack)

### Java 静态内部类和非静态内部类

[Why prefer non-static inner classes over static ones?](https://softwareengineering.stackexchange.com/questions/238782/why-prefer-non-static-inner-classes-over-static-ones)

> Joshua Bloch in Item 22 of his book "Effective Java Second Edition" tells when to use which kind of nested class and why. There are some quotes below:
>
> One common use of a static member class is as a public helper class, useful only in conjunction with its outer class. For example, consider an enum describing the operations supported by a calculator. The Operation enum should be a public static member class of the `Calculator` class. Clients of `Calculator` could then refer to operations using names like `Calculator.Operation.PLUS` and `Calculator.Operation.MINUS`.
>
> One common use of a nonstatic member class is to define an *Adapter* that allows an instance of the outer class to be viewed as an instance of some unrelated class. For example, implementations of the `Map` interface typically use nonstatic member classes to implement their *collection views*, which are returned by `Map`’s `keySet`, `entrySet`, and `values` methods. Similarly, implementations of the collection interfaces, such as `Set` and `List`, typically use nonstatic member classes to implement their iterators:
>
> ```
> // Typical use of a nonstatic member class
> public class MySet<E> extends AbstractSet<E> {
>     ... // Bulk of the class omitted
> 
>     public Iterator<E> iterator() {
>         return new MyIterator();
>     }
> 
>     private class MyIterator implements Iterator<E> {
>         ...
>     }
> }
> ```
>
> If you declare a member class that does not require access to an enclosing instance, *always* put the `static` modifier in its declaration, making it a static rather than a nonstatic member class.


### bridge method


- https://cn.aliyun.com/jiaocheng/330720.html
- https://docs.oracle.com/javase/tutorial/java/generics/bridgeMethods.html#bridgeMethods
- https://www.cnblogs.com/zsg88/p/7588929.html
- https://www.jianshu.com/p/250030ea9b28

### finally & return

参考：https://www.cnblogs.com/lanxuezaipiao/p/3440471.html

> 1. **finally块的语句在try或catch中的return语句执行之后返回之前执行**
>
> 2. **finally里的修改语句可能影响也可能不影响try或catch中 return已经确定的返回值**
>
> 3. **若finally里也有return语句则覆盖try或catch中的return语句直接返回**



### 动态代理

#### JDK动态代理

机制：**通过接口**

流程：

1. 被代理类`Subject`需要实现包含相应需要做代理处理的方法，这些方法来自被代理类实现的**若干接口**；
2. 实例化一个`Subject`对象；
3. 实现JDK的`InvocationHandler`接口，接口中进行业务代理，这部分逻辑在`invoke`方法中；
4. 实例化一个`InvocationHandler`对象，并绑定`Subject`实例；
5. 使用JDK的`Proxy.newProxyInstance(loader, interfaces, handler); `方法生成代理类；
   1. JDK动态代理库通过**若干接口**方法名称锁定被代理类的相关方法；
   2. JDK动态代理库通过字节码技术动态生成代理类，代理类重新定义了这些接口方法，并且调用`handler`对象；

``` java
interface AEvent{void ActionA();}
//被代理类
interface BEvent{void ActionB();}
class Me implements AEvent ,BEvent{
    @Override
    public void ActionA() {System.out.println("事件A");}
    @Override
    public void ActionB() {System.out.println("事件B");}
}
class MyInvocationHandler implements InvocationHandler{
    Object object;//实现了接口的被代理类的对象的声明 也是我们要代理的真实对象
    //给被代理类的对象实例化
    //返回代理类对象
    public Object blind(Object o){
        object = o;
        return Proxy.newProxyInstance(object.getClass().getClassLoader(),
                o.getClass().getInterfaces(),this);
    }
    //当通过代理类对象发起对被重写的方法的调用时 都会转化为对如下的invoke方法的调用
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        return method.invoke(object, args);
    }
}

public class test_Dynamic_Proxy {
    public static void main(String[] args) {
        //创建一个实现了InvocationHandler方法的接口的类的对象
        MyInvocationHandler handler = new MyInvocationHandler();
        //被代理类对象
        Me me = new Me();
        //调用blind()方法 动态返回一个同样实现了real所在类实现的接口的Subject代理类的对象
        Object object = handler.blind(me);
        //subject就是代理类的对象
        AEvent aEvent = (AEvent) object;
        aEvent.ActionA();
        System.out.println("----------------");
        BEvent bEvent = (BEvent) handler.blind(me);
        bEvent.ActionB();
    }
}
```



#### Cglib动态代理

机制：**通过继承实现**

流程：

1. 实现`MethodInterceptor `，在里面的`intercept`方法进行代理业务；
2. 获取Cglib的`Enhancer`对象，传入`SupperClass`，指定代理类，和`Callback`也就是一个`MethodInterceptor `实例；



### 泛型约束和局限性

1. 不能把基本数据类型当成类型参数，要用包装类；

2. 运行时类型检查只适用于原视类型：

   ``` java
   if (a instanceOf AClass<BClass>) // 错误
   if (a instanceOf AClass) // 只能检查原始类型
   ```

3. 不能`new`参数化类型数组：

   ``` java
   AClass<BClass>[] arr = new AClass<BClass>[10];	// 错误
   ```

   非要用数组结构，那就使用`ArrayList<AClass<BClass>> al = new ArrayList<>();`

4. 但是给参数个数可变的方法传递泛型类型实例：

   ``` java
   public static <T> void addAll(Collection<T> coll, T... ts)
   ```

   但是编译器会发出警告，你可以使用`@SuppressWarnings("unchecked")`来压制它

5. 不能在静态域或者方法中引用类型变量；

   ``` java
   public class AClass<T> {
       private static T instance;
       public static T getInstance() {
           if (instance == null) //...
           return instance;
       }
   }
   ```



### ClassLoader

https://www.baeldung.com/java-classloaders

#### **Bootstrap Class Loader**

Java classes are loaded by an instance of *java.lang.ClassLoader*. However, class loaders are classes themselves. Hence, the question is, who loads the *java.lang.ClassLoader* itself*?*

This is where the bootstrap or primordial class loader comes into the picture.

It's mainly responsible for loading JDK internal classes, typically *rt.jar* and other core libraries located in *$JAVA_HOME/jre/lib directory*. Additionally, **Bootstrap class loader serves as a parent of all the other \*ClassLoader\* instances**.

**This bootstrap class loader is part of the core JVM and is written in native code** as pointed out in the above example. Different platforms might have different implementations of this particular class loader.

#### **Extension Class Loader**

The **extension class loader is a child of the bootstrap class loader and takes care of loading the extensions of the standard core Java classes** so that it's available to all applications running on the platform.

Extension class loader loads from the JDK extensions directory, usually *$JAVA_HOME/lib/ext* directory or any other directory mentioned in the *java.ext.dirs* system property.

#### **System Class Loader**

The system or application class loader, on the other hand, takes care of loading all the application level classes into the JVM. **It loads files found in the classpath environment variable, \*-classpath\* or \*-cp\* command line option**. Also, it's a child of Extensions classloader.



### POJO & JavaBean

When we talk about a POJO(**“Plain Old Java Object”**), what we're describing is a straightforward type with no references to any particular frameworks. **A POJO has no naming convention** for our properties and methods.

**A JavaBean is still a POJO but introduces a strict set of rules around how we implement it:**

- Access levels – our properties are private and we expose getters and setters
- Method names – our getters and setters follow the *getX* and *setX* convention (in the case of a boolean, *isX* can be used for a getter)
- Default Constructor – a no-argument constructor must be present so an instance can be created without providing arguments, for example during deserialization
- Serializable – implementing the *Serializable* interface allows us to store the state



### Finall 关键字

- 修饰类：该类不能被继承；
- 修饰方法：该方法不能被重载；
- 修饰变量：该变量引用不能改变，并且必须在声明时就赋值，并且在编译时就已经赋值完毕，先于本类实例的构造方法；
- 修饰方法参数：该参数在改方法内不能被改变引用；



### 异常小记

#### 分类

```graph
              ---> Throwable <--- 
              |    (checked)    |
              |                 |
              |                 |
       --> Exception          Error
       |   (checked)       (unchecked)
       |
RuntimeException
  (unchecked)
```

1. 受检异常
2. 非受检异常/运行时异常
3. 错误

#### 受检异常

Java编译器要求我们必须处理的异常，要么显式地往上层调用方法抛出该异常，要么必须原地处理（`try-catch`）

- *IOException* – this exception is typically a way to say that **something on the network, filesystem, or database failed**.
- *ServletException*
- *ClassNotFoundException* - occurs when an application tries to **load a class through its fully-qualified name** and **can not find its definition on the classpath**

#### 运行时异常

运行时异常即不要求我们处理的异常，因此我们可以不用显式地使用`try-catch`语句去处理他们

- *ArrayIndexOutOfBoundsException* – this exception means that we tried to **access a non-existent array index**, like when trying to get index 5 from an array of length 3.
- *ClassCastException –* this exception means that we tried to perform **an illegal cast**, like trying to convert a *String* into a *List*. We can usually avoid it by performing defensive *instanceof* checks before casting.
- *IllegalArgumentException* – this exception is a generic way for us to say that one of the provided method or constructor **parameters is invalid**.
- *IllegalStateException* – This exception is a generic way for us to say that **our internal state**, like the state of our object, **is invalid**.
- *NullPointerException* – This exception means we tried to **reference a *null* object**. We can usually avoid it by either performing defensive *null* checks or by using *Optional.*
- *NumberFormatException* – This exception means that we tried to **convert a *String* into a number, but the string contained illegal** characters, like trying to convert “5f3” into a number.

#### 错误

错误都是非常严重的情况，比如内存泄露、栈溢出等等，而且我们也不会显示地在某个地方处理这些错误，而是希望它们一直往上抛出

- *StackOverflowError –* this exception means that the **stack trace is too big**. This can sometimes happen in massive applications; however, it usually means that we have some **infinite recursion** happening in our code.
- *NoClassDefFoundError* – this exception means that a class failed to load either due to **not being on the classpath** or **due to failure in static initialization**.
- *OutOfMemoryError* –  this exception means that the JVM doesn't have any more memory available to allocate for more objects. Sometimes, this is due to a **memory leak**.

#### ClassNotFoundException & NoClassDefFoundError

前者是受检异常，就是在编译时就没找到这个类，压根就没有加载进classpath里；

后者是错误，是编译时没问题，运行时由于类在初始化静态内容的时候出错了，所以这个类也压根没被加载进运行时的classpath里；



### Metaspace & Method Area & Perm Gen

理一理这三个之间的关系：

- 在JDK 7之前，方法区是`Perm Gen`的一部分；
- 在JDK 7之前`interned-string`也就是平常说的字符串常量池是存储在`Perm Gen`的，由于`Perm Gen`的空间很小，所以经常被爆，于是Java 7先把字符串常量池移到了方法区；
- 从JDK7开始`Perm Gen`的移除工作，贮存在`Perm Gen`的一部分数据已经转移到了Java Heap或者是Native Heap。但`Perm Gen`仍然存在于JDK7，并没有完全的移除：符号引用(Symbols)转移到了native heap；字面量(interned strings)转移到了java heap；类的静态变量(class statics)转移到了java heap；剥离到heap区的内容形成了`Method Area`；
- `Perm Gen`在JDK8中被完全的移除了；
- 在JDK 8后，classe metadata被存储在叫做`Metaspace`的native memory，在系统的直接内存中；
- 在JDK 8后，`Method Area`承担的数据内容可参考：https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.5.4