---
title: DP Again
categories:
- note
- algorithm
tags:
- dp
date: 2019-03-22 14:14:00 +8
---



### Introduction

我们先分析Leetcode的55题，是从45题Jump Game II 跳过来的，因为这题比II要简单一点，只需要判断序列是否能jump到终点就行，而45题是要找最小的jump次数；

为什么这题要拿出篇幅来分析？因为这题包含了很多东西： 

- **纯回溯**
- **纯回溯`--->`回溯Top-down DP**
- **回溯Top-Down DP`--->`迭代Bottom-up DP**
- **迭代Bottom-up DP`--->`线性贪婪**

分析完之后你会发现，原来算法可以这么美妙😃

### Jump Game

Given an array of non-negative integers, you are initially positioned at the first index of the array.

Each element in the array represents your maximum jump length at that position.

**Determine if you are able to reach the last index.**

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
             jump length is 0, which makes it impossible to reach the last index.:
```

#### 1. Backtracking

无论是I还是II，我最开始只能想到的就是回溯法，而回溯法用于解这两题是会炸的，因为时间复杂度和递归栈太多了，单作为DP的第一步，我们还是先把回溯写出来

```java
public boolean canJump(int[] nums) {
    return backtracking(nums, 0);
}

private boolean backtracking(int[] nums, int now) {
    if (now == nums.length - 1) {
        return true;
    } else {
        // 从允许的最大跳数开始跳
        int maxStep = nums[now];
        if (now + maxStep >= nums.length) {
            maxStep = nums.length - now - 1;
        }
        for (int i = maxStep; i >= 1; i--) {
            if (backtracking(nums, now + i)) {
                return true;
            }
        }
    }
    return false;
}
```

**Complexity Analysis**

- Time complexity : **O(2^n)**. There are **2^n** (upper bound) ways of jumping from the first position to the last, where *n* is the length of array `nums`. For a complete proof, please refer to Appendix A.
- Space complexity : **O(n)**. Recursion requires additional memory for the stack frames. 

#### 2. Memorization: DP Top-down

也许你已经意识到了，我们仅仅是想知道每一个位置是否能跳到最后一格而已，但是某个位置可能会有从不同地方跳过来的，如果第一次跳过来的时候，这时候肯定不知道这个位置能不能到达，然后从这个位置继续往下跳的时候就能回溯出一个结果来，如果我们将这个结果记录下来的话，那么第二次有从其他地方跳过来的时候，我们就知道这个位置往下走到底是个什么结果，这样就不必再继续往下跳然后等回溯了；

于是我们将每个位置的回溯结果记忆化：能到终点代表***GOOD***、不能到终点代表***BAD***、没尝试过代表***UNKNOWN***

比如Leetcode上的例子：

An example of a memorization table for input array `nums = [2, 4, 2, 1, 0, 2, 0]` can be seen in the diagram below. We write **G** for a *GOOD* position and **B** for a *BAD* one. We can see that we cannot start from indices 2, 3 or 4 and eventually reach last index (6), but we can do that from indices 0, 1, 5 and (trivially) 6.

| Index | 0    | 1    | 2    | 3    | 4    | 5    | 6    |
| ----- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| nums  | 2    | 4    | 2    | 1    | 0    | 2    | 0    |
| memo  | G    | G    | B    | B    | B    | G    | G    |

**Steps**

1. Initially, all elements of the `memo` table are ***UNKNOWN***, except for the last one, which is (trivially) ***GOOD*** (it can reach itself)
2. Modify the backtracking algorithm such that the recursive step first checks if the index is known (***GOOD***/ ***BAD***)
   1. If it is known then return *True* / *False*
   2. Otherwise perform the backtracking steps as before
3. Once we determine the value of the current index, we store it in the `memo` table

``` java
public class Solution {
    enum Index {
        GOOD, BAD, UNKNOWN
    }
    Index[] memo;
    public boolean canJumpFromPosition(int position, int[] nums) {
        if (memo[position] == Index.BAD) {
            return false;
        } else if (memo[position] == Index.GOOD) {
            return true;
        } else {
            int maxStep = Math.min(nums[position], nums.length - position - 1);
            for (int i = maxStep; i > 0; i--) {
                if (canJumpFromPosition(position + i, nums)) {
                    memo[position + maxStep] = Index.GOOD;
                    return true;
                }
            }
            memo[position] = Index.BAD;
            return false;
        }
    }

    public boolean canJump(int[] nums) {
        memo = new Index[nums.length];
        for (int i = 0; i < nums.length; i++) {
            memo[i] = Index.UNKNOWN;
        }
        memo[nums.length - 1] = Index.GOOD;
        return canJumpFromPosition(0, nums);
    }
}
```

**Complexity Analysis**

- Time complexity : **O(n^2)** For every element in the array, say `i`, we are looking at the next `nums[i]` elements to its right aiming to find a *GOOD* index. `nums[i]` can be at most *n*, where *n* is the length of array `nums`.
- Space complexity : **O(2n) =O(n)**. First n originates from recursion. Second n comes from the usage of the memo table. 

送算减少了很多的回溯了，时间复杂度也从2的n次方降到n的2次方了，这回提交到Leetcode，打了11.11%

#### 3. Memorization: DP Bottom-up

上篇练习过挺多DP的，但是都没仔细研究过**自顶向下**和**自底向上**，正好借这题来分析分析

我们的问题，若是要从一头到另一头，比如这一题，需要从起点跳到终点，然后从终点回溯回来（也许是跳到了之前回溯好了的结果），这样才能知道结果，形式化的想象一下，我们主动地发送请求到服务端，然后服务端返回结果，这是一个过去/回来的过程；

如果我们能直接从服务端返回结果，那么就少花一半以上的effort，也就是说，我们可以从终点直接往回走！

因为我们起点部分的点的结果，都是从终点附近的后半段点的结果递归回来的，我们这样做是提前从后半段算回结果

于是我们可以通过两个for循环，消除回溯调用栈

``` java
enum Index {
    GOOD, BAD, UNKNOWN
}

public class Solution {
    public boolean canJump(int[] nums) {
        Index[] memo = new Index[nums.length];
        for (int i = 0; i < nums.length; i++) {
            memo[i] = Index.UNKNOWN;
        }
        memo[nums.length - 1] = Index.GOOD;

        for (int i = nums.length - 2; i >= 0; i--) {
            int maxStep = Math.min(nums[i], nums.length - i - 1);
            // 从当前position的第一步开始
            for (int j = i + 1; j <= i + maxStep; j++) {
                if (memo[j] == Index.GOOD) {
                    memo[i] = Index.GOOD;
                    break;
                }
            }
        }

        return memo[0] == Index.GOOD;
    }
}
```

**Complexity Analysis**

- Time complexity : **O(n^2)**. For every element in the array, say `i`, we are looking at the next `nums[i]` elements to its right aiming to find a *GOOD* index. `nums[i]` can be at most *n*, where *n* is the length of array `nums`.
- Space complexity : **O(n)**. This comes from the usage of the memo table. 

我们又优化了一下DP，这次打了30.77%，似乎还不错，再看看能不能再有什么优化的地方



#### 4. Refine The DP

如果我们减负去很多题目以外的概念的话，我们将会得到一个很简单的Memo模型：和自底向上一样，只不过我们不需要考虑什么***UNKNOWN***

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
这次打了34.76%，别看和上面的没提升多少，相比之下这已经减少了1倍以上的耗时了，我们似乎已经达到了这道题DP的极限了，再靠DP的思维已经无法再进行优化了，这时候我告诉你，差一步你就能将这个DP转为线性解法，你可能会崩溃



#### 5. Greedy

从上面的DP我们可以发现，每当我们的到达一个新的位置（i）的时候，它就会往后找，找到一个GOOD就break掉，于是我们就认为这个新位置也是GOOD，而这个被找到的GOOD，就是当前新位置能reach到的第一个GOOD，因为一旦reach到这个GOOD，那么其他case就不比再考虑了，所以我们才break；

| Index | 0    | 1    | 2    | 3    | 4    | 5    | 6    |
| ----- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| nums  | 9    | 4    | 2    | 1    | 0    | 2    | 0    |
| memo  | U    | G    | B    | B    | B    | G    | G    |

那么如果说，我们每次都记录最后的GOOD的位置，于是我们仅仅需要计算，**当前位置能不能reach到这个GOOD**就行了，而这一步甚至不需要迭代，只要当前位置能跳的距离大于等于这个GOOD的位置就好了，于是我们可以从后往前线性地得到题解：

``` java
public boolean canJump(int[] nums) {
    int lastPos = nums.length - 1;
    for (int i = nums.length - 1; i >= 0; i--) {
        if (i + nums[i] >= lastPos) {
            lastPos = i;
        }
    }
    return lastPos == 0;
}
```



### Jump Game II

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

#### 1. Backtracking - O(2^n)

不多BB

``` java
public int jump(int[] nums) {
    return dfs(nums, 0, 0, Integer.MAX_VALUE);
}

private int dfs(int[] nums, int now, int jump, int minJump) {
    if (jump >= minJump) {
        return minJump;
    }
    if (now == nums.length - 1) {
        return Math.min(jump, minJump);
    } else {
        int subJump = Integer.MAX_VALUE;
        for (int i = 1; i <= nums[now] && now + i < nums.length; i++) {
            subJump = Math.min(dfs(nums, now + i, jump + 1, minJump), subJump);
        }
        return Math.min(subJump, minJump);
    }
}
```

不用多想，时间复杂度爆掉了



#### 2. DP Bottom-up - O (n^2)

```java
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



#### 3. BFS - O (n)

参考自：[10-lines C++ (16ms) / Python BFS Solutions with Explanations](https://leetcode.com/problems/jump-game-ii/discuss/18019/10-lines-C%252B%252B-(16ms)-Python-BFS-Solutions-with-Explanations)

如果我们仅观察步数的增长的话，我们其实能够把数组视为一棵以跳数来分层的数结构，这也是这道题能够用广度优先搜索来思考的关键点

比如`nums = [2, 3, 1, 1, 4]`，第一层是我们的起点`2`，它能够到达的下一层数字有`3,1`，而`3,1`的下一跳能够到达的是`1,4`如此一来我们仅需要跳2层就能够到达终点了；

再比如`nums = [2, 6, 5, 2, 3, 7, 4, 9, 8, 2, 1, 1]`，第一层`2`，第二层`6, 5`，第三层`2,3,7,4,9`，因为最多能从`i = 1, nums[1] = 6`跳到`nums[1 + 6] = nums[7] = 9`，然后第三层的第一个数必定是第二层结尾的下一个数，以此类推第四层`2, 1, 1`

```java
public int jump(int[] nums) {
    int jump = 0;
    int start = 0, end = 0;
    // when end reach the final index
    // that means we finish the jump
    while (end < nums.length - 1) {
        // jump first
        jump++;
        // at least one position on next floor
        int tmpEnd = end + 1;
        for (int i = start; i <= end; i++) {
            // hit the final straight
            if (i + nums[i] > nums.length) {
                return jump;
            }
            tmpEnd = Math.max(tmpEnd, i + nums[i]);
        }
        // visit next floor
        start = end + 1;
        end = tmpEnd;
    }
    return jump;
}
```



### Edit Distance

Given two words *word1* and *word2*, find the minimum number of operations required to convert *word1* to *word2*.

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



#### DP Top-down For Edit Distance

这题，乍一看一脸懵逼，咋还有3种情况！咋还随便什么位置都能有这三种情况！怎么玩！用什么思路！

思考几分钟后无果，果断去讨论区找思路，然后看到高评DP解，醍醐灌顶- -

简单来说，虽然对比到有不同有**3**种情况，但是我们还是可以按照顺序来给两个word做一个矩阵，于是熟悉的操作就来了，

``` java
a = ac, b = ae
 
     j = 0 1
         a e
i = 0 a  0 1
    1 c  1 1
    
我们看到，当我们走到i = 1，j = 1的时候，我们有3种选择：
1. 直接替换，于是操作数在a -> a的基础上+1；
2. 删除c，我们在ac -> a完成之后的基础上，继续进行a -> ae；
3. 插入e，我们在ac -> aec完成之后的基础上，继续进行aec -> ae；

（上面这一套是巨难理解的地方）

于是在这3个选择中选最小值
```

矩阵都来了，dp就完事了，于是我们可以想象一下状态转移公式：

``` java
String a,b

F(i, j) = {
	if a.charAt(i) == b.charAt(j)
		dp[i][j] = dp[i - 1][j - 1];
	else
        dp[i][j] = min of {
            dp[i - 1][j - 1],	// replace
            dp[i][j - 1],		// insert
            dp[i - 1][j]		// delete
        } + 1
}

base case：
	dp[i][0] = i;
	dp[0][j] = j;
```

于是代码为：

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



#### DP Bottom-up + Backtracking

我们还可以用回溯的形式去计算dp，也就是说以自底向上的思路去求解

```java
public int minDistance(String a, String b) {
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



### New 21 Game

Alice plays the following game, loosely based on the card game "21".

Alice starts with 0 points, and draws numbers while she has less than K points.  During each draw, she gains an integer number of points randomly from the range [1, W], where W is an integer.  Each draw is independent and the outcomes have equal probabilities.

Alice stops drawing numbers when she gets K or more points.  What is the probability that she has N or less points?

Example 1:

> Input: N = 10, K = 1, W = 10
> Output: 1.00000
> Explanation:  Alice gets a single card, then stops.

Example 2:

> Input: N = 6, K = 1, W = 10
> Output: 0.60000
> Explanation:  Alice gets a single card, then stops.
> In 6 out of W = 10 possibilities, she is at or below N = 6 points.

Example 3:

> Input: N = 21, K = 17, W = 10
> Output: 0.73278
> Note:
>
> 0 <= K <= N <= 10000
> 1 <= W <= 10000
> Answers will be accepted as correct if they are within 10^-5 of the correct answer.
> The judging time limit has been reduced for this question.

#### DP Top-down For 21 Game

这题刚上手确实过于难，看了官方题解后才能有比较清晰的了解。

首先我们需要理解题中的3个值：

- N值：获胜目标分，想要获胜的话，我们的积分就必须低于等于N；
- K值：停抽分，一旦我们最后一手牌抽到再累积积分超过K值，就停止抽牌，否则必须再抽一张；
- W值：牌面最大分值，我们抽牌能够获取【0~W】值的积分；
- 起始积分：0分；

然后我们再来分析例子：

1. K为1，意味着我们最多只能抽一次牌，最多的积分只能为1~10分，总积分低于等于N值（10）的概率为100%；
2. K为1，意味着我们最多只能抽一次牌，最多的积分只能为1~10分，总积分低于等于N值（6）的概率为60%；

再来分析例3，K为17时，我们看最后只能抽一手牌的情况，也就是积分为16的时候，这时候我们最好一手抽出的积分情况为：

``` graph
┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐┌-----┐
| ... ||  16 ||  17 ||  18 ||  19 ||  20 ||  21 ||  22 ||  23 ||  24 ||  25 ||  26 | <--- 总积分
└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘└-----┘
                 1      1      1      1      1      0      0      0      0      0    <--- 是否获胜
```

于是我们可以知道在积分等于16的时候，获胜的概率：

我们设*f(x)*，为积分为x的时候，获胜的概率，于是有

$$
\begin{aligned}
f(16) &= \frac {1} {10} \cdotp (1 + 1+ 1+ 1+ 1 + 0 + 0 + 0 + 0 + 0) \\\\ 
&= \frac {5} {10} = 0.5
\end{aligned}
$$

并且：

$$
f(17) = f(18) = f(19)  = f(20)  = f(21)  = 1 \\\\  f(22) = f(23) = f(24)  = f(25)  = f(26)  = 0
$$

 于是我们可以得到初步的状态转移方程：

$$
\begin{aligned} f(x) &= \frac {1} {W} \cdotp (f(x + 1) + f(x + 2) + \dotsb + f(x + W)) \\\\  f(x - 1) &= \frac {1} {W} \cdotp (f(x) + f(x + 1) + \dotsb + f(x + W - 1)) \\\\ \vdots \\\\ f(0) &= \frac {1} {W} \cdotp (f(1) + f(2) + \dotsb + f(W)) \end{aligned}
$$

到这里为止，其实我们已经能够写出题解了，但是我们要是以高中生的眼光来看上面的公式，我们不难发现，后一项和前一项的公式中其实有部分个结果是有重复的部分，*f(x)*和*f(x - 1)*中有重叠的*f(x + 1) + ... + f(x + W - 1))*，于是我们可以两式相减来简化一下：

$$
\begin{aligned} f(x) - f(x - 1) &= \frac {1} {W} \cdotp (\bcancel{f(x + 1)} + \bcancel{f(x + 2)} + \bcancel{\dotsb} + f(x + W)) \\\\ &\quad- \frac {1} {W} \cdotp (f(x) + \bcancel{f(x + 1)} + \bcancel{\dotsb} + \bcancel{f(x + W - 1)}) \\\\ &= \frac {1} {W} \cdotp (f(x + W) - f(x)) \end{aligned}
$$

于是有：

$$
f(x)  - f(x - 1)  = \frac {1} {W} \cdotp (f(x + W) - f(x))
$$

到这里有两个化简选择：

1. 如果*f(x - 1)*右移：

   $$
   f(x) = \frac {1} {W} \cdotp (f(x + W) - f(x))  - f(x - 1)
   $$

   这样无法求解，因为我们是从后往前推到的转移公式，最终是要推导道*f(0)*，我们希望的是要有：

   $$
   f(x) = C \cdot f(x + 1) + k
   $$

   这样的公式，这样我们才能倒序循环，从后一项推出前一项的值，观察上面的化简式可以发现，式中有3个高一项的值，一个矮一项的值，我们把高的都放右边，矮的单独放左边，于是有第二种化简

2. *f(x - 1)*右移后，原式右边左移，最后左右翻转一下：
$$
   \begin{aligned} f(x - 1) &= f(x) -  \frac {1} {W} \cdotp (f(x + W) - f(x)) \\\\ f(x) &= f(x + 1) -  \frac {1} {W} \cdotp (f(x + 1 + W) - f(x + 1)) \end{aligned}
   $$

上式就是我们最终得出的简化的通项公式，然后我们兴高采烈地写出题解：

``` java
public double new21Game(int n, int k, int w) {
    if (k == 0) return 1.0;
    double[] dp = new double[k + w + 1];
    for (int i = k; i <= k + w - 1 && i <= n; i++) {
        dp[i] = 1.0;
    }
    for (int i = k - 1; i >= 0; i--) {
        dp[i] = dp[i + 1] - (dp[i + w + 1] - dp[i + 1]) / w;
    }
    return dp[0];
}
```

结果爆炸，这到底是为什么呢？演算一下，我们发现*dp[16]*居然算出1.1000000，显然和事实的0.5不符，我们假设化简后通项公式不适用于*dp[K-1]*，那么我们需要先计算好这个值，再从*dp[K-2]*，开始去尝试，那么*dp[K-1]*等于多少呢？

我们在得到16分的时候，距离21分还有10张牌里有5种赢的可能，那就是21-16+1，也就是*N-K+1*，而如果说这时候W等于3，那么就最多只有3张牌里有3种赢的机会，所以我们可以得出公式：
$$
f(K - 1) = \frac {1} {W} \cdot min(N-K+1, W)
$$
于是我们最终的代码为：

``` java
public double new21Game(int n, int k, int w) {
    if (k == 0) return 1.0;
    double[] dp = new double[k + w + 1];
    for (int i = k; i <= k + w - 1 && i <= n; i++) {
        dp[i] = 1.0;
    }
    dp[k - 1] = 1.0 * Math.min(n - k + 1, w) / w;
    for (int i = k - 2; i >= 0; i--) {
        dp[i] = dp[i + 1] - (dp[i + w + 1] - dp[i + 1]) / w;
    }
    return dp[0];
}
```

