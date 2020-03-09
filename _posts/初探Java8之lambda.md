---
title: 初探Java8之lambda
categories:
  - thinking
comments: true
date: 2018-05-15 10:05:00
tags:
  - java8
  - lambda
---

{% cq %}

本文从为知笔记迁移过来, 本文的写作时间是 : 2016/10/17 下午12:28:14, 两年前的文章, 言语难免幼稚, 思维难免浅显, 多多包含.

{% endcq %}

### 引例

``` java
    List<Integer> intlist = new ArrayList<Integer>();

    intlist.add(1);
    intlist.add(2);
    intlist.add(3);

    intlist.forEach((num)->System.out.println(num));
```
​
这里就有一个疑问：ArrayList为什么会有一个forEach()函数，而且传进去的变量是这样的形式？

于是我向上找了`forEach()`方法的源码，发现这个方法是被定义在   `Iterable`接口里面的，接口里面为什么能定义方法？

``` java
    /**
     * Performs the given action for each element of the {@code Iterable}
     * until all elements have been processed or the action throws an
     * exception.  Unless otherwise specified by the implementing class,
     * actions are performed in the order of iteration (if an iteration order
     * is specified).  Exceptions thrown by the action are relayed to the
     * caller.
     *
     * @implSpec
     * <p>The default implementation behaves as if:
     * <pre>{@code
     *     for (T t : this)
     *         action.accept(t);
     * }</pre>
     *
     * @param action The action to be performed for each element
     * @throws NullPointerException if the specified action is null
     * @since 1.8
     */
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }
```

看了这个方法的说明发现，这是java8的新特性：允许接口里面定义默认方法。再一层一层地往上找可以发现继承和实现的关系图：

我们再回到`forEach`方法，他的参数为什么是这样的，看了源码我发现，他传进去的是一个：`Consumer` 类型的参数。所以这又是个什么鬼？惯例帖源码：
``` java
/**
 * Represents an operation that accepts a single input argument and returns no
 * result. Unlike most other functional interfaces, {@code Consumer} is expected
 * to operate via side-effects.
 *
 * <p>This is a <a href="package-summary.html">functional interface</a>
 * whose functional method is {@link #accept(Object)}.
 *
 * @param <T> the type of the input to the operation
 *
 * @since 1.8
 */
@FunctionalInterface
public interface Consumer<T> {
​
    /**
     * Performs this operation on the given argument.
     *
     * @param t the input argument
     */
    void accept(T t);
​
    /**
     * Returns a composed {@code Consumer} that performs, in sequence, this
     * operation followed by the {@code after} operation. If performing either
     * operation throws an exception, it is relayed to the caller of the
     * composed operation.  If performing this operation throws an exception,
     * the {@code after} operation will not be performed.
     *
     * @param after the operation to perform after this operation
     * @return a composed {@code Consumer} that performs in sequence this
     * operation followed by the {@code after} operation
     * @throws NullPointerException if {@code after} is null
     */
    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

得，看到这个 @since 1.8 就知道，`这又是一个java8的新东西：函数式接口 @FunctionalInterface 简称FI`，通过一些资料，我得知虽然之前也有一些`FI`，但是并没有很明确的给这些接口定义为`FI`，而是叫做`SAM类型（单抽象方法类型 Single Abstract Method）`。现在让我来好好研究这个接口，嗯，接口里面有个需要实现的方法`void accept(T t);`既然说需要实现那这个先放着，看下面那坨玩意.... 默认定义了一个`anThen`方法，传进去的是一个`Consumer`，出来的也是一个`Consumer`...？？

没关系，我们看第一句，这玩意就是判断你传进去的东西是不是`null`，不是就抛出个空指针异常；

下面就直接`return`了 而且这个结构有点不太好看出他做了什么，下面来分析分析我们`return`的是一个`Consumer`，所以在得出最终结果之前我们还得再进一次这个函数...所以..等等...不过这好像跟我们的`forEach`没什么关系。

好我们言归正传，看看forEach：
``` java    
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }
```

直接看for循环，这种形式的for循环是java1.5出的增强性for循环，目的是为了方便便利数组和集合，因为隐藏了index信息，所以对于单个元素的引索则显得很无力。 

因此吧，`this`就是我们的`intlist`，`action`就是我们的`lambda`表达式
```java 
  (num)->System.out.println(num)
```
然后。。。`action.accept(t)`。。这其实没什么，我们去看看`accept`就好了，往上翻发现：

``` java 
    /**
     * Performs this operation on the given argument.
     *
     * @param t the input argument
     */
    void accept(T t);
```

说啥？它说，执行输入进来的这个语句的操作。但这是接口里面的待实现的方法，没有实现我这么执行？？在哪实现的？？好，执行吧，他执行什么？ t ？ 往上看，t 是....？？？根据结果来看 t 应该是 `System.out.println(num)`

因为我们accept的就是这个句子，但是，如果 t 是一个语句，那么就和之前java5的增强性for循环的格式不对应...那那那我真没办法了。。只能认为这是一个语法糖了。。。我去反编译.class也看不懂底层到底是这么实现的，所学有限。

现在回到我们的最初----lambda表达式

其语法如下：

`(parameters)->{ statements; }`

我们的例子

`(num)->System.out.println(num)`

从结果来看，应该是我给你什么，你就能拿这个为我干什么事情。

再来看Java5和Java8的对比：

``` java
    //Java5的for-Each表达式对集合的循环
    for(Integer num : intlist){
        System.out.println(num);
    }
    
    //Java8的forEach()+lambda表达式对集合的循环
    intlist.forEach((num)->System.out.println(num));
```
在Java5的基础上，lambda就使代码更加简洁。

那么。。。lambda能在哪里用？前面提到过一个： `@FunctionalInterface` ，研究了Java8的API文档我发现：

这是一个FI声明，FI官方给的定义就是：有且仅有一个抽象方法的接口。而且这个抽象方法被称作是函数式方法，这个函数式方法能被lambda表达式的值和返回值类型所匹配。FI能够为多种上下文提供目标类型。

### Lambda的用法：

可选类型声明：不需要声明参数类型，编译器可以统一识别参数值。 

可选的参数圆括号：一个参数无需定义圆括号，但多个参数需要定义圆括号。 

可选的大括号：如果主体包含了一个语句，就不需要使用大括号。 

可选的返回关键字：如果主体只有一个表达式返回值则编译器会自动返回值，大括号需要指定明表达式返回了一个数值。

关于`lambda`表达式的理解，我在runoob网上看到一个例子，我觉得挺有代表性的，我自己也试着模仿这个例子去使用`lambda`：

``` java 
public class lambdaTest {
    
    //首先有一个标准的FI
    @FunctionalInterface
    interface LambdaPerform{
        void interfacesay(String name,int age);
    }
    
    public static void main(String[] args) {
        
        //lambda表达式登场
        LambdaPerform implementsay = (String name,int age) -> { System.out.print("lambda :");System.out.println(" "+name+" : "+age);};
        
        //神奇的一幕发生了
        implementsay.interfacesay("Tom", 25);
    }
}
```

控制台有结果：

lambda : Tom : 25

我们可以看到，传统的接口里面的抽象方法，必须要在某个类实现了这个接口，并提供了这个方法的实现，才可以用这个方法，那现在，如果这个接口是一个`FI`，`lambda`表达式登场之后，这个抽象方法`interfacesay`就能被使用。现在我们明白了，`lambda`表达式一登场的时候，他等于就干了两件大事：

- 实现了这个接口（从格式上看应该是等式左边的部分完成这个操作，有点匿名内部类的意思）

- 实现了这个接口里面唯一的抽象方法。（等式右边就好比写成列出成员列表，完成方法体实现抽象方法）

至少我是这样理解他干了这俩事的，所以我们就可以使用这个`interfacesay`函数！！！

### 总结

这也就解决了上面的`accept`方法为什么没有实现却可以使用的问题！

runoob网站还提到，`lambda`表达式只能引用`final`或者`final`局部变量，也就是不能在`lambda`内修改外部定义的变量，否则编译出错。就算没有说明变量是`final`，在表达式内也改不了，意思是传进去的变量被标识为有一个隐式的`final`说明。


参考：
http://www.runoob.com/java/java8-lambda-expressions.html
http://blog.csdn.net/samjustin1/article/details/52268004
Java Platform SE 8 - API