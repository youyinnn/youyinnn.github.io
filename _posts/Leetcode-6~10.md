---
title: Leetcode-6~10
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
date: 2019-02-17 13:18:00
series: leetcode
---



### 6. ZigZag Conversion(Medium)

The string `"PAYPALISHIRING"` is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

```
P   A   H   N
A P L S I I G
Y   I   R
```

And then read line by line: `"PAHNAPLSIIGYIR"`

Write the code that will take a string and make this conversion given a number of rows:

```
string convert(string s, int numRows);
```

**Example 1:**

```
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
```

**Example 2:**

```
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:

P     I    N
A   L S  I G
Y A   H R
P     I
```

说白了就是按照行数去写N字，完了之后再从左到右从上到下的序列

#### Logical Gap Beat(99.82%)

这样的阵图是很有逻辑性的，我们多看几组图的下标就能发现逻辑：

<pre class="nhi">
以26个字母序列为例：
row=3
    A   E   I   M   Q   U   Y            00    04    08    12    16    20    24
    B D F H J L N P R T V X Z     --->   01 03 05 07 09 11 13 15 17 19 21 23 25 
    C   G   K   O   S   W                02    06    10    14    18    22
------------------------------------
row=4
    A     G     M     S     Y            00      06       12       18       24
    B   F H   L N   R T   X Z     --->   01   05 07    11 13    17 19    23 25
    C E   I K   O Q   U W                02 04   08 10    14 16    20 22 
    D     J     p     V                  03      09       15       21
------------------------------------
row=5
    A       I       Q       Y            00        08          16          24
    B     H J     P R     X Z     --->   01     07 09       15 17       23 25
    C   G   K   O   S   W                02   06   10    14    18    22
    D F     L N     T V                  03 05     11 13       19 21
    E       M       U                    04        12          20
</pre>

到这差不多就看出规律了，我们以一个**V**为单元，每次循环就处理这个V单元就好了，比如以row为3/5为例：

<pre class="nhi">
row=3
A   E   I   M   Q   U   Y   00    | 04    | 08    | 12    | 16    | 20    | 24
B D F H J L N P R T V X Z   01 03 | 05 07 | 09 11 | 13 15 | 17 19 | 21 23 | 25 
C   G   K   O   S   W       02    | 06    | 10    | 14    | 18    | 22
-----------------------------
row=5
A       I       Q       Y   00        | 08          | 16          | 24
B     H J     P R     X Z   01     07 | 09       15 | 17       23 | 25
C   G   K   O   S   W       02   06   | 10    14    | 18    22
D F     L N     T V         03 05     | 11 13       | 19 21
E       M       U           04        | 12          | 20
</pre>

**row=3时**

- 第一行和最后一行之间有4个下标间距 （4 = (3 - 1) * 2）
- 第二行之间有2个下标间距 （2 = (3 - 2) * 2）

**row=5时**

- 第一行和最后一行之间有8个下标间距 （8 = (5 - 1) * 2）
- 第二行之间有6个下标间距 （6 = (5 - 2) * 2）
- 第三行4 （4 = (5 - 3) * 2）
- 第四行2 （2 = (5 - 4) * 2）

容易看出规律，我们以行数为遍历顺序的话，设求行数为**numRow**，当前行数为**nowRow**：

- 第一行和最后一行字符之间间距都是**（numRow - 1）* 2**，我们称它为**mainGap**
- 其他行：**（numRow - nowRow）* 2**，我们称它为**minorGap**

如果只看**mainGap**的距离，那么每一行我们都会经过它，关键在于求出**minorGap**的时候，如果它小于**mainGap**，那么在下一次循环之前，也要加上它

于是代码如下：

```java
public String convert(String s, int numRows) {
    if (numRows == 1) {
        return s;
    }
    char[] chars = s.toCharArray();
    int rowsCount = 1;
    StringBuilder sb = new StringBuilder();
    int mainGap = (numRows - 1) * 2;
    while (rowsCount <= numRows) {
        int start = rowsCount - 1;
        int minorGap = (numRows - rowsCount) * 2;
        for (int i = start; i < chars.length; i += mainGap) {
            sb.append(chars[i]);
            // add minorGap's char if it's not first/last row
            if (minorGap < mainGap
                    && rowsCount < numRows
                    && i + minorGap < chars.length) {
                sb.append(chars[i + minorGap]);
            }
        }
        rowsCount++;
    }
    return sb.toString();
}
```

### 7. Reverse Integer(Easy)

Given a 32-bit signed integer, reverse digits of an integer.

**Example 1:**

```
Input: 123
Output: 321
```

**Example 2:**

```
Input: -123
Output: -321
```

**Example 3:**

```
Input: 120
Output: 21
```

**Note:**
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−2^31,  2^(31 − 1)]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

#### Ⅰ. with string

You can use only string but in java we have StringBuilder

```java
public int reverse(int x) {
    int raw = Math.abs(x);
    StringBuilder sb = new StringBuilder(raw + "");
    sb.reverse();
    if (x < 0) {
        sb.insert(0, "-");
    }
    int ans = 0;
    try {
        ans = Integer.parseInt(sb.toString());
    } catch (Exception e) {
        // ignore
    }
    return ans;
}
```
#### Ⅱ. calculate

Refer from discuss

1. No need to handle the minus sign cause **Mod** will keep it.

   e.g `-51  % 10` get  `-1`

2. Do not use **long** type in java cause **"Assume we are dealing with an environment which could only store integers"** was declare on the question

```java
public int reverse(int x) {
    int ans = 0;
    while (x != 0) {
        int bit = x % 10;
        int tmp = ans * 10 + bit;
        if ((tmp - bit) / 10 != ans) { return 0; }
        ans = tmp;
        x /= 10;
    }
    return ans;
}
```



### 8. String To Integer(Medium)

这题是傻逼题，vote第一的discuss就是喷它的，因为有太多的边角case

```java
public int myAtoi(String str) {
    int ans = 0;
    char[] chars = str.toCharArray();
    if (chars.length == 0) {
        return 0;
    }
    int start = -1, end = 0;
    for(int i = 0; i < chars.length; i++) {
        char now = chars[i];
        if (start == -1) {
            if (!Character.isWhitespace(now)) {
                if (isNumber(now) || isSign(now)) {
                    start = i;
                } else {
                    return ans;
                }
            }
        } else if (isNumber(now)) {
            end = i;
        } else {
            end = i - 1;
            break;
        }
    }
    if (start == -1 || start > end) {
        return 0;
    }
    int base = 1;
    boolean negative = false;
    if (isSign(chars[start])) {
        if (chars[start] == '-') {
            negative = true;
        }
        start++;
    }
    for (int i = end; i >= start; i--) {
        ans += (char2Number(chars[i]) * base);
        base *= 10;
    }
    if ((ans % 10 != char2Number(chars[end]) && !isSign(chars[end])) ||
            (base == 0 && chars[start] != '0')) {
        return negative ? Integer.MIN_VALUE : Integer.MAX_VALUE;
    }
    return negative ? 0 - ans : ans;
}

public boolean isNumber(char c) {
    return (c >= '0' && c <= '9');
}
public boolean isSign(char c) {
    return (c == '-' || c == '+');
}
public int char2Number(char c) {
    return c - '0';
}
```



### 9. Parlindrome Number(Easy)

Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

**Example 1:**

```
Input: 121
Output: true
```

**Example 2:**

```
Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
```

**Example 3:**

```
Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
```

**Follow up:**

Coud you solve it without converting the integer to a string?

#### Ⅰ. slide window

If we know the length of the number sequence, then we could easily pick up any single number on this sequence.

<pre class="nhi">
We have number: x = 10234
               [1] 0 2 3 4
           pick 1 = (x / 10000) % 10
           -------------------------
                1 0 [2] 3 4
           pick 2 = (x / 100) % 10
We call 10000/100 as a 'base', it descide the position of the window.
</pre>

```java
public boolean isPalindrome(int x) {
    if (x < 0) {
        return false;
    }
    int length = 1;
    int tmp = x;
    int headBase = 1;
    int tailBase = 1;
    // get length and head bse
    while (tmp >= 10) {
        length++;
        tmp /= 10;
        headBase *= 10;
    }
    // pick head and tail accoding to the base
    for (int i = 0; i < length / 2; i++) {
        int head = (x / headBase) % 10;
        int tail = (x / tailBase) % 10;
        if (head != tail) {
            return false;
        } else {
            headBase /= 10;               
            tailBase *= 10;
        }
    } 
    return true;
}
```
#### Ⅱ. just look on half

Base on offical solution:

```java
public bool IsPalindrome(int x) {
    if(x < 0 || (x % 10 == 0 && x != 0)) {
        return false;
    }
    int rev = 0;
    while(x > rev) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return x == rev || x == rev/10;
}
```



### 10. Regular Expression Matching(hard)

Given an input string (`s`) and a pattern (`p`), implement regular expression matching with support for `'.'`and `'*'`.

```
'.' Matches any single character.
'*' Matches zero or more of the preceding element.
```

The matching should cover the **entire** input string (not partial).

**Note:**

- `s` could be empty and contains only lowercase letters `a-z`.
- `p` could be empty and contains only lowercase letters `a-z`, and characters like `.` or `*`.

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
p = "a*"
Output: true
Explanation: '*' means zero or more of the precedeng element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
```

**Example 3:**

```
Input:
s = "ab"
p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".
```

**Example 4:**

```
Input:
s = "aab"
p = "c*a*b"
Output: true
Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore it matches "aab".
```

**Example 5:**

```
Input:
s = "mississippi"
p = "mis*is*p*."
Output: false
```



#### Ⅰ. Recursion

这题难就难在，如果没有一阵见血地看出用什么思想去解的话，是很难找到解法的，因为解法并不多

我开始解的时候沉迷于线性解法，去遍历`pattern`字串，试图用多个`if-else`去覆盖到所有的case，但是失败了，因为线性解法去覆盖case的话，不太可能一次性写出所有的case就算真的让你写出来了话，花的时间也非常多

那么怎么才能一阵见血呢？看你做题的sence了- -

为了方便，我们把`text` matching `pattern`简写成`text -> pattern`

根据官方给出的回溯思路，我们考虑如下几种情况：

- 如果`pattern`为""的话，这次match的结果就等同于看`text`是否为空；

- 如果我们每次只对比`text`中的第一个字符，并且比完我们就将它剔除掉的话，于是我们每次都是从一个新的子`pattern`和一个新的子`text`去继续往下进行对比，比如说`abc -> abc`，当对比完`text[0] -> pattern[0]`之后，我们下一次就从`bc -> bc`去对比；

    也就是说：`text[0, n] -> pattern[0, m]`的结果等于`text[0]->pattern[0] && text[1, n]->pattern[1, m]`

- 如果`pattern`不为空，根据上一个情况的扩展，对于`text[0]->pattern[0]`的判断，如果pattern是`.`，那么这次判断match，否则还是看text和pattern的字符是否相等；

- 对于`.*`或者`X*`（X代表一个确定的字符）的情况，假如说，`text`只剩下一个字符了，那么我们其实可以忽略掉这个2长度的pattern，因为`*`就是0到多个，比如`c -> a*c`的match结果可以看作是`c -> c`；但是如果`text`还有多个字符，我们还是得乖乖地**去腥（去*）**，比如`aac -> a*c`，的match结果，我们首先判断首字符是否在**星范围内**，如果在，那么我们可以去掉它，继续用子串和原`pattern`比较：`ac -> a*c`，一直到最后我们发现，又回到了`c -> a*c`；

``` java
public boolean isMatch(String text, String pattern) {
    if (pattern.isEmpty()) {
        return text.isEmpty();
    }
    boolean firstMatch = (!text.isEmpty() &&
            (pattern.charAt(0) == text.charAt(0) || pattern.charAt(0) == '.'));

    if (pattern.length() >= 2 && pattern.charAt(1) == '*') {
        String subPattern = pattern.substring(2);
        return (isMatch(text, subPattern) ||
                (firstMatch && isMatch(text.substring(1), pattern)));
    } else {
        return firstMatch && isMatch(text.substring(1), pattern.substring(1));
    }
}
```



#### Ⅱ. DP

DP能写出千种万种方式，只是想不想得到而已，附上我喜欢的[一种](https://leetcode.com/problems/regular-expression-matching/discuss/5651/Easy-DP-Java-Solution-with-detailed-Explanation/231235)

``` 
假如我们有：

Tn = t1t2t3...tn-1tn
Pm = p1p2p3...pm-1pm

那么：
Match(Tm, Pm) = Match(tn, pm) && Match(Tn-1, Pm-1)		(1)
Match(Ti, Pj) =   if (ti == pj || pj == '.')
                then return Match(Ti-1, Pj-1);			(2)	
                else
                    if (pj == '*')
                        if (ti != pj-1 && pj-1 != '.')
                      then return Match(Ti, Pj-2);		(3)	// no match then skip 'X*'
                      else
                        return 
                            (Match(Ti, Pj-1)) ||		(4) // char before * appears once
                            (Match(Ti-1,Pj))  ||		(5) // char before * appears more
                            (Match(Ti, Pj-2));			(6) // no match then skip 'X*'

然后有一条边界条件，Match(tn, "") = (tn == "")
```

```java
public boolean isMatch(String s, String p) {
    s = '+' + s;
    p = '+' + p;
    char[] scs = s.toCharArray();
    char[] pcs = p.toCharArray();
    boolean[][] dp = new boolean[scs.length][pcs.length];
    dp[0][0] = true;
    for (int j = 1; j < pcs.length; j++) {
        if (pcs[j] == '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }
    for (int i = 1; i < scs.length; i++) {
        for (int j = 1; j < pcs.length; j++) {
            char pj = pcs[j];
            char si = scs[i];
            if (pj == si || pj == '.') {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (pj == '*') {
                if (si != pcs[j - 1] && pcs[j - 1] != '.') {
                    dp[i][j] = dp[i][j - 2];
                } else {
                    dp[i][j] = dp[i][j - 1] || dp[i - 1][j] || dp[i][j - 2];
                }
            }
        }
    }
    return dp[scs.length - 1][pcs.length - 1];
}
```

我们如果把几个case的dp打印出来，应该会更好理解一点，有多条状态转移公式的DP，确实是难，但是这个解法有一个优雅的地方在于它在T和P的开头加上'+'来代表各自的""，从而让各下标更好处理

**Case Match("abcd", ".*bcd")**

```
	+		.		*		b		c		d		
+	true	false	true	false	false	false	
a	false	true	true	false	false	false	
b	false	false	true	true	false	false	
c	false	false	true	false	true	false	
d	false	false	true	false	false	true	
```

**Case Match("mississippi", "mis\*is\*p*.")**

``` 
	+		m		i		s		*		i		s		*		p		*		.		
+	true	false	false	false	false	false	false	false	false	false	false	
m	false	true	false	false	false	false	false	false	false	false	false	
i	false	false	true	false	true	false	false	false	false	false	false	
s	false	false	false	true	true	false	false	false	false	false	false	
s	false	false	false	false	true	false	false	false	false	false	false	
i	false	false	false	false	false	true	false	true	false	true	false	
s	false	false	false	false	false	false	true	true	false	true	true	
s	false	false	false	false	false	false	false	true	false	true	true	
i	false	false	false	false	false	false	false	false	false	false	true	
p	false	false	false	false	false	false	false	false	false	false	false	
p	false	false	false	false	false	false	false	false	false	false	false	
i	false	false	false	false	false	false	false	false	false	false	false
```

