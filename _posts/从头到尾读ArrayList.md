---
title: 从头到尾读ArrayList
categories:
  - java
  - collections-framework
comments: true
date: 2018-06-05 08:31:21
tags:
  - arraylist
  - collections-framework
series: 从头到尾读
---

#### ArrayList类

对终于要正式开始读**ArrayList**的源码了，虽然**ArrayList**的源码价值并不是那么地大，但作为集合框架源码阅读的第一站来说，我选择了在这里站稳脚跟

这个计划搁置了很久，大概有15天，中间跑去面试了一个星期，面试下来发现自己的基础已经忘的差不多了，决定回来好好沉淀一段时间，暑期实习offer有没有已经不重要了，**剑指秋招！**

为什么要读它，因为线性表几乎是数据结构的基础必备，昨晚花了将近1小时手撸了一个ArrayList的自实现，再搭配源码来看**自己在基础方法上有哪些没考虑到的点**，以及**实际投入使用的ArrayList到底优秀在哪里**

#### 源码

##### 类头

``` java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
	//...
}
```

首先继承了`AbstractList`

我们顺着`AbstractList`往里摸，一直到最后我们发现，还有**Collection接口和Iterable接口**，这两个接口加上**List接口**为我们提供了非常重要的集合接口规范

然后我们往下看



##### 成员变量

ArrayList这个类的成员变量并不复杂

```java
// 这是默认的容器长度
private static final int DEFAULT_CAPACITY = 10;

// 这是一个空的容器数组
private static final Object[] EMPTY_ELEMENTDATA = {};

// 这是默认容量的空的容器数组 用这个数组和上面那个数组对比
// 来分辨出第一个元素被添加进来的时候到底有多膨胀
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

// 存储元素的数组
// ArrayList的容量就是这个数组的长度
// 在空数组的情况下 如果 elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
// 那么我们加入第一个元素的时候会选择以DEFAULT_CAPACITY为初试容量去扩展容器
transient Object[] elementData; // non-private to simplify nested class access

// 包含元素的个数 我更愿意将size叫成是载量
private int size;
```

其中最重要的显然就是**elementData**这个变量了，它就是整个容器的核心

其次就是**size**这个变量，在**线性结构**中，我们常接触到的两个概念：**capacity（容量）、size（大小）**

前者表示容器**能装多少**，后者表示容器**装了多少**，但我们使用后者的时候，总说**“这个容器大小是多少”**，这个**”大小“**的说法很容易和**“容量”**混为一谈

所以我更愿意将**size**叫成是**载量（loaded size）**

在这里我们还需要留意一个变量，这个变量来自于**AbstractList抽象类**

```java
protected transient int modCount = 0;
```

这个值记录着List的**结构被改变的次数**，结构改变指的是**任何会影响到size的操作**
因为这些改动，可能会**扰乱容器结构**，而导致迭代过程会出现错误的结果
这个变量会在迭代器中去补充一些逻辑，比如非法的修改会扰乱迭代过程，则**会抛出异常**
如果子类也要用到这个变量，要求**每一个可能改动容器结构的操作都需要调用一次这个变量**



##### 构造方法

总共有三个，我们只关心前两个就好了

```java
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    }
}
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

这里给出了我们的两个常量**EMPTY_ELEMENTDATA**和**DEFAULTCAPACITY_EMPTY_ELEMENTDATA**的去处，在我的自实现里，**无论是哪种方法我都选择了new出数组对象**，而这里还会有点偷懒，如果没有指定容量的话，则并不会**new Object[DEFAULT_CAPACITY]**，等到真正要加入元素的时候，才创建对象，这在下面add方法的时候会看到



##### 成员方法

接下来我们进入成员方法部分

###### trimToSize

```java
public void trimToSize() {
    modCount++;
    if (size < elementData.length) {
        elementData = (size == 0)
          ? EMPTY_ELEMENTDATA
          : Arrays.copyOf(elementData, size);
    }
}
```

首当其冲就是这个方法 该方法用于**修剪容器的容量**

怎么个**修剪**法？将容器的**”容量“**修剪为当前列表的**载量**，其目的是为了**优化容器对象所占存储空间**

比如我们容器初始容量为10，里面装了3个元素，那么就有**7个元素空间是被null占着的**

假设我们容器的使用场景总是在小于等于3的情况下工作，那么我们就可以把容器的容量修剪一下

**修剪前：**[a, b, c, **null, null, null, null, null, null, null**]

**修剪后：**[a, b, c]

并且**修剪**操作会访问**modCount**变量，意味着这告诉容器的**迭代器**，这个修剪方法可能会**扰乱迭代过程**

在修剪的时候，我们看到了这样的一个方法：**Arrays.copyOf(elementData, size)**

###### Arrays.copyOf

```java
public static <T> T[] copyOf(T[] original, int newLength) {
    return (T[]) copyOf(original, newLength, original.getClass());
}

public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    T[] copy = ((Object)newType == (Object)Object[].class)
        ? (T[]) new Object[newLength]
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
```

重点是**line：10**，整个方法是按照**源数组的长度（original.length）**以及**新长度（newLength）**的最小值去复制数组的



###### ensureCapacity

```java
public void ensureCapacity(int minCapacity) {
    int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
        ? 0
        : DEFAULT_CAPACITY;

    if (minCapacity > minExpand) {
        ensureExplicitCapacity(minCapacity);
    }
}
```

这个方法用于提升容器的容量，这个方法告诉容器：**至少要保证根据传入的最小容量（minCapacity）参数那么多的容量**

在这个方法里的选择是：

- 对于**最小扩容量（minExpand）**，如果当前容器为空容器，则最小扩容量为**DEFAULT_CAPACITY（10）**，如果容器**不是空容器**，则最**小扩容量为0**
- 一旦**最小容量（minCapacity）> 最小扩容量（minExpand）**，则需要**确保显式容量**

这里的理解有点绕，我们把它放到场景去分析一下：

**场景1，空容器：**

空容器传进来，**minExpand**就得**DEFAULT_CAPACITY**等于10，那么如果我们传入的**minCapacity**甚至小于默认的容量，那你就**一边呆着吧**

如果大于10，那就**按照你的来**，虽然还得进**ensureExplicitCapacity方法**，但是看到了后面就会发现，确实是会按照你给的大于10的值来扩容

**场景2，\[ 1 / 10 \] 的容器：**

**minExpand**肯定是0，那么只要我们传入的传入的**minCapacity**大于0，是肯定可以进**ensureExplicitCapacity方法**的，到了方法里面我们发现，如果你给的**minCapacity**还没有当前容器长度的**1.5倍**大，那么容器至少也会扩到**1.5倍**而忽略你给的值，大于**1.5倍**救会采用你给值来扩容

为什么是**1.5倍**？往下看就知道了

我们来看**ensureExplicitCapacity方法**

```java
private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

除了会改变容器结构，我们还得注意：当**允许的最小容量（minCapacity）**大于**当前容器容量（elementData.length）**的时候，这个时候我们就需要进行**溢出考虑(overflow-conscious)**了

###### grow

```java
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

这里规定：**数组最大的长度（MAX_ARRAY_SIZE）**为Integer值所能表示的最大的数减8，也就是**(2^31 - 1) - 8**

在方法里首先考虑**新容量（newCapacity）**怎么定义：

- **先定义新容量为旧容量的1.5倍（line：6）！** 
- 一旦**新容量（1.5倍）**比**允许的最小容量（minCapacity，这是用户期望的最小扩容量）**要小，那么新容量被**重新定义**为允许的最小容量
- 一旦**新容量（这时候可能是期望值，也可能是1.5倍）**大于**数组最大的长度（MAX_ARRAY_SIZE）**，那么我们就按照**hugeCapacity(minCapacity)**方法去**重新定义新容量**

于是我们发现，**ArrayList**的每次扩容，**最少都得是原容器的1.5倍**

对于**hugeCapacity**

```java
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

我们知道，既然**minCapacity**是个**int值**，那么它最大值就只能为**Integer.MAX_VALUE**，而我们这里定义的最大的数组长度为**Integer.MAX_VALUE - 8**，也就是说，这个定义并不是一定的，如果我们设置的minCapacity的值在**( Integer.MAX_VALUE - 8, Integer.MAX_VALUE ]**之间的话，那我们还是允许用**Integer.MAX_VALUE**作为最大数组长度的

这里我就有个疑问了，**-8的意义在哪里？一开始就定义到最大值不就好了？**

考虑完新容量之后，开始使用**Arrays.copyOf**来扩展容量**（grow line：12）**



###### contains和indexOf

```java
public boolean contains(Object o) {
    return indexOf(o) >= 0;
}

public int indexOf(Object o) {
    if (o == null) {
        for (int i = 0; i < size; i++)
            if (elementData[i]==null)
                return i;
    } else {
        for (int i = 0; i < size; i++)
            if (o.equals(elementData[i]))
                return i;
    }
    return -1;
}
```

和自实现不同的是，这里**contains调用的是indexOf的实现**，而且**indexOf**还允许**查找到第一个null元素在哪里**，这是我在自实现里没考虑过的



###### get和set

```java
E elementData(int index) {
    return (E) elementData[index];
}

public E get(int index) {
    rangeCheck(index);

    return elementData(index);
}

public E set(int index, E element) {
    rangeCheck(index);

    E oldValue = elementData(index);
    elementData[index] = element;
    return oldValue;
}
```

```java
private void rangeCheck(int index) {
    if (index >= size)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
```

首先看**get&set**，没什么特别的设计，只是这里有个**rangeCheck**，如果index大于等于载量，就抛异常



###### add1

这个是**ArrayList**的重头戏之一，牵扯到扩容的问题，来看看它怎么面对扩容

```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```

这里我们又注意到了**ensureCapacityInternal**这个方法

```java
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    return minCapacity;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

从方法名意义上去解释，当我们调用**add(E e)**的时候，是把元素加到数组的尾部位置，在这之前我们得先**确保容器的内部容量（ensureCapacityInternal）**，确保这个内部容量至少得是当前的**载量（size） + 1**，以这个值作为我们**允许的最小容量（minCapacity）**

也就是说，我的**elementData**数组至少还有最后一个位置可以让我顺利添加一个元素

在确保内部容量的时候，得先**计算容量（calculateCapacity）**，这里面的处理没有太多的花哨，如果容器为空，而且你给的**允许的最小容量（minCapacity）**还不如**默认容量（10）**大的话，那就直接选默认容量，只要容器不为空，哪怕里面只有一个元素，你给的**允许的最小容量（minCapacity）**甚至只是**2**，那也还是用2作为**参照**去调整容量，但这仅仅只是**参照**

为什么说仅仅是**参照**？重点在**ensureExplicitCapacity**这里

我们先理一理调用栈：

- **add(E e)**
  - **ensureCapacityInternal(size + 1)**
    - **calculateCapacity(elementData, minCapacity)**
    - **ensureExplicitCapacity(calculateCapacity(elementData, minCapacity))**
      - **grow(minCapacity)**

准备3个场景：

- 空容器，加一个元素
- 非空容器，容器容量足够  **\[ 1 / 10 \]  (size < element.length)**
- 非空容器，容器容量已满  **\[ 10 / 10 \]  （size == element.length）**

--------

对于**场景1**：

- **add(E e)**
  - **ensureCapacityInternal(0 + 1)**
    - **calculateCapacity(elementData, 0 + 1)    ==》   10**

    - **ensureExplicitCapacity(10)**

      到了**ensureExplicitCapacity(10)**的时候，因为这时候**elementData**其实是空的，所以会继续到**grow（10）**

    - **grow（10）**

**保证完内部容量之后**，可以进行**elementData[size++] = e**了，所以总的来说，最最最开始的时候，数组扩容肯定是一扩到10的

对于**场景2**：

- **add(E e)**
  - **ensureCapacityInternal(1 + 1)**

    - **calculateCapacity(elementData, 1 + 1)    ==》   2**

    - **ensureExplicitCapacity(2)**

      到了**ensureExplicitCapacity(2)**的时候，因为这时候**elementData.length = 10 > 2**，所以并不会调用**grow**来扩容

此时可以直接进行**elementData[size++] = e**

对于**场景3**：

- **add(E e)**

  - **ensureCapacityInternal(10 + 1)**

    - **calculateCapacity(elementData, 10 + 1)    ==》   11**

    - **ensureExplicitCapacity(11)**

      到了**ensureExplicitCapacity(11)**的时候，因为这时候**elementData.length = 10 < 11**，所以会继续到**grow（11）来进行扩容**

    - **grow（11）**

      往上翻**grow**会发现，这里新容量是扩展到了**15**

此时可以直接进行**elementData[size++] = e**

---------



###### add2

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);

    ensureCapacityInternal(size + 1);  // Increments modCount!!
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    elementData[index] = element;
    size++;
}
```

```java
private void rangeCheckForAdd(int index) {
    if (index > size || index < 0)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
```

对于**index**的限定：**不能在载量之外，也不能小于0**，然后确保了容量之后就开始移元素，然后往中间插元素，从这点来说，我的自实现和这个实现的差不多



###### remove1

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
```

基本都是常规操作，但是！这里的**line：11**是一个骚操作，很多自实现里面，只是把位置移到了，载量减到了就完了，也强调过可以不写**elementData[--size] = null**这句，目的是为了减少一步操作，访问不到的元素留着也没什么，现在想想确实有点可笑，注释里也说了，**将这个对象的引用摘除，好让GC管管这个被删除的元素**

这就是真正投入使用的容器，要考虑到的事情，**为用户尽可能地提高时间和空间效率！**



###### remove2

```java
public boolean remove(Object o) {
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}
private void fastRemove(int index) {
    modCount++;
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work
}
```

常规，我在想为什么remove1里的代码不用**fastRemove**，这两段完全是一摸一样的



###### clear

```java
public void clear() {
    modCount++;

    // clear to let GC do its work
    for (int i = 0; i < size; i++)
        elementData[i] = null;

    size = 0;
}
```

同理，很多自实现也只是将**size**置为零，并没扣考虑GC，但是我觉得这里是否存在一个**更好的实现**呢？比如说可以这样：

```java
public void clear() {
    modCount++;

    // clear to let GC do its work
	elementData = new Object[elementData.length];

    size = 0;
}
```

转瞬我就想明白了，这其实是一个**时间换空间的选择！**

确实for循环一个个置空确实比较浪费时间，比如有30w个元素在容器中，我就得for30w次

但是这样我还是在原数组的地址内存上进行操作，如果我选择了所谓的**更好的实现**，那么我还得在内存中再申请**30w个元素长度的数组空间**，虽然看上去，我好像马上就**摘除了原elementData的引用**，但实际上，原**elementData**的数组数据仍然会在内存中停留一段时间，**等待下一次GC并且GC选择回收它**

上面只是我的推测，实际GC是如何对于这两种情况做出选择的我们并不清楚，姑且就这样认为吧



###### removeAll和retainAll

对于**addAll、removeRange**等方法的实现比较常规，基本上和上面的差不多，**removeAll以及retainAll**还是要研究一哈子

```java
public boolean removeAll(Collection<?> c) {
    Objects.requireNonNull(c);
    return batchRemove(c, false);
}
```

```java
public boolean retainAll(Collection<?> c) {
    Objects.requireNonNull(c);
    return batchRemove(c, true);
}
```

这两个方法很相似，作用恰好相反，

- **removeAll是移除交集元素，留下补集元素**
- **retainAll是移除补集元素，保留交集元素**

两个方法都调用了**bantchRemove**方法

为了方便理解，我们将**bantchRemove**源码中的

- **complement重命名为justComplement，这个变量标识是取补集还是交集**
- **r重命名为readIndex，标识到元素的下标**
- **w重命名为writeIndex，标识写到元素的下标**

```java
private boolean batchRemove(Collection<?> c, boolean justComplement) {
    final Object[] elementData = this.elementData;
    int readIndex = 0, writeIndex = 0;
    boolean modified = false;
    try {
        for (; readIndex < size; readIndex++)
            if (c.contains(elementData[readIndex]) == justComplement)
                elementData[writeIndex++] = elementData[readIndex];
    } finally {
        // Preserve behavioral compatibility with AbstractCollection,
        // even if c.contains() throws.
        if (readIndex != size) {
            System.arraycopy(elementData, readIndex,
                             elementData, writeIndex,
                             size - readIndex);
            writeIndex += size - readIndex;
        }
        if (writeIndex != size) {
            // clear to let GC do its work
            for (int i = writeIndex; i < size; i++)
                elementData[i] = null;
            modCount += size - writeIndex;
            size = writeIndex;
            modified = true;
        }
    }
    return modified;
}
```

我们看**try块代码**，代码遍历了**elementData**，其中这一句的解读很有意思：

``` java
c.contains(elementData[r]) == justComplement
```

在**justComplement**为**false**的情况下：

- 如果c中没有原容器当前遍历到的元素，则**（false == false）= true**，将这个**c中没有的元素**覆盖到**elementData[writeIndex]**的位置
- 如果c中有原容器当前遍历到的元素，则**（true == false）= false**，不进行操作，进入下次循环

总的来说，就是**把原容器和c容器中不相交的元素按顺序移到原容器的前面去了**

同理在**justComplement**为**true**的情况下：

- 如果c中没有原容器当前遍历到的元素，则**（false == true）= false**，不进行操作，进入下次循环
- 如果c中有原容器当前遍历到的元素，则**（true == true）= true**，将这个**c中有的元素**覆盖到**elementData[writeIndex]**的位置

就是**把原容器和c容器中相交的元素按顺序移到原容器的前面去了**



然后有点迷的是**finally块**的语句

第一个判断应该是说，加入之前抛了一些异常什么的，导致上面的for循环中断了，如此一来应该是**没读完原容器里的元素**的，好了，没读完就算了，**把剩下没读完的元素移到之前写好的元素之后**，那这部分也算**读到了写好了（line：16）**

我认为这样的做法是**保护未读取完的元素数据不被丢失**

第二个判断，好了读完也写完了，现在数组中可能有三部分：

- 第一部分是选择**写下的元素序列**，这部分**有效**
- 第二部分可能是之前出错了，没读完的元素但是我移动到紧接着第一部分序列的后边了，这部分也**有效**
- 第三部分就是第二部分往前移动之前剩下的一些错位的元素，这部分不应该被访问到，所以**无效**

读完写完之后，**(writeIndex != size)**这样的条件会在什么情况下出现？第二部分真的有往前移动的时候，也就是说包含**无效元素**的时候

所以这时候就要**摘除无效元素的引用，然后重置载量为写元素的长度**