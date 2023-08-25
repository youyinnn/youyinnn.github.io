---
title: Java's Refernece
tags:
  - reference-type
date: 2019-03-02 21:08:00
---

### Introduction

本篇主要内容：

1. Java 到底是值传递还是引用传递
2. Java 中的引用类型详解以其应用场景

### Pass-By-Value Or Pass-By-Reference ?

Java 中的所有传递都是值传递，并不存在所谓的引用传递

要理解这个问题的关键在于：

```java
Dog myDog;
```

其中的`myDog`并不是真正的 Dog 对象，而是一个*pointer*，这个指针可以指向一个 Dog 对象

意思是说：

```java
Dog myDog = new Dog("Rover");
foo(myDog);
```

本质上来说，这仅仅只是将这个被创建的 Dog 对象的地址传递给了`foo`方法

假如说`myDog` 这个*pointer*的地址是**0x19**，而它指向的这个`Dog`对象的地址是**0x42**，那么我们其实是把**0x42**这个值，传递给了方法，而不是将**0x19**传递给了方法

如果说方法里面的逻辑是这样的：

```java
public void foo(Dog someDog) {
    someDog.setName("Max");     // 1
    someDog = new Dog("Fifi");  // 2
    someDog.setName("Rowlf");   // 3
}
```

我们来分析一下这个方法里发生了什么事：

- 参数`someDog`指向**0x42**
- 在`//1`
  - `someDog` 指向的**0x42**被 setName 成**Max**了
- 在`//2`
  - 一个名称为**Fifi**的新`Dog`对象（**0x97**）被`someDog`指向了
- 在`//3`
  - `someDog`指向的**0x97**被 setName 成**Rowlf**了
- 方法返回

那么接下来是灵魂拷问：_方法外面的`myDog`这时候叫什么名字？_

这里就是关键！

它叫**Max**，但是！

从始至终请记住，`myDog`是一个 pointer，它从始至终只指向了**0x42**，它还是原来那条一无是处的狗，只不过在`//1`的时候被人改了名字而已；

至于`someDog`，它只是一个容易变心的指针而已，所以方法内外的`myDog`和`someDog`，它们是两个世界的指针，谁也不会真正影响到谁变心；

### Reference Type

之前在 JVM 学习的时候学过几种引用的含义，这里再引用一些[参考](https://blog.csdn.net/xlinsist/article/details/57089288)，深入了解一下

> 作者：Xurtle
> 来源：CSDN
> 原文：https://blog.csdn.net/xlinsist/article/details/57089288

#### Strong reference

显式写出来的引用就是它，除非显式引用断开了否则就回收它，而这背后 JVM 正是直接通过可达性判断来回收的，每个强引用的对象都能通过可达性判断；

```java
String a = new String("xixi");	// ’xixi‘ is at 0x42
// some work
a = null;	// ‘xixi’ which means 0x42 is now available for GC
```

#### Soft reference

它引用的对象只有在内存不足时**且没有强引用同时引用这个对象的时候**，才会被回收，也即是在下次 OOM 之前，JVM 一定会清理掉所有的**soft reference**

虽然 GCor 们已经很努力地在工作了，但是我们作为 Java 开发，也不能为所欲为，不当的代码会造成冗余的对象，变成 GCor 们无法清理的垃圾，甚至造成内存泄漏问题

我们来看一段代码：

```java
public class LeakyChecksum {
    private byte[] byteArray;

    public synchronized int getFileChecksum(String fileName) {
        int len = getFileSize(fileName);
        if (byteArray == null || byteArray.length < len)
            byteArray = new byte[len];
        readFileContents(fileName, byteArray);
        // calculate checksum and return it
    }
}
```

在没有对`byteArray`进行手动数据清理的时候，`byteArray`会不断重用数组，除非`LeakyChecksum`对象被 GC，否则它不会被 GC，它的大小会始终和它处理过的最大的文件一样大，这样会增加 GC 的频率；

而且因为方法后续没有手动清理，所以这个字节数组就一直存在内存中的垃圾，造成内存泄漏

于是我们可以使用软引用去描述这个字节数组，一旦内存紧张的时候，它就会被回收掉，从而释放多余的空间

```java
public class CachingChecksum {
    private SoftReference<byte[]> bufferRef;

    public synchronized int getFileChecksum(String fileName) {
        int len = getFileSize(fileName);
        byte[] byteArray = bufferRef.get();
        if (byteArray == null || byteArray.length < len) {
            byteArray = new byte[len];
            bufferRef.set(byteArray);
        }
        readFileContents(fileName, byteArray);
        // calculate checksum and return it
    }
}
```

可以看到，我们每次都尝试获取软引用对象，如果它为 null，证明它是第一次访问或者被 GC 清理掉了

#### Weak reference

被声明为弱引用的对象，**如果没有强引用同时引用这个对象**，那么它只能存活到下一次 GC 之前

```java
WeakReference<String> sr = new WeakReference<String>(new String("hello"));

System.out.println(sr.get()); // hello
System.gc();                  // 通知JVM的gc进行垃圾回收
System.out.println(sr.get()); // might be null
```

#### Phantom reference

**Phantom References**与上面的几个引用存在很大的不同，至少上面的`Reference` 对象通过它们的`get()` 方法可以获取到它们所引用的对象，但是，`PhantomReference` 的只会返回`null`，因为虚引用的意义不在于 get 到引用，而在于**它能提醒我们哪些对象不应该继续存在了**

[这篇里](https://blog.csdn.net/xlinsist/article/details/57089288)说：_“Phantom reference 的唯一作用就是它可以监测到对象的死亡，即，当你的对象真正从内存中移除时，指向这个对象的`PhantomReference` 就会被加入到队列中”_

这句话其实后半句有误，应该是*“这个被回收对象生前所引用的虚引用对象会被加入到**引用队列**中”*才对

关于**引用队列**，具体是什么，我们下节再细说，先来整理一下虚引用到底有什么神通

它首先会表现出来的行为是：当且仅当虚引用对象的**参照对象（referent）**被 GC 回收掉的时候，那么这个虚引对象用会被加入到`ReferenceQueue`中，**这时候虚引用对象还没被回收**

```java
public class PhantomReferenceDemo {
    private static ReferenceQueue<Person> rq = new ReferenceQueue<>();
    static Person p;
    static Dog d;
    public static void main(String[] args){
        p = new Person("xixi");
        d = new Dog(p, rq, "haha");
        printRQ();
        p = null;
        System.gc();
        waitMoment(2000);	// wait gc
        printRQ();
    }

    static class Person {
        String name;Dog dog;
        public Person(String name) {this.name = name;}
        public void setDog(Dog dog) {this.dog = dog;}
    }

    static class Dog extends PhantomReference<Person> {
        String name;
        // Person person;
        public Dog(Person referent, ReferenceQueue<? super Person> q, String name) {
            super(referent, q);
            // this.person = referent;
            this.name = name;
        }
    }

    private static void waitMoment(long time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static void printRQ() {
        int size = 0;
        Object obj;
        while ( ( obj = rq.poll() ) != null ) {
            System.out.println("reference: " + obj);
            size++;
        }
        System.out.println("size of rq： " + size);
    }
}

// size of rq： 0
// reference: _reference.PhantomReferenceDemo$Dog@45ee12a7
// size of rq： 1
```

虚引用的正确实现方式就是如`Dog`对象一样，继承`PhantomReference<Person>`，因为狗是跟随人的，如果人没有了，那么狗就没有存在的必要了（请不要带有感情地去读这句话，客观的看代码- -）所以说，狗对象的**参照对象（referent）**是人！

所以在`line:9`之后，当人对象变为**不可达状态**的时候，被 GC 处理掉了之后，因为两者之间的虚引用关系，狗对象被加入到了指定的引用队列中，表面需要对这个没有存在必要的狗对象也进行处理，我们可以重写虚引用对象的`clear()`方法，在方法里面去掉狗的强引用，去然后在处理引用队列的时候，调用虚引用对象的`clear()`方法

```java
// Dog
@Override
public void clear() {
    super.clear();
    System.out.println("clear dog");
    d = null;
}
// printRQ
private static void printRQ() {
    // ...
    while ( ( obj = rq.poll() ) != null ) {
        // ...
        ((Reference) obj).clear();
    }
	// ...
}
```

那么上一句说到的不可达状态如何验证？狗对象的 Person 字段相关被注释掉了，如果解开注释之后，即使全局 q 对象已经设置为 null，但是人对象还有狗对象去引用，人对象还是处于可达状态的，所以第二次`printRQ`方法依旧是没有任何对象入队

### Reference Abstract Class & ReferenceQueue

上面提到的 4 种引用类型中的后 3 种，在 Java 中其实都是`Reference`的子类实现，并且`Reference`和`ReferenceQueue`的关系很密切

其实我感觉虚引用的作用可以人为替代，比如上文的人和狗的关系，只要狗没有强引用，那么人没了狗也就没了

所以更多的时候，虚引用是用来监听虚引用的参照对象是否被 GC 掉了

上节已经说过虚引用和引用队列的关系了，它必须指定一个引用队列，软引用和弱引用可以选择性地和引用队列合作

以下参考自[java 源码系列 - 带你读懂 Reference 和 ReferenceQueue](https://juejin.im/entry/5b28f605f265da59942344d4)

#### Reference

主要是负责内存的一个状态，当然它还和 java 虚拟机，垃圾回收器打交道。Reference 类首先把内存分为 4 种状态 Active，Pending，Enqueued，Inactive。

- Active，一般来说内存一开始被分配的状态都是 Active，
- Pending 大概是指快要被放进队列的对象，也就是马上要回收的对象，
- Enqueued 就是对象的内存已经被回收了，我们已经把这个对象放入到一个队列中，方便以后我们查询某个对象是否被回收，
- Inactive 就是最终的状态，不能再变为其它状态。

#### ReferenceQueue

引用队列，在检测到适当的**可到达性更改**后，垃圾回收器将已注册的引用对象添加到队列中，ReferenceQueue 实现了入队（enqueue）和出队（poll），还有 remove 操作，内部元素 head 就是泛型的 Reference。

#### Sample

```java
public static void main(String[] args) throws InterruptedException {
    ReferenceQueue queue = new ReferenceQueue();

    // 创建弱引用，此时状态为Active，并且Reference.pending为空
    // 当前Reference.queue = 上面创建的queue，并且next=null
    WeakReference reference = new WeakReference(new Object(), queue);
    System.out.println(reference);
    // 当GC执行后，由于是虚引用，所以回收该object对象
    //并且置于pending上，此时reference的状态为PENDING
    System.gc();

    /* ReferenceHandler从pending中取下该元素，并且将该元素放入到queue中，
    此时Reference状态为ENQUEUED，Reference.queue = ReferenceENQUEUED */

    /* 当从queue里面取出该元素，则变为INACTIVE，Reference.queue = Reference.NULL */
    Reference reference1 = queue.remove();
    System.out.println(reference1);
}
```

我们很容易就想到，`reference`和`reference1`是同一个对象，而且这段代码也揭示了一个事实：**匿名对象都是虚引用**

### Conclusion

有效地利用 3 种引用类型，可以帮助我们提高 GC 效率，防止 OOM

在 Java 中也有许多应用实例，比如有`WeakHashMap`等等，他在`ThreadLocal`里就运用到了，以后有空再研究
