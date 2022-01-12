---
title: Machine Learning Week2 Note
categories:
  - ml
tags:
  - dp
date: 2022-01-11 10:03:00 -4
series: Machine Learning From Andrew Ng
---



## Multivariate Linear Regression

### Multiple Features

Linear regression with multiple variables is also known as "multivariate linear regression".

We now introduce notation for equations where we can have any number of input variables.

$x_j^{(i)}=$ the value of feature $j$ in the $i$ th training example

$x^{(i)}=$ the input (features) of the $i$ th training example

$m=$ the number of training **examples**

$n=$ the number of **features**

The multivariable form of the **hypothesis aka. $h$** function accommodating these multiple features is as follows:

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

### Gradient Descent with Multiple Features

#### The Equation

The gradient descent equation itself is generally the same form; we just have to repeat it for our 'n' features:

repeat until convergence:{
$$
\begin{aligned}
\theta_0 &:= \space \theta_0 - \alpha \frac{1}{m}\stackrel{m}{\sum_{i=1}}(h_\theta(x^{(i)}) - y^{(i)}) \space\cdot\space x_0^{(i)}

\\
\theta_1 &:= \space \theta_1 - \alpha \frac{1}{m}\stackrel{m}{\sum_{i=1}}((h_\theta(x^{(i)}) - y^{(i)}) \space \cdot \space x^{(i)}) \space\cdot\space x_1^{(i)}

\\
\theta_2 &:= \space \theta_2 - \alpha \frac{1}{m}\stackrel{m}{\sum_{i=1}}((h_\theta(x^{(i)}) - y^{(i)}) \space \cdot \space x^{(i)}) \space\cdot\space x_2^{(i)}

\\
\dots
\end{aligned}
$$
}

#### Feature Scaling & Mean Normalization

**"Choose an sufficient scale of the features."**

The idea of the scaling is to make sure features are on a nicer and similar scale to make the process reach the optima more faster.

Every feature should around approximately  $-1 \space \le x_i \le 1$.  

<img src="../../../public/img/image-20220111104319937.png" alt="image-20220111104319937" style="zoom:40%;width: 100%" />

Replace $x_i$ with  following formula and this do not apply to $x_0$.
$$
x_i:= \frac{x_i - \mu_i}{s_i}
$$
Where $μ_i$ is the **average** of all the values for feature (i) and $s_i$ is the range of values $ (max - min)$, or $s_i$ is the standard deviation.

E.g.
$$
\begin{aligned}
x_1 &= \frac{size - 1000}{(max\space number\space of\space x_1) - (min\space number\space of\space x_1)}
\\
x_2 &= \frac{\#bedrooms - 2}{(max\space number\space of\space x_2) - (min\space number\space of\space x_2)}
\end{aligned}
$$

will get this approximately:

$$
-0.5 \le x_1 \le 0.5 \space,\space -0.5 \le x_2 \le 0.5
$$

#### The Learning Rate

**"Choose a sufficient learning rate of the features."**

**Debugging gradient descent.** Make a plot with ***number of iterations*** on the x-axis. Now plot the cost function, $J(θ)$ over the number of iterations of gradient descent. If $J(θ)$ ever increases, then you probably need to decrease $α$.

![img](../../../public/img/rC2jGKgvEeamBAoLccicqA_ec9e40a58588382f5b6df60637b69470_Screenshot-2016-11-11-08.55.21.png)

#### Polynomial Regression

**"Some data can not be represent with just a straight line, things are more complicated."**

<img src="../../../public/img/image-20220111150432097.png" alt="image-20220111150432097" style="zoom:33%;width:100%" />

Suppose we want to know the price of the house, and we have two features which lead to the following hypothesis:
$$
h_\theta(x) = \theta_0 + \theta_1 \times frontage + \theta_2 \times depth
$$
we can merge those two features into one feature like this:
$$
h_\theta(x) = \theta_0 + \theta_1 \times area, \qquad area = frontage \times depth
$$

And suppose we have the following training set:

<img src="../../../public/img/image-20220111151455763.png" alt="image-20220111151455763" style="zoom:33%;width:100%" />

the quadratic function:
$$
h_\theta(x) = \theta_0 + \theta_1(size) + \theta_2(size)^2
$$
and the cube function:
$$
h_\theta(x) = \theta_0 + \theta_1(size) + \theta_2(size)^2 + \theta_3(size)^3
$$

are not the best choice to fit this model, maybe we can use the square root function:
$$
h_\theta(x) = \theta_0 + \theta_1(size) + \theta_2\sqrt{(size)}
$$

### Normal Equation

**“Another way for getting the $\theta$ in one step analytically.”**

Previously with the gradient descent function, we can get the result by examining the data set and iterating them. But that requires derivation and calculus involved.

Say we got an example:

<img src="../../../public/img/image-20220111162716034.png" alt="image-20220111162716034" style="zoom:50%;width:100%" />

and we can get the $\theta$ by computing this: 
$$
\theta = (X^TX)^{-1}X^Ty
$$
where $(X^TX)^{-1}$ is the inverse of the matrix $X^TX$. This is called **Normal Equation**.

This equation require no feature scaling.

Characteristic of those two methods:

| Gradient Descent             | Normal Equation                                |
| :--------------------------- | :--------------------------------------------- |
| Need to choose alpha         | No need to choose alpha                        |
| Needs many iterations        | No need to iterate                             |
| $O (kn^2)$                   | $O (n^3)$, need to calculate inverse of $X^TX$ |
| Works well when $n$ is large | Slow if $n$ is very large                      |

