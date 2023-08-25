---
title: Leetcode-71~75
tags:
  - leetcode
  - mysqrt
  - binary-question
date: 2019-04-04 15:35:00 +8
series: leetcode
---

### 71. SimplifyPath(Medium)

Given an **absolute path** for a file (Unix-style), simplify it. Or in other words, convert it to the **canonical path**.

In a UNIX-style file system, a period `.` refers to the current directory. Furthermore, a double period `..` moves the directory up a level. For more information, see: [Absolute path vs relative path in Linux/Unix](https://www.linuxnix.com/abslute-path-vs-relative-path-in-linuxunix/)

Note that the returned canonical path must always begin with a slash `/`, and there must be only a single slash `/` between two directory names. The last directory name (if it exists) **must not** end with a trailing `/`. Also, the canonical path must be the **shortest** string representing the absolute path.

**Example 1:**

```
Input: "/home/"
Output: "/home"
Explanation: Note that there is no trailing slash after the last directory name.
```

**Example 2:**

```
Input: "/../"
Output: "/"
Explanation: Going one level up from the root directory is a no-op, as the root level is the highest level you can go.
```

**Example 3:**

```
Input: "/home//foo/"
Output: "/home/foo"
Explanation: In the canonical path, multiple consecutive slashes are replaced by a single one.
```

**Example 4:**

```
Input: "/a/./b/../../c/"
Output: "/c"
```

**Example 5:**

```
Input: "/a/../../b/../c//.//"
Output: "/c"
```

**Example 6:**

```
Input: "/a//b////c/d//././/.."
Output: "/a/b/c"
```

#### Iterate

以`/`为单位截出 name，然后如果碰到不是`..`也不是`.`也非空的 name，就加入到队列中，如果碰到`..`，就退出中尾部的 name，最后依次遍历队列，组成 path

```java
public String simplifyPath(String path) {
    StringBuilder sb = new StringBuilder("/");
    LinkedList<String> list = new LinkedList<>();
    int nowI = 0;
    while (nowI < path.length()) {
        int nextI = path.indexOf('/', nowI + 1);
        String name;
        if (nextI > nowI) {
            name = path.substring(nowI + 1, nextI);
            nowI = nextI;
        } else {
            name = path.substring(nowI + 1);
            nowI = path.length();
        }

        if (name.equals("..") && !list.isEmpty()) {
            list.removeLast();
        } else if (!name.equals(".") && !name.equals("..") && !name.isEmpty()) {
            list.add(name);
        }
    }
    for (String name : list) {
        sb.append(name).append('/');
    }
    if (sb.length() > 1) {
        sb.deleteCharAt(sb.lastIndexOf("/"));
    }
    return sb.toString();
}
```

### 72. Edit Distance(Hard)

Given two words _word1_ and _word2_, find the minimum number of operations required to convert _word1_ to _word2_.

You have the following 3 operations permitted on a word:

1. Insert a character
2. Delete a character
3. Replace a character

**Example 1:**

```
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

**Example 2:**

```
Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

#### DP

针对这题的分析在[DP Again](./1flo1c0.html?hash=fd3f1d11)中

```java
public int minDistance(String word1, String word2) {
    int[][] dp = new int[word1.length() + 1][word2.length() + 1];
    for (int i = 0; i <= word1.length(); i++) {
        dp[i][0] = i;
    }
    for (int j = 0; j <= word2.length(); j++) {
        dp[0][j] = j;
    }
    for (int i = 1; i <= word1.length(); i++) {
        for (int j = 1; j <= word2.length(); j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                // same as before
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1
                        + Math.min(
                                // replace
                                dp[i - 1][j - 1],
                        Math.min(
                                // delete
                                dp[i - 1][j],
                                // insert
                                dp[i][j - 1]));
            }
        }
    }
    return dp[word1.length()][word2.length()];
}
```

#### DFS

```java
public int minDistance2(String a, String b) {
    int[][] dp = new int[a.length() + 1][b.length() + 1];
    return dfs(a, b, a.length() - 1, b.length() - 1, dp);
}

private int dfs(String a, String b, int i, int j, int[][] dp) {
    if (i == -1) {
        return j + 1;
    }
    if (j == -1) {
        return i + 1;
    }
    if (dp[i][j] == 0) {
        if (a.charAt(i) == b.charAt(j)) {
            dp[i][j] = dfs(a, b, i - 1, j - 1, dp);
        } else {
            dp[i][j] = 1
                    + Math.min(
                            dfs(a, b, i - 1, j - 1, dp),
                    Math.min(
                            dfs(a, b, i - 1, j, dp),
                            dfs(a, b, i, j - 1, dp)));
        }
    }
    return dp[i][j];
}
```

### 73. Set Matrix Zeros(Medium)

Given a _m_ x _n_ matrix, if an element is 0, set its entire row and column to 0. Do it [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm).

**Example 1:**

```
Input:
[
  [1,1,1],
  [1,0,1],
  [1,1,1]
]
Output:
[
  [1,0,1],
  [0,0,0],
  [1,0,1]
]
```

**Example 2:**

```
Input:
[
  [0,1,2,0],
  [3,4,5,2],
  [1,3,1,5]
]
Output:
[
  [0,0,0,0],
  [0,4,5,0],
  [0,3,1,0]
]
```

**Follow up:**

- A straight forward solution using O(_m\*\*n_) space is probably a bad idea.
- A simple improvement uses O(_m_ + _n_) space, but still not the best solution.
- Could you devise a constant space solution?

#### Brute Force

这题我觉得没必要想太多，暴力解复杂度也就 O(mn)，然后这边空间复杂度就 O(m + n)，虽然题目要求说要用常数空间去做

```java
public void setZeroes(int[][] matrix) {
    boolean[] rowZ = new boolean[matrix.length];
    boolean[] colZ = new boolean[matrix[0].length];
    for (int i = 0; i < matrix.length; i++) {
        for (int j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 0) {
                rowZ[i] = colZ[j] = true;
            }
        }
    }
    for (int i = 0; i < matrix.length; i++) {
        if (rowZ[i]) {
            Arrays.fill(matrix[i], 0);
        } else {
            for (int j = 0; j < matrix[i].length; j++) {
                if (colZ[j]) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
}
```

### 74. Search a 2D Matrix(Medium)

Write an efficient algorithm that searches for a value in an _m_ x _n_ matrix. This matrix has the following properties:

- Integers in each row are sorted from left to right.
- The first integer of each row is greater than the last integer of the previous row.

**Example 1:**

```
Input:
matrix = [
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
]
target = 3
Output: true
```

**Example 2:**

```
Input:
matrix = [
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
]
target = 13
Output: false
```

#### Binary

没什么好说的

```java
public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }
    int m = matrix.length, n = matrix[0].length;
    int low = 0, high = m - 1, mid;
    while (low <= high) {
        mid = (high + low) >>> 1;
        int rowHead = matrix[mid][0];
        int rowTail = matrix[mid][n - 1];
        if (rowHead <= target && rowTail >= target) {
            return Arrays.binarySearch(matrix[mid], target) >= 0;
        }
        if (rowHead > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return false;
}
```

### 75. Sort Colors(Medium)

Given an array with _n_ objects colored red, white or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white and blue.

Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

**Note:** You are not suppose to use the library's sort function for this problem.

**Example:**

```
Input: [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

**Follow up:**

- A rather straight forward solution is a two-pass algorithm using counting sort.
  First, iterate the array counting number of 0's, 1's, and 2's, then overwrite array with total number of 0's, then 1's and followed by 2's.
- Could you come up with a one-pass algorithm using only constant space?

#### Two-pass Counting Sort

关于计数排序，[排序大礼包](./1b0rp9e.html?hash=63d906b)的时候讲过的，但这是 2n 时间，题目要求 1n 时间，暂时就不先做了，因为我觉得盲目追求 1n 时间属于投机

```java
public void sortColors(int[] nums) {
    int[] count = new int[3];
    for (int color : nums) {
        count[color]++;
    }
    int cur = 0;
    for(int i = 0; i < nums.length;) {
        if (count[cur] != 0) {
            nums[i] = cur;
            count[cur]--;
            i++;
        } else {
            cur++;
        }
    }
}
```
