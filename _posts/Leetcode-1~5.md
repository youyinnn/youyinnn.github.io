---
title: Leetcode-1~5
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
date: 2019-02-02 19:51:00
series: leetcode
---



### 1. TwoSum(Easy)

Given an array of integers, return **indices** of the two numbers such that they add up to a specific target.

You may assume that each input would have **exactly** one solution, and you may not use the *same* element twice.

**Example:**

```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

#### Ⅰ.Brute Force

``` java
public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[j] == target - nums[i]) {
                return new int[] { i, j };
            }
        }
    }
    throw new IllegalArgumentException("No two sum solution");
}
```

#### Ⅱ.Hashing

Of all other Java solution with they call “hashing”, they just using JDK’s provided implementation, and it’s not a friendly solution for those who are not coding with Java.

And as I thinking about, it’s shit code that you are using **a non-classic structure** like **“HashMap”, “ArrayList”** and so on.

It’s ok that you using JDK’s implementation like **“LinkedList”, “Stack”** because their basic function were all implemented in the accepted ordinary way.

But using a structure like **“HashMap”, “ArrayList”**, it’s totally cheating because the algorithm inside them **is not your work**, and you probably don’t know how to implement **HashMap’s** treeify operation or **ArrayList’s** grow operation.

I see the solution to this Problem and I was disappointed with it.

```java
public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> map = new HashMap<>(nums.length);
    for (int i = 0; i < nums.length ; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{i, map.get(complement)};
        }
        map.put(nums[i], i);
    }
    return nums;
}
```

So here is my solution about "TwoSum" with **self implement "hashing"**, it may not a nice code but it's friendly for all of you

``` java
// 4ms runtime 26~27MB memory use
// need to record val and index at the same time
class Pair {
	int val;
	int index;
}

// hash table
private Pair[] table;

// hash method just mod
private int hash(int key) {
	return Math.abs(key) % table.length;
}

// set hash table from origin sequence
private void setTable(int[] origin) {
	// table's rank is double
	int rank = origin.length << 1;
	table = new Pair[rank];
	for (int i = 0; i < origin.length; i++) {
	    // detection the right place the key should set on hash table
		int place = detection(origin[i], false);
		Pair pair = new Pair();
		pair.val = origin[i];
		pair.index = i;
		table[place] = pair;
	}
}

// seek the key's position in hash table
private int seek(int key) {
    // seek key and return -1 if no key found in hash table
	return detection(key, true);
}

// collsion handle with just linear detection
private int detection(int key, boolean seek) {
	int hash = hash(key);
	// detect key's position in hash table at once hash()
	if (!seek && table[hash] == null) {
		return hash;
	} else if (seek && table[hash] == null) {
	    // no match found
		return -1;
	} else if (seek && table[hash].val == key) {
	    // match key
		return hash;
	} else {
	    // collsion handle with linear detection
		int offset = 1;
		boolean after = false;
		// linear detect forward
		while (hash + offset < table.length) {
			if (!seek && table[hash + offset] == null) {
				break;
			} else if (seek && table[hash + offset] == null) {
				return -1;
			} else if (seek && table[hash + offset].val == key) {
				return hash + offset;
			}
			offset++;
		}
		// liner detect backward
		if (hash + offset == table.length) {
			offset = 1;
			while (hash - offset >= 0) {
				if (!seek && table[hash - offset] == null) {
					break;
				} else if (seek && table[hash - offset] == null) {
					return -1;
				} else if (seek && table[hash - offset].val == key) {
					return hash + offset;
				}
				offset++;
			}
		} else {
			after = true;
		}
		return after ? hash + offset : hash - offset;
	}
}

public int[] twoSum(int[] nums, int target) {
	setTable(nums);
	for (int i = 0; i < nums.length; i++) {
		int complement = target - nums[i];
		int seek = seek(complement);
		if (seek != -1) {
			int index = table[seek].index;
			// handle case like [3, 3] target 6
			if (index == i) {
				if (seek + 1 < table.length) {
					index = table[seek + 1].index;
				} else {
					index = table[seek - 1].index;
				}
			}
			// handle case like [3, 2, 4] target 6
			if (nums[index] + nums[i] == target) {
				return new int[]{i, index};
			}
		}
	}
	return nums;
}
```

### 2. Add Two Number(Medium)

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order** and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example:**

```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```

![](https://leetcode.com/problems/add-two-numbers/Figures/2_add_two_numbers.svg)

这题没什么tricky的，就是两个连各自的结点相加，关键是怎么记录各自链表的当前计算指针，并且处理好长短不一情况下的进位，下面是官方的solution：

``` java
// 由第三条新的链和它的计算指针完成
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummyHead = new ListNode(0);
    ListNode p = l1, q = l2, curr = dummyHead;
    int carry = 0;
    while (p != null || q != null) {
        int x = (p != null) ? p.val : 0;
        int y = (q != null) ? q.val : 0;
        int sum = carry + x + y;
        carry = sum / 10;
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        if (p != null) p = p.next;
        if (q != null) q = q.next;
    }
    if (carry > 0) {
        curr.next = new ListNode(carry);
    }
    return dummyHead.next;
}
```

下面是我参照这种思路，针对空间优化的代码，所有计算在1链上进行，并处理了两条链长短不一样的情况，如果1链长，那么就继续计算carry；如果二链长，那么把二链剩余需要计算的链接到1链上，在1链上继续计算carry：

```java
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    boolean carry = false;
    ListNode ap = l1, bp = l2;
    while (ap != null || bp != null) {
        int count = carry ? 1 : 0;
        if (ap != null) {
            count += ap.val;
        }
        if (bp != null) {
            count += bp.val;
        }
        if (count >= 10) {
            count = count % 10;
            carry = true;
        } else {
            carry = false;
        }

        if (ap != null) {
            ap.val = count;
            if (ap.next == null) {
                if (bp != null) {
                    ap.next = bp.next;
                    bp = null;
                    // 以防还有carry 在l2上记录l1最后一个结点
                    l2 = ap;
                } else if (carry) {
                    ap.next = new ListNode(1);
                    carry = false;
                    break;
                }
            }
            ap = ap.next;
        }
        if (bp != null) {
            bp = bp.next;
        }
    }
    if (carry) {
        l2.next = new ListNode(1);
    }
    return l1;
}
```



### 3. Longest Substring(Medium)

Given a string, find the length of the **longest substring** without repeating characters.

**Example 1:**

```
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 
```

**Example 2:**

```
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**

```
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

#### ascii mapping

官方给出的解法，官方还给出了用HashMap和HashSet去解的

**ascii mapping**这样的解法虽然知道**第一目的**是用ascii映射数组去记录上一次重复出现char的下标，但是官方的这个后续实现，不多看几眼，很难看出意图，所以我觉得这是一段没有灵魂的代码，里面的i、j已经完全没有灵魂了，难以理解

``` java
public class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length(), ans = 0;
        int[] index = new int[128];
        for (int j = 0, i = 0; j < n; j++) {
            i = Math.max(index[s.charAt(j)], i);
            ans = Math.max(ans, j - i + 1);
            index[s.charAt(j)] = j + 1;
        }
        return ans;
    }
}
```

还是解一下逻辑：

1. 既然有下标，可以考虑用**下标差**去计算长度，而不是count出来

2. 假设要表达的字符序列只在**ascii-128**中出现，于是我们可以用**hash**的方式，给出一个128位的数组`index`，数组用来记录**上一次重复出现该ascii码字符的index的下一位（`index[s.charAt(j)] = j + 1`）**，为什么是下一位？因为既然已经重复了，就从下一位开始计算所求序列

    比如说**“a”**这个序列，**a**的**ascii**是97，所以在`index`的97号上找index，这时候是0

3. **i**的作用：获取最靠近`j`的**有过重复的字符index的下一位**，比如序列**“abca”**，当J循环到最后一个a的时候，i的值是上一个有过重复的a的index的下一位

### 4. Median of Two Sorted Arrays(Hard)

There are two sorted arrays **nums1** and **nums2** of size m and n respectively.

Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

You may assume **nums1** and **nums2** cannot be both empty.

**Example 1:**

```
nums1 = [1, 3]
nums2 = [2]

The median is 2.0
```

**Example 2:**

```
nums1 = [1, 2]
nums2 = [3, 4]

The median is (2 + 3)/2 = 2.5
```

这道题难就难在要找到**O(log (m+n))**的解，说到已排好序、log级，自然而然想到二分法，关键是怎么对两个已排序的数组进行统一二分法，找到中位数

在此先给出容易想到但是不符合题意的解**(n+m)/2**解

#### Ⅰ.a (n+m)/2 solution

分别从两个数组中取最小的数，然后取到两数组长度中位之后，自然就找到中位数了

```java
public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length < nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    int lengthSum = nums1.length + nums2.length;
    int mi = lengthSum / 2;
    int p1 = 0, p2 = 0;
    int[] tar = new int[mi + 1];
    for (int i = 0 ; i <= mi; i++) {
        if (p1 == nums1 .length) {
            tar[i] = nums2[p2];
            continue;
        }
        if (p1 <= nums1.length - 1 && p2 <= nums2.length - 1) {
            if (nums1[p1] > nums2[p2]) {
                tar[i] = nums2[p2];
                p2++;
            } else if (nums1[p1] < nums2[p2]) {
                tar[i] = nums1[p1];
                p1++;
            } else {
                tar[i++] = nums1[p1];
                if (i < tar.length) {
                    tar[i] = nums1[p1];
                }
                p1++;
                p2++;
            }
        } else {
            tar[i] = nums1[p1];
            p1++;
        }
    }
    if (lengthSum % 2 == 0) {
        double a = tar[tar.length - 1];
        double b = tar[tar.length - 2];
        return (a + b) / 2;
    } else {
        return tar[tar.length - 1];
    }
}
```

#### Ⅱ. log(m+n) solution

对数级解非常不容易找出来，我觉得能解出来的都是数学家- -

对数级解决方案有2种，一种是**泛化为“findKth”问题**，另一种是**“分治法寻找perfect I”**

##### Perfect I

官方给出的[solution](https://leetcode.com/problems/median-of-two-sorted-arrays/solution/)就是它，为了解这个问题，首先我们从统计学上去了解一下什么是**Medium**

> Dividing a set into two equal length subsets, that one subset is always greater than the other.
>
> 它将原集合分成等长的两个子集，其中一个子集中的任意元素总是大于另一个子集中的任意元素

然后我们再了解一个**切（Cut）**的概念：

>  假设长度为m的A集合有随机一个**cut**出现在下标i的位置，那么有**m + 1**种可能的**cut（0 ~ m）**
>
>  ```nhi
>         left_A             |        right_A
>   A[0], A[1], ..., A[i-1]  |  A[i], A[i+1], ..., A[m-1]
>  ```
>
>  其中：
>
>  - len(left_A) = i, len(right_A) = m − i
>
>  - when i = 0, **left_A** is empty, and when i = m, **right_A** is empty
>
>  类似地，对B我们可以：
>
>  ```nhi
>         left_B             |        right_B
>   B[0], B[1], ..., B[j-1]  |  B[j], B[j+1], ..., B[n-1]
>  ```
>
>  A、B连在一起看，我们得出：
>
>  ```nhi
>         left_part          |        right_part
>   A[0], A[1], ..., A[i-1]  | A[i], A[i+1], ..., A[m-1]
>   B[0], B[1], ..., B[j-1]  |  B[j], B[j+1], ..., B[n-1]
>  ```
>  如果我们可以找到如下**两个条件**：
>
>  1. **len(left_part) = len(right_part)**
>  2. **max(left_part) ≤ min(right_part)**
>
>  那么我们就等于将全集**{A, B}**分为**等长**的2部分，且左半部分中的元素总是比右半部分中的元素要小
>
>  注意，**等长**概念在偶数全集里面比较容易展现，即左右两边元素个数相同，而在奇数集合里面，约定**左集合比右集合多一个**，所以奇数集合的中位数总是**左集合中最大的那一个**
>
>  这时候**Medium**可以由 **(max(left_part) + min(right_part)) / 2** 得出！也即我们若是找到了正确的切点，那么也就找到了**Medium**

于是我们按照以下步骤进行切点的寻找：

> 1. 总是以较短的集合作为A集合，以短集合的长度去寻找**Cut**
>
> 2. 设置`iMin=0`，`iMax=m`，在[iMin, iMax]中寻找cut
>
> 3.  `i`为A的cut，它等于`(iMin + iMax) / 2`; `j`为B的cut，它等于`(m + n + 1) / 2 -i `
>
> 4. 现在我们切好了，满足了等长条件，于是我们判断切点是否是我们想要的，这将会有3种情况：
>
>     - `B[j - 1] <= A[i] && A[i - 1] >= B[j]`
>
>         意味着满足了条件二了，`i`和`j`正是我们要找的**切点**，找到了切点，就判断全集长度的奇偶性，从而求出**Medium**
>
>     - `B[j - 1] >  A[i]`：
>
>         意味着`i`找小了，所以这时候将`iMin`加1，于是下一次`i`切点也会往后挪
>
>     - `A[i-1] > B[j]`：
>
>         意味着`i`找大了，这时候将`iMax`减1，于是下一次`i`切点也会往前挪

```java
public double findMedianSortedArrays(int[] A, int[] B) {
    int m = A.length;
    int n = B.length;
    // to ensure m<=n
    if (m > n) {
        return findMedianSortedArrays(B, A);
    }
    int iMin = 0, iMax = m, halfLen = (m + n + 1) / 2;
    while (iMin <= iMax) {
        int i = (iMin + iMax) / 2;
        int j = halfLen - i;
        if (i < iMax && B[j-1] > A[i]){
            // i is too small
            iMin = i + 1;
        } else if (i > iMin && A[i-1] > B[j]) {
            // i is too big
            iMax = i - 1;
        } else {
            // i is perfect
            int maxLeft;
            if (i == 0) { maxLeft = B[j-1]; }
            else if (j == 0) { maxLeft = A[i-1]; }
            else { maxLeft = Math.max(A[i-1], B[j-1]); }
            if ( (m + n) % 2 == 1 ) { return maxLeft; }

            int minRight;
            if (i == m) { minRight = B[j]; }
            else if (j == n) { minRight = A[i]; }
            else { minRight = Math.min(B[j], A[i]); }

            return (maxLeft + minRight) / 2.0;
        }
    }
    return 0.0;
}

// show cut when perfect i was found
// eg: A[1, 8, 20, 55, 77] B[2, 4, 5, 9, 23, 27, 85, 152, 964]
//
// cut:3 --> [1, 8, 20] | [55, 77]
// cut:4 --> [2, 4, 5, 9] | [23, 27, 85, 152, 964]
public void showCut(int[] arr, int cutIndex) {
    int[] leftPart = new int[cutIndex];
    int[] rightPart = new int[arr.length - cutIndex];
    System.arraycopy(arr, 0, leftPart, 0, cutIndex);
    System.arraycopy(arr, cutIndex, rightPart, 0, arr.length - cutIndex);
    System.out.println("cut:" + cutIndex + " --> " + Arrays.toString(leftPart) + " | " + Arrays.toString(rightPart));
}
```



### 5. Longest Palindromic Substring

Given a string **s**, find the longest palindromic substring in **s**. You may assume that the maximum length of **s** is 1000.

**Example 1:**

```
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
```

**Example 2:**

```
Input: "cbbd"
Output: "bb"
```

**Example 3:**

```
Input: "ab"
Output: "a"
```

**Example 4:**

```
Input: ""
Output: ""
```



#### 60+ms Solution (Beat 33%)

因为String **s**是一个char数组，我们以遍历这个数组为基础，当我们在位置`i`碰到一个char的时候，就找它下一次出现的位置`j`，那么我们就可以继续数组子序列`[i, j]`是否是回文串，由此找到一个可能的解；然后再以`j+1`开始，再找下一个`j`，于是代码可以是：

```java
public boolean isPalindrome(char[] src, int begin, int end) {
    while(begin < end) {
        if(src[begin++] != src[end--]) {
            return false;
        }
    }
    return true;
}

public String longestPalindrome(String s) {
    char[] chars = s.toCharArray();
    if (chars.length == 1) {
        return s;
    }
    int start = 0, end = 0;
    for (int i = 0; i < chars.length; i++) {
        if (chars.length - i < end - start + 1) {
            break;
        }
        char nowC = chars[i];
        int next = i;
        do {
            next = s.indexOf(nowC, next + 1);
            if (next - i + 1 < end - start + 1) {
                continue;
            }
            if (next > 0) {
                if (next - i + 2 > end - start + 1 &&
                    isPalindrome(chars, i + 1, next - 1)) {
                    
                    start = i;
                    end = next + 1;
                }
            }
        } while (next > 0);
    }
    if (end == 0 && chars.length != 0) {
        return chars[0] + "";
    }
    return s.substring(start, end);
}
```

解法的关键是do循环里面的`next = s.indexOf(nowC, next + 1)`，但也正是在这一步里，花费了大量的时间做了重复的工作，因为这里也是在遍历数组- -



#### 7-10ms Solution (Beat 98%)

我们换个思路，关于next的位置，我们不一定要通过遍历数组的方式去寻找下一个可能的end字符的下标，我们可以通过之前已经找到过的回文字符串的长度，来**猜**出下标

我们倒着来看（为什么倒着？后面解释），对于每个`i > 0`，都有很多种可能说在`s[i]`就是一组回文数的end，那么这个可能性由什么去缩小？由一个**既定的长度len**来决定，我们倒着来看的话，`s[i - len + 1]`到`s[i]`之间的**len**长度子串如果是回文数的话，我们就马上找到了一组可能的解

那么这个**既定的len**怎么求？我们可以发现这个**len**最终就是我们想要的结果字串的长度，所以我们不妨从0开始，在序列**至少有一个字符**的时候，**要找到比原len更长的解的话，我们的len需要再往前吃1位或者2位数字**，如果还是要保持原**len**的话，是求不出解的，比如最开始`end = i = 0`的时候`start = i - len + 1 = 1`，这是无解

以`"abcba"`为例

我们尝试**len**往前吃1位，`end = i = 0`的时候`start = i - (len + 1)+ 1 = i - len = 0`，我们得到整个字符串的第一个字符`'a'`，它肯定是回文数，所以我们得到第一个解，**len++**，此时记录下`start`和`end`

接下来我们以表格的形式来描述遍历过程，包含了往前吃2位的情况：

|  end = i  | start = i - len - 1 | start = i - len | string[start, end]  |             len              |
| :-------: | :-----------------: | :-------------: | :-----------------: | :--------------------------: |
| 0 = `'a'` |     -1 **无解**     |        0        |          a          |          ++后等于1           |
| 1= `'b'`  |     -1 **无解**     |        0        |    ab **不是解**    |            还是1             |
| 2= `'c'`  |          0          |        1        | abc/bc **都不是解** |              1               |
| 3= `'b'`  |          1          |        2        |    bcb **是解**     | 吃两位得的解，所以len+=2 = 3 |
| 4= `'a'`  |          0          |        1        |   abcba **是解**    |          len+=2 = 5          |

于是循环中的逻辑为：

```java
public String longestPalindrome(String s) {
    char[] ca = s.toCharArray();
    // handle ""
    if (ca.length == 0) {
        return "";
    }
    int start = 0, end = 0;
    int len = 0;
    for(int i = 0; i < ca.length; i++) {
        // eat 2
        if(isPalindrome(ca, i - len - 1, i)) {
            start = i - len - 1; end = i;
            len += 2;
        } 
        // eat 1
        else if(isPalindrome(ca, i - len, i)) {
            start = i - len; end = i;
            len += 1;
        }
    }
    return s.substring(start, end + 1);
}

private boolean isPalindrome(char[] chars, int head, int tail) {
    if(head < 0) {
        return false;
    }
    while(head < tail) {
        if(chars[head++] != chars[tail--]) {
            return false;
        }
    }
    return true;
}
```

##### 一点优化

观察表中最后一行以及`isPalindrome`函数可以发现，判断`abcba`是否为回文串的时候，重复判断了`bcb`，而它已经在上一次被判断过了，于是我们可以将start和end提出去，让它们在下一次判断回文数的时候也能够使用，避免重复判断

在回文数判断函数中补上：

```java
private int start, end;
private boolean isPalindrome(char[] chars, int head, int tail) {
    if(head < 0) {
        return false;
    }
    if (chars[head] == chars[tail] && start == head + 1 && end == tail - 1) {
        return true;
    }
    while(head < tail) {
        if(chars[head++] != chars[tail--]) {
            return false;
        }
    }
    return true;
}
```

