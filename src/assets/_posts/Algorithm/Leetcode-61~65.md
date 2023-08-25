---
title: Leetcode-61~65
tags:
  - leetcode
date: 2019-04-02 14:18:00 +8
series: leetcode
---

### 61.Rotate List(Medium)

Given a linked list, rotate the list to the right by _k_ places, where _k_ is non-negative.

**Example 1:**

```
Input: 1->2->3->4->5->NULL, k = 2
Output: 4->5->1->2->3->NULL
Explanation:
rotate 1 steps to the right: 5->1->2->3->4->NULL
rotate 2 steps to the right: 4->5->1->2->3->NULL
```

**Example 2:**

```
Input: 0->1->2->NULL, k = 4
Output: 2->0->1->NULL
Explanation:
rotate 1 steps to the right: 2->0->1->NULL
rotate 2 steps to the right: 1->2->0->NULL
rotate 3 steps to the right: 0->1->2->NULL
rotate 4 steps to the right: 2->0->1->NULL
```

#### Solution

追踪指针，简单直接

```java
public ListNode rotateRight(ListNode head, int k) {
    if (head == null) {
        return null;
    }
    ListNode newHead, tail = null;
    int length = 0;
    ListNode now = head;
    // 遍历一般计算长度 标志尾巴
    while (now != null) {
        if (now.next == null) {
            tail = now;
        }
        now = now.next;
        length++;
    }

    // 处理k
    k %= length;
    if (k == 0) {
        return head;
    }
    int count = 0;
    ListNode pre = new ListNode(0);
    now = head;
    pre.next = head;
    // 遍历到转轴点
    while (count < length - k) {
        pre = pre.next;
        now = now.next;
        count++;
    }
    // 断开转轴点
    pre.next = null;
    // 转轴点为新的头部
    newHead = now;
    // 尾部接上旧头部
    tail.next = head;
    return newHead;
}
```

### 62.Unique Paths(Medium)

A robot is located at the top-left corner of a _m_ x _n_ grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

How many possible unique paths are there?

![img](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)
Above is a 7 x 3 grid. How many possible unique paths are there?

**Note:** _m_ and _n_ will be at most 100.

**Example 1:**

```
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Right -> Down
2. Right -> Down -> Right
3. Down -> Right -> Right
```

**Example 2:**

```
Input: m = 7, n = 3
Output: 28
```

#### DP

机器人走方格，有多少种走法题目，在[地痞](./188zp6j.html?hash=c401ac5d)解过的，这遍解不同的是，我简化了之前的思路，并不需要预置好 pre 数组的结果

```java
public int uniquePaths(int m, int n) {
    int[] pre = new int[n];
    int[] now = new int[n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            now[j] = j > 0 ? (now[j - 1] + pre[j]) : 1;
        }
        pre = Arrays.copyOf(now, now.length);
    }
    return now[n - 1];
}
```

### 63.Unique Paths II (Medium)

A robot is located at the top-left corner of a _m_ x _n_ grid (marked 'Start' in the diagram below).

The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).

Now consider if some obstacles are added to the grids. How many unique paths would there be?

![img](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

An obstacle and empty space is marked as `1` and `0` respectively in the grid.

**Note:** _m_ and _n_ will be at most 100.

**Example 1:**

```
Input:
[
  [0,0,0],
  [0,1,0],
  [0,0,0]
]
Output: 2
Explanation:
There is one obstacle in the middle of the 3x3 grid above.
There are two ways to reach the bottom-right corner:
1. Right -> Right -> Down -> Down
2. Down -> Down -> Right -> Right
```

#### DP

稍微变种一下，因为有障碍物，所以我们处理第一行 now 的时候，还是预处理一下 pre 比较好

```java
public int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length;
    int n = obstacleGrid[0].length;
    int[] pre = new int[n];
    // 如果起点没有障碍物
    if (obstacleGrid[0][0] != 1) {
        pre[0] = 1;
        for (int i = 1; i < pre.length; i++) {
            if (obstacleGrid[0][i] != 0) {
                pre[i] = 1;
            } else {
                // 一旦碰到障碍物 后面的路就断了
                break;
            }
        }
    }
    int[] now = new int[n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (obstacleGrid[i][j] == 1) {
                now[j] = 0;
            } else {
                now[j] = j > 0 ? (now[j - 1] + pre[j]) : pre[j];
            }
        }
        pre = Arrays.copyOf(now, now.length);
    }
    return now[n - 1];
}
```

### 64.Minimun Path Sum(Medium)

Given a _m_ x _n_ grid filled with non-negative numbers, find a path from top left to bottom right which _minimizes_ the sum of all numbers along its path.

**Note:** You can only move either down or right at any point in time.

**Example:**

```
Input:
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
Output: 7
Explanation: Because the path 1→3→1→1→1 minimizes the sum.
```

#### DP

曾经有一道题，[硬币收集问题](./188zp6j.html?hash=d2258ac5)，这个就相当于收集到的最小币值

```java
public int minPathSum(int[][] grid) {
    if (grid.length == 0 || grid[0].length == 0) {
        return 0;
    }
    int[] pre = new int[grid[0].length];
    int[] now = new int[grid[0].length];
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (i == 0 && j == 0) {
                now[0] = grid[0][0];
            } else if (i == 0) {
                now[j] = grid[0][j] + now[j - 1];
            } else if (j == 0) {
                now[j] = grid[i][0] + pre[j];
            } else {
                now[j] = grid[i][j] + Math.min(now[j - 1], pre[j]);
            }
        }
        pre = Arrays.copyOf(now, now.length);
    }
    return now[now.length - 1];
}
```

### 65.Valid Number(Hard)

不做，傻逼题
