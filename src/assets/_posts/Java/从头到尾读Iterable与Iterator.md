---
title: 从头到尾读Iterable与Iterator
comments: true
date: 2018-05-15 17:22:14
tags:
  - iterable
  - iterator
  - collections-framework
series: 从头到尾读
---

### Iterable 接口

含义: 这个接口的含义是, 容器的元素是否支持**迭代器**访问

#### 源码

```java
/**
 * 实现这个接口, 意味着对象可以使用forEach循环进行操作
 */
public interface Iterable<T> {
    /**
     * 返回一个迭代器
     */
    Iterator<T> iterator();

    /**
     * (1)和lambda有关, 执行这个方法等效于
     *  for (E element : collection) {
     *      //对e进行每一个action操作
     *  }
     */
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }

    /**
     * (1)返回一个源迭代器的子集迭代器, 这个子集迭代器可以迭代指定部分的源集合的元素
     * (2)意思是返回一个阉割版的迭代器.
     * (3)关键是Spliterator<T>这个接口, 默认的情况下, 这个方法并不阉割迭代器.
     * 具体作用暂未摸索到, 以后再回来看看.
     */
    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(), 0);
    }
}
```

### Iterator 接口

含义: 实现这个接口的类就是某个容器的**迭代器**, 这个概念的意思是, 我可以持有一个**迭代器**去遍历容器中的元素.

#### 源码

```java
/**
 * 源代码不多 所以去掉了很多注释就贴出来了
 */
public interface Iterator<E> {

    /**
     * 如果当次迭代还有下一个元素 就返回true 否则返回false
     */
    boolean hasNext();

    /**
     * (1)获取下一个元素, 并且指针下移一次
     * (2)如果迭代器没有下一个元素, 仍要强行调用该方法, 则会抛出
     *
     * @throws NoSuchElementException 这个异常
     */
    E next();

    /**
     * (1)移除元素
     * (2)这个方法会抛出两种异常:
     *  1)必须至少调用一次next方法, 且不能是最后一次next方法调用完之后, 才能调用remove, 否则抛出@throws IllegalStateException
     *  2)如果没有自己的实现, 则调用默认方法, 默认就是不支持remove方法, 所以会抛出@throws UnsupportedOperationException
     */
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    /**
     * (1)这个方法用于执行对Collection里所有元素的遍历, 每次遍历都对元素执行一遍action, 对于Consumer, 这个是1.8的特性, lambda语法糖的一些特性, 这块是对于forEach循环增强的方法.
     * (2)对于这个方法到底在哪里用到, 以后看读源码的时候是否会再遇到它吧.
     */
    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}

```

#### forEachRemaining 引例

> 待补充

### ListIterator

比一般的迭代器要厉害

```java
/**
 * 实现这个接口，意味着你的迭代器可以允许正向逆向地遍历list
 * 在过程中你甚至可以获取当前迭代的index，甚至是修改元素
 */
public interface ListIterator<E> extends Iterator<E> {

    // 查询操作
    boolean hasNext();

    E next();

    // 这个是前向询问是否有元素
    boolean hasPrevious();

    // 这是前向访问元素 作用和next()相反
    E previous();

    // 一个是获取后向index 一个是前向
    int nextIndex();
    int previousIndex();

    // 修改操作
    void remove();

    void set(E e);

    void add(E e);
}
```
