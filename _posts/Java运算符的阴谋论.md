---
title: Java运算符的阴谋论
categories:
  - note
comments: true
tags:
  - java
  - operator
date: 2018-6-3 21:28:00
---



{% cq %}

小心点，一不小心你就栽跟头了 :ghost:

{% endcq%}



### 你画我猜

下面程序输出多少？

```java
public static void main(String[] args) {
    int i = 2;
    i += i -= i *= i;
    System.out.println(i);
}
```

答案：0

### 为什么说阴谋论？

- 你知道Java里有哪几种运算符嘛？
- 你知道`-=`是算数运算符还是赋值运算符嘛？
- 你知道是`|`和`||`到底哪个才是短路嘛？
- 你知道怎么不用`*`或`/`做2的倍数的乘除运算嘛？
- 你知道`>>`和`>>>`有什么区别嘛？
- 你知道`-1 >>> 1 = 2147483647 `怎么来的嘛？
- 你知道`<<<`代表什么意思嘛？
- 你知道还有一种运算符它里面全是字母没有符号嘛？
- 上面的问题你如果有一大半不会，那你还不觉得Java运算符里有阴谋吗？



### 运算符种类

#### 算数运算符

没得说，加减乘除模，+、-、*、/、%



#### 一元运算符

- **-，**负号运算符
- **+，**正号运算符（还有这玩意？你不知道吧？）
- **++，**自加运算符，注意前后
- **--，**自减运算符，注意前后
- **!，**非运算符，用于逻辑语句改是非



#### 赋值运算符

- **=，**就这一个



#### 复合赋值运算符

- **+=**, for adding left operand with right operand and then assigning it to variable on the left.
- **-=**, for subtracting left operand with right operand and then assigning it to variable on the left.
- ***=**, for multiplying left operand with right operand and then assigning it to variable on the left.
- **/=**, for dividing left operand with right operand and then assigning it to variable on the left.
- **^=**, for raising power of left operand to right operand and assigning it to variable on the left.
- **%=**, for assigning modulo of left operand with right operand and then assigning it to variable on the left.

都不解释了



#### 关系运算符

- **== , Equal to :** returns true of left hand side is equal to right hand side.
- **!= , Not Equal to :** returns true of left hand side is not equal to right hand side.
- **< , less than :** returns true of left hand side is less than right hand side.
- **<= , less than or equal to :** returns true of left hand side is less than or equal to right hand side.
- **> , Greater than :** returns true of left hand side is greater than right hand side.
- **>= , Greater than or equal to:** returns true of left hand side is greater than or equal to right hand side.



#### 逻辑运算符

- **&& , **短路与
- **|| ,**短路或
- **&，**非短路与
- **|，**非短路或



#### 三元运算符

``` java
int i = 1 > 2 ? 1 : 2;
```



#### 位运算符

- **&，**二进制和运算
- **|，**二进制或运算
- **^，**二进制异或预算
- **~，**二进制逆运算



#### 位移运算符以及二进制补码位移规则

- **<< ,**有符号左移，**丢弃最高位，低位补0** 
- **>> , **有符号右移，**符号位不变，左边依次补上符号位，且与此同时最低位要舍弃** 
- **>>> ,** 无符号左移，**符号位跟着左移，左边依次补上0，且与此同时最低位要舍弃** 

```java
@Test
public void testShift(){
    int a = 8;
    int b = 7;
    int c = -1;
    System.out.println(a >> 1);
    System.out.println(a >> 2);
    System.out.println(b << 1);
    System.out.println(b << 2);
    System.out.println(c >> 1);
    System.out.println(c >>> 1);
    System.out.println(c >>> 2);
}
```

``` console
4 // 0000 ... 0000 1000 -> 0000 ... 0000 0100 -> 8 / 2
2 // 0000 ... 0000 1000 -> 0000 ... 0000 0010 -> 8 / 4
14 // 0000 ... 0000 0111 -> 0000 ... 0000 1110 -> 7 * 2
28 // 0000 ... 0000 0111 -> 0000 ... 0001 1100 -> 7 * 4
-1 
2147483647
1073741823
```



上面的**负数计算**可能看不懂，我们先复习一下数的二进制表示

以有符号数来说，数的二进制表示有**原码表示法**、**补码表示法**、**移码表示法**我们观察以下码表

| 真值x（十进制） | 真值x（二进制） |      原码      |  反码（过渡）  |      补码      |      移码      |
| :-------------: | :-------------: | :------------: | :------------: | :------------: | :------------: |
|      -127       |   - 0111 1111   | **1** 111 1111 | **1** 000 0000 | **1** 000 0001 | **0** 000 0001 |
|       -1        |   - 0000 0001   | **1** 000 0001 | **1** 111 1110 | **1** 111 1111 | **0** 111 1111 |
|       +0        |   + 0000 0000   | **0** 000 0000 | **0** 000 0000 | **0** 000 0000 | **1** 000 0001 |
|       -0        |   - 0000 0000   | **1** 000 0000 | **1** 111 1111 | **0** 000 0000 | **1** 000 0001 |
|       +1        |   + 0000 0001   | **0** 000 0001 | **0** 000 0001 | **0** 000 0001 | **1** 000 0001 |
|      +127       |   + 0111 1111   | **0** 111 1111 | **0** 111 1111 | **0** 111 1111 | **1** 111 1111 |

所以对于**-1**，Java中的的int长度为32，一步步来

**二进制真值表示：**- 0000 0000 0000 0000 0000 0000 0000 0001

**二进制原码表示： ** **1**000 0000 0000 0000 0000 0000 0000 0001

**二进制反码表示： ** **1**111 1111 1111 1111 1111 1111 1111 1110

**二进制补码表示： ** **1**111 1111 1111 1111 1111 1111 1111 1111

我们始终都得记住这一点，**计算机中的负数都是用二进制补码存储的**，所以负数的二进制运算也是基于补码来算的

**所以：**

- 当我们运算：**-1 >> 1** 的时候，**符号位不变，左边依次补上符号位，且与此同时最低位要舍弃** 

  **原补码： ** **1**111 1111 1111 1111 1111 1111 1111 1111

  **新补码： ** **1**111 1111 1111 1111 1111 1111 1111 1111 <span style="color:red;font-weight:bold;">1</span> <---去掉

  **得结果： ** **1**111 1111 1111 1111 1111 1111 1111 1111

  去掉尾部多出来的1之后，整个补码表示的负数还是**-1**

- 当我们运算：**-1 >>> 1** 的时候，**符号位跟着左移，左边依次补上0，且与此同时最低位要舍弃** 

  **原补码： ** **1**111 1111 1111 1111 1111 1111 1111 1111

  **新补码： ** **0**111 1111 1111 1111 1111 1111 1111 1111 <span style="color:red;font-weight:bold;">1</span> <---去掉

  **得结果： ** **0**111 1111 1111 1111 1111 1111 1111 1111

  这个结果我们可以简单地由：**2^31 - 1 = 2147483648 - 1 = 2147483647** 去计算

  **2147483647的补码正是0111 1111 1111 1111 1111 1111 1111 1111**

- 我们继续验算：**-1 >>> 2** 

  **原补码： ** **1**111 1111 1111 1111 1111 1111 1111 1111

  **新补码： ** **0**011 1111 1111 1111 1111 1111 1111 1111 <span style="color:red;font-weight:bold;">11</span> <---去掉

  **得结果： ** **0**011 1111 1111 1111 1111 1111 1111 1111

  这个结果我们可以简单地由：**2^30 - 1 = 1073741824 - 1 = 1073741823** 去计算

  **1073741823的补码正是0011 1111 1111 1111 1111 1111 1111 1111**

- 我们继续验算：**-9 >>> 4**

  **有原码： ** **1**000 0000 0000 0000 0000 0000 0000 1001

  **有反码： ** **1**111 1111 1111 1111 1111 1111 1111 0110

  **有补码： ** **1**111 1111 1111 1111 1111 1111 1111 0111

  **新补码： ** **0**000 1111 1111 1111 1111 1111 1111 1111 <span style="color:red;font-weight:bold;">0111</span> <---去掉

  **得结果： ** **0**000 1111 1111 1111 1111 1111 1111 1111

  这个结果我们可以简单地由：**2^28 - 1 = 268435456 - 1 = 268435455** 去计算

  **268435455的补码正是0000 1111 1111 1111 1111 1111 1111 1111**

#### 类型判断运算符

使用格式：

``` java
	object instanceof Class/SubClass/Interface
```



#### 位运/位移运算的使用场景

##### 2的次幂快速乘除运算

看上面，有符号左右移，每移n位是运算2的n次幂乘除



##### 快速模2/奇偶判断（不要再只会x % 2 == 0啦）

任意数与1取位与，结果为1则是奇数

```java
// x & 1 等价于 x % 2
System.out.println(3 & 1); //1
System.out.println(2 & 1); //0
```



##### 快速两数交换/不用中间值

```java
int a = 999;
int b = 888;
a ^= b;
b ^= a;
a ^= b;
System.out.println(a); // 888
System.out.println(b); // 999
```



##### 加密解密

```java
@Test
public void testEncript(){
    int plaintext = 0b00001111; // 0000 1111
    int key =       0b01010101; // 0101 0101
    
    //encription
    int cipher = plaintext ^ key; // 0101 1010
    
    //decription
    int plaintext2 = cipher ^ key; // 0000 1111
}
```



##### BitMask

什么是BitMask？一般翻译为**位掩码**，是一种以高效、省空间的方式对**状态（status）**进行**设置（set）、清零（clear）、检查（check）**的位运算运用。

比如我们在业务中**某条记录**需要记录16个**A业务状态**，也就是需要4个bit位来记录我们的**A业务状态**，假设我们这条记录还有其他**业务的状态**，我们选择记录的第**5-8位**来记录**A业务状态**，则可以假设有如下记录：

**record：**1001 **0111** 0010

则中间的**0111**才是我们真正想要操作的记录位，我们可以用**BitMask**来操作：

- 设置**BitMask：**0x0**F**0 -> 0000 **1111** 0000
- 对于**检查（check）**：**record & mask**
- 对于**清零（clear）**：**record & ~mask**
- 对于**设置（set）**：**record & ~mask | status binary code**

```java
@Test
public void testBitMask(){
    // Mask: 0000 1111 0000 -> 0x0F0 -> 240
    int mask = 0x0F0;
    // Record: 0111 0011 1111 -> 0x73F -> 1855
    int record = 0x73F;
    int status;
    // check
    status = record & mask;
    System.out.println(status); // 48 -> 0000 0011 0000
    // clear
    status = record & ~mask;
    System.out.println(status); // 1807 -> 0111 0000 1111
    // set
    status = record & ~mask | 0x060;
    System.out.println(status); // 1903 -> 0111 0110 1111
}
```



##### BitMap算法

貌似是一个很强的东西，待更新



-----------

**参考**

https://www.geeksforgeeks.org/operators-in-java/#Unary%20Operators

http://www.52ij.com/jishu/102.html

https://segmentfault.com/q/1010000005850046

https://blog.csdn.net/tangxiaoyin/article/details/80123142