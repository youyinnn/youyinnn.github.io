---
title: Machine Learnnig Week1 Note
categories:
  - ml
tags:
  - dp
date: 2021-12-16 14:14:00 -4
---



### Defination of Machine Learning

From Arthur Samuel

> Machine learning as the field of study that gives computers the ability to learn without being explicitly learned

From Tom Mitchell

> A computer program is said to learn from experience E with respect to some task T and some performance measure P, if its performance on T, as measured by P, improves with experience E.

### Supervised Learning

You tell the program what is what and it will find the pattern by your guiding.

![img](../../../public/img/2d99281dfc992452c9d32e022ce71161.png)

#### Regression Problem

The picture shown above is a **regression problem** to be solved.

> **Predict** **continuous** valued output.

#### Classification Problem

![img](../../../public/img/4f80108ebbb6707d39b7a6da4d2a7a4e.png)

The picture shown above is a **classification problem** to be solved.

> **Discrete** valued output(there might be more than 2 values).

*More attributes can be used in the problem.

![img](../../../public/img/c34fa10153f223aa955d6717663a9f91.png)

### Singlevariate Linear Regression

Given an example:

![img](../../../public/img/44c68412e65e62686a96ad16f278571f.png)

To establish notation for future use, we’ll use

- $x^{(i)}$ to denote the “**input**” variables (living area in this example), also called input features.

- $ y^{(i)}$ to denote the “**output**” or target variable that we are trying to predict (price). 

- a pair $(x^{(i)} , y^{(i)} )$ is called a training example, and the dataset that we’ll be using to learn—a list of m training examples $(x^{(i)} , y^{(i)}); i = 1, . . . , m$—is called a training set. 

We will also use $X$ to denote the space of **input values**, and $Y$ to denote the space of **output values**.

To describe the supervised learning problem slightly more formally, our goal is, given a training set, to learn a function $h : X → Y $ so that $h(x)$ is a “good” predictor for the corresponding value of $y$. 

For historical reasons, this function h is called a **hypothesis**.

![img](../../../public/img/hypothesis-sl.png)

When the target variable that we’re trying to predict is continuous, such as in our housing example, we call the learning problem a **regression problem**. 

When $y$ can take on only a small number of discrete values (such as if, given the living area, we wanted to predict if a dwelling is a house or an apartment, say), we call it a **classification problem**.

#### The Cost Function

Back to the example of the house prices, with hypothesis:

$$
h_\theta(x) = \theta_0 + \theta_1x
$$

and with $\theta_i$ represent the **parameters** of the **model**, it is time to find out what $\theta_0$ and $\theta_1$ stand for.

![image-20211217153913519](../../../public/img/image-20211217153913519.png)

The mission is to **find out $\theta_0$ and $\theta_1$** to make our hypothesis function close to our tranning set.

Hence we have:

$$
J(\theta_0, \theta_1) = {1 \over 2m}\stackrel{m}{\sum_{i=1}}(h_\theta(x^{(i)}) \space\space - \space\space y^{(i)})^2
$$

We want the find out the **minimization** of the function:

$$
minimize \space J(\theta_0, \theta_1)
$$

We call $J(\theta_0, \theta_1)$ a **Cost function** or **Square error cost function**.It is the most commonly used function for most linear regression function.

This takes an **average difference** $\frac{1}{2m}$ (actually a fancier version of an average, better than $\frac{1}{m}$) of all the results of the hypothesis with inputs from $x$'s and the actual output $y$'s.

The **mean is halved($\frac{1}{2}$)** as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the $\frac{1}{2}$ term(因为平方函数的导数项将抵消掉$\frac{1}{2}$项).

#### Cost Function Intuition I

Say we have a hypothesis of $h_\theta(x)$ where $\theta$ contains only $\theta_1$, and $m = 3$, then we have:
$$
h_\theta(x) = \theta_1x
\newline
J(\theta_1) = {1 \over 2m}\stackrel{m}{\sum_{i=1}}(h_\theta(x^{(i)}) \space\space - \space\space y^{(i)})^2
$$
then when:

- $\theta_1 = 0$, $J(\theta_1) = \frac{1}{2m}(1^2 + 2 ^ 2 + 3^2) = \frac{1}{6} \cdot14$
- $\theta_1 = 1$, $J(\theta_1) = \frac{1}{2m}(0^2 + 0^2 + 0^2) = 0$
- ...

![img](../../../public/img/2c9fe871ca411ba557e65ac15d55745d.png)

we can plot $J(\theta_1)$ as the second picture shows, the minimize result will be 0 when $\theta_1 = 1$.



### Gradient Decent

Imagine that we graph our **hypothesis function** based on its fields $\theta_0$ and $\theta_1$ (actually we are graphing the cost function as a function of the parameter estimates). 

We are not graphing ***x*** and ***y*** itself, but the parameter range of our hypothesis function and the cost resulting from selecting a particular set of parameters.

We put $\theta_0$ on the ***x axis*** and  $\theta_1$on the ***y axis***, with the **cost function** on the vertical **z axis**. The points on our graph will be the result of the cost function using our hypothesis with those specific theta parameters. The graph below depicts such a setup.

![img](../../../public/img/No43vxpjKZqj8Sl8AdZwffsWj59Sq5u_iEDyMRKSv18.png)

We will know that we have succeeded when our cost function is **at the very bottom of the pits** in our graph, i.e. when its value is the minimum.  

The red arrows show the minimum points in the graph.

The way we do this is by taking the **derivative（导数）** (the **tangential line（正切线）** to a function) of our cost function. The **slope of the tangent（切面的坡度）** is the **derivative** at that point and it will give us a direction to move towards. 

We make steps down the cost function in the direction with the steepest descent. The **size** of each step is determined by the parameter $\alpha$, which is called the **learning rate**. 

For example, the distance between each 'star' in the graph above represents a step determined by our parameter $\alpha$. A **smaller** $\alpha$ would result in a **smaller step** and a **larger** $\alpha$ results in a **larger step**. 

The direction in which the step is taken is determined by the partial derivative of $J(\theta_0,\theta_1)$. 

Depending on **where one starts** on the graph, one could end up **at different points**. The image above shows us two different starting points that end up in two different places. 

> The **gradient descent algorithm** is:
>
> repeat until convergence:
> $$
> \theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta_0, \theta_1)
> $$
> where $j=0,1$ represents the feature index number.
>

At each iteration j, one should **simultaneously update** the parameters $\theta_1, \theta_2,...,\theta_n$. Updating a specific parameter prior to calculating another one on the $j^{(th)}$ iteration would yield to a wrong implementation. 

