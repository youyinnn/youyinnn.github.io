## Terminologies and Concepts

### Mathmatics

#### Floating Point Numbers

##### Left & Right

There are two **terminologies** that I'm familiar with. Sometimes, the part to the right of the decimal (cents) is called the **_mantissa_**, and the part to the left (dollars, in your metaphor), is called the **_characteristic_**.

But I also like the generic terms **_integer-part_** and **_fractional-part_**. It's what I and those with whom I do research call them (who uses the word mantissa routinely? not me, but perhaps someone). Yes, I know the fractional part doesn't actually have to be a fraction, but that's just something I toss into my big bag of math vagaries.

[reference](https://math.stackexchange.com/questions/64042/what-are-the-numbers-before-and-after-the-decimal-point-referred-to-in-mathemati)

#### Superscript & Subscript

$$
X_z^{y}
$$

#### Mean

Mean is same as the average number.

#### Prime

A notation where there is a ' at the top right of the target:

$$
X^\prime
$$

It represent the transpose of a matrix($X^T$) in octave.

#### Chart

##### Histogram

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Histogram_of_arrivals_per_minute.svg/1920px-Histogram_of_arrivals_per_minute.svg.png" style="zoom:33%;width:100%" />

#### Standard deviation

标准偏差

Suppose that the entire population of interest is eight students in a particular class. For a finite set of numbers, the population standard deviation is found by taking the [square root](https://en.wikipedia.org/wiki/Square_root) of the [average](https://en.wikipedia.org/wiki/Average) of the squared deviations of the values subtracted from their average value. The marks of a class of eight students (that is, a [statistical population](https://en.wikipedia.org/wiki/Statistical_population)) are the following eight values:

$$
2, \space4, \space4, \space4, \space5, \space5, \space7, \space9.
$$

These eight data points have the [mean](https://en.wikipedia.org/wiki/Mean) (average) of 5:

$$
\mu = \frac{2+4+4+4+5+5+7+9}{8} = 5
$$

First, calculate the deviations of each data point from the mean, and [square](<https://en.wikipedia.org/wiki/Square_(algebra)>) the result of each:

$$
(2-5)^2 = 9, \space(5-5)^2 = 0\\
(4-5)^2 = 1, \space(5-5)^2 = 0\\
(4-5)^2 = 1, \space(7-5)^2 = 4\\
(4-5)^2 = 1, \space(9-5)^2 = 16\\
$$

The [variance](https://en.wikipedia.org/wiki/Variance) is the mean of these values:

$$
\sigma^2 = \frac{
9+1+1+1+0+0+4+16
}{8} = \frac{32}{8} = 4
$$

and the _population_ standard deviation is equal to the square root of the variance:

$$
\sigma = \sqrt{4} = 2
$$

This formula is valid only if the eight values with which we began form the complete population. If the values instead were a random sample drawn from some large parent population (for example, they were 8 students randomly and independently chosen from a class of 2 million), then one divides by 7 (which is _n_ − 1) instead of 8 (which is _n_) in the denominator of the last formula, and the result is $s = \sqrt {32/7}\approx 2.1$.

In that case, the result of the original formula would be called the _sample_ standard deviation and denoted by _s_ instead of $\sigma$.

Dividing by _n_ − 1 rather than by _n_ gives an unbiased estimate of the variance of the larger parent population. This is known as _[Bessel's correction](https://en.wikipedia.org/wiki/Bessel's_correction)_.[[4\]](https://en.wikipedia.org/wiki/Standard_deviation#cite_note-4)[[5\]](https://en.wikipedia.org/wiki/Standard_deviation#cite_note-5) Roughly, the reason for it is that the formula for the sample variance relies on computing differences of observations from the sample mean, and the sample mean itself was constructed to be as close as possible to the observations, so just dividing by _n_ would underestimate the variability.

#### Hat Operator

https://en.wikipedia.org/wiki/Hat_operator

$$
\hat{\theta}
$$

In [statistics](https://en.wikipedia.org/wiki/Statistics), the hat is used to denote an [estimator](https://en.wikipedia.org/wiki/Estimator) or an estimated value. For example, in the context of [errors and residuals](https://en.wikipedia.org/wiki/Errors_and_residuals_in_statistics), the "hat" over the letter ε indicates an observable estimate (the residuals) of an unobservable quantity called ε (the statistical errors).
