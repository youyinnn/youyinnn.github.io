---
title: Leetcode-31~35
tags:
  - leetcode
date: 2019-03-16 21:46:00
series: leetcode
---

### 31. Next Permutation(Medium)

Implement **next permutation**, which rearranges numbers into the lexicographically next greater permutation of numbers.

If such arrangement is not possible, it must rearrange it as the lowest possible order (ie, sorted in ascending order).

The replacement must be **in-place** and use only constant extra memory.

Here are some examples. Inputs are in the left-hand column and its corresponding outputs are in the right-hand column.

```
1,2,3` → `1,3,2`
`3,2,1` → `1,2,3`
`1,1,5` → `1,5,1
```

#### From Back(7ms)

不难，找规律找出来就好了，首先弄清楚字典顺序是怎么回事，比如序列 1 2 3 4，往后的序列是

```
1 2 3 4  ┌→ 2 1 3 4  ┌→ 3 1 2 4  ┌→ 4 1 2 3
1 2 4 3  |  2 1 4 3  |  3 1 4 2  |  4 1 3 2
1 3 2 4  |  2 3 1 4  |  3 2 1 4  |  4 2 1 3
1 3 4 2  |  2 3 4 1  |  3 2 4 1  |  4 2 3 1
1 4 2 3  |  2 4 1 3  |  3 4 1 2  |  4 3 1 2
1 4 3 2 -┘  2 4 3 1 -┘  3 4 2 1 -┘  4 3 2 1
```

多看几组我们可以发现，如果我们从后往前找到**顺序**的一对，比如 4 1 3 2 中，1 和 3 是顺序的，那么如果将 1 和**它的下一个自然数交换位置**，然后**将该位置往后的序列自然排序**，就可以得到下一组自然序列，比如 1 在当前序列中的下一个自然数是 2，于是交换得到 4 2 3 1，然后再对 2 后面的序列进行排序，如此得到 4 2 1 3

于是代码为：

```java
public void nextPermutation(int[] nums) {
    for (int i = nums.length - 1; i >= 0; i--) {
        int b = nums[i];
        if (i == 0) {
            Arrays.sort(nums, i, nums.length);
            break;
        }
        int a = nums[i - 1];
        if (a < b) {
            int theBiggerOneIndex = findTheBiggerOne(nums, i - 1, nums.length - 1, a);
            swap(nums, i - 1, theBiggerOneIndex);
            Arrays.sort(nums, i, nums.length);
            break;
        }
    }
}

private void swap(int[] nums, int a, int b) {
    int tmp = nums[a];
    nums[a] = nums[b];
    nums[b] = tmp;
}

private int findTheBiggerOne(int[] nums, int start, int end, int target) {
    for (int i = end; i >= start; i--) {
        if (nums[i] > target) {
            return i;
        }
    }
    return start;
}
```

### 32. Longest Valid Parentheses(Hard)

Given a string containing just the characters `'('` and `')'`, find the length of the longest valid (well-formed) parentheses substring.

**Example 1:**

```
Input: "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()"
```

**Example 2:**

```
Input: ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()"
```

这题，本来还想用找**Q5 最长回文数**的套路去做的，不行，而且这题有更简单的方法

#### DP

想不到吧？这题居然可以 dp，牛皮吧？根据官方给的 solution，我优化了代码，以一种更简单的方式去用 dp 解这道题，我们先看几个例子：

```java
1.假如我们有：
                ( ) ( )
    -------------------
                0 2 0 4
    -------------------
match:            2   2
                  +   +
before match:     ?   2

对于最后一个4，我们可以做这样的解释：
1）因为它和前一个字符match了，所以算2个长度；
2）因为在这2个长度之前，紧前面也有一个长度为2的合法子串，所以这两紧挨着的串长度可以加在一起；

2.为了方便处理before match，我们在每个处理串前加上一个+号，于是：
               + ( ) ( )
    --------------------
               0 0 2 0 4
    --------------------
match:             2   2
                   +   +
before match:      0   2

3.再看另外一个例子：
              + ( ( ) ) ( ( ) )
    ---------------------------
              0 0 0 2 4 0 0 2 8
    ---------------------------
match:              2 2     2 2
                    + +     + +
inside:             0 2     0 2
                    + +     + +
before match:       0 0     0 4

对于第一个4：
它前面一个符号是闭口，且这个闭口符号有效值为2，于是当前闭口要考虑的有效开口，
应该往前数2+1位，也就是下标为1的位置，如果这个位置是开口，那么证明match，
且before match的有效值为0，于是它的有效值就是2+2+0

同理8：
它前面一个符号是闭口，且这个闭口符号有效值是2，于是当前闭口要考虑的有效开口，
应该往前数2+1位，也就是下标为5的位置，如果这个位置是开口，那么证明match，
且before match的有效值为4，于是它的有效值就是2+2+4
```

于是我们可以看出规律：

- 开口有效值都是 0
- 闭口：
  - 如果前一位是开口，那么直接 match 到 2 个长度，然后再连上这对开闭口**紧前的符号**的有效值；
  - 如果前以为是闭口，那么说明有可能是大包小的情况，所以**以前一位闭口的有效值为参考**，在这个有效值**再前一位（这里记为 far match）**与当前闭口做 match：
    - 如果不 match，那么当前闭口有效值为 0；
    - 否则 match 值 2 加上前一位闭口有效值再加上**far match 的紧前的符号**的有效值，就是当前闭口的有效值；

于是代码：

```java
public int longestValidParentheses(String s) {
    int maxMatch = 0;
    s = "+" + s;
    int[] dp = new int[s.length()];
    char[] chars = s.toCharArray();
    for (int i = 2; i < chars.length; i++) {
        char now = chars[i];
        if (now == ')') {
            char pre = chars[i - 1];
            if (pre == '(') {
                dp[i] = 2 + dp[i - 2];
            } else if (chars[i - dp[i - 1] - 1] == '('){
                dp[i] = 2 + dp[i - 1] + dp[i - dp[i - 1] - 2];
            }
        }
        maxMatch = Math.max(dp[i], maxMatch);
    }
    return maxMatch;
}
```

### 33. Search in Rotated sorted Array (Medium)

Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e., `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`).

You are given a target value to search. If found in the array return its index, otherwise return `-1`.

You may assume no duplicate exists in the array.

Your algorithm's runtime complexity must be in the order of _O_(log _n_).

**Example 1:**

```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

**Example 2:**

```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

#### Find The Rotate Pivot With Binary- O(logn)

这题唯一的技巧就是，如何找到被轴转过的有序数组的轴，找到轴就能对轴两边进行二分法了

##### Find Pivot

精髓，真的很直白的技巧，这也可以作为**“找到被轴转过的有序数组的轴”**的题解

```java
private int findPivot(int[] nums) {
    int low = 0, high = nums.length - 1, mid;
    while (low < high) {
        mid = (high + low) / 2;
        if (nums[mid] > nums[high]) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}
```

##### With Pivot

```java
public int search(int[] nums, int target) {
    if (nums.length == 0) {
        return -1;
    }
    int rs;
    if (nums[0] <= nums[nums.length - 1]) {
        rs = Arrays.binarySearch(nums, target);
        return rs < 0 ? -1 : rs;
    }
    int pivot = findPivot(nums);

    if (nums[pivot] <= target && nums[nums.length - 1] >= target) {
        rs = Arrays.binarySearch(nums, pivot, nums.length, target);
    } else {
        rs = Arrays.binarySearch(nums, 0, pivot, target);
    }
    return rs < 0 ? -1 : rs;
}
```

### 34. Find First And Last Position Of Element In Sorted Array

Given an array of integers `nums` sorted in ascending order, find the starting and ending position of a given `target` value.

Your algorithm's runtime complexity must be in the order of _O_(log _n_).

If the target is not found in the array, return `[-1, -1]`.

**Example 1:**

```
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

**Example 2:**

```
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```

```java
public int[] searchRange(int[] nums, int target) {
   int search = Arrays.binarySearch(nums, target);
    if (search < 0) {
        return new int[]{-1, -1};
    } else {
        int first = search, tmpFirst = search;
        while (tmpFirst >= 0) {
            tmpFirst = Arrays.binarySearch(nums, 0, tmpFirst, target);
            if (tmpFirst >= 0) {
                first = tmpFirst;
            }
        }
        int last = search, tmpLast = search;
        while (tmpLast >= 0 && tmpLast < nums.length) {
            tmpLast = Arrays.binarySearch(nums, tmpLast + 1, nums.length, target);
            if (tmpLast >= 0) {
                last = tmpLast;
            }
        }
        return new int[]{first, last};
    }
}
```

不多说

### 35. Search Insert Position(Easy)

Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You may assume no duplicates in the array.

**Example 1:**

```
Input: [1,3,5,6], 5
Output: 2
```

**Example 2:**

```
Input: [1,3,5,6], 2
Output: 1
```

```java
public int searchInsert(int[] nums, int target) {
    int low = 0, high = nums.length - 1, mid = 0;
    while (low <= high) {
        mid = (high + low) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return low;
}
```

关键：

- low <= high
- 返回 low
