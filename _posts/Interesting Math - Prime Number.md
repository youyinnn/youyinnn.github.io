---
title: Interesting Math - Prime Number
categories:
  - note
  - mathematics
tags:
  - prime
  - math
series: Interesting Math
date: 2020-4-16 8:43:39
---



### Preface

Prime number is important for computer science, especially in cryptography such as [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), which relies on the difficulty of [factoring](https://en.wikipedia.org/wiki/Integer_factorization) large numbers into their prime factors.

So I planed to summarize some concepts and algorithm of prime number.

### Basic Concepts

#### Prime number/Composite number

A **prime number** (or a **prime**) is a [natural number](https://en.wikipedia.org/wiki/Natural_number) greater than 1 that cannot be formed by multiplying two smaller natural numbers.

A natural number greater than 1 that is not prime is called a [composite number](https://en.wikipedia.org/wiki/Composite_number).

For exmple, 5 is a prime number because it can only be divided by 1 and 5 itself, but 6 can be divided by 1, 6, 2, 3.

#### Factor Number/Divisor number

In [mathematics](https://en.wikipedia.org/wiki/Mathematics), a **divisor** of an [integer](https://en.wikipedia.org/wiki/Integer)***n***, also called a **factor** of ***n***, is an integer***m*** that may be multiplied by some integer to produce***n***.

In this case, one also says that***n*** is a **multiple** of ***m***. An integer***n*** is **divisible** by another integer***m*** if***m*** is a divisor of***n***; this implies dividing***n*** by***m*** leaves no remainder.

7 can be divided by 2 and 3 but leaves 1 as remainder.

6 can be divided by 2 and 3 but leaves 0 as remainder.

#### Primality test

A simple but slow method of checking the primality of a given number ***n***, called [trial division](https://en.wikipedia.org/wiki/Trial_division), tests whether ***n*** is a multiple of any integer between 2 and ***√n***. Faster algorithms include the [Miller–Rabin primality test](https://en.wikipedia.org/wiki/Miller–Rabin_primality_test), which is fast but has a small chance of error, and the [AKS primality test](https://en.wikipedia.org/wiki/AKS_primality_test), which always produces the correct answer in [polynomial time](https://en.wikipedia.org/wiki/Polynomial_time) but is too slow to be practical. Particularly fast methods are available for numbers of special forms, such as [Mersenne numbers](https://en.wikipedia.org/wiki/Mersenne_number). As of December 2018 the [largest known prime number](https://en.wikipedia.org/wiki/Largest_known_prime_number) has 24,862,048 [decimal digits](https://en.wikipedia.org/wiki/Numerical_digit).

#### Interesting fact of prime number

> From [geeksforgeeks](https://www.geeksforgeeks.org/prime-numbers/)

1. Two is the only even Prime number.

2. Every prime number can represented in form of 6n+1 or 6n-1 except 2 and 3, where n is natural number.

3. Two and Three are only two consecutive natural numbers which are prime too.

4. [Goldbach Conjecture: ](https://en.wikipedia.org/wiki/Goldbach's_conjecture)Every even integer greater than 2 can be expressed as the sum of two primes.

5. Wilson Theorem: Wilson’s theorem states that a natural number p > 1 is a prime number if and only if

   ```
       (p - 1) ! ≡  -1   mod p 
   OR  (p - 1) ! ≡  (p-1) mod p
   ```

6. Fermat’s Little Theorem: If n is a prime number, then for every a, 1 <= a < n,

   ```
   an-1 ≡ 1 (mod n)
    OR 
   an-1 % n = 1 
   ```

7. [Prime Number Theorem](https://en.wikipedia.org/wiki/Prime_number_theorem) : The probability that a given, randomly chosen number n is prime is inversely proportional to its number of digits, or to the logarithm of n.

8. [Lemoine’s Conjecture](https://www.geeksforgeeks.org/lemoines-conjecture/) : Any odd integer greater than 5 can be expressed as a sum of an odd prime (all primes other than 2 are odd) and an even semiprime. A semiprime number is a product of two prime numbers. This is called Lemoine’s conjecture.

9. **There is no known efficient formula for primes. However, there are numerous expressions that do encode all primes, or only primes.**

### Primality Test

#### Trial division - O(√n)

The simplest primality test is *[trial division](https://en.wikipedia.org/wiki/Trial_division)*: Given an input number *n*, check whether any prime integer *m* from 2 to ***√n*** evenly [divides](https://en.wikipedia.org/wiki/Divisibility) *n* (the division leaves no [remainder](https://en.wikipedia.org/wiki/Remainder)). If *n* is divisible by any *m* then *n* is [composite](https://en.wikipedia.org/wiki/Composite_number), otherwise it is [prime](https://en.wikipedia.org/wiki/Prime_number).

Example coded with python:

``` python
def trialdivision(n):
    if (n <= 1):
        return False
    else:
        count = 2
        while count * count <= n:
            if n % count == 0:
                return False
            count = count + 1
        return True
```

#### Optimized solution - O(√n)

Based on the fact that **every prime number can represented in form of 6k+1 or 6k-1 except 2 and 3**, where n is natural number.

``` python
def sixkopt(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # starts from 5 because 4 is composite number
    k = 5
    while k * k <= n:
        if n % (k) == 0 or n % (k + 2) == 0:
            return False
        k = k + 6
    return True
```

#### Sieve of Eratosthenes

<img src="https://image.youyinnn.top/Sieve_of_Eratosthenes_animation.gif" style="clear:right;float:right;margin-left:1rem;">

In [mathematics](https://en.wikipedia.org/wiki/Mathematics), the **sieve of Eratosthenes** is an ancient [algorithm](https://en.wikipedia.org/wiki/Algorithm) for finding all [prime numbers](https://en.wikipedia.org/wiki/Prime_number) up to any given limit.

It does so by iteratively marking as [composite](https://en.wikipedia.org/wiki/Composite_number) (i.e., not prime) the multiples of each prime, starting with the first prime number, 2. The multiples of a given prime are generated as a sequence of numbers starting from that prime, with [constant difference between them](https://en.wikipedia.org/wiki/Arithmetic_progression) that is equal to that prime. This is the sieve's key distinction from using [trial division](https://en.wikipedia.org/wiki/Trial_division) to sequentially test each candidate number for divisibility by each prime.

The earliest known reference to the sieve ([Ancient Greek](https://en.wikipedia.org/wiki/Ancient_Greek_language): κόσκινον Ἐρατοσθένους, *kóskinon Eratosthénous*) is in [Nicomachus of Gerasa](https://en.wikipedia.org/wiki/Nicomachus)'s *[Introduction to Arithmetic](https://en.wikipedia.org/wiki/Introduction_to_Arithmetic)*, which describes it and attributes it to [Eratosthenes of Cyrene](https://en.wikipedia.org/wiki/Eratosthenes), a [Greek mathematician](https://en.wikipedia.org/wiki/Greek_mathematics).

One of a number of [prime number sieves](https://en.wikipedia.org/wiki/Generating_primes#Prime_sieves), it is one of the most efficient ways to find all of the smaller primes. It may be used to find primes in [arithmetic progressions](https://en.wikipedia.org/wiki/Arithmetic_progression).

To find all the prime numbers less than or equal to 30, proceed as follows.

First, generate a list of integers from 2 to 30:

 2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

The first number in the list is 2; cross out every 2nd number in the list after 2 by counting up from 2 in increments of 2 (these will be all the multiples of 2 in the list):

 2  3  <del>4</del>  5  <del>6</del>  7  <del>8</del>  9  <del>10</del> 11 <del>12</del> 13 <del>14</del> 15 <del>16</del> 17 <del>18</del> 19 <del>20</del> 21 <del>22</del> 23 <del>24</del> 25 <del>26</del> 27 <del>28</del> 29 <del>30</del>

The next number in the list after 2 is 3; cross out every 3rd number in the list after 3 by counting up from 3 in increments of 3 (these will be all the multiples of 3 in the list):

 2  3  <del>4</del>  5  <del>6</del>  7  <del>8</del>  <del>9</del> <del>10</del> 11 <del>12</del> 13 <del>14</del> <del>15</del> <del>16</del> 17 <del>18</del> 19 <del>20</del> <del>21</del> <del>22</del> 23 <del>24</del> 25 <del>26</del> <del>27</del> <del>28</del> 29 <del>30</del>

The next number not yet crossed out in the list after 3 is 5; cross out every 5th number in the list after 5 by counting up from 5 in increments of 5 (i.e. all the multiples of 5):

 2  3  <del>4</del>  5  <del>6</del>  7  <del>8</del>  <del>9</del> <del>10</del> 11 <del>12</del> 13 <del>14</del> <del>15</del> <del>16</del> 17 <del>18</del> 19 <del>20</del> <del>21</del> <del>22</del> 23 <del>24</del> <del>25</del> <del>26</del> <del>27</del> <del>28</del> 29 <del>30</del>

The next number not yet crossed out in the list after 5 is 7; the next step would be to cross out every 7th number in the list after 7, but they are all already crossed out at this point, as these numbers (14, 21, 28) are also multiples of smaller primes **because 7 × 7 is greater than 30**. The numbers not crossed out at this point in the list are all the prime numbers below 30:

 2  3     5     7           11    13          17    19          23                29

##### Implement - O(nlog(log(n)))

``` python
def SieveOfEratosthenes(n): 
    # Create a boolean array "prime[0..n]" and initialize 
    #  all entries it as true. A value in prime[i] will 
    # finally be false if i is Not a prime, else true. 
    prime = [True for i in range(n+1)] 
    p = 2
    while (p * p <= n): 
        # If prime[p] is not changed, then it is a prime 
        if (prime[p] == True): 
            # Update all multiples of p 
            for i in range(p * p, n+1, p): 
                prime[i] = False
        p += 1
```

### Application

#### Prime factor decomposition/Prime factorization

Given a composite integer ***n***, the task of providing one (or all) prime factors is referred to as *factorization* of ***n***. It is significantly more difficult than primality testing, and although many factorization algorithms are known, they are slower than the fastest primality testing methods. Trial division and [Pollard's rho algorithm](https://en.wikipedia.org/wiki/Pollard's_rho_algorithm) can be used to find very small factors of ***n***, and [elliptic curve factorization](https://en.wikipedia.org/wiki/Elliptic_curve_factorization) can be effective when ***n*** has factors of moderate size. Methods suitable for arbitrary large numbers that do not depend on the size of its factors include the [quadratic sieve](https://en.wikipedia.org/wiki/Quadratic_sieve) and [general number field sieve](https://en.wikipedia.org/wiki/General_number_field_sieve). 

As with primality testing, there are also factorization algorithms that require their input to have a special form, including the [special number field sieve](https://en.wikipedia.org/wiki/Special_number_field_sieve). As of December 2019 the [largest number known to have been factored](https://en.wikipedia.org/wiki/Integer_factorization_records) by a general-purpose algorithm is [RSA-240](https://en.wikipedia.org/wiki/RSA-240), which has 240 decimal digits (795 bits) and is the product of two large primes.

Several [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) algorithms, such as [RSA](https://en.wikipedia.org/wiki/RSA_(algorithm)) and the [Diffie–Hellman key exchange](https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange), are based on large prime numbers (2048-[bit](https://en.wikipedia.org/wiki/Bit) primes are common). 

RSA relies on the assumption that it is much easier (that is, more efficient) to perform the multiplication of two (large) numbers ***x*** and ***y*** than to calculate ***x*** and ***y*** (assumed [coprime](https://en.wikipedia.org/wiki/Coprime)) if only the product is known. The Diffie–Hellman key exchange relies on the fact that there are efficient algorithms for [modular exponentiation](https://en.wikipedia.org/wiki/Modular_exponentiation) (computing ***a^b mod c***), while the reverse operation (the [discrete logarithm](https://en.wikipedia.org/wiki/Discrete_logarithm)) is thought to be a hard problem.

Prime numbers are frequently used for [hash tables](https://en.wikipedia.org/wiki/Hash_table). For instance the original method of Carter and Wegman for [universal hashing](https://en.wikipedia.org/wiki/Universal_hashing) was based on computing [hash functions](https://en.wikipedia.org/wiki/Hash_function) by choosing random [linear functions](https://en.wikipedia.org/wiki/Linear_function) modulo large prime numbers. Carter and Wegman generalized this method to [***k***-independent hashing](https://en.wikipedia.org/wiki/K-independent_hashing) by using higher-degree polynomials, again modulo large primes.  As well as in the hash function, prime numbers are used for the hash table size in [quadratic probing](https://en.wikipedia.org/wiki/Quadratic_probing) based hash tables to ensure that the probe sequence covers the whole table.



### Reference

https://www.geeksforgeeks.org/prime-numbers/

https://en.wikipedia.org/wiki/Prime_number

https://en.wikipedia.org/wiki/Primality_test

https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes

