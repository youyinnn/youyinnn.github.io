---
title: 优先队列&二叉堆（2-heap）
categories:
  - data structures
  - heap
tags:
  - queue
  - priority-queue
  - heap
  - 2-heap
date: 2020-6-13 12:8:2
---

### Introduction

在排序算法中有堆排序，而要理解好堆排序，首先我们得先理解好堆的概念，一般在数据结构上，我们把优先队列的数据结构称为堆，那什么是有限队列呢？它能应用在哪些场景呢？这些是本篇要介绍的重点

### Priority Queue

定义：

> 优先队列至少要实现以下个操作：insert（插入）；deleteMin（删除最小元素），要找出、删除并返回队列中最小的元素
>
> 插入等于是入队，删除等于是出队：
>
> ```graph
>       删除最小元素         ┏------------------┓      插入元素
> <-------------------------|     优先队列      |<--------------------
>                           ┗------------------┛
> ```

### Binary Heap

最常见的堆实现就是二叉堆，和二叉查找树一样，二叉堆也有两个性质：结构性、堆序性

- **结构性：**堆在逻辑上可以看作的一个完全二叉树，而且因为完全二叉树的规律性，我们可以使用数组来存放堆元素，其中：
  1. 对于数组上任意`i`位置，其左儿子的位置在`2i`上，右儿子在`2i + 1`上，其父亲在`└i / 2┘`位置；
  2. 最大堆的大小需要提前决定一个合适的值，尽量减少数组扩容；
- **堆序性：**堆中任意根节点应该**小于等于**它的后裔；

```graph
            13                   13
          /    \               /    \
        14     15             6     16
        / \                  / \
       19 27                19  27
           堆                    非堆
```

#### Insert

为了将一个元素 X 插入到堆中，我们在堆的下一个可用位置（堆的尾部）创建一个“空穴”，以保证该堆还是一个完全树

如果 X 可以放在空穴中而不破坏堆序性（如果此时 X 的值大于等于空穴的父节点的值），那么 X 就放在这个位置；否则，我们将该空穴的父节点放到空穴，然后父节点的原来的位置充当心的空穴；以此直到 X 能够放进空穴为止；

```graph
比如插入5
        13                   13                 ▢                 5
      /    \               /    \             /    \            /    \
    21     16     →       ▢     16     →    13     16     →   13     16
    / \                  / \                / \               / \
   24  ▢                19 21             19  21            19  21
```

这个过程叫上滤（percolate up），相关的伪码：

```pseudocode
// arr[]
insert(x):
    hole = ++currentSize;
	while x < arr[hole / 2]:
		arr[hole] = arr[hole/2];
		hole /= 2;
	arr[hole] = x;
```

根据*《数据结构与算法分析——Mark Allen Weiss》*的结论，**插入/上滤算法的平均效率为*O(1)*，最坏为*O(logN)***

#### DeleteMin

要删除最小元素，首先把堆顶元素挖空（数组第一个元素），然后再调整堆序性，由于这时候少了一个元素，所以要重新调整堆，我们把堆中最后一个元素当成对比元素，如果对比元素可以放在该空穴，那么就放置，否则将该空穴位置上较小的子元素放置到空穴处，原较小元素的位置称为新的空穴，再和对比元素进行比较；

```graph
        ▢                    13                 13               13
      /    \               /    \             /    \            /    \
     13    16     →       ▢     16     →    19     16     →   19    16
    / \                  / \                / \               /
   24  21               19  21             ▢  21            21
```

但是当堆中有偶数个元素的时候，再使用这种算法会出现问题：

```graph
        ▢                    13                 13               13
      /    \               /    \             /    \            /    \
     13    16     →      ▢      16     →    21     16     →   21    16
    / \    /            /  \    /           / \    /         /  \
  24  21 19            24  21 19           24  ▢ 19        24   19?
```

所以我们需要巧妙地将每个根节点都视为都有 2 个子节点，实现的伪码：

```pseudocode
// arr[]，且元素从下标1开始存放，保证当下标i为1的时候，其两倍是有效的下标2
deleteMin():
	min = findMin();
	arr[1] = arr[currentSize--];
	percolateDown(1);
	return min;

percolateDown(hole):
	tmp = arr[hole];
	while hole * 2 <= currentSize:
		child = hole * 2;
		if child != currentSize and arr[child + 1] < arr[child]:
			child++;
		if arr[child] < tmp:
			arr[hole] = arr[child];
		else:
			break;
		hole = child;
	arr[hole] = tmp;
```

```graph
若原来15有左子节点19，则这时候堆顶为19，且将它挖空，tmp为19
        ▢                    13                 13
      /    \               /    \             /    \
     13    16     →      ▢      16     →    19     16
    / \                 /  \    /           / \
  24  21               24  21 19           24  21
```

如上图，执行情况：

1. 当`hole = 1`时，这时候 child 为 2，于是会对比 13 和 16 的值，发现 13 小于 16，所以 child 还是 2，然后`tmp = 19`大于`arr[child] = 13`，于是 13 填到空穴处，13 原来的位置称为新的空穴；
2. 当`hole = 2`，这时候 child 为 4，于是会对比 24 和 21 的值，发现 24 大于 21，所以 child 加一，然后`tmp = 19`小于`arr[child] = 21`，于是 break；
3. 最后退出了循环，直接`arr[hole] = tmp;`

根据*《数据结构与算法分析——Mark Allen Weiss》*的结论，**删除最小点/下滤算法的平均效率为*O(logN)***

#### BuildHeap

二叉堆的还有一个重要的操作就是构建堆，有两种思路，一是对每个新增节点都进行插入操作，**平均效率为*O(N)***;

还有就是直接对原数组从中间节点（最后一个父节点）开始忘数组前面一一进行下滤，而这个的平均效率也被证明**为*O(N)***；

```pseudocode
buildHeap():
	for i = currentSize / 2 -> 1:
		percolateDown(i);
```

### Application For BinaryHeap

1. 寻找序列中第 k 小的数：以线性效率建堆之后，调用`deleteMin()`k - 1 次，此时堆顶就是第 k 小的数，因此平均效率为**_O(N + klogN)_**；
2. 寻找序列中前 k 小的数：调用`deleteMin()`k 次，此时堆顶就是第 k 小的数；
3. “寻找序列中前 90%大的数”，变治为“寻找序列中前 10%小的数”；

### Heap Sort

我们观察一下二叉堆的应用，如果说，应用 1 的 k 等于 N 的话，那么我们等于将序列从小到大输出了出来，效率为**_O(NlogN)_**再加上**_O(N)_**的空间，那么我们能不能够优化一下呢？

我们在建堆的时候申请了 N 的空间，每次删除最小元素之后，虽然物理空间数组长度还是 N，但是我们的关心的堆范围已经，假如说我们每次删除最小元素之后，把最小元素放在删除之前堆的大小的尾部，那么等所有删除最小元素操作完之后，我们就得到了一个逆序的数组，我们把实现这种功能的方法叫做小顶堆排序

于是我们发现：小顶堆能在**_O(NlogN)_**时间常量空间内把乱序数组整理称逆序数组！

我们再反过来想，如果要对数组进行排序，是不是可以构建**大顶堆**然后以相同的思路**删除最大元素**呢？

按照书上的思路，实现起来就是：

```java
public static void heapSort(int[] arr) {
    for (int i = arr.length / 2 - 1; i >= 0; i--)
        percDown(arr, i, arr.length);

    for (int i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        percDown(arr, 0, i);
    }
}

public static void percDown(int[] arr, int hole, int nowSize) {
    int child;
    int tmp = arr[hole];
    for (; hole * 2 + 1 < nowSize; hole = child) {
        child = hole * 2 + 1;
        if (child != nowSize - 1 && arr[child] < arr[child + 1]) {
            child++;
        }
        if (tmp < arr[child]) {
            arr[hole] = arr[child];
        } else break;
    }
    arr[hole] = tmp;
}
```

还有一种实现方式，但是这个效率稍差，参考[GeeksforGeeks](https://www.geeksforgeeks.org/heap-sort/)

```java
public void sort(int arr[])
{
    // Build heap
    for (int i = arr.length / 2 - 1; i >= 0; i--)
        heapify(arr, arr.length, i);

    for (int i= arr.length - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}

// To heapify a subtree rooted with node i which is
// an index in arr[]. n is size of heap
void heapify(int arr[], int currentSize, int holeIndex) {
    int largestIndex = holeIndex; // Initialize largest as root
    int leftIndex = 2 * holeIndex + 1;
    int rightIndex = 2 * holeIndex + 2;

    // If left child is larger than root
    if (leftIndex < currentSize && arr[leftIndex] > arr[largestIndex])
        largestIndex = leftIndex;

    // If right child is larger than largest so far
    if (rightIndex < currentSize && arr[rightIndex] > arr[largestIndex])
        largestIndex = rightIndex;

    // If largest is not root
    if (largestIndex != holeIndex) {
        int swap = arr[holeIndex];
        arr[holeIndex] = arr[largestIndex];
        arr[largestIndex] = swap;
        // Recursively heapify the affected sub-tree
        heapify(arr, currentSize, largestIndex);
    }
}
```
