---
title: Leetcode-46~50
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
- permutation
- backtrack
- mypow
date: 2019-03-27 15:39:00 +8
series: leetcode
---



### 46. Permutation(Medium)

Given a collection of **distinct** integers, return all possible permutations.

**Example:**

```
Input: [1,2,3]
Output:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

#### Backtracking

回溯之前已经分析过了，关键是用contains或者一个flag数组去避免重复

``` java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    backtracking(ans, new ArrayList<>(), nums);
    return ans;
}

private void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums) {
    if (tmp.size() == nums.length) {
        ans.add(new ArrayList<>(tmp));
    } else {
        for (int i = 0; i < nums.length; i++) {
            if (!tmp.contains(nums[i])) {
                tmp.add(nums[i]);
                backtracking(ans, tmp, nums);
                tmp.remove(tmp.size() - 1);
            }
        }
    }
}
```



### 47. Permutation II(Medium)

Given a collection of numbers that might contain duplicates, return all possible unique permutations.

**Example:**

```
Input: [1,1,2]
Output:
[
  [1,1,2],
  [1,2,1],
  [2,1,1]
]
```

#### Backtracking

关键是用一个flags数组和预先排序操作去避免重复

``` java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    int[] flags = new int[nums.length];
    Arrays.sort(nums);
    backtracking(ans, new ArrayList<>(), nums, flags);
    return ans;
}

private void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums, int[] flags) {
    if (tmp.size() == nums.length) {
        ans.add(new ArrayList<>(tmp));
    } else {
        for (int i = 0; i < nums.length; i++) {
            if (flags[i] == 0) {
                if (i > 0 && nums[i] == nums[i - 1] && flags[i - 1] == 0) {
                    continue;
                }
                tmp.add(nums[i]);
                flags[i] = 1;
                backtracking(ans, tmp, nums, flags);
                flags[i] = 0;
                tmp.remove(tmp.size() - 1);
            }
        }
    }
}
```



### 48. Rotate Image(Medium)

You are given an *n* x *n* 2D matrix representing an image.

Rotate the image by 90 degrees (clockwise).

**Note:**

You have to rotate the image [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm), which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.

**Example 1:**

```
Given input matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

rotate the input matrix in-place such that it becomes:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
```

**Example 2:**

```
Given input matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 

rotate the input matrix in-place such that it becomes:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]
```



#### Think In The Smart Way

挺简单的，就看你想不想地到而已- -，刚开始我真的一个数字一个数字地去转，从最外面一圈转到最里面，结果就傻逼了，需要处理很多拐弯的case

如果我们将右旋90°这个事情简单地看成：

```
0. original matrix:
                    [1,2,3]
                    [4,5,6]
                    [7,8,9]
                    
1. swap side base on diagonal:

                    [@,2,3]            [@,4,7]           [1,4,7]
                    [4,@,6]     -->    [2,@,8]    -->    [2,5,8]
                    [7,8,@]            [3,6,@]           [3,6,9]

2. swap side base on row's half:

                    [1,@,7]            [7,@,1]           [7,4,1]
                    [2,@,8]     -->    [8,@,2]    -->    [8,5,2]
                    [3,@,9]            [9,@,3]           [9,6,3]

```

其他旋也是一样的

``` java
public void rotate(int[][] matrix) {
    for (int i = 0; i < matrix.length; i++) {
        for (int j = i + 1; j < matrix.length; j++) {
            int tmp = matrix[j][i];
            matrix[j][i] = matrix[i][j];
            matrix[i][j] = tmp;
        }
    }

    for (int[] rows : matrix) {
        int l = 0, r = rows.length - 1;
        int tmp;
        while (l < r) {
            tmp = rows[r];
            rows[r] = rows[l];
            rows[l] = tmp;
            l++;
            r--;
        }
    }
}
```



### 49. Group Anagrams(Medium)

Given an array of strings, group anagrams together.

**Example:**

```
Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
Output:
[
  ["ate","eat","tea"],
  ["nat","tan"],
  ["bat"]
]
```

#### Hashing

先每个字符串用排序得出对应的字谜的解，然后这个解作为key放在HashMap中，后续相同字谜解的，一起加在同一个key下

``` java
public List<List<String>> groupAnagrams(String[] strs) {
    HashMap<String, List<String>> ansMap = new HashMap<>();
    for (String str : strs) {
        char[] chars = str.toCharArray();
        Arrays.sort(chars);
        String key = String.valueOf(chars);
        if (!ansMap.containsKey(key)) {
            ansMap.put(key, new LinkedList<>());
        }
        ansMap.get(key).add(str);
    }
    return new LinkedList<>(ansMap.values());
}
```
这里有2个优化的地方：

- 因为都是在屁股加解，所以用`LinkedList`会好点；
- `String.valueOf(chars)`会比`Arrays.toString(chars)`要来得干脆；



### 50. Pow(x, n) (Medium)

Implement [pow(*x*, *n*)](http://www.cplusplus.com/reference/valarray/pow/), which calculates *x* raised to the power *n* (xn).

**Example 1:**

```
Input: 2.00000, 10
Output: 1024.00000
```

**Example 2:**

```
Input: 2.10000, 3
Output: 9.26100
```

**Example 3:**

```
Input: 2.00000, -2
Output: 0.25000
Explanation: 2-2 = 1/22 = 1/4 = 0.25
```

**Note:**

- -100.0 < *x* < 100.0
- *n* is a 32-bit signed integer, within the range [−231, 231 − 1]

#### Recursion

这题首先暴力解可以，但是时间会爆，比较如果n为`Integer.MAX_VALUE`的话，那就得有20亿次的循环计算，但是呢，这20亿次计算，有一半可以砍掉的，我们拿`pow(2, 20)`来举例，2的20次方，等于2的10次方的平方，于是我们只需要算出2的10次方，那么就可以得出2的20次方了：`pow(2, 20) = pow(2, 10) * pow(2, 10)`，而`pow(2, 10) = pow(2, 5) * pow(2, 5)`，而`pow(2, 5) = pow(2, 4) * 2`，而`pow(2, 4) = pow(2, 2) * pow(2, 2)`，而`pow(2, 2) = 2 * 2`；

于是我们把20次计算减少为5次计算，同理我们如果20亿次计算可以减少为31次计算，不要问为什么

然后我们再覆盖一些边角case~

``` java
public double myPow(double x, int n) {
    if (n == 0 || x == 1) {
        return 1;
    }
    if (n == Integer.MIN_VALUE) {
        double sub = 1 / x;
        return myPow(sub, Integer.MAX_VALUE) * sub;
    }
    if (n < 0) {
        return myPow(1 / x, -n);
    }
    if (n == 2) {
        return x * x;
    } else {
        if (n % 2 == 0) {
            int sub = n / 2;
            double subPow = myPow(x, sub);
            if (subPow == 0.0) {
                return 0;
            } else {
                return subPow * subPow;
            }
        } else {
            return myPow(x, n - 1) * x;
        }
    }
}
```