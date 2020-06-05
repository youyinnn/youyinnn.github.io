---
title: Leetcode-41~45
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
date: 2019-03-20 20:03:00
series: leetcode
---



### 41. First Missing Postive(Hard)

Given an unsorted integer array, find the smallest missing positive integer.

**Example 1:**

```
Input: [1,2,0]
Output: 3
```

**Example 2:**

```
Input: [3,4,-1,1]
Output: 2
```

**Example 3:**

```
Input: [7,8,9,11,12]
Output: 1
```

**Note:**

Your algorithm should run in *O*(*n*) time and uses constant extra space.

这题难点在于线性和常数空间



#### After Sort (Beat 85%)

思路和之前处理3sum一样，为了处理重复，我们先把数组排序，然后设一个flag从1开始数就好了

```java
public int firstMissingPositive(int[] nums) {
    Arrays.sort(nums);
    int flag = 1;
    int i = 0;
    for (; i < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        int num = nums[i];
        if (num > 0) {
            if (num != flag) {
                break;
            } else {
                flag++;
            }
        }
    }
    return flag;
}
```


#### Turned

1. 数组里面有干扰数字，比如负数和0，对于负数我们直接变成整数最大值，0则可以忽略掉，这是我们第一个n时间要干的事情；

2. 第二个n时间我们遍历数组，所有出现的正数，并且在数组长度范围内的数，就将这个数对应的排序位置中的数变为负数；比如有正数4，那么就要把数组下标3上的数字取相反数；

3. 第三个n时间，如果碰到非负数，则说明这个位置没有在第二个n里被置反，所以这个位置对应的就是第一个丢失的正数；

4. 如果三个n时间没有找到解，那么解就是数组长度+1；

```java
public int firstMissingPositive(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] <= 0) {
            nums[i] = Integer.MAX_VALUE;
        }
    }
    for (int i = 0; i < nums.length; i++) {
        int abs = Math.abs(nums[i]);
        if (abs <= nums.length && abs > 0 && nums[abs - 1] > 0) {
            nums[abs - 1] *= -1;
        }
    }
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) return i + 1;
    }
    return nums.length + 1;
}
```


### 42. Trapping Rain Water(Hard)

Given *n* non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.

![img](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png)
The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.**Thanks Marcos** for contributing this image!

**Example:**

```
Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```



#### Find Logic(Beat 98.7%)

我们需要两根柱子，左，右；我们顺序遍历数组，每遇到一个0以上的柱子视为左柱子，那么右柱子是怎么决定的呢？我们多看几个例子：

```
[9,8,4,6]     [4,2,3]       [4,9,4,5,3,2]
░             ░                ░
░ ░           ░ ▓ ░            ░
░ ░           ░ ░ ░            ░
░ ░ ▓ ░       ░ ░ ░            ░
░ ░ ▓ ░                        ░ ▓ ░
░ ░ ░ ░                      ░ ░ ░ ░
░ ░ ░ ░                      ░ ░ ░ ░ ░
░ ░ ░ ░                      ░ ░ ░ ░ ░ ░
░ ░ ░ ░                      ░ ░ ░ ░ ░ ░
```

加上例子我们可以发现：

- 一旦碰到比左柱子高的柱子，这个就是右柱子，如例图中的[1,0,3]；
- 如果没有比左柱子高的柱子，剩下的柱子中最高的柱子就是右柱子，比如上面的3个例子就是；
- 下一轮右柱子就是上一轮的左柱子；

然后关于积水的计算：

- 左右柱子之间，最多能积矮柱那么高的水；
- 左右柱子之间，最长能积两柱之间那么宽水；
- 两柱之间会有石头；
- 积水：
    1. 面积：遍历两柱之间的石头，高宽乘积减去石头和就是积水；
    2. 遍历两柱之间，每次都用高减去当前的石头高，然后加到一个sum中；

于是：

```java
public int trap(int[] height) {
    int count = 0;
    for (int i = 0; i < height.length - 1;) {
        int l = height[i];
        if (l > 0) {
            int ri = i + 1;
            // 找右柱子
            for (int j = i + 1; j < height.length; j++) {
                if (height[j] > l) {
                    ri = j;
                    break;
                } else {
                    ri = height[j] > height[ri] ? j : ri;
                }
            }
            int length = Math.min(l, height[ri]);
            int trap = 0;
            // 减石头
            for (int j = i + 1; j < ri; j++) {
                trap += length - Math.min(length, height[j]);
            }
            if (trap > 0) {
                count += trap;
                i = ri;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
    return count;
}
```


### 43. Multiply Strings(Medium)

Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.

**Example 1:**

```
Input: num1 = "2", num2 = "3"
Output: "6"
```

**Example 2:**

```
Input: num1 = "123", num2 = "456"
Output: "56088"
```

**Note:**

1. The length of both `num1` and `num2` is < 110.
2. Both `num1` and `num2` contain only digits `0-9`.
3. Both `num1` and `num2` do not contain any leading zero, except the number 0 itself.
4. You **must not use any built-in BigInteger library** or **convert the inputs to integer** directly.



这题，当然你可以硬打，拆分乘法为2位数内的乘法和多位数的加法，但是效率很慢，我们来用数学解决这个问题

#### Mathematics

要点：

- n位数×m位数，结果长度是n+m；

- 把乘法看成是矩阵；

    ```
    123 x 456:
             j = 0   1   2
                 4   5   6
    i = 0    1   4   5   6       5  4  3
        1    2   8  10  12       4  3  2
        2    3  12  15  18       3  2  1
    左边是两位数相乘结果，右边是相乘结果的位数，于是123 x 456的结果可以是：
    
    位数：N  N  N  N  N  N
         0  4  5  6 15 18
               8 10 12 
                 12
    乘积缩放的篮子位置，观察ij就能看出来，位置会放在i+j+1下标的位置上，
    最后验算一下可知：
    123 x 456 = 56088 = 18 + （150+120）+（1200+1000+600）+（8000+5000）+40000
    ```

于是我们准备好篮子，把每一位的两位数相乘结果算出来，都加在篮子里，然后从篮子后面往前处理好进位就行了

```java
public String multiply(String a, String b) {
    int maxLength = a.length() + b.length();
    int[] box = new int[maxLength];
    for (int i = 0; i < a.length(); i++) {
        for (int j = 0; j < b.length(); j++) {
            char an = a.charAt(i);
            char bn = b.charAt(j);
            box[i + j + 1] += (an - '0') * (bn - '0');
        }
    }
    StringBuilder sb = new StringBuilder();
    for (int i = box.length - 1; i >= 0; i--) {
        int num = box[i];
        int left = num % 10;
        int carry = num / 10;
        if (i > 0) {
            box[i - 1] += carry;
        }
        sb.insert(0, left);
    }
    while (sb.length() > 0 && sb.charAt(0) == '0') {
        sb.delete(0, 1);
    }
    return sb.length() > 0 ? sb.toString() : "0";
}
```


### 44. Wildcard Matching(Hard)

Given an input string (`s`) and a pattern (`p`), implement wildcard pattern matching with support for `'?'` and `'*'`.

```
'?' Matches any single character.
'*' Matches any sequence of characters (including the empty sequence).
```

The matching should cover the **entire** input string (not partial).

**Note:**

- `s` could be empty and contains only lowercase letters `a-z`.
- `p` could be empty and contains only lowercase letters `a-z`, and characters like `?` or `*`.

**Example 1:**

```
Input:
s = "aa"
p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".
```

**Example 2:**

```
Input:
s = "aa"
p = "*"
Output: true
Explanation: '*' matches any sequence.
```

**Example 3:**

```
Input:
s = "cb"
p = "?a"
Output: false
Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.
```

**Example 4:**

```
Input:
s = "adceb"
p = "*a*b"
Output: true
Explanation: The first '*' matches the empty sequence, while the second '*' matches the substring "dce".
```

**Example 5:**

```
Input:
s = "acdcb"
p = "a*c?b"
Output: false
```



#### DP (Beat 70.43%)

这题和第10题类似，不同的是它的*可以是任意序列，而不是任意前面一个字符，所以首先它可以用DP去打，要领：

```
if (pc == '?') {
    dp[i][j] = dp[i - 1][j - 1];
}
if (pc == '*') {
    dp[i][j] = dp[i][j - 1] | dp[i - 1][j];
}
if (pc == sc) {
    dp[i][j] = sc == pc && dp[i - 1][j - 1];
}

于是比较简单的写出矩阵来：
s: acdcb p: a*c?b

    + a * c ? b
 +  √ × × × × ×
 a  × √ √ × × ×
 c  × × √ √ × ×
 d  × × √ × √ ×
 c  × × √ √ × ×
 b  × × √ × √ ×
```

于是：

```java
public boolean isMatch(String s, String p) {
    s = "+" + s;
    p = "+" + p;
    boolean[][] dp = new boolean[s.length()][p.length()];
    dp[0][0] = true;
    for (int i = 1; i < p.length(); i++) {
        if (p.charAt(i) == '*') {
            dp[0][i] = dp[0][i - 1];
        }
    }
    for (int i = 1; i < s.length(); i++) {
        for (int j = 1; j < p.length(); j++) {
            char sc = s.charAt(i);
            char pc = p.charAt(j);
            if (pc == '*') {
                dp[i][j] = dp[i][j - 1] | dp[i - 1][j];
            } else if (pc == '?') {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = sc == pc && dp[i - 1][j - 1];
            }
        }
    }
    return dp[s.length() - 1][p.length() - 1];
}
```
虽然按部就班地打下了这题，但是beat率不高，所以这题还有更精妙的做法，讨论区有一种线性打法，直接根据if-else来打，我觉得case太难覆盖，我自己做的话，笔试时间内可能打不出，所以不推荐；

#### DFS(Beat 100%)

参考一下究竟是怎么个dfs法：

```java
public boolean isMatch(String s, String p) {
    return dfs(s, p, 0, 0) > 1;
}

private int dfs(String s, String p, int si, int pi) {
    if (si == s.length() && pi == p.length()) {
        return 2;
    }
    if (si == s.length() && p.charAt(pi) != '*') {
        return 0;
    }
    if (pi == p.length()) {
        return 1;
    }
    if (p.charAt(pi) == '*') {
        if (pi + 1 < p.length() && p.charAt(pi + 1) == '*') {
            return dfs(s, p, si, pi + 1);
        }
        for (int i = 0; i <= s.length() - si; i++) {
            int ret = dfs(s, p, si + i, pi + 1);
            if (ret == 0 || ret == 2) {
                return ret;
            }
        }
    }
    if (s.charAt(si) == p.charAt(pi) || p.charAt(pi) == '?') {
        return dfs(s, p, si + 1, pi + 1);
    }
    return 1;
}
```



### 45. Jump Game II (Hard)

Given an array of non-negative integers, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

Your goal is to reach the last index in the minimum number of jumps.

**Example:**

```
Input: [2,3,1,1,4]
Output: 2
Explanation: The minimum number of jumps to reach the last index is 2.
    Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

这题有在[DP Again](./1flo1c0.html)做过分析，就不多说了

#### DP

``` java
public int jump(int[] nums) {
    int[] dp = new int[nums.length];
    for (int i = nums.length - 2; i >= 0; i--) {
        // one jump to the end
        if (i + nums[i] >= nums.length) {
            dp[i] = 1;
        } else {
            // jump max step if it can reach the end
            int tmp = Integer.MAX_VALUE;
            for (int j = i + 1; j <= i + nums[i]; j++) {
                if (dp[j] != Integer.MAX_VALUE) {
                    tmp = Math.min(tmp, dp[j] + 1);
                }
            }
            dp[i] = tmp;
        }
    }
    return dp[0];
}
```

#### BFS

```java
public int jump(int[] nums) {
    int jump = 0;
    int start = 0, end = 0;
    while (end < nums.length - 1) {
        jump++;
        int tmpEnd = end + 1;
        for (int i = start; i <= end; i++) {
            if (i + nums[i] > nums.length) {
                return jump;
            }
            tmpEnd = Math.max(tmpEnd, i + nums[i]);
        }
        start = end + 1;
        end = tmpEnd;
    }
    return jump;
}
```