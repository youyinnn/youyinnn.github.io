---
title: Some Backtracking Problem In Leetcode
categories:
  - algorithm
  - backtracking
tags:
  - leetcode
  - backtracking
date: 2019-03-24 16:26:00 +8
---



### Introduction

在Leetcode上做到某些题的时候，会发现这些题的解法大致都是差不多，将**ans容器**传递到某个方法中，这个方法一般有`dfs`，`backtracking`，`bfs`，等命名，然后方法中会有递归调用，然后到达某一个出口的时候，就会将当前的**tmp答案**放置到**ans容器**中，于是达到探索所有解的目的

这篇大概也是各个题的题解，只是在评论区里看到有人[整理](https://leetcode.com/problems/permutations/discuss/18239/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partioning))了，我就一起整理下来分析分析

> This structure might apply to many other backtracking questions, but here I am just going to demonstrate Subsets, Permutations, and Combination Sum.



### Subset

Given a set of **distinct** integers, *nums*, return all possible subsets (the power set).

**Note:** The solution set must not contain duplicate subsets.

**Example:**

```
Input: nums = [1,2,3]
Output:
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
```

#### Solution

要找到一组无重复序列的子集，我们可以通过回溯的思想，去做这件事情，比如有序列`[1,2,3]`，因为子集可以不管顺序，所以123和321和312之类的是一样的，所以我们可以按照顺序决定谁开头，然后从这个开头位置开始进行回溯，比如：

```
第一个开头是什么都没有，这也是空集的情况[]；

[]——》  记录这个序列；

第二个开头是1，于是由1开始进行递归：

  |----1——》  记录这个序列，加入2；这时候i从0开始；
     |----1，2——》  记录这个序列，加入3；这时候i从1开始；
        |---- 1，2，3——》  记录这个序列，这时候i从2开始，达到序列底部，删除3，回退到上一层； 
     |----1《——  从上一层回退回来的，删除2，结束该次循环；
     |----1，3——》  记录这个序列，这时候i从2开始，达到序列底部，删除3，回退到上一层；
  |----1《——  从上一层回退回来的，删除1，结束该次循环；

于是1开头的子集已经访问完毕，继续

第三个开头是2，于是由2开始进行递归：

    |----2——》  记录这个序列，加入3；这时候i从1开始；
       |----2，3——》  记录这个序列，这时候i从2开始，达到序列底部，删除3，回退到上一层；
    |----2《——  从上一层回退回来的，删除2，结束该次循环；
    
于是2开头的子集已经访问完毕，继续

第三个开头是3，于是由3开始进行递归：

    |----3——》  记录这个序列，这时候i从2开始，达到序列底部，删除3，回退到上一层；
    |----3《——  从上一层回退回来的，删除3，结束该次循环；
    
于是3开头的子集已经访问完毕，序列所有数字均已经作为开头访问过子序列了，求解完毕；
```

于是实现可以简单的写出：

```java
public List<List<Integer>> subsets(int[] nums) {
    LinkedList<List<Integer>> ans = new LinkedList();
    backtracking(ans, new ArrayList<>(), nums, 0);
    return ans;
}

private void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums, int start) {
    ans.add(new ArrayList<>(tmp));
    for (int i = start; i < nums.length; i++) {
        tmp.add(nums[i]);
        backtracking(ans, tmp, nums, i + 1);
        tmp.remove(tmp.size() - 1);
    }
}
```


### Subset II

Given a collection of integers that might contain duplicates, **nums**, return all possible subsets (the power set).

**Note:** The solution set must not contain duplicate subsets.

**Example:**

```
Input: [1,2,2]
Output:
[
  [2],
  [1],
  [1,2,2],
  [2,2],
  [1,2],
  []
]
```

和上题差不多，只是这类题总会有，无重复序列，有重复序列的两种题型出现，于是我们如何在处理有重复序列的时候，避免重复解成了解决第二类问题的关键

#### Solution

避免判断重复的关键是：**先对序列进行排序**！

我们以`[1,2,2]`为例

```
第一个开头是什么都没有，这也是空集的情况[]；

[]——》  记录这个序列；

第二个开头是1，于是由1开始进行递归：

  |----1——》  记录这个序列，加入2；这时候i从0开始；
     |----1，2——》  记录这个序列，加入2；这时候i从1开始；
        |---- 1，2，2——》  记录这个序列，这时候i从2开始，达到序列底部，删除2，回退到上一层； 
     |----1《——  从上一层回退回来的，删除2，结束该次循环；
     |----1，2——》  这个序列i=2的时候，i != start && nums[i] == nums[i - 1]
  |----1《——  从上一层回退回来的，删除1，结束该次循环；

于是1开头的子集已经访问完毕，继续

第三个开头是2，于是由2开始进行递归：

    |----2——》  记录这个序列，加入2；这时候i从1开始；
       |----2，2——》  记录这个序列，这时候i从2开始，达到序列底部，删除2，回退到上一层；
    |----2《——  从上一层回退回来的，删除2，结束该次循环；
    
于是2开头的子集已经访问完毕，继续

第三个开头是2，于是由2开始进行递归：

    因为这时候start还是0，而i != start && nums[i] == nums[i - 1]成立，于是2就应该跳过；
    
于是3开头的子集已经访问完毕，序列所有数字均已经作为开头访问过子序列了，求解完毕；
```

```java
public List<List<Integer>> subsetsWithDup(int[] nums) {
    ArrayList<List<Integer>> ans = new ArrayList<>();
    Arrays.sort(nums);
    backtracking(ans, new ArrayList<>(), nums, 0);
    return ans;
}

private void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums, int start) {
    ans.add(new ArrayList<>(tmp));
    for (int i = start; i < nums.length; i++) {
        if (i != start && nums[i] == nums[i - 1]) {
            continue;
        }
        tmp.add(nums[i]);
        backtracking(ans, tmp, nums, i + 1);
        tmp.remove(tmp.size() - 1);
    }
}
```


### Permutation

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

#### Solution

这题就并不是找子集了，于是123和321是两个解，我们还是以前两题相类似的思路，顺序以某个数字开头，然后依次递归下去，比如以`1`开头，然后从剩下的数字中分别可以遍历出`12`和`13`，然后`12`从剩下的3中遍历出结果`123`，而`13`可以从剩下的2中遍历出`132`；于是1开头的所有排列已经找到了；依次类推2和3开头的结果

其中有tricky的地方是，每次我们要找下一个候选的时候，我们要判断当前后续是否在当此排列人当中，如果在就跳过，跳过的方法也很简单，因为序列本身无重复，所以直接`!tmp.contains(nums[i])`就好，于是实现可以是：

```java
public List<List<Integer>> permute(int[] nums) {
    LinkedList<List<Integer>> ans = new LinkedList<>();
    backtracking(ans, new ArrayList(), nums);
    return ans;
}

private void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums) {
    if (tmp.size() == nums.length) {
        ans.add(new ArrayList<>(tmp));
    } else {
        for (int i = 0; i < nums.length; i++) {
            // skip when 
            if (!tmp.contains(nums[i])) {
                tmp.add(nums[i]);
                backtracking(ans, tmp, nums);
                tmp.remove(tmp.size() - 1);
            }
        }
    }
}
```


### Permutation II

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



#### Solution

这里又有不同了，序列中有重复的数字，那么不能像上一题一样用数值去判断是否存在过**tmp** 中了，所以我们可以设置一个flag数组，用于标识对应位置上的数组是否出现过，实际上我们上一题也可以用这样的方法

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    LinkedList<List<Integer>> ans = new LinkedList();
    int[] flags = new int[nums.length];
    backtracking(ans, new ArrayList(), nums, flags);
    return ans;
}

public void backtracking(List<List<Integer>> ans, List<Integer> tmp, int[] nums, int[] flags) {
    if (tmp.size() == nums.length) {
        ans.add(new ArrayList(tmp));
    } else {
        for (int i = 0; i < nums.length; i++) {
            // 如果出现过就跳过
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
关键去重是这一行：`i > 0 && nums[i] == nums[i - 1] && flags[i - 1] == 0`

前面两个子条件可以理解，之前我们去重都是这样做的，第三个条件是什么意思呢？如果和当前数组重复的元素也就是前一位，**并没有被计入tmp序列的话**，那么就说明它已经被还原为0了，说明这是一个新开始了，比如说序列`[1,1,3]`，当以**第一个1**为开头的时候，序列解已经给出`1,1,3/1,3,1`了，等到给出解的时候，所有的flag已经都还原成`[0,0,0]`，意味着重新计数了，等到以**第二个1**为开头的时候，这时候判断它和第一个一数值相等，并且第一个1都没有被纳入计数的时候，于是这是一个开始，且是重复的开始，所以可以跳过



### Combination Sum

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

```
Input: candidates = [2,3,5], target = 8,
A solution set is:
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```



#### Solution

这里首先说说排列和组合的区别，前面两题**Permutation**，是排列问题，排列问题需要考虑顺序，也就是123和321是两个解，所以每次回溯的循环都是从0开始，以1开头要考虑所有的其他数字，以3开头也要考虑所有的其他数字；

而组合是不需要考虑顺序的，也就是123和321是同一个解，于是每次循环都从一个新的start开始，比如序列`[1, 2, 3]`的话，从1开头，要考虑自己和剩下的2和3，从2开头就只需要考虑自己和3就行了，从3开头就只需要考虑自己就好了；

然后对于这题来说，每次我们往下传的时候，都传做好减法的target，一直到最后target为0的时候，等于找到了一组解，于是代码为：

```java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    backtrack(ans, new ArrayList<>(), candidates, 0, target);
    return ans;
}

private void backtrack(List<List<Integer>> ans, List<Integer> tmp, int[] candidate, int start, int target) {
    if (target == 0) {
        ans.add(new ArrayList<>(tmp));
    } else if (target > 0) {
        for (int i = start; i < candidate.length; i++) {
            tmp.add(candidate[i]);
            backtrack(ans, tmp, candidate, i, target - candidate[i]);
            tmp.remove(tmp.size() - 1);
        }
    }
}
```



### Combination Sum II

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



#### Solution

额，我觉得到现在已经轻车熟路了，这里要注意的是，题目里说了每一个候选数字自能使用一次，于是我们往下传的时候，start要是i+1

```java
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    List<List<Integer>> ans = new ArrayList<>();
    Arrays.sort(candidates);
    backtrack(ans, new ArrayList<>(), candidates, 0, target);
    return ans;
}

private void backtrack(List<List<Integer>> ans, List<Integer> tmp, int[] candidate, int start, int target) {
    if (target == 0) {
        ans.add(new ArrayList<>(tmp));
    } else if (target > 0) {
        for (int i = start; i < candidate.length; i++) {
            if (i > start && candidate[i] == candidate[i - 1]) {
                continue;
            }
            tmp.add(candidate[i]);
            backtrack(ans, tmp, candidate, i + 1, target - candidate[i]);
            tmp.remove(tmp.size() - 1);
        }
    }
}
```



### Palindrome Partitioning

Given a string *s*, partition *s* such that every substring of the partition is a palindrome.

Return all possible palindrome partitioning of *s*.

**Example:**

```
Input: "aab"
Output:
[
  ["aa","b"],
  ["a","a","b"]
]
```



#### Solution

这题怎么说，其实可以用dp，而不用回溯，因为回溯确实有点魔幻，因为在回溯里不太好追踪子集，至少我这个笨脑子追踪不了

```java
public List<List<String>> partition(String s) {
   List<List<String>> list = new ArrayList<>();
   backtrack(list, new ArrayList<>(), s, 0);
   return list;
}

public void backtrack(List<List<String>> list, List<String> tempList, String s, int start){
   if(start == s.length())
      list.add(new ArrayList<>(tempList));
   else{
      for(int i = start; i < s.length(); i++){
         if(isPalindrome(s, start, i)){
            tempList.add(s.substring(start, i + 1));
            backtrack(list, tempList, s, i + 1);
            tempList.remove(tempList.size() - 1);
         }
      }
   }
}

public boolean isPalindrome(String s, int low, int high){
   while(low < high)
      if(s.charAt(low++) != s.charAt(high--)) return false;
   return true;
} 
```