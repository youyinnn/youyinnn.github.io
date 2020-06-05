---
title: Leetcode-16~20
categories:
- note
- algorithm
- leetcode
tags:
- leetcode
date: 2019-03-06 20:13:00
series: leetcode
---



### 16.3SumClosest(Medium)

Given an array `nums` of *n* integers and an integer `target`, find three integers in `nums` such that the sum is closest to `target`. Return the sum of the three integers. You may assume that each input would have exactly one solution.

**Example:**

```
Given array nums = [-1, 2, 1, -4], and target = 1.

The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
```

和上一题一样，只不过这一题并不用废心思处理重复

```java
public int threeSumClosest2(int[] nums, int target) {
    Arrays.sort(nums);
    int closest = nums[0] + nums[1] + nums[nums.length - 1];
    for (int i = 0; i < nums.length - 2; i++) {
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == target) {
                return sum;
            }
            if (Math.abs(sum - target) < Math.abs(closest - target)) {
                closest = sum;
            }
            if (sum > target) {
                r--;
            } else {
                l++;
            }
        }
    }
    return closest;
}
```



### 17. Letter Combinations of a Phone Number(Medium)

Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

![img](http://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Telephone-keypad2.svg/200px-Telephone-keypad2.svg.png)

**Example:**

```
Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```

**Note:**

Although the above answer is in lexicographical order, your answer could be in any order you want.

这题怎么说，一看就是DP，最终解法有点像最近点对，然后也有点像**Merge Kth Sorted List**

上一个公式：`Get("234")=Get("2") X Get("34")`；`Get("34")=Get("3") X Get("4")`；

于是我们将多个问题始终简化为只处理2个符号的问题，最后暴力求2个符号的问题即可

```java
private static char[][] map = {
        {}, // 0
        {}, // 1
        {'a','b','c'},  // 2
        {'d','e','f'},  // 3
        {'g','h','i'},  // 4
        {'j','k','l'},  // 5
        {'m','n','o'},  // 6
        {'p','q','r','s'}, // 7
        {'t','u','v'},  // 8
        {'w','x','y','z'}, // 9
};

private static char[] mapping(char digitalChar) {
    return map[digitalChar - '0'];
}

public static List<String> letterCombinations(String digits) {
    if (digits.isEmpty()) {
        return Collections.emptyList();
    }
    char[] chars = digits.toCharArray();
    return get(chars, 0, chars.length - 1);
}

private static List<String> get(char[] set, int start, int end) {
    LinkedList<String> ans = new LinkedList<>();
    if (start == end) {
        char[] mapping = mapping(set[start]);
        for (char c : mapping) {
            ans.add(String.valueOf(c));
        }
    } else if (end - start == 1) {
        char[] sm = mapping(set[start]);
        char[] em = mapping(set[end]);
        for (char aSm : sm) {
            for (char anEm : em) {
                ans.add(aSm + String.valueOf(anEm));
            }
        }
    } else {
        List<String> a = get(set, start, start + 1);
        List<String> b = get(set, start + 2, end);
        for (String as : a) {
            for (String bs : b) {
                ans.add(as + bs);
            }
        }
    }
    return ans;
}
```



### 18. 4Sum(Medium)

Given an array `nums` of *n* integers and an integer `target`, are there elements *a*, *b*, *c*, and *d* in `nums` such that *a* + *b* + *c* + *d* = `target`? Find all unique quadruplets in the array which gives the sum of `target`.

**Note:**

The solution set must not contain duplicate quadruplets.

**Example:**

```
Given array nums = [1, 0, -1, 0, -2, 2], and target = 0.

A solution set is:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]
```

有了3sum的经验，4sum迎刃而解

```java
public List<List<Integer>> fourSum(int[] nums, int target) {
    LinkedList<List<Integer>> ans = new LinkedList<>();
    Arrays.sort(nums);
    for (int i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        int a = nums[i];
        for (int j = i + 1; j < nums.length; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) {
                continue;
            }
            int b = nums[j];
            int l = j + 1, r = nums.length - 1;
            while (l < r) {
                if (a + b + nums[l] + nums[r] == target) {
                    // l++ r-- here
                    ans.add(Arrays.asList(a, b, nums[l++], nums[r--]));
                    // skip same result when low is the same value
                    while (l < r && nums[l - 1] == nums[l]) {
                        l++;
                    }
                    // skip same result when high is the same value
                    while (l < r && nums[r] == nums[r + 1]) {
                        r--;
                    }
                } else if (a + b + nums[l] + nums[r] > target) {
                    r--;
                } else {
                    l++;
                }
            }
        }
    }
    return ans;
}
```


### 19. Remove Nth Node From End Of List(Medium)

Given a linked list, remove the *n*-th node from the end of list and return its head.

**Example:**

```
Given linked list: 1->2->3->4->5, and n = 2.

After removing the second node from the end, the linked list becomes 1->2->3->5.
```

**Note:**

Given *n* will always be valid.

**Follow up:**

Could you do this in one pass?

####  Two Pass Solution

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode pre = head;
    int size = 1;
    while (pre.next != null) {
        pre = pre.next;
        size++;
    }
    int f = size - n;
    if (f == 0) {
        head = head.next;
    } else {
        pre = new ListNode(0);
        pre.next = head;
        while (f > 0) {
            pre = pre.next;
            f--;
        }
        ListNode remove = pre.next;
        pre.next = remove.next;
    }
    return head;
}
```
没什么说的，one pass获得长度，two pass直接定位删除

#### One Pass Solution 

```java
public ListNode removeNthFromEnd2(ListNode head, int n) {
    ListNode pre = new ListNode(0), now = head, check;
    pre.next = head;
    if (head == null) {
        return null;
    }
    while (true) {
        int count = 0;
        check = now;
        while (count < n) {
            if (check == null) {
                return head.next;
            }
            check = check.next;
            count++;
        }
        if (check != null) {
            pre = pre.next;
            now = now.next;
        } else {
            if (pre.next == head) {
                return head.next;
            }
            pre.next = pre.next.next;
            break;
        }
    }
    return head;
}
```

遍历链，对每个结点都往后找n+1个结点记为**CHECK**，如果**CHECK**为NULL，则说明当前的now就是要删掉的结点，我觉得这种方法还不如遍历两遍

#### One Pass Solution - Tow pointers

从剑指Offer上面看到的思路，对应面试题22，思想是设立两个指针，指针1先走n步，然后这时候指针2开始走，在这个过程种指针1和2始终有n步的距离差，所以当指针1走到null位置时，指针2自然就走到倒数第n个节点的位置了。

``` java
public ListNode removeNthFromEnd3(ListNode head, int n) {
    if (head == null || head.next == null) return null;
    ListNode p1 = head, p2 = head, pre = head;
    while (p1 != null) {
        if (n != 0) {
            n--;
        } else {
            pre = p2;
            p2 = p2.next;    
        }
        p1 = p1.next;
    }
    // 当长度为n的链表要求删除倒数第n个节点时，p2始终呆在头节点，所以直接返回头节点的next
    if (p2 == head) {
        return head.next;
    }
    pre.next = p2.next;
    return head;
}
```





### 20. Valid Parentheses

Given a string containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Note that an empty string is also considered valid.

**Example 1:**

```
Input: "()"
Output: true
```

**Example 2:**

```
Input: "()[]{}"
Output: true
```

**Example 3:**

```
Input: "(]"
Output: false
```

**Example 4:**

```
Input: "([)]"
Output: false
```

**Example 5:**

```
Input: "{[]}"
Output: true
```

#### Stack

没什么说的，和数据结构书上的表达式求值是一样的，比书上的简单

```java
public boolean isValid(String s) {
    if (s.isEmpty()) {
        return true;
    }
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (isBegin(c)) {
            stack.push(c);
        } else {
            if (stack.isEmpty()) {
                return false;
            }
            Character begin = stack.pop();
            if (!isPair(begin, c)) {
                return false;
            }
        }
    }
    return stack.empty();
}

public boolean isBegin(char a) {
    return a == '(' || a == '[' || a == '{';
}

public boolean isPair(char begin, char end) {
    if (begin == '(') {
        return end == ')';
    } else if (begin == '[') {
        return end == ']';
    } else {
        return end == '}';
    }
}
```
