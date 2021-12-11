---
title: Leetcode-11~15
categories:
  - algorithm
  - leetcode
tags:
  - leetcode
date: 2019-02-27 21:42:00
series: leetcode
---

### 11. Container With Most Water(Medium)

Given _n_ non-negative integers _a1_, _a2_, ..., _an_ , where each represents a point at coordinate (_i_, _ai_). _n_ vertical lines are drawn such that the two endpoints of line _i_ is at (_i_, _ai_) and (_i_, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

**Note:** You may not slant the container and _n_ is at least 2.

![](../../../public/img/20190228214420.png)

The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

**Example:**

```
Input: [1,8,6,2,5,4,8,3,7]
Output: 49
```

#### Ⅰ. Brute Force - O(n^2)

```java
public int maxArea2(int[] height) {
    int ans = 0;
    for (int i = 0; i < height.length; i++) {
        if (Math.max(i * height[i], (height.length - i - 1) * height[i]) > ans) {
            for (int j = 0; j < height.length; j++) {
                if (i != j) {
                    int l = Math.min(height[i], height[j]);
                    int w = Math.abs(i - j);
                    ans = Math.max(w * l, ans);
                }
            }

        }
    }
    return ans;
}
```

#### Ⅱ. Two Pointer - O (n)

既然要找 2 根柱子，那么我们就设有 2 个指针，分别从两端开始往里走，因为指针撑到最大的时候，对于两边指针都可能是它们能得到的最大值

设**(L, R)**表示一组可能的解，对于示例输入，最开始是`(1, 7)`，如果 L 比 R 小，那么证明以 1 为 L 的 case：`(1, 3)、(1, 8)...`等等都不需要考虑了，因为这时候已经找到了以 1 为 L 的最优解了，`(1, 7) = 1*7i`，`(1, 3) = 1 * （7i - 1)`

所以 L 后走一步，情况反过来就 R 往前走一步，直到 L 和 R 相遇；并且这样做的同时我们不必运算对角线 case 和对称 case

```java
public int maxArea2(int[] height) {
    int ans = 0, l = 0, r = height.length - 1;
    while (l < r) {
        int w = r - l;
        if (height[l] > height[r]) {
            ans = Math.max(ans, height[r] * w);
            r--;
        } else {
            ans = Math.max(ans, height[l] * w);
            l++;
        }
    }
    return ans;
}
```

然后在讨论区有更具象化的解释：[Yet another way to see what happens in the O(n) algorithm](https://leetcode.com/problems/container-with-most-water/discuss/6099/yet-another-way-to-see-what-happens-in-the-on-algorithm)

> The O(n) solution with proof by contradiction doesn't look intuitive enough to me. Before moving on, read any [example](https://leetcode.com/problems/container-with-most-water/discuss/6100/Simple-and-clear-proofexplanation) of the algorithm first if you don't know it yet.
>
> Here' another way to see what happens in a matrix representation:
>
> Draw a matrix where the row is the first line, and the column is the second line. For example, say `n=6`.
>
> In the figures below, `x` means we don't need to compute the volume for that case: (1) On the diagonal, the two lines are overlapped; (2) The lower left triangle area of the matrix is symmetric to the upper right area.
>
> We start by computing the volume at `(1,6)`, denoted by `o`. Now if the left line is shorter than the right line, then all the elements left to `(1,6)` on the first row have smaller volume, so we don't need to compute those cases (crossed by `---`).
>
> ```
>   1 2 3 4 5 6
> 1 x ------- o
> 2 x x
> 3 x x x
> 4 x x x x
> 5 x x x x x
> 6 x x x x x x
> ```
>
> Next we move the left line and compute `(2,6)`. Now if the right line is shorter, all cases below `(2,6)` are eliminated.
>
> ```
>   1 2 3 4 5 6
> 1 x ------- o
> 2 x x       o
> 3 x x x     |
> 4 x x x x   |
> 5 x x x x x |
> 6 x x x x x x
> ```
>
> And no matter how this `o` path goes, we end up only need to find the max value on this path, which contains `n-1` cases.
>
> ```
>   1 2 3 4 5 6
> 1 x ------- o
> 2 x x - o o o
> 3 x x x o | |
> 4 x x x x | |
> 5 x x x x x |
> 6 x x x x x x
> ```
>
> Hope this helps. I feel more comfortable seeing things this way.

### 12. Int To Roman(Medium)

Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

```
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

For example, two is written as `II` in Roman numeral, just two one's added together. Twelve is written as, `XII`, which is simply `X` + `II`. The number twenty seven is written as `XXVII`, which is `XX` + `V` + `II`.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as `IX`. There are six instances where subtraction is used:

- `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.
- `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.
- `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

Given an integer, convert it to a roman numeral. Input is guaranteed to be within the range from 1 to 3999.

**Example 1:**

```
Input: 3
Output: "III"
```

**Example 2:**

```
Input: 4
Output: "IV"
```

**Example 3:**

```
Input: 9
Output: "IX"
```

**Example 4:**

```
Input: 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.
```

**Example 5:**

```
Input: 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
```

#### Hashing

这题没什么说的，一看就是 Hashing

```java
private String[] hashRom = {
        "", "I","II","III","IV","V","VI","VII","VIII","IX",
        "", "X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "", "C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "", "M","MM","MMM",
};

public String intToRoman(int num) {
    return hashRom[30 + (num / 1000)] +
            hashRom[20 + ((num % 1000) / 100)] +
            hashRom[10 + ((num % 100) / 10)] +
            hashRom[num % 10];
}
```

### 13. Roman To Int(Easy)

```java
private int mapping(char c) {
    switch (c) {
        case 'I':
            return 1;
        case 'V':
            return 5;
        case 'X':
            return 10;
        case 'L':
            return 50;
        case 'C':
            return 100;
        case 'D':
            return 500;
        case 'M':
            return 1000;
        default:
            return 0;
    }
}

public int romanToInt(String s) {
    char[] rs = s.toCharArray();
    int ans = 0;
    for (int i = 0; i < rs.length;) {
        int nowInt = mapping(rs[i]), nextInt;
        if (i + 1 < rs.length
                && (nextInt = mapping(rs[i + 1])) > nowInt) {
            ans += nextInt - nowInt;
            i += 2;
        } else {
            ans += nowInt;
            i++;
        }
    }
    return ans;
}
```

### 14. Longest Common Prefix(Easy)

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

**Example 1:**

```
Input: ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**

```
Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

**Note:**

All given inputs are in lowercase letters `a-z`.

#### Brute Force (Beat 99.85%)

```java
public String longestCommonPrefix(String[] strs) {
    if (strs.length == 0) {
        return "";
    }
    StringBuilder stringBuilder = new StringBuilder();
    String flag = strs[0];
    boolean stop = false;
    for (int i = 0; i < flag.length() && !stop; i++) {
        char flagP = flag.charAt(i);
        for (int j = 1; j < strs.length; j++) {
            String next = strs[j];
            if (next.length() - 1 < i || next.charAt(i) != flagP) {
                stop = true;
            }
        }
        if (!stop) {
            stringBuilder.append(flagP);
        }
    }
    return stringBuilder.toString();
}
```

### 15. 3Sum(Medium)

Given an array `nums` of _n_ integers, are there elements _a_, _b_, _c_ in `nums` such that _a_ + _b_ + _c_ = 0? Find all unique triplets in the array which gives the sum of zero.

**Note:**

The solution set must not contain duplicate triplets.

**Example:**

```
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

这题和 2sum 的思路有非常大的不同，2sum 是通过哈希去寻找是否有 target，而从 3sum 开始，到后面的 4sum，做法都比较 tricky，评论区里的第一解法也都是同一种思路

因为 2sum 里的元素都是不重复的，所以可以用 hash，而 3sum 开始就不能用 hash 去解了

这题难点就在于，如何去重，比如说例子里给的`nums`，里面有两个负一，如果用暴力解的话，不免会出现两个`[-1, 0, 1]`，于是暴力解也很难受

所以去重的思路，才是这题思路的关键

#### Sorted & Double Pointer

先排序，然后再前后双指针遍历解，遍历的同时直接根据排序的性质去重

比如`nums=[-2,1,1,2,0,-2,4,4,-2]`排完序之后：`nums=[-2,-2,-2,0,1,1,2,4,4]`

套一层循环 i=0，从-4 开始寻找可能的解，指针 L= i + 1，从 i 的下一位开始，R=nums.length - 1，从末尾开始：

- 如果`nums[i] + nums[L] + nums[R] > 0`，证明 R 值大了，于是 R--，继续下一轮比较；

- 如果`nums[i] + nums[L] + nums[R] < 0`，证明 L 值小了，于是 L++，继续下一轮比较；

- 如果`nums[i] + nums[L] + nums[R] = 0`，证明找到了一个可能的解，于是将这个解记录，**同时 L++，R--继续下一组迭代**

  但是还没处理完，这时候要处理重复，因为 L 和 R 同时靠拢了一步，如果下一步 L 或者 R 还是同样的值，那么这个答案不可取，L 和 R 要继续靠拢到和上一个解不一样为止，比如例子中第一组解找到的是`nums[i] = -2,nums[L]=-2,nums[R]=4`，LR 靠拢后，`nums[L]`还是`-2`，`nums[R]`还是`4`，这时候要各自考虑到和前值不一样的位置，再做考虑

- 如果`L >= R`则枚举完了

在`i`循环中也是一样的，如果**nums[i] = nums[i - 1]**，那么说明当前值可能的解在上一次循环中已经求过了，再求也是重复的，于是跳过这种情况

所以代码为：

```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i-1]) {
            continue;
        }
        int l = i+1, r = nums.length - 1, need = 0 - nums[i];
        while (l < r) {
            if (nums[l] + nums[r] == need) {
                res.add(Arrays.asList(nums[i], nums[l++], nums[r--]));
                while (r > l && nums[l] == nums[l-1]) {
                    l++;
                }
                while (r > l && nums[r] == nums[r+1]) {
                    r--;
                }
            } else if (nums[l] + nums[r] > need) {
                r--;
            } else{
                l++;
            }
        }
    }
    return res;
}
```

其中排序用的是 JDK 提供的排序，具体实现是`DualPivotQuicksort`，效率比一般的快排快很多
