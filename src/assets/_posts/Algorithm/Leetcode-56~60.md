---
title: Leetcode-56~60
tags:
  - leetcode
  - n-queens
  - backtrack
date: 2019-03-30 21:16:00 +8
series: leetcode
---

### 56.Merge Intervals(Medium)

Given a collection of intervals, merge all overlapping intervals.

**Example 1:**

```
Input: [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].
```

**Example 2:**

```
Input: [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```

#### Solution

多写几组就知道规律了，我们将 start 和 end 各**按照升序**写成 2 个数组：

```
[[1,3],[2,6],[8,10],[15,18]]
start: [1,2, 8,15]
end:   [3,6,10,18]
result:
       [1,2  [8, [15
        3,6] 10]  18]

[[1,4],[4,5]]
start: [1,4]
end:   [4,5]
result:
       [1,4
        4,5]

```

于是我们找得出规律，我们同时从开头遍历两个数组，当下标为`i`的时候，如果`end[i] <= start[i + 1]`，证明找到了一组 intervals

```java
public List<Interval> merge(List<Interval> intervals) {
    List<Interval> ans = new LinkedList<>();
    int[] ss = new int[intervals.size()];
    int[] ee = new int[intervals.size()];
    for (int i = 0; i < intervals.size(); i++) {
        ss[i] = intervals.get(i).start;
        ee[i] = intervals.get(i).end;
    }
    Arrays.sort(ss);
    Arrays.sort(ee);
    int si = 0;
    int ei = 0;
    int nowStart;
    while (ei < intervals.size()) {
        nowStart = ss[si];
        while (si + 1 < intervals.size() && ee[ei] >= ss[si + 1]) {
            si++;
            ei++;
        }
        ans.add(new Interval(nowStart, ee[ei]));
        si++;
        ei++;
    }
    return ans;
}
```

### 57.Insert Interval

Given a set of _non-overlapping_ intervals, insert a new interval into the intervals (merge if necessary).

You may assume that the intervals were initially sorted according to their start times.

**Example 1:**

```
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

**Example 2:**

```
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].
```

#### Solution

因为前面解 Merge 的时候，就用排序无视掉了顺序，所以插入的时候，直接可以使用上面的 Merge 继续做

```java
public List<Interval> insert(List<Interval> intervals, Interval newInterval) {
    intervals.add(newInterval);
    return merge(intervals);
}

public List<Interval> merge(List<Interval> intervals) {
    List<Interval> ans = new LinkedList<>();
    int[] ss = new int[intervals.size()];
    int[] ee = new int[intervals.size()];
    for (int i = 0; i < intervals.size(); i++) {
        ss[i] = intervals.get(i).start;
        ee[i] = intervals.get(i).end;
    }
    Arrays.sort(ss);
    Arrays.sort(ee);
    int si = 0;
    int ei = 0;
    int nowStart;
    while (ei < intervals.size()) {
        nowStart = ss[si];
        while (si + 1 < intervals.size() && ee[ei] >= ss[si + 1]) {
            si++;
            ei++;
        }
        ans.add(new Interval(nowStart, ee[ei]));
        si++;
        ei++;
    }
    return ans;
}
```

### 58.Length Of Last Word(Easy)

Given a string _s_ consists of upper/lower-case alphabets and empty space characters `' '`, return the length of last word in the string.

If the last word does not exist, return 0.

**Note:** A word is defined as a character sequence consists of non-space characters only.

**Example:**

```
Input: "Hello World"
Output: 5
```

#### Solution

```java
public int lengthOfLastWord(String s) {
    String[] split = s.split(" ");
    if (s.isEmpty() || split.length == 0) {
        return 0;
    } else {
        int i = split.length - 1;
        int len = split[i].length();
        while (len == 0) {
            len = split[--i].length();
        }
        return len;
    }
}
```

### 59.SpiralMatrixII(Medium)

Given a positive integer _n_, generate a square matrix filled with elements from 1 to *n*2 in spiral order.

**Example:**

```
Input: 3
Output:
[
 [ 1, 2, 3 ],
 [ 8, 9, 4 ],
 [ 7, 6, 5 ]
]
```

#### Solution

有了[Spiral Matrix](./xmbex2.html?hash=73ecdd5a)的经验，这题就很容易暴打出来了

```java
public int[][] generateMatrix(int n) {
    int[][] ans = new int[n][n];
    int dir = 0;
    int count = 2;
    ans[0][0] = 1;
    int[] point = {0, 0};
    while (count <= n * n) {
        if (dir == 0) {
            for (int i = point[1] + 1; i < n; i++) {
                ans[point[0]][i] = count++;
                point[1] = i;
                if (i + 1 < n && ans[point[0]][i + 1] > 0) {
                    break;
                }
            }
            dir = 1;
        } else if (dir == 1) {
            for (int i = point[0] + 1; i < n; i++) {
                ans[i][point[1]] = count++;
                point[0] = i;
                if (i + 1 < n && ans[i + 1][point[1]] > 0) {
                    break;
                }
            }
            dir = 2;
        } else if (dir == 2) {
            for (int i = point[1] - 1; i >= 0; i--) {
                ans[point[0]][i] = count++;
                point[1] = i;
                if (i - 1 >= 0 && ans[point[0]][i - 1] > 0) {
                    break;
                }
            }
            dir = 3;
        } else {
            for (int i = point[0] - 1; i >= 0; i--) {
                ans[i][point[1]] = count++;
                point[0] = i;
                if (i - 1 >= 0 && ans[i - 1][point[1]] > 0) {
                    break;
                }
            }
            dir = 0;
        }

    }
    return ans;
}
```

### 60.Permutation Sequence(Medium)

The set `[1,2,3,...,*n*]` contains a total of _n_! unique permutations.

By listing and labeling all of the permutations in order, we get the following sequence for _n_ = 3:

1. `"123"`
2. `"132"`
3. `"213"`
4. `"231"`
5. `"312"`
6. `"321"`

Given _n_ and _k_, return the *k*th permutation sequence.

**Note:**

- Given _n_ will be between 1 and 9 inclusive.
- Given _k_ will be between 1 and _n_! inclusive.

**Example 1:**

```
Input: n = 3, k = 3
Output: "213"
```

**Example 2:**

```
Input: n = 4, k = 9
Output: "2314"
```

#### Mathematical

数学观察法做出- -

```
我们观察一下n=4的时候：
前12个序列为：

1: 1 2 3 4   7: 2 1 3 4
2: 1 2 4 3   8: 2 1 4 3
3: 1 3 2 4   9: 2 3 1 4
4: 1 3 4 2  10: 2 3 4 1
5: 1 4 2 3  11: 2 4 1 3
6: 1 4 3 2  12: 2 4 3 1

可以观察到，我们选第一个数是满6个选一位，也就是以1开头的序列共有剩下3!=6种可能，
一次类推后面几位数字就都

当n=4，k=9的时候

我们开始选第一个数，candidate:[1,2,3,4]

3! x 1 < k = 9 ≤ 3! x 2

于是选第2个候选者；k = 9 - (3! x 1) = 3;

我们开始选第二个数，candidate:[1,3,4]

2! x 1 < k = 3 ≤ 2! x 2

于是选第2个候选者；k = 3 - (2! x 1) = 1;

我们开始选第三个数，candidate:[1,4]

0 < k = 1 ≤ 1! x 1

于是选择第1个候选者;这时候只剩下一个候选者了，得解
```

于是代码为：

```java
public String getPermutation(int n, int k) {
    LinkedList<String> candidate = new LinkedList<>();
    StringBuilder sb = new StringBuilder();
    int factorial = 1;
    for (int i = 1; i <= n; i++) {
        factorial *= i;
        candidate.add(String.valueOf(i));
    }
    int bit = n;
    while (candidate.size() > 0) {
        factorial = factorial / bit;
        bit--;
        int pick = 0;
        while (k > pick * factorial) {
            pick++;
        }
        sb.append(candidate.remove(pick - 1));
        k -= ((pick - 1) * factorial);
    }
    return sb.toString();
}
```
