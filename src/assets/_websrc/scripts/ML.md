## ML

### Stanford CS 229 Lecture Note

https://cs229.stanford.edu/notes2021fall/

### Concept

#### Multivariate Linear Regression

Linear regression with multiple variables is also known as "multivariate linear regression".

We now introduce notation for equations where we can have any number of input variables.

$x_j^{(i)}=$ the value of feature $j$ in the $i$ th training example

$x^{(i)}=$ the input (features) of the $i$ th training example

$m=$ the number of training **examples**

$n=$ the number of **features**

The multivariable form of the **hypothesis aka $h$** function accommodating these multiple features is as follows:

$$
h_\theta(x) = \theta_0 + \theta_1x_1 + \theta_2x_2 + \cdots + \theta_nx_n
$$

In order to develop intuition about this function, we can think about $\theta_0$ as the **basic price** of a house, $\theta_1$ as **the price per square meter**,  $\theta_2$ as the **price per floor**, etc.  

$x_1$ will be the number of square meters in the house, $x_2$ the number of floors, etc.

Using the definition of **matrix multiplication**, our **multivariable hypothesis function** can be concisely represented as:

$$
h_\theta(x) = 
[\theta_1 \enspace \theta_2 \enspace \theta_3 \enspace \cdots \enspace \theta_4]
\begin{bmatrix}
   x_0 \newline
   x_1 \newline
   x_2 \newline
   \vdots\newline
   x_n
\end{bmatrix}
=\theta^Tx
$$

This is a **vectorization** of our hypothesis function for one training example; see the lessons on vectorization to learn more.

Note that for convenience reasons in this course we assume $x_0^{(i)} =  for (i\in1,\dots,m)$.

This allows us to do matrix operations with theta and $x$. 

Hence making the two vectors $\theta$ and $x^{(i)} $ match each other element-wise (that is, have the same number of elements: $n+1$). 

