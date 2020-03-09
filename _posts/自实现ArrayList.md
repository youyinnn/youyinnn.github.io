---
title: 自实现ArrayList
categories:
  - note
comments: true
date: 2018-06-04 22:47:12
tags:
  - arraylist
---



#### 前言

最近在复习**数据结构**和**算法**，这两个玩意也是被称之为**“程序员的基本素养”**，我最近比较想干的一件事就是读集合框架的源码

基于这个伟大目标，我开启了源码阅读的**“从头到尾读”**系列，目前只完成了**Collection接口、Iterable接口、Iterator接口**这三个章节，正打算开始读**ArrayList**的源码

为什么想要写自实现的ArrayList，主要也是为了配合ArrayList的源码阅读

大二的时候也学过数据结构这门课，也用Java实现过简单的ArrayList和其他常见的结构，但是这次的自实现，我的目标是**往JDK源码上面靠拢**，意在学习大师级的**设计手法以及精妙的算法**

话不多说，开搞



#### 热身
在此之前还没开始阅读`ArrayList`，但是我们可以稍稍瞥一眼它的类头，

``` java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
	//...
}
```

这里面重要的内容首先我们就盯着`AbstractList`这个抽象类，一直往深了摸，摸到了`Collection`这个接口，这个接口继承了`Iterable`接口，欸~摸到宝了，我们拿这个玩意去开展我们的**自实现类**，为什么其他的抽象类、其他的接口不用管呢？

在我看来，**无论是Collection、List这类的接口，还是AbstractList、AbstractCollection这些抽象类**它们仅是提供一个**接口规范以及一定的实现**，真正有意思的东西，还得是**迭代器**这个利器！

于是马上写好自实现的类头，加上泛型就不用说了

```java
public class MyArrayList<E> implements Iterable<E>{

    @Override
    public Iterator<E> iterator() {
        return null;
    }

    @Override
    public void forEach(Consumer<? super E> action) {

    }

    @Override
    public Spliterator<E> spliterator() {
        return null;
    }
}
```
这里面除了`Iterator()`方法之外，另外两个方法不太熟，但首先我们保证好一个容器结构应有的几个基本接口：

- **get(int index)**
- **int size()**
- **E remove(int index)**
- **void add(E element)**
- **void add(int index, E element)**
- **boolean contains(int index)**
- **int indexOf(E element)**

里面注意的几个点：

- 凡是牵扯到**索引操作**的，都需要**判断index是否合法**，比如是负数或者超过界限了
- add方法的**扩容问题**

准备就绪，咔咔咔就写下十几行代码：

```java
private final int DEFAULT_CAPACTTY = 10;
private int size = 0;
private E[] array;

MyArrayList() {
    array = (E[]) new Object[DEFAULT_CAPACTTY];
}

MyArrayList(int capacity) {
    array = (E[]) new Object[capacity];
}

public int size() {
    return size;
}
public E get(int index) {
    E element = null;
    if (index <= endIndex()) {
        element = array[index];
    }
    return element;
}
public boolean contains(E target) {
    if (target != null) {
        for (E e : this) {
            if (e.equals(target)) {
                return true;
            }
        }
    }
    return false;
}

public int indexOf(E element) {
    if (element != null) {
        for (int i = 0; i < size; i++) {
            if (element.equals(array[i])) {
                return i;
            }
        }
    }
    return -1;
}
```

这些就不解释了，为了方便，我还写了一个获取末尾元素下标值的方法，这也是基本的

```java
private int endIndex() {
    return size - 1;
}
```



##### remove

```java
public E remove(int index) {
    E element;
    if (index >= 0 && index <= endIndex()) {
        element = array[index];
        if (index < endIndex()) {
            System.arraycopy(array, index + 1, array, index, endIndex() - index);
        }
        size--;
        return element;
    } else {
        throw new ArrayIndexOutOfBoundsException("index:" + index);
    }
}	
```

基本思路，如果index在可取范围内，则可以remove，否则抛出异常

在可取范围内，如果index不是最后一个的话，那么移除该元素就得：

- **index位之后的元素往前移一位**
- **size--**

否则只进行`size--`



##### add

```java
public void add(E element) {
    add(size, element);
}

public void add(int index, E element) {
    if (index < 0) {
        throw new ArrayIndexOutOfBoundsException("index:" + index);
    } else {
        // 如果插入位置为当前数组尾部或者更后面 则统一插到尾部位置
        adjustArray();
        if (index < size) {
            System.arraycopy(array, index, array, index + 1, endIndex() - index);
        }
        array[index] = element;
        size++;
    }
}

public void adjustArray() {
    if (size == array.length) {
        E[] newArr = (E[]) new Object[array.length * 2];
        System.arraycopy(array, 0, newArr, 0, array.length);
        array = newArr;
    }
}
```

实现`add(int index, E element)`和传统的不太一样，我的这个方法更具体一些，我们把扩容的事情抽象成一个`adjustArray`方法，如果要插入的位置在当前列表的中间，我们将数组从要插入的位置开始往后移一位



##### Iterator

每个集合的**Iterator**的实现和各自集合的特点有关，所以**Iterator**也需要我们自己实现

```java
private class MyArrayListIterator implements Iterator<E>{

    private int currentIndex = 0;

    @Override
    public boolean hasNext() {
        return currentIndex < size;
    }

    @Override
    public E next() {
        return array[currentIndex++];
    }

    @Override
    public void remove() {
        MyArrayList.this.remove(--currentIndex);
    }

    @Override
    public void forEachRemaining(Consumer<? super E> action) {
        MyArrayList.this.forEach(action);
    }
}
```

这是我们写在**MyArrayList**类中的内部类，由于是基于数组的实现，**三大迭代器方法**也很简单就实现了，我们写完之后，**Iterable**方法就可以写两个了：

```java
@Override
public Iterator<E> iterator() {
    return new MyArrayListIterator();
}

@Override
public void forEach(Consumer<? super E> action) {
    if (action != null) {
        for (E e : this) {
            action.accept(e);
        }
    }
}
```



目前为止（2018年6月5日-08点55分）[代码快照](https://github.com/youyinnn/Algorithm_zoom/blob/a853c7bfa875ad032e4638562f5ae5d5a5483b79/src/main/java/datasrtuct/list/MyArrayList.java)，我们的自实现算是基本达标了，接下来我们进入阅读ArrayList的环节