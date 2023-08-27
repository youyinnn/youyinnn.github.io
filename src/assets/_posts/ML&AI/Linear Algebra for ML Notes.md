---
title: Linear Algebra for ML Notes
comments: true
tags:
  - algebra
series: Coursera, Linear Algebra
---

### Week 1

#### 2 Variables System

1. System of Sentences: Sentences are linear algebra equations for organizing the world's information.

2. Complete/Redundant/Contradictory System;

   Non-singular System -> Complete System;

   Singular System -> Redundant/Contradictory System;

   ![image-20230822215940482](../../img/image-20230822215940482.png)

   ![image-20230822220235281](../../img/image-20230822220235281.png)

3. Sentences to Equations

   ![image-20230822220352131](../../img/image-20230822220352131.png)

4. System of equations as lines

   ![image-20230822221317778](../../img/image-20230822221317778.png)

   The geometric notion of Singularity: We change the constants of the equations to zero, and then the lines move to the origin.

   ![image-20230822231234363](../../img/image-20230822231234363.png)

5. Systems of equations as matrices

   ![image-20230822231753952](../../img/image-20230822231753952.png)

6. (Linear) Dependence and Independence

   ![image-20230822231940545](../../img/image-20230822231940545.png)

7. Determinant Formula: to determine if a matrix is singular or not.

   ![image-20230822232328322](../../img/image-20230822232328322.png)

   $$ad$$ is the product of the main diagonal and $$bc$$ is the product of the antidiagonal.

   If the matrix is singular, then the determinant is equal to ***zero***.



#### 3 Variable System

More systems of equations.

![image-20230826201346215](../../img/image-20230826201346215.png)

Another example:

![image-20230826201431377](../../img/image-20230826201431377.png)

If we turn the constant into zero:

![image-20230826201630854](../../img/image-20230826201630854.png)



#### Linear Dependent and Independent in more complicated System

#### Linear Dependent 

Case 1:

![image-20230826202408030](../../img/image-20230826202408030.png)

The third equation depends on the first and the second equation.

Case 2:

![image-20230826204019824](../../img/image-20230826204019824.png)

#### Linear Indenpent

![image-20230826204600977](../../img/image-20230826204600977.png)



#### Determinant for 3x3

We should do this for each diagonal. If the diagonal is incomplete, we wrap around to the other side.

![image-20230826205016045](../../img/image-20230826205016045.png)

Case 3: A non-zero determinant means that it is a non-singular matrix.

![image-20230826205044401](../../img/image-20230826205044401.png)

Case 4: An upper triangular matrix. The determinant is the product of the diagonal entries.

![image-20230826225949948](../../img/image-20230826225949948.png)

![image-20230826230111689](../../img/image-20230826230111689.png)



### Week 2

#### Solving Non-singular System

Case 1:

![image-20230826234703204](../../img/image-20230826234703204.png)



#### Solving Singular System

Case 2:

![image-20230826235229454](../../img/image-20230826235229454.png)

Case 3:

![image-20230826235328636](../../img/image-20230826235328636.png)



#### Row Echelon Form

![image-20230827004553813](../../img/image-20230827004553813.png)

Definition:

![image-20230827005646788](../../img/image-20230827005646788.png)

1. The main diagonal should only contain 1 and 0;
2. The values below the main diagonal should only be 0;
3. The values of the 1's right of the diagonal could be anything;
4. The values of the 0's right of the diagonal must be 0;



#### Row Operations that Preserve Singularity

1. Switching Rows

   ![image-20230827010702249](../../img/image-20230827010702249.png)

2. Multiplying a Row by a non-zero scalar

   ![image-20230827010824927](../../img/image-20230827010824927.png)

3. Adding a Row to another row

   ![image-20230827010947668](../../img/image-20230827010947668.png)

   This will result in the same determinant.
