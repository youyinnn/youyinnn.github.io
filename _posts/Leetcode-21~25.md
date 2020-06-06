---
title: Leetcode-21~25
categories:
  - algorithm
  - leetcode
tags:
  - leetcode
date: 2019-03-06 21:17:00
series: leetcode
---



### 21. Merge Two Sorted Lists(Easy)

Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.

**Example:**

```
Input: 1->2->4, 1->3->4
Output: 1->1->2->3->4->4
```

#### Brute Force(Beat 90.65%)

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null || l2 == null) {
        return l1 == null ? l2 : l1;
    }
    ListNode pre = new ListNode(0);
    pre.next = l1;
    ListNode head = l1;
    // use l1 l2 as pointers
    while (l2 != null && l1 != null) {
        if (l2.val < l1.val) {
            pre.next = l2;
            l2 = l2.next;
            pre.next.next = l1;
            // if l2 is little than head
            // then it become a new head
            if (head == l1) {
                head = pre.next;
            }
        }
        pre = pre.next;
        l1 = pre.next;
    }
    // the rest of l2 were all bigger than l1
    if (l2 != null) {
        pre.next = l2;
    }
    return head;
}
```
大致思想是以第一条链为参照，做插入排序，分别用l1，l2做now指针

链这玩意，很依赖指针，特别是单链表，对逻辑能力要求比较高，推荐做的时候把图画出来，并且适当的在原head的基础上，加一个pre，再标识now，然后迭代两个指针



### 22. Generate Parentheses

Given *n* pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

For example, given *n* = 3, a solution set is:

```
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```

这道题我自己想的时候，想到了很多方法，比如**填坑**，但是填坑怎么处理对称重复的解我实在是想不出，然后又想到了一种**欠债**法，比如我们把开口和闭口分开，有两个债主分别管理两种债务，开口符号出现一个就代表欠一次债，闭口也是；而其中的要求就是，之前的欠债计算中，闭口欠债绝对不能比开口欠债多，这样后面的解才合法

也就是在创造序列的时候，最后一个序列必须是闭口，最后一个还债的必须是闭口，不是闭口的不考虑

可惜的是，这样的思路我并没有坚持下去，后面在评论区，高分解果然也是一样的思路，只不过不同的是，它用更算法逻辑的思路去解释这件事：**有选择地递归**

非常遗憾的是，高分解用**backtracing**去解释这种思路，但是他并不是回溯，因为它没有走进死胡同，再折返回去，而是每次都选择正确的道路

#### Rightfully Recursion

```java
public List<String> generateParenthesis(int n) {
    LinkedList<String> ans = new LinkedList<>();
    return get(ans, "", 0, 0 ,n);
}

private List<String> get(List<String> ans, String str, int open, int close, int n) {
    if (str.length() == n * 2) {
        // means we reach the end
        ans.add(str);
    } else {
        // one rightful path
        if (open < n) {
            get(ans, str + "(", open + 1, close, n);
        }
        // another rightful path
        if (close < open) {
            get(ans, str + ")", open, close + 1, n);
        }
    }
    return ans;
}
```

### 23. Merge K Sorted Lists(Hard)

Merge *k* sorted linked lists and return it as one sorted list. Analyze and describe its complexity.

**Example:**

```
Input:
[
  1->4->5,
  1->3->4,
  2->6
]
Output: 1->1->2->3->4->4->5->6
```

做这题的时候，我有很多种思路，一步步网上打才发现，原来大道至简，用归并排序才是王道，真的不要怕使用递归，栈不深的情况下，递归是一个很高效的算法

写上面那句话的时候突然灵机一想，想到两个月前面试里被面试官问道：若干日志文件，每个日子文件里的日志按照时间顺序打的，怎么合并成一个有序日志文件

当时只能说出分段排序，然后被面试官继续问怎么分段，然后又扯用索引，现在回来一想，归并是个多么美妙的算法

以归并的思想来看这道题，根本不算难题

#### Merge Sort(Beat 100%)

```java
public ListNode mergeKLists(ListNode[] lists) {
    return mergeKLists(lists, 0, lists.length - 1);
}

// merge sort
private ListNode mergeKLists(ListNode[] lists, int start, int end) {
    int length = end - start + 1;
    if (lists.length == 0) {
        return null;
    }
    if (length == 1) {
        return lists[start];
    }
    if (length == 2) {
        return mergeTwoLists(lists[start], lists[end]);
    } else {
        int mid = (length / 2) + start;
        ListNode right = mergeKLists(lists, start, mid);
        ListNode left = mergeKLists(lists, mid + 1, end);
        return mergeTwoLists(right, left);
    }
}

// 用到之前的合并2个有序List
private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null || l2 == null) {
        return l1 == null ? l2 : l1;
    }
    ListNode pre = new ListNode(0);
    pre.next = l1;
    ListNode head = l1;
    while (l2 != null && l1 != null) {
        if (l2.val < l1.val) {
            pre.next = l2;
            l2 = l2.next;
            pre.next.next = l1;
            if (head == l1) {
                head = pre.next;
            }
        }
        pre = pre.next;
        l1 = pre.next;
    }
    if (l2 != null) {
        pre.next = l2;
    }
    return head;
}
```


### 24. Swap Nodes In Pairs(Medium)

Given a linked list, swap every two adjacent nodes and return its head.

You may **not** modify the values in the list's nodes, only nodes itself may be changed.

**Example:**

```
Given 1->2->3->4, you should return the list as 2->1->4->3.
```

#### Brute Force(Beat 100%)

```java
public ListNode swapPairs(ListNode head) {
    if (head == null) {
        return null;
    }
    if (head.next == null) {
        return head;
    }
    ListNode newHead = head.next;
    ListNode pre = new ListNode(0);
    pre.next = head;
    ListNode now = pre.next;
    ListNode next = now.next;
    while (next != null) {
        pre.next = next;
        now.next = next.next;
        next.next = now;
        
        pre = now;
        now = pre.next;
        if (now == null) {
            break;
        }
        next = now.next;
    }
    return newHead;
}
```
没难度的，指针做好就行



### 25. Reverse Nodes In K-Group(Hard)

Given a linked list, reverse the nodes of a linked list *k* at a time and return its modified list.

*k* is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of *k* then left-out nodes in the end should remain as it is.

**Example:**

Given this linked list: `1->2->3->4->5`

For *k* = 2, you should return: `2->1->4->3->5`

For *k* = 3, you should return: `3->2->1->4->5`

**Note:**

- Only constant extra memory is allowed.
- You may not alter the values in the list's nodes, only nodes itself may be changed.

#### Brute Force (Beat 99.32%)

这题，做出来了就是成功了，基本上思路就是直观的暴力解，解题的难点在于，如何处理指针

做链表题的时候始终要记住一句话：**Keep tracking the pointer**

跟踪指针到最后，你就赢了

我们的思路很简单，首先从头开始，每k个结点为一段，我们的任务就是把这一段提出来，逆转，再放回去

要做到这件事，首先我们得做到逆转一段链表，这件事也没什么技巧，hmmmmm，好吧还是有点东西的，我总是喜欢分治法+递归，我已经爱上了这种简单直接的做法了

上公式：`reverse(2 -> 3 -> 4 -> 5) = reverse ( reverse (2 -> 3) -> reverse(3 -> 4))`，于是所有的逆转都变成了两个结点链表的逆转，而且为了更简单地做到这件事，我还用一个数据结构来表示一条链，记录它的头和尾，以更好地接上两个链

```java
class Segment {
    ListNode head;
    ListNode tail;

    Segment(ListNode head, ListNode tail) {
        this.head = head;
        this.tail = tail;
    }
}
private Segment reverse(ListNode head) {
    if (head == null) {
        return null;
    }
    ListNode a = head;
    ListNode b = head.next;
    if (b == null) {
        return new Segment(head, head);
    } else if (b.next == null) {
        b.next = a;
        a.next = null;
        return new Segment(b, a);
    } else {
        ListNode right = b.next;
        b.next = null;
        Segment leftSeg = reverse(a);
        Segment rightSeg = reverse(right);
        // reconnect two seg
        rightSeg.tail.next = leftSeg.head;
        // reassign seg tail cause we connect a new list after it
        rightSeg.tail = leftSeg.tail;
        return rightSeg;
    }
}
```
那么接下来：我们用4个指针，来对原链进行分段逆转，大致思路如下：

```
               head (ignore this)
                 ↓
origin list:     1 -> 2 -> 3 -> 4 -> 5 -> 6 -> NULL
assume k is: 3

assign some pointer：

1. nowPre: the pre node of this segment
2. nowHead: the head node of this segment
3. tmp: the head of next segment
4. tmpPre: the pre node of tmp node, it also the tail node of the reversed segment

		newHead -> NULL
							 
		nowPre → 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> NULL
			   ↗     ↑
		   tmpPre    tmp
		              ↑
		            nowHead
		            
这是初始状态，我们开始移动tmp和tmpPre：

		nowPre → 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> NULL
			          ↑       ↗     ↑
		           nowHead tmpPre    tmp

于是这时候我们可以将链看成是三段：
1. nowPre之前的结点是一段；		   记为A段
2. nowHead到tmpPre的结点是一段；	记为B段
3. tmp之后的结点是一段；			   记为C段

这时候可以看出，我们要逆转的段是第二段，于是先断开BC之间的连接：

		nowPre → 0 -> 1 -> 2 -> 3       4 -> 5 -> 6 -> NULL
			          ↑       ↗        ↑
		           nowHead tmpPre      tmp
		           
这时候逆转B段（注意原来的nowPre、tmpPre、nowHead也会变的）：

                   nowPre → 0
                            ↓
		          3 -> 2 -> 1           4 -> 5 -> 6 -> NULL
		          ↑         ↑           ↑
	           tmpPre    nowHead       tmp
	           
然后nowHead.next = tmp，就可以接上BC段：

                       nowPre → 0
                                ↓
    		          3 -> 2 -> 1 -> 4 -> 5 -> 6 -> NULL
	    	          ↑       ↗     ↑
    	           tmpPre  nowHead  tmp
	           
再nowPre.next = tmpPre，纠正AB段：

    	nowPre → 0 -> 3 -> 2 -> 1 -> 4 -> 5 -> 6 -> NULL
	    	          ↑       ↗     ↑
    	           tmpPre  nowHead  tmp
	           
最后调整指针，为下一次处理做准备（若是第一次处理，则newHead必定为空，则可以指定newHead）：
1. newHead = reverseSegment.head
2. nowPre = nowHead
3. nowHead = tmp
4. tmpPre = nowPre

               newHead
                  ↓
	         0 -> 3 -> 2 -> 1 -> 4 -> 5 -> 6 -> NULL
                            ↑    ↑
	                   nowPre    tmp
	                        ↑    ↑
	                   tmpPre    nowHead
```

于是代码：

```java
public ListNode reverseKGroup(ListNode head, int k) {
    if (k == 1) {
        return head;
    }
    ListNode
            nowPre = new ListNode(0),
            tmp = head,
            newHead = null,
            nowHead, tmpPre;
    nowPre.next = tmp;

    while (tmp != null) {
        nowHead = tmp;
        tmpPre = nowPre;
        int count = 0;
        while (count < k && tmp != null) {
            tmp = tmp.next;
            tmpPre = tmpPre.next;
            count++;
        }
        if (count == k) {
            // disconnected two part
            tmpPre.next = null;
            // reverse segment
            Segment reverse = reverse(nowHead);
            if (newHead == null) {
                newHead = reverse.head;
            }
            // reconnected part B & C
            nowHead.next = tmp;
            // reconnected part A & B
            nowPre.next = tmpPre;
            // reassign the nowPre
            nowPre = nowHead;
        }
    }
    // when k is bigger than list length then newHead will be null
    // so just return head
    return newHead == null ? head : newHead; 
}
```