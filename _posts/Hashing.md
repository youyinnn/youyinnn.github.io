---
title: Hashing
categories:
  - datastruct
  - hash
tags:
  - algorithm
  - hash
date: 2019-02-02 20:40:00
---



### What is HashTable

Of all structure we learn before like "array" or "stack", the element's position on their structure is not absolute, it's uncertain which means there is no pattern on it.  

So the searching operation was always base on "comparing",  the searching efficiency of them were dependence on the times they perform compare.

In a perfect situation is that we don't want to do any comparing opts, them we grape the element at once. So we need something to record the relationship between key value and the place where it store. Then next time we seek a key, we would able to use this relationship to grape it immediately.

We define the relationship as **"Hash"**.

![hashing ds](https://www.geeksforgeeks.org/wp-content/uploads/HashingDataStructure-min-768x384.png)

And we will discuss two aspect of it: **"Hash Method"** & **"Collision Handle"**

### Hash Method

There are many ways to hash, and we better know what is a good hash method before we code it.

A good hash method will mapping any key to a un-used place, which means there is no collision for all elements. The probability of it is all with the same. We call it **Uniform Hash Method**.

**Capture information on key**

$$
H(key) = key \\\\ H(key) = a \cdotp key + b
$$

**Mod**
$$
H(key) = | key|\mod rank
$$
Assume thay our hash-table's length is **rank**, with this way, we could always get a rightful index of it.

### Collision Handle

Since a hash function gets us a small number for a big key, there is possibility that two keys result in same value. The situation where a newly inserted key maps to an already occupied slot in hash table is called collision and must be handled using some collision handling technique. Following are the ways to handle collisions:

- **Chaining:**The idea is to make each cell of hash table point to a linked list of records that have same hash function value. Chaining is simple, but requires additional memory outside the table.

    Like JDK's `HashMap`, link nodes when meet collision.

- **Open Addressing:** In open addressing, all elements are stored in the hash table itself. Each table entry contains either a record or NIL. When searching for an element, we one by one examine table slots until the desired element is found or it is clear that the element is not in the table.

    We need a offset to avoid the collision:

    1. Linear Detection：[1，2，3，4，┈，m - 1] **forward**, [-1，-2，-3，-4，┈，0] **backward**
    2. Quadratic Linear Detection：1^2, -1^2, 2^2, -2^2, 3^2 ┈

- **Re-Hashing:** set multiple stage for hash method, hash util no collision

### Practice

```java
public interface HashableInteger {
    int hash(int key);
    int collisionHandle(int key);
    void setHashTable(int[] originSequence);
    int seek(int key);
    void showTable();
}
```

#### Linear Detection HashTable

```java
public class LdHashTable implements HashableInteger {
    private Integer[] table;
    public LdHashTable(int[] originSeq) {setHashTable(originSeq);}

    @Override
    public int hash(int key) {
        return Math.abs(key) % table.length;
    }
    @Override
    public int collisionHandle(int key) {
        return linearDetection(key, false);
    }
    @Override
    public void setHashTable(int[] originalSeq) {
        // table's rank is double
        this.table = new Integer[originalSeq.length << 1];
        for (int key : originalSeq) {
            // detection the right place the key should set on hash table
            int place = collisionHandle(key);
            table[place] = key;
        }
    }
    @Override
    public int seek(int key) {
        return linearDetection(key, true);
    }
    @Override
    public void showTable() {
        System.out.println(Arrays.toString(table));
    }
    private int linearDetection(int key, boolean seek) {
        int hash = hash(key);
        // detect key's position in hash table at once hash()
        if (!seek && table[hash] == null) {
            return hash;
        } else if (seek && table[hash] == null) {
            // no match found
            return -1;
        } else if (seek && table[hash] == key) {
            // match key
            return hash;
        } else {
			// collsion handle with linear detection
            int offset = 1;
            boolean after = false;
			// linear detect forward
            while (hash + offSet < table.length) {
                if (!seek && table[hash + offSet] == null) {
                    break;
                } else if (seek && table[hash + offSet] == null) {
                    return -1;
                } else if (seek && table[hash + offSet] == key) {
                    return hash + offSet;
                }
                offSet++;
            }
            // liner detect backward
            if (hash + offSet == table.length) {
                offSet = 1;
                while (hash - offSet >= 0) {
                    if (!seek && table[hash - offSet] == null) {
                        break;
                    } else if (seek && table[hash - offSet] == null) {
                        return -1;
                    } else if (seek && table[hash - offSet] == key) {
                        return hash + offSet;
                    }
                    offSet++;
                }
            } else {
                after = true;
            }
            return after ? hash + offSet : hash - offSet;
        }
    }
}
```