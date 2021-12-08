---
title: Leetcode-66~70
categories:
  - algorithm
  - leetcode
tags:
  - leetcode
  - mysqrt
  - binary-question
date: 2019-04-02 22:40:00 +8
series: leetcode
---



### 66.Plus One(Easy)

Given a **non-empty** array of digits representing a non-negative integer, plus one to the integer.

The digits are stored such that the most significant digit is at the head of the list, and each element in the array contain a single digit.

You may assume the integer does not contain any leading zero, except the number 0 itself.

**Example 1:**

```
Input: [1,2,3]
Output: [1,2,4]
Explanation: The array represents the integer 123.
```

**Example 2:**

```
Input: [4,3,2,1]
Output: [4,3,2,2]
Explanation: The array represents the integer 4321.
```



#### Solution

处理carry的题目我们前面碰的多了，熟能生巧

``` java
public int[] plusOne(int[] digits) {
    boolean carry = true;
    for (int i = digits.length - 1; i >= 0; i--) {
        if (carry) {
            int tmp = digits[i] + 1;
            if (tmp >= 10) {
                digits[i] = tmp % 10;
            } else {
                digits[i] = tmp;
                carry = false;
            }
        }
    }
    if (carry) {
        int[] ans = new int[digits.length + 1];
        ans[0] = 1;
        return ans;
    } else {
        return digits;
    }
}
```



### 67.Add Binary(Easy)

Given two binary strings, return their sum (also a binary string).

The input strings are both **non-empty** and contains only characters `1` or `0`.

**Example 1:**

```
Input: a = "11", b = "1"
Output: "100"
```

**Example 2:**

```
Input: a = "1010", b = "1011"
Output: "10101"
```



#### Solution

和[MultiplyString](./11z93zc.html?hash=22be3288)一样，我们先把两数和算到长数数组中，然后再遍历长数数组进行进位的处理

```java
public String addBinary(String a, String b) {
    if (a.length() < b.length()) {
        return addBinary(b, a);
    }
    char[] ac = a.toCharArray();
    char[] bc = b.toCharArray();
    int ai = ac.length - 1;
    int bi = bc.length - 1;
    while (bi >= 0) {
        ac[ai] = ac[ai] == '0'
                // aci = 0
                ? bc[bi]
                // aci = 1
                : (bc[bi] == '0'
                    // bci = 0
                    ? '1'
                    // bci = 1
                    : '2');
        bi--;
        ai--;
    }
    StringBuilder sb = new StringBuilder();
    boolean carry = false;
    for (int i = ac.length - 1; i >= 0; i--) {
        if (carry) {
            if (ac[i] == '0') {
                ac[i] = '1';
                carry = false;
            } else if (ac[i] == '1') {
                ac[i] = '2';
            } else if (ac[i] == '2'){
                ac[i] = '3';
            }
        }
        if (ac[i] == '2') {
            ac[i] = '0';
            carry = true;
        } else if (ac[i] == '3') {
            ac[i] = '1';
            carry = true;
        }
        sb.insert(0, ac[i]);
    }
    if (carry) {
        sb.insert(0, '1');
    }
    return sb.toString();
}
```

 

### 68.Text Justification(Hard)

Given an array of words and a width *maxWidth*, format the text such that each line has exactly *maxWidth*characters and is fully (left and right) justified.

You should pack your words in a greedy approach; that is, pack as many words as you can in each line. Pad extra spaces `' '` when necessary so that each line has exactly *maxWidth* characters.

Extra spaces between words should be distributed as evenly as possible. If the number of spaces on a line do not divide evenly between words, the empty slots on the left will be assigned more spaces than the slots on the right.

For the last line of text, it should be left justified and no **extra** space is inserted between words.

**Note:**

- A word is defined as a character sequence consisting of non-space characters only.
- Each word's length is guaranteed to be greater than 0 and not exceed *maxWidth*.
- The input array `words` contains at least one word.

**Example 1:**

```
Input:
words = ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16
Output:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
```

**Example 2:**

```
Input:
words = ["What","must","be","acknowledgment","shall","be"]
maxWidth = 16
Output:
[
  "What   must   be",
  "acknowledgment  ",
  "shall be        "
]
Explanation: Note that the last line is "shall be    " instead of "shall     be",
             because the last line must be left-justified instead of fully-justified.
             Note that the second line is also left-justified becase it contains only one word.
```

**Example 3:**

```
Input:
words = ["Science","is","what","we","understand","well","enough","to","explain",
         "to","a","computer.","Art","is","everything","else","we","do"]
maxWidth = 20
Output:
[
  "Science  is  what we",
  "understand      well",
  "enough to explain to",
  "a  computer.  Art is",
  "everything  else  we",
  "do                  "
]
```



#### Solution

这题难，难就难在题解的步骤多，虽然这题争议很大，但是这题还挺多公司喜欢出的

首先我们要来看一下标准解的条件：

- 每一行尽可能的吃能吃的单词；（Greedy）
- 每一行单词之间的空格要分布均匀，如果有不均匀，那么左边的空格要比右边的空格多；（full-justify）
- 如果一行只有一个单词，那么它左对齐；（left-justify）
- 最后一行无论多少单词，都是左对齐；（left-justify）



我们的步骤可以简单地理解为：

1. 从剩下的单词中，尽可能地吃能吃的单词；`findRight`
2. 调整当前吃下的单词的空格；`justify`
3. 将调整好的单词添加到结果；
4. 如果还有剩下的单词，重复步骤1；

```java
 public List<String> fullJustify(String[] words, int maxWidth) {
    int left = 0; List<String> result = new ArrayList<>();
    
    while (left < words.length) {
        int right = findRight(left, words, maxWidth);
        result.add(justify(left, right, words, maxWidth));
        left = right + 1;
    }
    
    return result;
}

private int findRight(int left, String[] words, int maxWidth) {
    int right = left;
    int sum = words[right++].length();
    
    while (right < words.length && (sum + 1 + words[right].length()) <= maxWidth)
        sum += 1 + words[right++].length();
        
    return right - 1;
}

private String justify(int left, int right, String[] words, int maxWidth) {
    if (right - left == 0) return padResult(words[left], maxWidth);
    
    boolean isLastLine = right == words.length - 1;
    int numSpaces = right - left;
    int totalSpace = maxWidth - wordsLength(left, right, words);
    
    String space = isLastLine ? " " : blank(totalSpace / numSpaces);
    int remainder = isLastLine ? 0 : totalSpace % numSpaces;
    
    StringBuilder result = new StringBuilder();
    for (int i = left; i <= right; i++)
        result.append(words[i])
            .append(space)
            .append(remainder-- > 0 ? " " : "");
    
    return padResult(result.toString().trim(), maxWidth);
}

private int wordsLength(int left, int right, String[] words) {
    int wordsLength = 0;
    for (int i = left; i <= right; i++) wordsLength += words[i].length();
    return wordsLength;
}

private String padResult(String result, int maxWidth) {
    return result + blank(maxWidth - result.length());
}

private String blank(int length) {
    return new String(new char[length]).replace('\0', ' ');
}
```


### 69.Sqrt(x) (Easy) 

Implement `int sqrt(int x)`.

Compute and return the square root of *x*, where *x* is guaranteed to be a non-negative integer.

Since the return type is an integer, the decimal digits are truncated and only the integer part of the result is returned.

**Example 1:**

```
Input: 4
Output: 2
```

**Example 2:**

```
Input: 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since 
             the decimal part is truncated, 2 is returned.
```



#### Binary

这题虽然是简单题，但我也还是在弯路上走了很久

题目给到提示了：

1. **Try exploring all integers.**
2. **Use the sorted property of integers to reduced the search space.**

这两条提示我开始没看出来什么，后面发现- -，原来都已经告诉你标准的二分法思路了

于是我们要求X的开根号，可以这样想：

- 答案肯定在`[1~X]`之间；
- 二分的思路找最接近X^2的数，因为毕竟是整数结果；

```java
public int mySqrt(int x) {
    int low = 1, high = x, mid;
    while (low < high) {
        mid = low + (high - low) / 2;
        if (mid == x / mid) {
            return mid;
        } else if (mid > x / mid) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return low > x / low ? low - 1 : low;
}
```


### 70.ClimbingStairs(Easy)

You are climbing a stair case. It takes *n* steps to reach to the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Note:** Given *n* will be a positive integer.

**Example 1:**

```
Input: 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
```

**Example 2:**

```
Input: 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

#### Solution

``` java
public int climbStairs(int n) {
    int a = 1, b = 0;
    int ans = 0;
    for (int i = 1; i <= n; i++) {
        ans = a + b;
        b = a;
        a = ans;
    }
    return ans;
}
```

