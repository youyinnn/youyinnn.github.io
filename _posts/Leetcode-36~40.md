---
title: Leetcode-36~40
categories:
  - algorithm
  - leetcode
tags:
  - leetcode
  - sudoku
  - combination-sum
date: 2019-03-20 19:46:00
series: leetcode
---



### 36. Valid Sudoku(Medium)

Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated **according to the following rules**:

1. Each row must contain the digits `1-9` without repetition.
2. Each column must contain the digits `1-9` without repetition.
3. Each of the 9 `3x3` sub-boxes of the grid must contain the digits `1-9` without repetition.

![sudoku](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png)

A partially filled sudoku which is valid.

The Sudoku board could be partially filled, where empty cells are filled with the character `'.'`.

**Example 1:**

```
Input:
[
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]
Output: true
```

**Example 2:**

```
Input:
[
  ["8","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]
Output: false
Explanation: Same as Example 1, except with the 5 in the top left corner being 
    modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.
```

**Note:**

- A Sudoku board (partially filled) could be valid but is not necessarily solvable.
- Only the filled cells need to be validated according to the mentioned rules.
- The given board contain only digits `1-9` and the character `'.'`.
- The given board size is always `9x9`.



#### Brute Force

这图暴力解就已经足够快了，其他解也不觉得有多快，比较无论怎么弄都是常数次，所以空间消耗要考虑好

```java
public boolean isValidSudoku(char[][] board) {
    for (int rowIndex = 0; rowIndex < board.length; rowIndex++) {
        char[] row = board[rowIndex];
        for (int columnIndex = 0; columnIndex < row.length; columnIndex++) {
            char number = row[columnIndex];
            if (number != '.') {
                for (int col = 0; col < row.length; col++) {
                    // duplicate in same row
                    if (col != columnIndex && row[col] == number) {
                        return false;
                    }
                }
                for (int ro = 0; ro < row.length; ro++) {
                    // duplicate in same column
                    if (ro != rowIndex && board[ro][columnIndex] == number) {
                        return false;
                    }
                }
                int rowFactor = rowIndex / 3;
                int colFactor = columnIndex / 3;
                // duplicate in 3x3
                for (int rs = rowFactor * 3; rs < (rowFactor * 3) + 3; rs++) {
                    for (int cs = colFactor * 3; cs < (colFactor * 3) + 3; cs++) {
                        if (rs != rowIndex && cs != columnIndex && board[rs][cs] == number) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}
```


### 37. Sudoku Solver(Hard)

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy **all of the following rules**:

1. Each of the digits `1-9` must occur exactly once in each row.
2. Each of the digits `1-9` must occur exactly once in each column.
3. Each of the the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.

Empty cells are indicated by the character `'.'`.

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png)
A sudoku puzzle...

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sudoku-by-L2G-20050714_solution.svg/250px-Sudoku-by-L2G-20050714_solution.svg.png)
...and its solution numbers marked in red.

**Note:**

- The given board contain only digits `1-9` and the character `'.'`.
- You may assume that the given Sudoku puzzle will have a single unique solution.
- The given board size is always `9x9`.



暂不会解，感觉和马踏棋盘一样要用回溯法，而且需要对数独的解法要有了解；



### 38. Count And Say(Easy)

傻逼题



### 39. Combination Sum(Medium)

Given a **set** of candidate numbers (`candidates`) **(without duplicates)** and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sums to `target`.

The **same** repeated number may be chosen from `candidates` unlimited number of times.

**Note:**

- All numbers (including `target`) will be positive integers.
- The solution set must not contain duplicate combinations.

**Example 1:**

```
Input: candidates = [2,3,6,7], target = 7,
A solution set is:
[
  [7],
  [2,2,3]
]
```

**Example 2:**

```java
Input: candidates = [2,3,5], target = 8,
A solution set is:
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```



#### Recursion

这题比较好用回溯，去重的技巧也有点3sum的意思

```java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    LinkedList<List<Integer>> ans = new LinkedList<>();
    Arrays.sort(candidates);
    for (int i = 0; i < candidates.length; i++) {
        int candidate = candidates[i];
        LinkedList<Integer> one = new LinkedList<>();
        one.add(candidate);
        get(ans, one, candidates, i, target - candidate);
    }
    return ans;
}

private void get(List<List<Integer>> ans, List<Integer> one, int[] candidates, int offset, int target) {
    if (target == 0) {
        ans.add(new LinkedList<>(one));
    }
    if (candidates[offset] <= target) {
        for (int i = offset; i < candidates.length; i++) {
            int candidate = candidates[i];
            if (candidate <= target) {
                one.add(candidate);
                get(ans, one, candidates, i, target - candidate);
                one.remove(one.size() - 1);
            }
        }
    }
}
```


### 40. Combination Sum II(Medium)

Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sums to `target`.

Each number in `candidates` may only be used **once** in the combination.

**Note:**

- All numbers (including `target`) will be positive integers.
- The solution set must not contain duplicate combinations.

**Example 1:**

```
Input: candidates = [10,1,2,7,6,1,5], target = 8,
A solution set is:
[
  [1, 7],
  [1, 2, 5],
  [2, 6],
  [1, 1, 6]
]
```

**Example 2:**

```
Input: candidates = [2,5,2,1,2], target = 5,
A solution set is:
[
  [1,2,2],
  [5]
]
```



这题和上题一样，多费心思处理重复就好了

```java
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    LinkedList<List<Integer>> ans = new LinkedList<>();
    Arrays.sort(candidates);
    for (int i = 0; i < candidates.length; i++) {
        if (i > 0 && candidates[i] == candidates[i - 1]) {
            continue;
        }
        int candidate = candidates[i];
        LinkedList<Integer> one = new LinkedList<>();
        one.add(candidate);
        get(ans, one, candidates, i + 1, target - candidate);
    }
    return ans;
}

private void get(List<List<Integer>> ans, List<Integer> one, int[] candidates, int offset, int target) {
    if (target == 0) {
        ans.add(new LinkedList<>(one));
    }
    if (offset < candidates.length && candidates[offset] <= target) {
        for (int i = offset; i < candidates.length; i++) {
            if (i != offset && candidates[i] == candidates[i - 1]) {
                continue;
            }
            int candidate = candidates[i];
            if (candidate <= target) {
                one.add(candidate);
                get(ans, one, candidates, i + 1, target - candidate);
                one.remove(one.size() - 1);
            } else {
                break;
            }
        }
    }
}
```