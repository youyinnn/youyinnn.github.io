---
title: The Basic Grammar Of Python (AB)
categories:
  - python
  - grammar
tags:
  - python
  - grammar
series: Python Note
date: 2020-5-8 17:0:15
---



The series of \<Python Note\> is talking about some basic grammar rules of python, for quick search while I might use python.

The first article will introduces  `print()` and `input()`, the comment syntax, variables assignment and some basic types in python.

## A

### Method: print() & input()

Example:

``` python
print('NI', 'Hao') # NI HAO
print('1 + 3 =', 1 + 3) # 1 + 3 = 4
name = input() # type jack
print('name was signed as: ' + name) # name was signed as:  jack
```

#### print()

`print`(**objects*, *sep=' '*, *end='\n'*, *file=sys.stdout*, *flush=False*)

Print *objects* to the text stream *file*, separated by *sep* and followed by *end*. *sep*, *end*, *file* and *flush*, if present, must be given as keyword arguments.

``` python
print('NI', 'Hao', sep='-', end='') # NI HAO
print('1 + 3 =', 1 + 3) # NI HAO1 + 3 = 4
```

#### input()

`input`([*prompt*])

If the *prompt* argument is present, it is written to standard output without a trailing newline. The function then reads a line from input, converts it to a string (stripping a trailing newline), and returns that. When EOF is read, [`EOFError`](https://docs.python.org/3/library/exceptions.html#EOFError) is raised. Example:

```
>>> s = input('--> ')  
--> Monty Python's Flying Circus
>>> s  
"Monty Python's Flying Circus"
```

### Comment

``` python
# single line
''' multi-line 
xixi = 123
haha = 456
'''
```

### Variables Assignment

``` python
# assignment
var = '123'
var2, var3 = '123', 456

# delete reference
del var
# call print(var) will raise NameError: name 'var' is not defined
```



## B

### Basic Types

#### Boolean

##### Truth Value Testing

**Any object can be tested for truth value**, for use in an [`if`](https://docs.python.org/3/reference/compound_stmts.html#if) or [`while`](https://docs.python.org/3/reference/compound_stmts.html#while) condition or as operand of the Boolean operations below.

By default, an object **is considered `true`** unless its class defines either a [`__bool__()`](https://docs.python.org/3/reference/datamodel.html#object.__bool__) method that returns `False` or a [`__len__()`](https://docs.python.org/3/reference/datamodel.html#object.__len__) method that returns zero, when called with the object. [[1](https://docs.python.org/3/library/stdtypes.html#id12)]

Here are most of the built-in objects considered  **`false`**:

- constants defined to be false: `None` and `False`.
- zero of any numeric type: `0`, `0.0`, `0j`, `Decimal(0)`, `Fraction(0, 1)`
- empty sequences and collections: `''`, `()`, `[]`, `{}`, `set()`, `range(0)`

Operations and built-in functions that have a Boolean result always return `0` or `False` for false and `1` or `True` for true, unless otherwise stated. (Important exception: the Boolean operations `or` and `and` always return one of their operands.)

##### Operators

``` python
x or y # if x is false, then y, else x
x and y # if x is false, then x, else y
not x # if x is false, then True, else False
```

##### Comparisons

There are eight comparison operations in Python. They all have the same priority (which is higher than that of the Boolean operations). Comparisons **can be chained** arbitrarily like `x < y <= z` which equivalent to `x < y and y <= z`, except that *y* is evaluated only once (but in both cases *z* is not evaluated at all when `x < y` is found to be false).

This table summarizes the comparison operations:

| Operation | Meaning                 |
| :-------- | :---------------------- |
| `<`       | strictly less than      |
| `<=`      | less than or equal      |
| `>`       | strictly greater than   |
| `>=`      | greater than or equal   |
| `==`      | equal                   |
| `!=`      | not equal               |
| `is`      | object identity         |
| `is not`  | negated object identity |

Any object can be compared with those operators when defining `__lt__()`,`__le__()`,`__eq__()`,`__ne__()`, `__gt__()`,`__ge__()` methods. 

These are the so-called “rich comparison” methods. The correspondence between operator symbols and method names is as follows: `x<y` calls `x.__lt__(y)`, `x<=y` calls `x.__le__(y)`, `x==y` calls `x.__eq__(y)`, `x!=y` calls `x.__ne__(y)`, `x>y` calls `x.__gt__(y)`, and `x>=y` calls `x.__ge__(y)`.

Example:

``` python
@total_ordering
class Student:
    def _is_valid_operand(self, other):
        return (hasattr(other, "lastname") and
                hasattr(other, "firstname"))
    def __eq__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.lastname.lower(), self.firstname.lower()) ==
                (other.lastname.lower(), other.firstname.lower()))
    def __lt__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.lastname.lower(), self.firstname.lower()) <
                (other.lastname.lower(), other.firstname.lower()))
```

#### Numeric Types

The constructors [`int()`](https://docs.python.org/3/library/functions.html#int), [`float()`](https://docs.python.org/3/library/functions.html#float), and [`complex()`](https://docs.python.org/3/library/functions.html#complex) can be used to produce numbers of a specific type.

All numeric types (except complex) support the following operations (for priorities of the operations, see [Operator precedence](https://docs.python.org/3/reference/expressions.html#operator-summary)):

| Operation         | Result                                                       | Notes  | Full documentation                                           |
| :---------------- | :----------------------------------------------------------- | :----- | :----------------------------------------------------------- |
| `x + y`           | sum of *x* and *y*                                           |        |                                                              |
| `x - y`           | difference of *x* and *y*                                    |        |                                                              |
| `x * y`           | product of *x* and *y*                                       |        |                                                              |
| `x / y`           | quotient of *x* and *y*                                      |        |                                                              |
| `x // y`          | floored quotient of *x* and *y*                              | (1)    |                                                              |
| `x % y`           | remainder of `x / y`                                         | (2)    |                                                              |
| `-x`              | *x* negated                                                  |        |                                                              |
| `+x`              | *x* unchanged                                                |        |                                                              |
| `abs(x)`          | absolute value or magnitude of *x*                           |        | [`abs()`](https://docs.python.org/3/library/functions.html#abs) |
| `int(x)`          | *x* converted to integer                                     | (3)(6) | [`int()`](https://docs.python.org/3/library/functions.html#int) |
| `float(x)`        | *x* converted to floating point                              | (4)(6) | [`float()`](https://docs.python.org/3/library/functions.html#float) |
| `complex(re, im)` | a complex number with real part *re*, imaginary part *im*. *im* defaults to zero. | (6)    | [`complex()`](https://docs.python.org/3/library/functions.html#complex) |
| `c.conjugate()`   | conjugate of the complex number *c*                          |        |                                                              |
| `divmod(x, y)`    | the pair `(x // y, x % y)`                                   | (2)    | [`divmod()`](https://docs.python.org/3/library/functions.html#divmod) |
| `pow(x, y)`       | *x* to the power *y*                                         | (5)    | [`pow()`](https://docs.python.org/3/library/functions.html#pow) |
| `x ** y`          | *x* to the power *y*                                         | (5)    |                                                              |

Notes:

1. Also referred to as integer division. The resultant value is a whole integer, though the result’s type is not necessarily int. The result is always rounded towards minus infinity: `1//2` is `0`, `(-1)//2` is `-1`, `1//(-2)` is `-1`, and `(-1)//(-2)` is `0`.

2. Not for complex numbers. Instead convert to floats using [`abs()`](https://docs.python.org/3/library/functions.html#abs) if appropriate.

3. Conversion from floating point to integer may round or truncate as in C; see functions [`math.floor()`](https://docs.python.org/3/library/math.html#math.floor) and [`math.ceil()`](https://docs.python.org/3/library/math.html#math.ceil) for well-defined conversions.

4. float also accepts the strings “nan” and “inf” with an optional prefix “+” or “-” for Not a Number (NaN) and positive or negative infinity.

5. Python defines `pow(0, 0)` and `0 ** 0` to be `1`, as is common for programming languages.

6. The numeric literals accepted include the digits `0` to `9` or any Unicode equivalent (code points with the `Nd` property).

   See http://www.unicode.org/Public/12.1.0/ucd/extracted/DerivedNumericType.txt for a complete list of code points with the `Nd` property.

All [`numbers.Real`](https://docs.python.org/3/library/numbers.html#numbers.Real) types ([`int`](https://docs.python.org/3/library/functions.html#int) and [`float`](https://docs.python.org/3/library/functions.html#float)) also include the following operations:

| Operation                                                    | Result                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`math.trunc(x)`](https://docs.python.org/3/library/math.html#math.trunc) | *x* truncated to [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral) |
| [**`round(x[, n])`**](https://docs.python.org/3/library/functions.html#round) | *x* rounded to *n* digits, rounding half to even. If *n* is omitted, it defaults to 0. |
| [`math.floor(x)`](https://docs.python.org/3/library/math.html#math.floor) | the greatest [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral) <= *x* |
| [`math.ceil(x)`](https://docs.python.org/3/library/math.html#math.ceil) | the least [`Integral`](https://docs.python.org/3/library/numbers.html#numbers.Integral) >= *x* |

#### String

##### Basic Usage

``` python
# single quotes
print('spam eggs')
# double quotes
print("spam eggs")
# \ can be used to escape quotes
print("dosn\'t")

# index
word = "abcd"
print(word[1])
# range
print(word[-1])
print(word[2:3])
print(word[:3])

# span multiple line with triple quotes '''... ''' or """..."""
# backslash can prevent newline when placed at the end of the line
print('''\
Options: 
    -a      all
    -c      clean\
''')

print('''\
Show the index of a string like \'Python\'
    +---+---+---+---+---+---+
    | P | y | t | h | o | n |
    +---+---+---+---+---+---+
      0   1   2   3   4   5   6
     -6  -5  -4  -3  -2  -1\
''')

# operator '+' and '*'
print('h' +  2 * 'mmm')

# operator 'in' to see if a substr is contained in a sting
print('xi' in 'awpfasdxidapdpw')

# built-in function len()
print(len('1234'))

# method
## capitalize / lower / upper the str
print('hello'.capitalize())
print('hello'.upper())
print('ASD'.lower())
## centered / left justify / right justify the str with width
print('HELLO'.center(2))
print('HELLO'.center(10))
print('HELLO'.center(11, '-'))
print('HELLO'.ljust(11, '-'))
print('HELLO'.rjust(11, '-'))

## find and return the lowest index
print('hello'.find('ll'))
print('hello'.find('lel'))
print('hellohello'.rfind('llo'))

## index similar to find() but raise ValueError when the substr is not found
# print('hello'.index('lel'))
# print('hello'.rindex('lel'))

## isalnum() / isalpha()
print('1123'.isalnum())
print('aasd'.isalpha())

print('   '.isspace())
print('132'.isnumeric())

print('asddda'.replace('d', 'e'))
print('asddda'.replace('d', 'e', 2))

## endswith / startswith
print('asd'.endswith('d'))

## split
print('a,b,c'.split(','))
print('a,b,c'.split(',', maxsplit=1))
print('asd\naasd\naasda\r'.splitlines())
print('asd\naasd\naasda\r'.splitlines(keepends=True))

## strip remove certain characters from the sides of a string
print('#....ASdas..asad##..dadkjl....##...#'.strip('.#'))
print('#....ASdas..asad##..dadkjl....##...#'.lstrip('.#'))
print('#....ASdas..asad##..dadkjl....##...#'.rstrip('.#'))
```

Output:

``` console
spam eggs
spam eggs
dosn't
str asd number 123
b
d
c
abc
Options:
    -a      all
    -c      clean
Show the index of a string like 'Python'
    +---+---+---+---+---+---+
    | P | y | t | h | o | n |
    +---+---+---+---+---+---+
      0   1   2   3   4   5   6
     -6  -5  -4  -3  -2  -1
hmmmmmm
True
4
Hello
HELLO
asd
HELLO
  HELLO   
---HELLO---
HELLO------
------HELLO
2
-1
7
True
True
True
True
aseeea
aseeda
True
['a', 'b', 'c']
['a', 'b,c']
['asd', 'aasd', 'aasda']
['asd\n', 'aasd\n', 'aasda\r']
ASdas..asad##..dadkjl
ASdas..asad##..dadkjl....##...#
#....ASdas..asad##..dadkjl
```



##### Format

``` python
# fill with index
print('{}-{}-{}'.format(1,2,3))
print('{0}-{2}-{1}'.format(1,2,3))

# fill by values: add 'f' flag before quotes
a = 'xixi'
b = 'haha'
print(f'{a} {b}')

# fill with keys
print('{a} {b}'.format(a='xixi', b='haha'))

# fill with dict's key
d = {'a': 'xixi', 'b': 'haha'}
print('{a} {b}'.format(**d))

# fill with attributes
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __str__(self):
        return 'Point({me.x}, {me.y})'.format(me = self)

print(Point(3,4))

# aligning string
print('{:>30}'.format('align'))
print('{:<30}'.format('align'))
print('{:^30}'.format('align'))
print('{:-^30}'.format('align'))
print('{:*^30}'.format('align'))
print('{:*<30}'.format('align'))

# converting the value between different base
print('int:{0:d} hex:{0:x} oct:{0:o} bin:{0:b}'.format(10))
## with prefix
print('int:{0:d} hex:{0:#x} oct:{0:#o} bin:{0:#b}'.format(10))

# expressing percentage
i = 1 / 3
print('{0:>20.2%}'.format(i)) # align and percentage
print('{0:*>20.2%}'.format(i))
print('{0:>20.10%}'.format(i))
print('{0:.10%}'.format(i))
```
Output:

``` console
1-2-3
1-3-2
xixi haha
xixi haha
xixi haha
Point(3, 4)
                         align
align
            align
------------align-------------
************align*************
align*************************
int:10 hex:a oct:12 bin:1010
int:10 hex:0xa oct:0o12 bin:0b1010
              33.33%
**************33.33%
      33.3333333333%
33.3333333333%
```

##### Regex

``` python
# compile a regular expression pattern into a regular expression object 
import re

str = 'aasddohwawddogasads'

# use regular expression object 
po = re.compile(r'do[gh]')
print(po.search(str))

# use re directly
print(re.search(r'do[gh]', str))

# return all matching substr as list
print(re.findall(r'do[gh]', str))

# return all matching Match Object as list
for rs in re.finditer(r'do[gh]', str):
    print(rs)

# split str
print(re.split(r'[a-z]', 'adas123fd12d123', flags=re.IGNORECASE))

# replace
print(re.sub(r'and', '&', 'You And Me, Me And You.', flags=re.IGNORECASE))
print(re.sub(r'and', '&', 'You And Me, Me And You.', flags=re.IGNORECASE, count=1))
```
Output:
``` console
<re.Match object; span=(4, 7), match='doh'>
<re.Match object; span=(4, 7), match='doh'>
['doh', 'dog']
<re.Match object; span=(4, 7), match='doh'>
<re.Match object; span=(11, 14), match='dog'>
['', '', '', '', '123', '', '12', '123']
You & Me, Me & You.
You & Me, Me And You.
```



