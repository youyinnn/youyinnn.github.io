---
title: 这，就是Lambda！
categories:
  - note
comments: true
date: 2018-06-02 10:52:00
tags:
  - lambda
  - java8
---

### HelloWorld

昨天的小米笔试题: **请用Lambda写一个将int数组[1,2,3]转换为String数组["1","2","3"]**

当时没写完整，就这个为例作为开始吧, 完整代码如下:

``` java
  int[] si = {1, 2, 3};
  Function<int[], String[]> f = (int[] ar) -> {
      String[] ss = new String[ar.length];
      for (int i = 0; i < ar.length ; i++) {
          ss[i] = ar[i] + "";
      }
      return ss;
  };
  System.out.println(Arrays.toString(f.apply(si)));
```

看不懂是不是?看不懂就对了,Lambda是一个语法糖,它的语法你得看得懂,才知道上面的代码干了什么.



### 语法

#### 要点1-函数式接口的支持

> 语法必须要函数式接口的支持, 函数式接口: **即接口中只有一个抽象方法**.一般需要`@FunctionalInterface`注解修饰类.
>
> 我们称这个唯一的抽象方法为, **函数方法**



#### 要点2-箭头语法

函数式写法格式, 分**左右两边**:
``` lambda
  (param1, param2, ...) -> {statement1;statement2;...;};
```
- **左边-参数列表**-方法要传递的参数:
  - 根据泛型可以省略参数列表的类型
  - 没有参数或者有两个以上参数时必须写`()`, 只有一个参数时可以省略`()`

- **右边-语句块**-表达式要执行的语句:
  - 如果只有一条语句, 则可以省略`{}`, 多条语句必须要`{}`
  - 如果有返回值, 且只有一条语句, 则可以`return`, 多条语句必须加




#### 要点3-参数列表类型和返回值类型

我们的lambda表达式, 最终还是得被一个**函数式接口**所引用, 我们的表达式可能有**参数列表**, 可能有**返回值**, 也可能都没有. 那么我们省略类型的时候, 函数是怎么判断参数列表类型和返回值类型的呢? 我们来看看这个接口

``` java
@FunctionalInterface
interface MyFunction<T, R> {
    /**
     * 函数方法:
     *  处理两个T类型的对象, 返回R类型的结果
     */
    R get(T t1, T t2);
}
```

很容易就看出, 我们是根据接口上的**泛型**去规定**参数列表类型**以及**返回值类型**的,  当我们省略类型的时候, 因为lambda是**依靠泛型填充类型**, 编译的时候, 代码就已经根据上下文自动填补类型了, 比如说这里的`get(T t1, T t2)`方法, 你**传递什么参数**, 参数类型就是什么, **方法体中实现的**的返回语句是什么类型的, 函数的返回值类型就是什么

``` java
public class Main{
	public static <T, R> R invokeGet(T t1, T t2, MyFunction<T, R> mf) {
        return mf.get(t1, t2);
    }    
}
```

我们可以如下省略类型的调用: 

``` java
    Person p1 = new Person("abc", 12);
    Person p2 = new Person("efg", 13);
    Integer integer =
            Main.invokeGet(p1, p2, (ax, bx) -> ax.getName().length() + bx.getName().length());
```

正常的做法是: 

``` java
    Integer integer =
            Main.<Person, Integer>invokeGet(p1, p2, (ax, bx) -> ax.getName().length() + bx.getName().length());
```

那么这里为什么可以省略? 因为我`invokeGet`的时候, 传进去的**t1, t2**是**p1, p2**, 所以**T类型**被补充为**Person类型**, 而对于返回值类型, 因为我们这里的方法体实现就一句话, 所以**{}**省略了, **return** 也省略了, 返回值类型就是语句`ax.getName().length() + bx.getName().length()`所运算出的类型.




#### 代码示例

``` java
public class Main{

    /**
     * 语法格式一: 无参 无返回值
     * 常用场景: 替代匿名内部类;
     *  () -> System.out.println("xixi");
     */
    @Test
    public void test1(){
        Runnable run = () -> System.out.println("xixi");
        run.run();
    }

    /**
     * 语法二: 一个参数 无返回值
     * Tips: 一个参数的话 小括号可以省略不写了 甚至可以配合方法引用(如代码中)
     *
     *         Consumer<String> consumer = x -> System.out.println(x);
     *         Consumer<String> consumer = (x) -> System.out.println(x);
     *
     * 常用场景: 和Consumer接口配合
     */
    @Test
    public void test2(){
        Consumer<String> consumer = System.out::println;
        consumer.accept("haha");
    }

    /**
     * 语法三: 两个参数, 有返回值
     * Tips1:
     *  返回值类型在接口方法上已经定义, 参数列表类型已经被泛型规定好了也可以省略,如:
     *          int compare(T o1, T o2);
     *
     * Tips2:
     *  如果实现的方法体中有一条语句, 那么return和大括号可以省略不写
     *
     * Tips3:
     *  如果实现的方法体中有多条语句, 那么必须要大括号和return
     *
     * Tips4:
     *  Comparator接口中已经写好了常用的自然顺序比较或者逆序比较的默认方法可以直接用默认方法引用
     */
    @Test
    public void test3(){
        //Comparator<Integer> comparator = Comparator.reverseOrder();
        Comparator<Integer> comparator = (x, y) -> y.compareTo(x);

        Comparator<Integer> comparator1 = (x, y) -> {
            System.out.println(x + y);
            return y.compareTo(x);
        };
    }

    /**
     * Lambda表达式的高级用法:
     *  (1) 连续泛型指定参数和返回值的类型
     *  (2) 静态方法指定泛型调用
     *  (3) 传递函数式接口
     */
    public static <T, R> R invokeGet(T t1, T t2, MyFunction<T, R> mf) {
        return mf.get(t1, t2);
    }

    @Test
    public void test4(){
        Person p1 = new Person("abc", 12);
        Person p2 = new Person("uiop", 13);
        Integer integer = 
                Main.invokeGet(p1, p2, (ax, bx) -> ax.getName().length() + bx.getName().length());
        String s = 
                Main.invokeGet(p1, p2, (ax, bx) -> ax.getAge() + " : " + bx.getAge());

        System.out.println(integer);
        System.out.println(s);
    }
}
```



### 五大核心函数式接口

前面我们说了, lambda依赖函数式接口, Java8已经写好了很多函数式接口了, 而其中最常用的就是接下来要介绍的**五大核心函数式接口**, 这样的函数式接口在Java8中到处都是.

所以说了解这**五大核心函数式接口**到底能干什么, 这点是非常重要的.

首先看看我写的笔试题的未完整版是什么样子的:

``` java
  Function f = (int[] arr) -> {
      String[] s = new String[arr.length];
      for (int i = 0; i < arr.length ; i++) {
          s[i] = arr[i] + "";
      }
      return s;
  };
```

再来看看完整版:

``` java
  int[] si = {1, 2, 3};
  Function<int[], String[]> f = (int[] ar) -> {
      String[] ss = new String[ar.length];
      for (int i = 0; i < ar.length ; i++) {
          ss[i] = ar[i] + "";
      }
      return ss;
  };
  System.out.println(Arrays.toString(f.apply(si)));
```

这和完整版相比, 缺少的是`Function`类后面的泛型定义, 所以这段代码是过不了的, 了解一下**五大核心函数式接口**,



#### Consumer<T> 消费型接口
##### 源码

``` java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

##### 函数方法

``` java
    void accept(T t);
```

消费型接口, 意思就是**"只进不出"**的表现, 所以我们看到方法并没有**返回值类型**

##### 默认方法

这个方法相当于将两个`Consumer`函数组合在了一起, 形成一个新的`Consumer`函数, after函数在源函数之后执行, 相当于一个**"后置函数"**

##### 示例

``` java
    @Test
    public void testConsumer(){
        Person p1 = new Person("abc", 12);
        Person p2 = new Person("uiop", 13);

        Consumer<Person> gn = 
            (person) -> System.out.println("Name is : " + person.getName());
        Consumer<Person> ga = 
            (person) -> System.out.println("Age is : " + person.getAge());
        Consumer<Person> gnAndga = gn.andThen(ga);

        gn.accept(p1);
        ga.accept(p2);
        gnAndga.accept(p1);
    }
```

``` console
Name is : abc
Age is : 13
Name is : abc
Age is : 12
```



#### Supplier<T> 供给型接口
##### 源码

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

##### 函数方法

```java
	T get();
```

**"有出没进"**, 供给型的函数接口.

##### 示例

```java
@Test
public void testSupplier(){
    Supplier<Person> supplier = () -> new Person();
    Person person = supplier.get();
    System.out.println(person);
}
```



#### Function<T, R> 函数型接口

##### 源码

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

##### 函数方法

```java
	R apply(T t);
```

就像一个函数, **"有进有出"**

##### 默认方法

`andThen`方法我们在消费型接口的时候已经介绍过了, 然后`compose`方法和这个方法差不多, 只不过这个方法是在源函数之前执行, 相当于是一个**"前置函数"**

##### 静态方法

这个方法暂时还没摸到有什么作用

##### 示例

```java
@Test
public void testFunction(){
    Person person = new Person();
    Function<Person, Person> function = (ps) -> {
        System.out.println("nothing change~");
        return ps;
    };
    function = function.compose((ps) -> {
        System.out.println("before");
        ps.setName("xixi");
        return ps;
    });
    function = function.andThen((ps) -> {
        System.out.println("after");
        ps.setAge(15);
       return ps;
    });
    System.out.println(function.apply(person));
}
```

``` console
before
nothing change~
after
Person{name='xixi', age=15}
```



#### Predicate<T> 条件预测型接口

##### 源码

```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
}
```

##### 函数方法

```java
	boolean test(T t);
```

给个T, 返回个布尔值

#### 默认方法

经过前几个接口的默认方法, 我们现在应该很容易能理解默认方法的作用了, 特别是对于**条件预测型接口**的默认方法, `and` `or` `negate` 分别代表用**和**的方式连接两个条件, 用**与**的方式连接两个条件, 用**非**呈现这个条件.



#### Comparator<T> 比较器接口

这个接口里的默认方法就更多, 牵扯到的使用情况就更复杂, 有待日后研究, 其实本来只是**"四大核心函数式接口"**的, 这个我放在第五个, 因为这个接口里的方法有很有价值. 
