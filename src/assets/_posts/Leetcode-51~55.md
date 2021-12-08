---
title: Leetcode-51~55
categories:
  - algorithm
  - leetcode
tags:
  - leetcode
  - n-queens
  - backtrack
date: 2019-03-30 10:57:00 +8
series: leetcode
---



### 51. N-Queens(Hard)

The *n*-queens puzzle is the problem of placing *n* queens on an *n*×*n* chessboard such that no two queens attack each other.

![img](https://assets.leetcode.com/uploads/2018/10/12/8-queens.png)

Given an integer *n*, return all distinct solutions to the *n*-queens puzzle.

Each solution contains a distinct board configuration of the *n*-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space respectively.

**Example:**

```
Input: 4
Output: [
 [".Q..",  // Solution 1
  "...Q",
  "Q...",
  "..Q."],

 ["..Q.",  // Solution 2
  "Q...",
  "...Q",
  ".Q.."]
]
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above.
```



#### Rough Backtracking

要打这题，首先得做好下棋的一步关键的那一步：判断该位置是否能下，于是对于**一张完整的棋盘**来说，我们每下一步之前，就需要判断：

1. 同行同列是否有棋子；
2. 对角线是否有棋子；

于是为了做到这一步，大概会花n * n的时间

然后用回溯去做每一颗棋子的下棋判断，直观+回溯的考虑的话，确实是这样的，但是这题我们可以用一种更聪明的方式去解决；

#### Smart Backtracking

首先我们的判断步骤，不需要遍历整张`n*n`的棋盘，我们也不需要事先准备好整张棋盘，如果我们把每一步棋当成一行去填补棋盘，第一行是一个棋子，第二行是第二个棋子，于是

- 当我们下第`i`个棋子的时候，只需要判断前面的`0~i-1`行棋盘就好了；
- 关于对角线，我们也不必遍历整行，因为对角线的位置可以根据行差算出来，比如要插入第`i`行第`j`列的时候，需要判断上面`i-1`行的对角线的话，比如第2行在该行的对角线理论上为`j + i - 2`或者`j - (i - 2)`；

于是我们的判断方法为：

```java
private boolean valid(List<String> cb, int x, int y) {
    for (int rowIndex = 0; rowIndex < x; rowIndex++) {
        char[] row = cb.get(rowIndex).toCharArray();
        if (row[y] == 'Q') {
            return false;
        }
        int gap = x - rowIndex;
        if (y + gap < row.length && row[y + gap] == 'Q') {
            return false;
        }
        if (y - gap >= 0 && row[y - gap] == 'Q') {
            return false;
        }
    }
    return true;
}
```
这样来说会将判断方法的效率基本提到线性，于是加上回溯：

``` java
char[] css;

public List<List<String>> solveNQueens(int n) {
    css = new char[n];
    List<List<String>> ans = new ArrayList<>();
    backtracking(ans, new ArrayList<>(), n, 0);
    return ans;
}

private void backtracking(List<List<String>> ans, List<String> cb, int n, int row) {
    if (row == n) {
        ans.add(new ArrayList<>(cb));
    } else {
        for (int i = 0; i < n; i++) {
            if (valid(cb, row, i)) {
                Arrays.fill(css, '.');
                css[i] = 'Q';
                cb.add(String.valueOf(css));
                backtracking(ans, cb, n, row + 1);
                cb.remove(cb.size() - 1);
            }
        }
    }
}
```



#### Elegant Backtracking

很遗憾的是，我们上面再聪明再接近线性的判断效率，其实还是抵不过常数级的，所以我们上面的优化过后的code也仅是打到43.6%，我们再来整理一下我们的**valid**函数：

- 同列不能下；
- 左右对角线不能下；

同列的话，我们可以用一个n长度数组去记录，这个数组可以所有行共用；

对角线的话，我们前面做[**MultiplyString**](./11z93zc.html?hash=22be3288)，有想出来过一个对角线的技巧，于是这里我们也可以将所有的对角线压缩成一行：

```
对于一个4*4的棋盘：

对于135°的右向对角线，我们可以将2维的压缩成
                                 0
   j = 0  1  2  3               1 1              
i = 0  0  1  2  3              2 2 2        
    1  1  2  3  4     -->     3 3 3 3  -->  drSet：0 1 2 3 4 5 6
    2  2  3  4  5              4 4 4
    3  3  4  5  6               5 5
                                 6
行列关系和压缩数组的关系可以是：
    dri = col + row
    
同理对于45°的左向对角线：
                                   3
   j =  0   1   2   3            2  2
i = 0   0   1   2   3          1  1  1
    1  -1   0   1   2  -->   0  0  0  0  --> dlSet: -3 -2 -1 0 1 2 3
    2  -2  -1   0   1         -1 -1 -1 
    3  -3  -2  -1   0           -2 -2
                                  -3
行列关系和压缩数组的关系可以是：
    dli = col - row
    
然后为了数组下标好处理，我们可以加上一个n
    dli = col - row + n      --> dlSet: 1 2 3 4 5 6 7
```

于是这两行就能在代表整个棋盘的左右对角线，**通过规律可以发现，对角线压缩数组的长度不会超过2n**，于是我们的程序可以在线性的时间内判断对角线和列的棋位是否合法了：

```java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> ans = new ArrayList<>();
    backtracking(ans, new ArrayList<>(), new boolean[n], new boolean[n * 2], new boolean[n * 2], n, 0);
    return ans;
}

private void backtracking(List<List<String>> ans, List<String> cb,
                           boolean[] colSet, boolean[] dlSet, boolean[] drSet, int n, int row) {
    if (row == n) {
        ans.add(new ArrayList<>(cb));
    } else {
        for (int col = 0; col < n; col++) {
            int dli = col - row + n;
            int dri = col + row;
            if (colSet[col] || dlSet[dli] || drSet[dri]) {
                continue;
            }
            colSet[col] = dlSet[dli] = drSet[dri] =  true;
            char[] css = new char[n];
            Arrays.fill(css, '.');
            css[col] = 'Q';
            cb.add(String.valueOf(css));
            backtracking(ans, cb, colSet, dlSet, drSet, n, row + 1);
            cb.remove(cb.size() - 1);
            colSet[col] = dlSet[dli] = drSet[dri] =  false;
        }
    }
}
```

### 52.N-QueensII(Hard)

The *n*-queens puzzle is the problem of placing *n* queens on an *n*×*n* chessboard such that no two queens attack each other.

![img](https://assets.leetcode.com/uploads/2018/10/12/8-queens.png)

Given an integer *n*, return the number of distinct solutions to the *n*-queens puzzle.

**Example:**

```
Input: 4
Output: 2
Explanation: There are two distinct solutions to the 4-queens puzzle as shown below.
[
 [".Q..",  // Solution 1
  "...Q",
  "Q...",
  "..Q."],

 ["..Q.",  // Solution 2
  "Q...",
  "...Q",
  ".Q.."]
]
```



#### Solution I

没什么，就改一改上一题而已

```java
int ans = 0;

public int totalNQueens(int n) {
    backtracking(new ArrayList<>(), n, 0);
    return ans;
}

private void backtracking(List<String> cb, int n, int row) {
    if (row == n) {
        ans++;
    } else {
        for (int i = 0; i < n; i++) {
            if (valid(cb, row, i)) {
                char[] css = new char[n];
                Arrays.fill(css, '.');
                css[i] = 'Q';
                cb.add(String.valueOf(css));
                backtracking(cb, n, row + 1);
                cb.remove(cb.size() - 1);
            }
        }
    }
}

private boolean valid(List<String> cb, int x, int y) {
    for (int rowIndex = 0; rowIndex < x; rowIndex++) {
        char[] row = cb.get(rowIndex).toCharArray();
        if (row[y] == 'Q') {
            return false;
        }
        int gap = x - rowIndex;
        if (y + gap < row.length && row[y + gap] == 'Q') {
            return false;
        }
        if (y - gap >= 0 && row[y - gap] == 'Q') {
            return false;
        }
    }
    return true;
}
```


#### Solution II

```java
int ans = 0;
boolean[] colSet, drSet, dlSet;

public int totalNQueens(int n) {
    colSet = new boolean[n];
    drSet = new boolean[n * 2];
    dlSet = new boolean[n * 2];
    backtracking(n, 0);
    return ans;
}

private void backtracking(int n, int row) {
    if (row == n) {
        ans++;
    } else {
        for (int col = 0; col < n; col++) {
            int dli = col - row + n;
            int dri = col + row;
            if (colSet[col] || drSet[dri] || dlSet[dli]) {
                continue;
            }
            colSet[col] = drSet[dri] = dlSet[dli] = true;
            backtracking(n, row + 1);
            colSet[col] = drSet[dri] = dlSet[dli] = false;
        }
    }
}
```


### 53. Maximun SubArray(Easy)

Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Example:**

```
Input: [-2,1,-3,4,-1,2,1,-5,4],
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.
```

**Follow up:**

If you have figured out the O(*n*) solution, try coding another solution using the divide and conquer approach, which is more subtle.

#### DP

不多说，在[地痞](./188zp6j.html)有分析过的

```java
public int maxSubArray(int[] nums) {
    int rMax = 0, max = Integer.MIN_VALUE;
    for (int current: nums) {
        rMax = Math.max(current, current + rMax);
        max = Math.max(max, rMax);
    }
    return max;
}
```


### 54. Spiral Matrix(Medium)

Given a matrix of *m* x *n* elements (*m* rows, *n* columns), return all elements of the matrix in spiral order.

**Example 1:**

```
Input:
[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
]
Output: [1,2,3,6,9,8,7,4,5]
```

**Example 2:**

```
Input:
[
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9,10,11,12]
]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```



#### Brute Force

hmmmmm，强打就完事了，怎么强打呢？四个关键点：

1. 起点

    > 我们假设每次我们都从当前圈的左上角为起点

2. 方向

    > 我们假设每次从起点开始的话，转一圈经过的方向恒为：右-下-左-上

    ```
    比如一个3X4的矩阵，从起点0,0开始的话：
        → → → →                       
        1 2 3 4          1 2 3 4 ↓        1 2 3 4            1  2  3  4
                    ==>        5 ↓  ==>         5    ==>  ↑ 10        5
                               6 ↓        9 8 7 6            9  8  7  6
                                          ← ← ← ←
    于是第一圈就完成了，四个方向均只执行到边界了
    ```

3. 边界

    > 0我们设每个方向都会有边界，每经过一个方向，边界就上涨或者下调；
    >
    > 比如一个3X4的矩阵，第一圈的时候，按照下标和方向顺序的话，边界值是：3-2-0-1
    >
    > 关于上涨和下调，接着看下一点

4. 单向行进

    > 我们有了起点、方向、边界了之后，就可以开始单向行进了，开始由0,0为起点，朝右行进，边界值为3，于是我们从起点开始遍历列下标

    ```
    模拟第一圈的情况：
    1. 0,0 - 0,1 - 0,2 - 0,3；到达边右界；于是右边界减少到2；轮到下一个方向；
    2. 0,3 - 1,3 - 2,3；到达下边界；于是下边界增加到1；轮到下一个方向；
    3. 2,3 - 2,2 - 2,1 - 2,0；到达左边界；于是左边界增加到1；轮到下一个方向；
    4. 2,0 - 1,0；到达上边界；于是上边界减少到2；轮到下一个方向；
    ```

于是代码为：

```java
public List<Integer> spiralOrder(int[][] matrix) {
    LinkedList<Integer> ans = new LinkedList<>();
    if (matrix.length == 0) {
        return ans;
    }
    int[] range = new int[]{matrix[0].length - 1, matrix.length - 1, 0, 1};
    int[] point = new int[]{0, 0};
    int rangeIndex = 0;
    ans.add(matrix[0][0]);
    while (ans.size() < matrix.length * matrix[0].length) {
        int nowRange = range[rangeIndex];
        if (rangeIndex == 0) {
            for (int i = point[1] + 1; i <= nowRange; i++) {
                ans.add(matrix[point[0]][i]);
            }
            point[1] = nowRange;
            range[rangeIndex] -= 1;
        }
        if (rangeIndex == 1){
            for (int i = point[0] + 1; i <= nowRange; i++) {
                ans.add(matrix[i][point[1]]);
            }
            point[0] = nowRange;
            range[rangeIndex] -= 1;
        }
        if (rangeIndex == 2) {
            for (int i = point[1] - 1; i >= nowRange; i--) {
                ans.add(matrix[point[0]][i]);
            }
            point[1] = nowRange;
            range[rangeIndex] += 1;
        }
        if (rangeIndex == 3) {
            for (int i = point[0] - 1; i >= nowRange; i--) {
                ans.add(matrix[i][point[1]]);
            }
            point[0] = nowRange;
            range[rangeIndex] += 1;
        }
        rangeIndex = nextRange(rangeIndex);
    }
    return ans;
}

private int nextRange(int i) {
    return i + 1 < 4 ? i + 1 : 0;
}
```



### 55.Jump Game(Medium)

Given an array of non-negative integers, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

Determine if you are able to reach the last index.

**Example 1:**

```
Input: [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

**Example 2:**

```
Input: [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum
             jump length is 0, which makes it impossible to reach the last index.
```

这题就不多解释了，在[DP Again](./1flo1c0.html)中有详细解读过，但是在再一次做到这题的时候，还是写出了一种更优的DP，因为一时间忘了贪婪解法怎么写出来了- -

#### DP

```java
public boolean canJump(int[] nums) {
    boolean[] can = new boolean[nums.length];
    can[nums.length - 1] = true;
    for (int i = nums.length - 2; i >= 0; i--) {
        int steps = nums[i];
        for (int j = i + 1; j < nums.length && j <= i + steps; j++) {
            if  (can[j]) {
                can[i] = true;
                break;
            }
        }
    }
    return can[0];
}
```
#### Greedy

```java
public boolean canJump(int[] nums) {
    int last = nums.length - 1;
    for (int i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= last) {
            last = i;
        }
    }
    return last == 0;
}
```