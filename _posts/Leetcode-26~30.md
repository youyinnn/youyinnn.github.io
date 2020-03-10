---
title: Leetcode-26~30
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
date: 2019-03-09 16:21:00
series: leetcode
---



### 26. Remove Duplicated From Sorted Array(Easy)

Given a sorted array *nums*, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each element appear only *once* and return the new length.

Do not allocate extra space for another array, you must do this by **modifying the input array in-place** with O(1) extra memory.

**Example 1:**

```
Given nums = [1,1,2],

Your function should return length = 2, with the first two elements of nums being 1 and 2 respectively.

It doesn't matter what you leave beyond the returned length.
```

**Example 2:**

```
Given nums = [0,0,1,1,1,2,2,3,3,4],

Your function should return length = 5, with the first five elements of nums being modified to 0, 1, 2, 3, and 4 respectively.

It doesn't matter what values are set beyond the returned length.
```

**Clarification:**

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by **reference**, which means modification to the input array will be known to the caller as well.

Internally you can think of this:

```java
// nums is passed in by reference. (i.e., without making a copy)
int len = removeDuplicates(nums);

// any modification to nums in your function would be known by the caller.
// using the length returned by your function, it prints the first len elements.
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```

#### Brute Force

```java
public int removeDuplicates(int[] nums) {
    int len = 0;
    int range = 0, set = 0;
    for (int i = 0; i < nums.length; i++) {
        if (range < nums.length - 1 &&
            nums[range] == nums[range + 1]) {
            range++;
        } else {
            nums[set] = nums[range];
            set++;
            range++;
            len++;
        }
    }
    return len;
}
```



### 27. Remove Element(Easy)

Given an array *nums* and a value *val*, remove all instances of that value [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) and return the new length.

Do not allocate extra space for another array, you must do this by **modifying the input array in-place** with O(1) extra memory.

The order of elements can be changed. It doesn't matter what you leave beyond the new length.

**Example 1:**

```
Given nums = [3,2,2,3], val = 3,

Your function should return length = 2, with the first two elements of nums being 2.

It doesn't matter what you leave beyond the returned length.
```

**Example 2:**

```
Given nums = [0,1,2,2,3,0,4,2], val = 2,

Your function should return length = 5, with the first five elements of nums containing 0, 1, 3, 0, and 4.

Note that the order of those five elements can be arbitrary.

It doesn't matter what values are set beyond the returned length.
```

**Clarification:**

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by **reference**, which means modification to the input array will be known to the caller as well.

#### Brute Force

```java
public int removeElement(int[] nums, int val) {
    int len = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != val) {
            nums[len++] = nums[i];   
        }
    }
    return len;
}
```
### 28. Implement strStr() (Easy)

Implement [strStr()](http://www.cplusplus.com/reference/cstring/strstr/).

Return the index of the first occurrence of needle in haystack, or **-1** if needle is not part of haystack.

**Example 1:**

```
Input: haystack = "hello", needle = "ll"
Output: 2
```

**Example 2:**

```
Input: haystack = "aaaaa", needle = "bba"
Output: -1
```

**Clarification:**

What should we return when `needle` is an empty string? This is a great question to ask during an interview.

For the purpose of this problem, we will return 0 when `needle` is an empty string. This is consistent to C's [strstr()](http://www.cplusplus.com/reference/cstring/strstr/) and Java's [indexOf()](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#indexOf(java.lang.String)).

这题其实就是字符串匹配，所以没什么多说的，要么暴力解要么kmp，比较遗憾的是，Leetcode的case不够多，于是暴力解的Runtime居然比KMP解的Runtime还要快

#### Brute Force - O(n \* m)

```java
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) {
        return 0;
    }
    char[] t = haystack.toCharArray();
    char[] p = needle.toCharArray();
    int n = t.length;
    int m = p.length;
    for (int i = 0; i <= n - m; i++){
        int j = 0;
        while(j < m && p[j] == t[i + j]){
            j++;
            if (j == m) return i;
        }
    }
    return -1;
}
```
#### KMP - O(n + m)

``` java
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) {
        return 0;
    }
    return kmp(haystack.toCharArray(), needle.toCharArray());
}

private int kmp(char[] t, char[] p) {
    int[] next = nextVal(p);
    int i = 0;
    int j = 0;
    while (i < t.length && j < p.length) {
        if (j == -1 || t[i] == p[j]) {
            // 有匹配就++
            i++;
            j++;
        } else {
            // 否则就按照next去移位j
            j = next[j];
        }
    }
    if (j == p.length) {
        return i - j;
    } else {
        return -1;
    }
}
    
public int[] nextVal(char[] p) {
    int[] nextVal = new int[p.length];
    int j = 0;
    int k = -1;
    nextVal[0] = -1;
    while (j < p.length - 1) {
        if (k == -1 || p[j] == p[k]) {
            j++;
            k++;
            if (p[j] != p[k]) {
                nextVal[j] = k;
            } else {
                nextVal[j] = nextVal[k];
            }
        } else {
            k = nextVal[k];
        }
    }
    return nextVal;
}
```



### 29. Divide Two Integer (Medium)

Given two integers `dividend` and `divisor`, divide two integers without using multiplication, division and mod operator.

Return the quotient after dividing `dividend` by `divisor`.

The integer division should truncate toward zero.

**Example 1:**

```
Input: dividend = 10, divisor = 3
Output: 3
```

**Example 2:**

```
Input: dividend = 7, divisor = -3
Output: -2
```

**Note:**

- Both dividend and divisor will be 32-bit signed integers.
- The divisor will never be 0.
- Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 231 − 1 when the division result overflows.

不能用乘除符号、不能用Long，行吧，用位运算试试，两倍两倍地运算，总比暴力一个一个的减要快多了

但是怎么说，这题也是垃圾题，500+👍，2700+的:thumbsdown:

#### Bit operation (Beat 100%)

```java
public int divide(int dividend, int divisor) {       
    if(dividend ==  Integer.MIN_VALUE && divisor == -1){
        return Integer.MAX_VALUE;
    }
    
    boolean isNeg = (dividend < 0) ^ (divisor < 0);
    if(dividend > 0) dividend = -dividend;
    if(divisor > 0) divisor = -divisor;
       
    return isNeg? -div(dividend, divisor) : div(dividend, divisor);
}
public int div(int divid, int divis){
    if(divid > divis) return 0;
    int curSum = divis << 1, prevSum = divis, q = 1;
    
    while(divid <= curSum && curSum < prevSum){
        prevSum = curSum;
        curSum <<= 1; q <<= 1;
    }
    return q + div(divid - prevSum, divis);
}
```



### 30. Substring with Concatenation of All Words(Hard !!)

You are given a string, **s**, and a list of words, **words**, that are all of the same length. Find all starting indices of substring(s) in **s** that is a concatenation of each word in **words** exactly once and without any intervening characters.

**Example 1:**

```
Input:
  s = "barfoothefoobarman",
  words = ["foo","bar"]
Output: [0,9]
Explanation: Substrings starting at index 0 and 9 are "barfoor" and "foobar" respectively.
The output order does not matter, returning [9,0] is fine too.
```

**Example 2:**

```
Input:
  s = "wordgoodgoodgoodbestword",
  words = ["word","good","best","word"]
Output: []
```

这题，变态难，首先words能全排列出n！种pattern，如果这题用全排列去做，然后每个排列去indexOf，那肯定TLE，先不说indexOf的效率，就是非递归的全排列，一时半会也写不出来，递归全排列绝壁TLE

不用全排列，那么我们从概率的角度来思考一下，假如我们把全排列的一个解称为一个**pattern**

从第二个例子我们可以知道，一个可能的**pattern**必然包含所有单词出现的频数；这是第一个关键点；

第二个点就是，我们处理字符串匹配的时候，不免会具象化一个滑动窗口出来，这个滑动窗口阔着s串中的一个和**pattern**一样长的子串；

那么一个明显的思路是：我们知道words中的单词都是一样长的，假如说窗口中的子串，从头开始每个一个word长度，都有一个单词匹配到words中的word，而且我们可以维护一个临时的words频数计数器，每匹配到一个单词就增加这个频数计数

于是到最后就只会有三种可能：

1. 窗口中的某个word并没有在words中记过频数；
2. 窗口中的某个word临时出现的频数超过words中记过频数；
3. 窗口中最后一个word都没有出现上面两个可能；那么这就是一个解！

于是我们处理问题的关键就在于，如何**避免重复的单词对比而滑动窗口**

其实我自己想是已经想到了频数记录，然后滑动窗口了，但是我只能i++地滑动窗口，效率慢了许多，先放上我的解

#### My Solution (550+ms Beat 9.0%)

```java
public List<Integer> findSubstring(String s, String[] words) {
    LinkedList<Integer> ans = new LinkedList<>();
    if (words.length == 0) {
        return ans;
    }
    int wordLength = words[0].length();
    HashMap<String, Integer> countMap = new HashMap<>(words.length);
    int count = 0;
    for (String word : words) {
        Integer integer = countMap.get(word);
        if (integer != null) {
            countMap.put(word, ++integer);
        } else {
            countMap.put(word, 1);
        }
        count++;
    }

    for (int i = 0; i < s.length() - wordLength + 1; i++) {
        String first = s.substring(i, i + wordLength);
        Integer firstCount = countMap.get(first);
        int tmpCount = count;
        if (firstCount != null) {
            HashMap<String, Integer> tmp = (HashMap<String, Integer>) countMap.clone();
            tmp.put(first, --firstCount);
            tmpCount--;
            int tmpI = i;
            do {
                if (tmpCount == 0) {
                    ans.add(i);
                    break;
                } else {
                    tmpI = tmpI + wordLength;
                    if (tmpI <= s.length() - wordLength) {
                        String next = s.substring(tmpI, tmpI + wordLength);
                        Integer nextCount = tmp.get(next);
                        if (nextCount != null && nextCount != 0) {
                            tmp.put(next, --nextCount);
                            tmpCount--;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } while (true);
        }
    }
    return ans;
}
```



#### Elegant Solution (9ms Beat 99.6%)

leetcode上效率最快的解，用一种难以想象的方式去滑动窗口，优雅而晦涩

```java
public List<Integer> findSubstring2(String s, String[] words) {
    List<Integer> indexes = new ArrayList<>();
    if (words.length == 0) {
        return indexes;
    }
    int wordLength = words[0].length();
    int patternLength = wordLength * words.length;
    if (patternLength > s.length()) {
        return indexes;
    }

    Map<String, Integer> strings = new HashMap<>(words.length);
    for (int i = 0; i < words.length; ++i) {
        strings.put(words[i], strings.getOrDefault(words[i], 0) + 1);
    }

    Map<String, Integer> temp = new HashMap<>();
    for (int k = 0; k < wordLength; ++k) {
        for (int i = k; i <= s.length() - patternLength; i += wordLength) {
            int j = i + patternLength;
            for (; j > i; j -= wordLength) {
                String word = s.substring(j - wordLength, j);
                if (temp.getOrDefault(word, 0) + 1
                        > strings.getOrDefault(word, 0)) {
                    i = j - wordLength;
                    break;
                }
                temp.put(word, temp.getOrDefault(word, 0) + 1);
            }
            if (j == i) {
                indexes.add(i);
            }
            temp.clear();
        }
    }
    return indexes;
}
```

假如我们一个单词的长度是`wordLength`，一个pattern的长度是`patternLength`

18行开始是精髓，用了3个for去做滑动窗口，其中：

- 第一个for长度是单词的长度，它可以处理偏差，可以理解为滑动窗口的出发点，因为我们**滑动窗口的长度总是单词长度的倍数（`j = i + patternLength`），并且总是以单词长度的倍数为距离做滑动（`i += wordLength`）**，想象一下就知道了，比如：

    `s = “aasosfoobar” words = ["foo", "bar"]`的时候，第一个第一个循环表示只需要每次从**第一个a**或者**第二个a**或**第三个s**开始往后滑动窗口就行了，因为**第四个o**如果也需要滑动的话，它得到的结果会有一部分和**第一个a**重叠；再其次，如果要窗口滑动到解`foobar`处的话，必须从**第三个s**为起点，对比两次（**滑动两个单词长度距离**）才滑动到正解处；

- 第二个for循环是用于滑动窗口距离的；

- 第三个for循环也是精髓，是用于对比窗口里的单词出现的频数的，根据频数结果来**记录解或者决定下一次滑动窗口的起点**

    为什么这里要决定下一次滑动窗口的起点？原因很简单，在处理的时候我们已经知道当前窗口**尾部**有几组**连续**单词是**出现在words**里的，而当前窗口**头部**可能有几组单词是**不出现在words**里的，如果有不出现在words中的单词，那么我们下一次滑动窗口的起点可以从当前窗口中**尾部连续命中**的地方开始继续对比窗口，因为这部分连续的命中单词在下一个窗口中可能是一个解；

分析起来比较复杂，实现起来就更精妙了，我们从第三个for循环中可以看到，我们是从窗口的后面往前比较的（`j -= wordLength`），如果比较到没有命中的单词，那么**当前的j**，就是下一次窗口的起点，为什么要`i = j - wordLength` ？因为下一次i循环之前会执行一次`i += wordLength`

然后30行处，如果j已经和i一样了，那么说明从窗口的最后到最前都命中了，并且符合频数限制，于是这是一组合法的解