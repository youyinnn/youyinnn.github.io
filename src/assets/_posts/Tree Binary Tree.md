---
title: Tree Binary Tree
categories:
  - data structures
  - tree
tags:
  - algorithm
  - binary-tree
  - tree
  - dfs
  - bfs
date: 2019-01-30 21:36:20
---



### Basic Algorithm In Binary Tree

#### Traverse

A Tree is typically traversed in two ways:

- Breadth First Traversal (Or Level Order Traversal)
- Depth First Traversals
    - Inorder Traversal (Left-Root-Right)
    - Preorder Traversal (Root-Left-Right)
    - Postorder Traversal (Left-Right-Root)

```
            1
          /   \
         2     3
       /  \
      4    5

BFS and DFSs of above Tree
Breadth First Traversal : 1 2 3 4 5
Depth First Traversals:
      Preorder  : 1 2 4 5 3 
      Inorder   : 4 2 5 1 3 
      Postorder : 4 5 2 3 1
```

**Is there any difference in terms of Time Complexity?**
All four traversals require **O(n)** time as they visit every node exactly once.

**Is there any difference in terms of Extra Space?**
There is difference in terms of extra space required.

1. Extra Space required for **Level Order** Traversal is **O(w) where w is maximum width** of Binary Tree. In level order traversal, **queue** one by one stores nodes of different level.
2. Extra Space required for **Depth First** Traversals is **O(h) where h is maximum height** of Binary Tree. In Depth First Traversals, **stack** (or function call stack) stores all ancestors of a node.

***It is evident from above points that extra space required for Level order traversal is likely to be more when tree is more balanced and extra space for Depth First Traversal is likely to be more when tree is less balanced.***

**How to Pick One?**

1. Extra Space can be one factor (Explained above)

2. Depth First Traversals are typically recursive and recursive code requires function call overheads.

3. The most important points is:

    > **BFS starts visiting nodes from root while DFS starts visiting nodes from leaves.** 
    >
    > So if our problem is to search something that is more likely to closer to root, we would prefer BFS. And if the target node is close to a leaf, we would prefer DFS.

##### BFS(BreathFirstSearch)

**Idea:**

1. need a **queue**
2. need root node, and add it into queue
3. loop this while queue is not empty:
    1. dequeue the queue head as tmp
    2. print tmp's value;
    3. enqueue tmp's children(left first then right);

```java
public static void breathFirstTraversal(Node root) {
    LinkedList<Node> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        Node tmp = q.poll();
        System.out.print(tmp.val + " ");
        if (tmp.left != null) {
            q.add(tmp.left);
        }
        if (tmp.right != null) {
            q.add(tmp.right);
        }
    }
}
```

##### DFS(DepthFirstSearch)

With the different position of root's visit, their 3 types of DFS: **pre-order**, **in-order**, **post-order**.

There are two way we could use to implement it: **1) loop with stack; 2) recursion**

And we omit the recursion solusion here.

###### **Pre-Order**

```java
public List<Integer> preorderTraversal(TreeNode root) {
    LinkedList<Integer> ans = new LinkedList<>();
    if (root == null) return ans;
    Stack<TreeNode> s = new Stack<>();
    s.push(root);
    while (!s.isEmpty()) {
        TreeNode tmp = s.pop();
        ans.add(tmp.val);

        if (tmp.right != null) s.push(tmp.right);
        if (tmp.left  != null) s.push(tmp.left);
    }
    return ans;
}
```

###### **In Order**

```java
public List<Integer> inorderTraversal(TreeNode root) {
    LinkedList<Integer> ans = new LinkedList<>();
    Stack<TreeNode> s = new Stack<>();
    TreeNode tmp = root;
    while (tmp != null || !s.isEmpty()) {
        if (tmp != null) {
            s.push(tmp);
            tmp = tmp.left;
        } else {
            tmp = s.pop();
            ans.add(tmp.val);
            tmp = tmp.right;
        }
    }
    return ans;
}
```

###### **Post Order**

```java
public List<Integer> postorderTraversal(TreeNode root) {
    Stack<TreeNode> s = new Stack<>();
    LinkedList<Integer> ans = new LinkedList<>();
    if (root == null) return ans;
    s.push(root);
    while (!s.isEmpty()) {
        TreeNode tmp = s.pop();
        ans.addFirst(tmp.val);

        if (tmp.left  != null) s.push(tmp.left);
        if (tmp.right != null) s.push(tmp.right);
    }
    return ans;
}
```

#### Insertion in level order

**Idea:** Traverse tree with level order, find a node which didn't have two child, insert the new node at here with level order.

<pre>
tree: 
        10                                    10
      /    \            insert 3            /    \
    11      9           -------&gt;          11      9
      \    /                             /  \    /
       7  15                            3    7  15
</pre>

