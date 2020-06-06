---
title: The basic grammar of python (CD)
categories:
  - python
  - grammar-p
tags:
  - python
  - grammar
series: Python Note
date: 2020-5-10 14:19:14
---



Flow control syntax, Function definition, Modules.

## C

### Flow Control
#### `if` statement

``` python
if x > 0:
    print('x > 0')
elif x == 0: 
    print('x = 0')
else:
    print('x < 0')
```



#### `for` statement

Example:

``` python
array = [1, 2, 3, 4]
for i in array:
    print(i)
    
for i in range(5):
    print(i)
```

Else clause in the loop:

``` python
for i in range(5):
    if (i == 5):
        break
    else:
        print(i)
else:
    print('No break ', i)

for i in range(5):
    if (i == 4):
        print('break here')
        break
    else:
        print(i)
else:
    print('never be reached here because the break')
```

Key-pair iteration:

``` python
# key-pair 
clt = {'a': 'b', 'c': 'd'}
for key, val in clt.items():
    print(key, val)
```



#### `while` statement

``` python
while True:
    num = input('Please enter a number bigger than 10')
    if (num <= 10):
        print('Too small!')
    else：
    	print('Number is:', num)
        break
```





#### `pass` statement

The [`pass`](https://docs.python.org/3/reference/simple_stmts.html#pass) statement does nothing. It can be used when a statement is required syntactically but the program requires no action. For example:

```python
while True:
    pass  # Busy-wait for keyboard interrupt (Ctrl+C)
```

This is commonly used for creating minimal classes:

```python
class MyEmptyClass:
    pass
```

Another place [`pass`](https://docs.python.org/3/reference/simple_stmts.html#pass) can be used is as a place-holder for a function or conditional body when you are working on new code, allowing you to keep thinking at a more abstract level. The `pass` is silently ignored:

```python
def initlog(*args):
    pass   # Remember to implement this!
```





### Function

#### Define One

We must define a function with `def` keyword:

``` python
# fibonacci series to an arbitary boundary
def fib(n):
    a, b = 0, 1
    while a <= n:
        print(a, end=' ')
        a, b = b, a + b
    print()    
fib(2000)

# with return statement
def fib2(n):
    result = []
    a, b = 0, 1
    while a <= n:
        result.append(a)
        a, b = b, a + b
    return result

rs = fib2(2000)
print(rs)
```

#### Default Argument Values

``` python
# default arg values
def ask(name, age=10, gender='male'):
    print(name, age, gender)

ask('Jack')
ask('Jack', 12)
ask('Julia', gender='female')

# default value is evaluated only once
def foo(a, l=[]):
    l.append(a) # l will only be evaluated once at the first time calling this function
    print(l)

foo(1)
foo(2)
foo(3)
foo(4, l=[0]) # reassign l with a new list
```

Output:

``` console
Jack 10 male
Jack 12 male
Julia 10 female
[1]
[1, 2]
[1, 2, 3]
[0, 4]
```



#### Special Area Of Parameters

Take a look on this:

```python
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
      -----------    ----------     ----------
        |               /                  |
        |     Positional or keyword area   |
        |                                   -- Keyword only area
         -- Positional only area
```

To define function's parameter list, we should follow the order above.

`/` and `*` are optional. If used, these symbols indicate the kind of parameter by how the arguments may be passed to the function: positional-only, positional-or-keyword, and keyword-only. Keyword parameters are also referred to as named parameters.

Example:

```python
>>> def standard_arg(arg):
...     print(arg)
...
>>> def pos_only_arg(arg, /):
...     print(arg)
...
>>> def kwd_only_arg(*, arg):
...     print(arg)
...
>>> def combined_example(pos_only, /, standard, *, kwd_only):
...     print(pos_only, standard, kwd_only)
```

As guidance:

- Use positional-only if you want the name of the parameters to not be available to the user. This is useful when parameter names have no real meaning, if you want to enforce the order of the arguments when the function is called or if you need to take some positional parameters and arbitrary keywords.
- Use keyword-only when names have meaning and the function definition is more understandable by being explicit with names or you want to prevent users relying on the position of the argument being passed.
- For an API, use positional-only to prevent breaking API changes if the parameter’s name is modified in the future.



#### Keyword Arguments

Functions can also be called using [keyword arguments](https://docs.python.org/3/glossary.html#term-keyword-argument) of the form `kwarg=value`. For instance, the following function:

```python
def parrot(voltage, state='a stiff', action='voom', type='Norwegian Blue'):
    print("-- This parrot wouldn't", action, end=' ')
    print("if you put", voltage, "volts through it.")
    print("-- Lovely plumage, the", type)
    print("-- It's", state, "!")
```

accepts one required argument (`voltage`) and three optional arguments (`state`, `action`, and `type`). This function can be called in any of the following ways:

```python
parrot(1000)                                          # 1 positional argument
parrot(voltage=1000)                                  # 1 keyword argument
parrot(voltage=1000000, action='VOOOOOM')             # 2 keyword arguments
parrot(action='VOOOOOM', voltage=1000000)             # 2 keyword arguments
parrot('a million', 'bereft of life', 'jump')         # 3 positional arguments
parrot('a thousand', state='pushing up the daisies')  # 1 positional, 1 keyword
```

All the following calls would be invalid:

```python
parrot()                     # required argument missing
parrot(voltage=5.0, 'dead')  # non-keyword argument after a keyword argument
parrot(110, voltage=220)     # duplicate value for the same argument
parrot(actor='John Cleese')  # unknown keyword argument
```

In a function call, keyword arguments must follow positional arguments. All the keyword arguments passed must match one of the arguments accepted by the function (e.g. `actor` is not a valid argument for the `parrot` function), and their order is not important. This also includes non-optional arguments (e.g. `parrot(voltage=1000)` is valid too). No argument may receive a value more than once.

#### Packing Arguments

When a final formal parameter of the form `**name` is present, it receives a dictionary (see [Mapping Types — dict](https://docs.python.org/3/library/stdtypes.html#typesmapping)) **containing all keyword arguments** except for those corresponding to a formal parameter. 

This may be combined with a formal parameter of the form `*name` (described in the next subsection) which receives a [tuple](https://docs.python.org/3/tutorial/datastructures.html#tut-tuples) **containing the positional arguments** beyond the formal parameter list. (`*name` must occur before `**name`.) 

For example, if we define a function like this:

```python
def cheeseshop(kind, *arguments, **keywords):
    # 'kind' is a formal parameter
    print("-- Do you have any", kind, "?")
    print("-- I'm sorry, we're all out of", kind)
    # collecting formal parameters after 'kind' before keyword parameters as a list named 'argements'
    for arg in arguments:
        print(arg)
    print("-" * 40)
    # collectiong keyword parameters as a dict named 'keywords'
    for kw in keywords:
        print(kw, ":", keywords[kw])
```

It could be called like this:

```python
cheeseshop("Limburger", 
           "It's very runny, sir.",
           "It's really very, VERY runny, sir.",
           shopkeeper="Michael Palin",
           client="John Cleese",
           sketch="Cheese Shop Sketch")
```

and of course it would print:

```console
-- Do you have any Limburger ?
-- I'm sorry, we're all out of Limburger
It's very runny, sir.
It's really very, VERY runny, sir.
----------------------------------------
shopkeeper : Michael Palin
client : John Cleese
sketch : Cheese Shop Sketch
```

Note that the order in which the keyword arguments are printed is guaranteed to match the order in which they were provided in the function call.

#### Unpacking Arguments

Pass a list with `*` operator:

```python
>>> list(range(3, 6))            # normal call with separate arguments
[3, 4, 5]
>>> args = [3, 6]
>>> list(range(*args))            # call with arguments unpacked from a list
[3, 4, 5]
```

Pass a dictionary with `**` operator:

```python
>>> def parrot(voltage, state='a stiff', action='voom'):
...     print("-- This parrot wouldn't", action, end=' ')
...     print("if you put", voltage, "volts through it.", end=' ')
...     print("E's", state, "!")
...
>>> d = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
>>> parrot(**d)
-- This parrot wouldn't VOOM if you put four million volts through it. E's bleedin' demised !
```

#### Function Annotation

[Annotations](https://docs.python.org/3/glossary.html#term-function-annotation) are stored in the `__annotations__` attribute of the function as a dictionary and have no effect on any other part of the function.

**Parameter annotations** are defined by a colon(`:`) after the parameter name, followed by an expression evaluating to the value of the annotation.

**Return annotations** are defined by a literal `->`, followed by an expression, between the parameter list and the colon denoting the end of the [`def`](https://docs.python.org/3/reference/compound_stmts.html#def) statement.

The following example has a positional argument, a keyword argument, and the return value annotated:

```python
>>> def f(ham: str, eggs: str = 'eggs') -> str:
...     print("Annotations:", f.__annotations__)
...     print("Arguments:", ham, eggs)
...     return ham + ' and ' + eggs
...
>>> f('spam')
Annotations: {'ham': <class 'str'>, 'return': <class 'str'>, 'eggs': <class 'str'>}
Arguments: spam eggs
'spam and eggs'
```



#### Generator Function

This part is a bit advancing, I recommend reading this after reading the **(EF)** chapter.

##### Generator Expression

A generator expression is a compact generator notation in parentheses:

```python
generator_expression ::=  "(" expression comp_for ")"
```

In the part of Data Structures, we have learned creating a list by using expression:

``` python
l = [x * 2 for x in range(3)]
```

Actually, it was generator expression that repersenting an iterating process which generate a list:

``` python
g = (x * 2 for x in range(3))
l = [g]
```

And it act like an iterator object:

``` python
g = (x ** x for x in range(5))

for i in range(6):
    print(next(g))
```

Will get:

``` console
1
1
4
27
256
Traceback (most recent call last):
  File "/MyPython/practice/class/generator.py", line 24, in <module>
    print(next(g))
StopIteration
```

##### `yield` statement

We can turn a generator expression into a function by using `yield` statement:

``` python
g = (x ** x for x in range(5))
# is equivilant to 
def g():
    for i in range(5)
    	x = i ** i
        yield x
g = g() # it has to be call
```

###### More Examples

``` python
def f():
    try:
        yield 1
        try:
            yield 2
            1/0
            yield 3  # never get here
        except ZeroDivisionError:
            yield 4
            yield 5
            raise
        except:
            yield 6
        yield 7     # the "raise" above stops this
    except:
        yield 8
    yield 9
    try:
        x = 12
    finally:
       yield 10
    yield 11
print list(f()) # [1, 2, 4, 5, 8, 9, 10, 11]
```

refer to: https://www.python.org/dev/peps/pep-0255/#example

## D

### Modules

Python has a way to put definitions in a file and use them in a script or in an interactive instance of the interpreter. Such a file is called a *module*; definitions from a module can be ***imported*** into other modules or into the *main* module.

Before that, we should introduce a global variable  named `__name__` which can be used to identify whether a `.py` file is **run directly** from command line or **is imported** to other file as a module.

For example, say we got a file named `fibo.py`:

``` python
print('name in fibo', __name__) # will print 'fibo' when imported as a module
def fibo(n):
    # ...
def fiboprint(n):
    # ...

# response when executing modules files as scripts
if (__name__ == '__main__'):
    # to get command line arguments
    import sys
    if (sys.argv.__len__() > 1):
        fiboprint(int(sys.argv[1]))
    else:
        print('Please set n')
```

A module can contain excutable statement for the purpos of initializing the modules:

``` python
rs = [] # collecting result
def fibo(n):
    # put the result into the 'rs'
```

Or we can just run it as a command line script:

``` bash
python fibo.py 10
```

#### Import

``` python
# import as object
import fibo # this will import an object named 'fibo' which file name is 'fibo.py'
# usage
fibo.fibo(10)
fibp.fiboprint(10)

# import object with new name
import fibo as fiiboo
fiiboo.fibo(10)

# import function only
from fibo import fibo, fiboprint
fibo(10)
fiboprint(10)

# import function with new name
from fibo import fib as fibonacci
fibonacci(10)

# import all function
from fibo import *
```

#### Module Search Path

When a module named `fibo` is imported, the interpreter first searches for a built-in module with that name. If not found, it then searches for a file named `fibo.py` in a list of directories given by the variable [`sys.path`](https://docs.python.org/3/library/sys.html#sys.path). [`sys.path`](https://docs.python.org/3/library/sys.html#sys.path) is initialized from these locations:

- The directory containing the input script (or the current directory when no file is specified).
- [`PYTHONPATH`](https://docs.python.org/3/using/cmdline.html#envvar-PYTHONPATH) (a list of directory names, with the same syntax as the shell variable `PATH`).
- The installation-dependent default.

#### In Packages

Here’s a possible structure for your package (expressed in terms of a hierarchical filesystem):

```python
sound/                          Top-level package
      __init__.py               Initialize the sound package
      formats/                  Subpackage for file format conversions
              __init__.py
              wavread.py
              wavwrite.py
              ...
      effects/                  Subpackage for sound effects
              __init__.py
              echo.py
              surround.py
              ...
      filters/                  Subpackage for filters
              __init__.py
              equalizer.py
              ...
```

When importing the package, Python searches through the directories on `sys.path` looking for the package subdirectory.

The `__init__.py` files are required to make Python treat directories containing the file as packages. This prevents directories with a common name, such as `string`, unintentionally hiding valid modules that occur later on the module search path. 

In the simplest case, `__init__.py` **can just be an empty file**, but it can also execute initialization code for the package or set the `__all__` variable, described later.

Users of the package can import individual modules from the package, for example:

```python
import sound.effects.echo as echo
echo.makesound()
```

##### Import * From Packages

For example, the file `sound/effects/__init__.py` could contain the following code:

```python
__all__ = ["echo", "surround", "reverse"]

def do():
	# do something
```

This would mean that `from sound.effects import *` would import the three named submodules of the `sound` package.

What's more, we can define function in `sound/effects/__init__.py`，file and use it by:

``` python
import sound.effects as effects
effects.do()
```