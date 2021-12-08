---
title: 初探Java8之方法引用
categories:
  - java
  - grammar
comments: true
date: 2018-05-15 10:40:00
tags:
  - java8
  - 方法引用
---

{% cq %}

本文从为知笔记迁移过来, 本文的写作时间是 : 2016/10/18 下午1:41:28, 两年前的文章, 言语难免幼稚, 思维难免浅显, 多多包含.

{% endcq %}

 > 在学习这个东西的时候，找了很多资料，网上说的也都很笼统，找不到一个比较容易上手的例子，直到我看到一篇文章，作者在整体讲述Java5-8的新特性，其中讲完Java8的lambda表达式之后，马上就讲方法引用这个特性，我才更加清楚的意识到，方法引用其实是比lambda更加简洁的一个语法糖（不知道我这样理解对不对），但是，常识告诉我们，越简单的技术，限制条件就越多，为什么网上的关于方法引用的讲解都很散，因为方法引用的使用条件有点多。

根据这篇文章，我又自己写了一个例子，来说明为什么方法引用可以是一个更加简洁的lambda：

#### 引例

``` java
public class methodReferences {
    
    //标准FI
    interface methodReferencesFI{
        List<String> toList(String[] string);
    }
    
    public static void main(String[] args) {
        
        //lambda登场，这时候干了哪两件事？
        methodReferencesFI lam = person->{return Arrays.asList(person);};
        
        //MethodReferences登场，这时候其实也干了两件事
        methodReferencesFI mr = Arrays::asList;
        
        //给定数组
        String[] person = {"Tom","Jack","Jimy"};
        
        System.out.println("lambda 's toList :"+lam.toList(person));
        
        //神奇的事情
        System.out.println("MethodReferances 's toList :"+mr.toList(person));
        
        //更神奇的事
        List<String> personlist = mr.toList(person);
        
        //这也是静态方法引用
        personlist.forEach(System.out::println);
        
    }
​
}
```

你看，两种方式，同样实现了`methodReferencesFI` ，只是MR更加简便。这里同时也演示了昨天我没举例的有返回值的FI方法是如何使用lambda的。

这样看来，方法引用，好像更6一点啊？但是，但是，前面说了，越简单的技术，使用条件就越多，这里的使用条件就是，引用的方法是静态方法 ，比如asList是Arrays这个工具类下面的静态方法，这种工具类一般不用创建对象，可以直接用类名调用方法。这就是方法引用的其中一个限制条件。

刚才我又看了一篇文章，让我对于lambda表达式和方法引用之间的关系又有了新的理解。

上面说到，我们通常用lambda表达式来创建匿名方法，然而，我们有时候仅仅是调用了一个已经存在的方法：

``` java
Arrays.sort(stringsArray,(s1,s2)->s1.compareToIgnoreCase(s2));
```

但是在JAVA8中，还可以直接通过方法引用来简写lambda表达式中已经存在的方法。

``` java
Arrays.sort(stringsArray, String::compareToIgnoreCase);
```

#### 四种方法引用的形式

##### 1. 引用某个对象的实例方法：

``` java
class ComparisonProvider{
            public int compareByName(Person a,Person b){
                return a.getName().compareTo(b.getName());
            }
​
            public int compareByAge(Person a,Person b){
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }
​
ComparisonProvider provider = new ComparisonProvider();
​
//使用lambda表达式
//对象的实例方法
Arrays.sort(persons,(a,b)->provider.compareByAge(a,b));
​
//使用方法引用
//引用的是对象的实例方法
Arrays.sort(persons, provider::compareByAge);
```

首先我们来分析一下这里为什么可以用lambda，我们来看一下这个Arrays.sort的源码：

``` java
    public static <T> void sort(T[] a, Comparator<? super T> c) {
        if (c == null) {
            sort(a);
        } else {
            if (LegacyMergeSort.userRequested)
                legacyMergeSort(a, c);
            else
                TimSort.sort(a, 0, a.length, c, null, 0, 0);
        }
    }
```

这里看不出什么花，再看第二个参数：Comparator<? super T> c ，行，看源码之后我发现，这是一个FI，里面定义了唯一的一个抽象方法。。。？？唉不对？有两个抽象方法。。这就很尴尬了。。这和官方给出的FI的定义不符啊，这不是打脸嘛，后面我去查资料和看源码注释了解到，虽然这个接口显式定义了两个类方法，但是equals是一个明确声明为继承自Object的具体的函数！！！ 

但是，例子上这个lambda的使用方式，和我昨天学的有点不太一样，昨天的是，首先有一个FI，然后一步做两步，实现FI，实现FI方法，再调用该方法，但是呢，这里一步做了三件事情。我们先来看看如果用按照昨天的步骤做会如何。

``` java
    //开始肯定是一步做两步了
    Comparator<Person> comparator = (Person a,Person b)->provider.compareByName(a,b);
    ​
    //然后调用
    Arrays.sort(persons,comparator);
    现在直接：
    Arrays.sort(persons,(a,b)->provider.compareByAge(a,b));
    而方法引用更直接：
    Arrays.sort(persons, provider::compareByAge);
```

##### 2. 引用特定类的类型对象的实例方法

这个引用在文章里面被介绍为`难以理解的`，难以理解的东西，所以也难以维护，建议不使用这种引用。

##### 3. 构造函数的引用

其实这挺简单的。但是我觉得也没必要，因为new Class()；这种形式就已经够简单的了。

##### 4. 静态方法引用

格式`Class::static_method`

到这里方法引用总算是粗略的过了一遍，但是回想前面这一路学习下来，我还是有一个地方，不是很理解。

``` java
    //这也是静态方法引用
    personlist.forEach(System.out::println);
```

上文有一个地方说道这个...我们把这句话用lambda表示出来看看：

``` java
    personlist.forEach((p)->System.out.println(p));
```

但是...静态在哪？往上找源码我发现，只有out这个对象是静态的 ，其他的类都没有静态方法和这个相关，首先，System里面有一个静态的PrintStream对象out，然后PrintStream里面有一个已经实现的非静态方法println。静态对象应用非静态方法，算是静态引用么？