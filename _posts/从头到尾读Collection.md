---
title: 从头到尾读Collection
categories:
  - thinking
  - 从头到尾读系列
comments: true
date: 2018-05-15 17:17:26
tags:
  - collection
  - collections-framework
series: 从头到尾读
---

### Collection接口

### 源代码解读

#### 头部

``` java
public interface Collection<E> extends Iterable<E> {
  //...
}
```
头部继承了`Iterable<E>`接口, 对, 这里要注意是extends一个接口, 为什么是extends, 我们去看`Iterable<E>`接口里到底有啥, [跳转文章](https://youyinnn.github.io/?to=post&number=44).

所以我们知道, Collection继承了这个`接口`就代表着它拥有了容器内元素可迭代访问的功能.

#### 方法

##### 查询操作 Query Operations

###### size()方法

``` java
    /**
     * (1) 返回容器中存储元素的个数,
     * (2) 注意如果容器存储元素的数量超过了Integer.MAX_VALUE, 则该方法会仅返回Integer.MAX_VALUE.
     *
     * Q1: 所以容器到底能不能存超过Integer.MAX_VALUE数量的元素?
     */
    int size();
```

> 注意返回值是int

###### isEmpty()方法 

``` java
    boolean isEmpty();
```

> 略

###### contains(Object o)方法

``` java
    boolean contains(Object o);
```

> 略

###### iterator()方法

``` java
    Iterator<E> iterator();
```

> 略

###### toArray()方法

``` java
    /**
     * (1)返回一个包含集合所有元素的Object[]数组, 这个数组的元素顺序和迭代器迭代访问的顺序一致.
     * (2)这个方法返回的数组是安全的, 也就是一个new出来的数组, 里面的元素和源集合里的元素没有任何引用关系, 换句话说, 修改数组或者集合任何一方都不会影响彼此. 
     * (3)这个方法被视为数组和集合的转换方法之一.
     */
    Object[] toArray();
```

###### toArray(T[] a)方法

``` java
    /**
     * (1)返回一个包含集合所有元素的指定运行时T类型的数组.
     * (2)如果数组的类型和容量适合改容器元素, 则将容器元素从数组0号位依次放置(覆盖数组该位置原值).
     * (3)如果类型不匹配, 则抛出@throws ArrayStoreException.
     * (4)如果容量过小, 则并不操作传入的数组, 集合元素转换的新数组可以通过返回值得到.
     * (5)数组安全.
     * (6)转换方法之一.
     * (7)toArray(new Object[0])这样调用等价于toArray().
     */
    <T> T[] toArray(T[] a);
```

##### 修改操作 Modification Operations

###### add(E e)方法

``` java
    /**
     * (1)这个方法不是必须要实现的.
     * (2)保证集合包含了特定的元素, 那么当集合的内容发生改变的时候, 方法返回true; 当集合不允许包含重复元素的时候, 这个方法返回false.
     * (3)支持这个方法的集合类需要明确地在文档中指出添加元素的条件限制, 比如在特定的情况下, 集合不允许添加null元素, 甚至还会强行限制添加元素的类型.
     * (4)如果不是在元素重复的情况下拒绝元素添加到容器中, 你最好抛出一个可清晰说明原由的异常, 而不是返回false.
     * 
     * @throws IllegalStateException 如果你对元素的添加做出了限制, 规定某些元素不能被添加进来, 那么你可以抛出这个异常.
     * 常见异常 略.
     */
    boolean add(E e);
```

> 接口毕竟是接口, 注释中明确了实现这个方法的很多限制.


###### remove(Object o)

``` java
    /**
     * (1)这个方法不是必须实现的.
     * (2)从集合中移除特定的一个元素, 移除规则需符合(o==null ? e==null : o.equals(e)), 如果有元素被移除, 则方法返回true.
     * 
     * 常见异常 略.
     */
    boolean remove(Object o);
```

##### 数量级操作 Bulk Operations

###### containsAll(Collection<?> c)方法

``` java
    /**
     * (1)如果源集合里包含指定集合里的所有元素, 则返回true.
     */
    boolean containsAll(Collection<?> c);
```

###### addAll(Collection<? extends E> c)方法

``` java
    /**
     * (1)这个方法不是必须实现的
     * (2)文档原句: 
     *  The behavior of this operation is undefined if the 
     *  specified collection is modified while the operation is in progress.
     *  (This implies that the behavior of this call is undefined if the
     *  specified collection is this collection, and this collection is
     *  nonempty.)
     *  大致意思是, 调用方法的时候, 在方法内部不可以回调这个方法, 甚至是调用this.addAll(c)
     *  因为在这个方法执行的时候, 该方法其实是未定义的. 实现该方法的时候需要注意一下.
     *
     * 常见异常 略.
     */
    boolean addAll(Collection<? extends E> c);
```

###### removeAll(Collection<?> c)方法

``` java
    /**
     * (1)这个方法不是必须实现的.
     * (2)移除源集合中所有和c集合共有的元素.
     */
    boolean removeAll(Collection<?> c);
```

###### removeIf(Predicate<? super E> filter)方法

``` java
    /**
     * (1)自1.8.
     * (2)移除集合中满足特定陈述(predicate)的元素.
     * 
     * 实现要求:
     *  默认的实现是, 使用自己的迭代器去遍历元素. 每个匹配到的元素都使用Iterator.remove()方法.
        如果迭代器不支持移除方法, 则会在匹配到第一个元素的时候抛出相关异常.
     */
    default boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }
```

###### retainAll(Collection<?> c)方法

``` java
    /**
     * (1)这个方法不是必须实现的.
     * (2)保留源集合中和c集合共有的元素.
     */
    boolean retainAll(Collection<?> c);
```

###### clear()方法

``` java
    void clear();
```

> 略

##### 比较和散列 Comparison and hashing

###### equals(Object o)方法

``` java
    boolean equals(Object o);
```

> 略

###### hashCode()方法

``` java
    boolean hashCode();
```

> 略

###### spliterator()方法

``` java
    /**
     * (1)自1.8.
     * (2)返回一个Spliterators对象
     * (3)若要实现该方法, 需要记录好子迭代器的特征值. 如果子迭代器记录的是Spliterator.SIZED 
     * 而且集合没有元素, 那么就没有必要再记录特征值了.
     * (4)默认的实现最好被子类重载, 以得到更有效的子迭代器. 为了更好地保存stream()方法和parallelStream()方法的懒加载, 
     *  子迭代器必须持有 IMMUTABLE 或者 CONCURRENT, 或者是`延迟绑定`的.
     *  如果没有持有这些特征值, 重载的类必须在子迭代器中记录好绑定的策略以及结构化的接口, 并且需要重载stream()方法和parallelStream()方法
     */
    @Override
    default Spliterator<E> spliterator() {
        return Spliterators.spliterator(this, 0);
    }
```

#### 疑问

##### Q1: 容器到底能不能存超过Integer.MAX_VALUE数量的元素?

##### Q2: spliterator()方法的作用是什么?