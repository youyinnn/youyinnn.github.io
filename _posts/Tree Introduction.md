---
title: Tree Introduction
categories:
  - datastruct
  - tree
tags:
  - algorithm
  - binary-tree
date: 2019-01-28 15:11:00
---



### Should have a PLAN!

I was asked a tree problem when I was having a face to face interview at *PayPal* last Friday, and I might failed on this question.

It's been too long that I'm almost forgot the knowledge of TREE, and I've never truly go over it and it's time to get it done.

The question:

<pre class="nhi">
A tree like:                          Node structure:
              5a &lt;-- root node             Node ┬ int  value
            /   \                               ├ Node left
           5b    5c                             └ Node right
          / \     \
         6   5d    7a
                  / \
                 5e  7b
Question: 
A "Group" is defined as a set that it's Nodes have the same value and within 
the relationship of Parent-Child. Find the number of group of provided tree.
e.g：the tree above will have 4 groups [5a,5b,5c,5d],[6],[7a,7b],[5e]
</pre>

### Introduction

**Trees:** Unlike Arrays, Linked Lists, Stack and queues, which are linear data structure, trees are hierarchical data structure.

**Tree Vocabulary:** The topmost node is called root of the tree. The elements that are directly under an element are called its children. The element directly above something is called its parent. For example, ‘a’ is a child of ‘f’, and ‘f’ is the parent of ‘a’. Finally, elements with no children are called leaves.

```
      tree
      ----
       j    <-- root
     /   \
    f      k  
  /   \      \
 a     h      z    <-- leaves 
```

**Why Trees?**
**1.** One reason to use trees might be because you want to store information that naturally forms a hierarchy. For example, the **file system** on a computer:

```
file system
-----------
     /    <-- root
  /      \
...       home
      /          \
   ugrad        course
    /       /      |     \
  ...      cs101  cs112  cs113  
```

**2.** Trees (with some ordering e.g., BST) provide moderate access/search (quicker than Linked List and slower than arrays).
**3.** Trees provide moderate insertion/deletion (quicker than Arrays and slower than Unordered Linked Lists).
**4.** Like Linked Lists and unlike Arrays, Trees don’t have an upper limit on number of nodes as nodes are linked using pointers.

**Main applications** of trees include:

1. Manipulate **hierarchical** data.
2. Make information easy to search (see tree traversal).
3. Manipulate sorted lists of data.
4. As a workflow for compositing digital images for visual effects.
5. Router algorithms
6. Form of a multi-stage decision-making (see business chess).

**Key Word:**

1. **moderate（中等的、适中的）**
2. **hierarchical（阶层的）**

### Binary Tree

**Binary Tree:** A tree whose elements have at most 2 children is called a binary tree. Since each element in a binary tree can have only 2 children, we typically name them the left and right child.

<pre>
Node ┬ int  value
     ├ Node left
     └ Node right
</pre>

#### Properties

1. The maximum number of nodes at level ‘l’ of a binary tree is **2^(l-1)**
2. Maximum number of nodes in a binary tree of height ‘h’ is **2^h – 1**
3. In a Binary Tree with N nodes, minimum possible height or minimum number of levels is  **⌈ Log2(N+1)⌉**

   This can be directly derived from point 2 above. If we consider the convention where height of a leaf node is considered as 0, then above formula for minimum possible height becomes   **⌈ Log2(N+1) ⌉ – 1**

4. A Binary Tree with L leaves has at least   ⌈ Log2L ⌉ + 1   levels
    A Binary tree has maximum number of leaves (and minimum number of levels) when all levels are fully filled. Let all leaves be at level l, then below is true for number of leaves L.

   ```
      L   <=  2l-1  [From Point 1]
      l =   ⌈ Log2L ⌉ + 1 
      where l is the minimum number of levels. 
   ```

5. In Binary tree where every node has 0 or 2 children, number of leaf nodes is always one more than nodes with two children

    ```
       L = T + 1
    Where L = Number of leaf nodes
          T = Number of internal nodes with two children
    ```

*PS：前两个理解一下就好了，后面3个用的少，用的时候还得查- -*

#### Types of Binary Tree

- **Full Binary Tree** A Binary Tree is full if **every node has 0 or 2 children**. Following are examples of a full binary tree. We can also say a full binary tree is a binary tree in which all nodes except leaves have two children.
- **Complete Binary Tree:** A Binary Tree is complete Binary Tree if all levels are completely filled except possibly the last level and the last level has all keys as left as possible.
- **Perfect Binary Tree** A Binary tree is Perfect Binary Tree in which all internal nodes have two children and **all leaves are at the same level**.
- **Balanced Binary Tree**
  A binary tree is balanced if the height of the tree is O(Log n) where n is the number of nodes. 
  - **AVL tree** maintains O(log n) height by making sure that the difference between heights of left and right subtrees is 1.
  - **Red-Black trees** maintain O(log n) height by making sure that the number of Black nodes on every root to leaf paths are same and there are no **adjacent(邻近的)** red nodes.
  - **Balanced Binary Search trees** are performance wise good as they provide O(log n) time for search, insert and delete.
- **A degenerate (or pathological) tree** A Tree where every internal node has one child. Such trees are performance-wise same as linked list.

