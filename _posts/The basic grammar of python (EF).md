---
title: The Basic Grammar Of Python (EF)
categories:
  - python
  - grammar-p
tags:
  - python
  - grammar
series: Python Note
date: 2020-5-17 15:10:47
---







Data Structures, Classes and Errors & Exceptions.

## E

### Data Structures

#### Sequence Types — [`list`](https://docs.python.org/3/library/stdtypes.html#list), [`tuple`](https://docs.python.org/3/library/stdtypes.html#tuple), [`range`](https://docs.python.org/3/library/stdtypes.html#range)

There are three basic sequence types: lists, tuples, and range objects. Additional sequence types tailored for processing of [binary data](https://docs.python.org/3/library/stdtypes.html#binaryseq) and [text strings](https://docs.python.org/3/library/stdtypes.html#textseq) are described in dedicated sections.

#### Common Sequence Operations

The operations in the following table are supported by most sequence types, both mutable and immutable. The [`collections.abc.Sequence`](https://docs.python.org/3/library/collections.abc.html#collections.abc.Sequence) ABC is provided to make it easier to correctly implement these operations on custom sequence types.

| Operation              | Result                                                       |
| :--------------------- | :----------------------------------------------------------- |
| `x in s`               | `True` if an item of *s* is equal to *x*, else `False`       |
| `x not in s`           | `False` if an item of *s* is equal to *x*, else `True`       |
| `s + t`                | the concatenation of *s* and *t*                             |
| `s * n` or `n * s`     | equivalent to adding *s* to itself *n* times                 |
| `s[i]`                 | *i*th item of *s*, origin 0                                  |
| `s[i:j]`               | slice of *s* from *i* to *j*                                 |
| `s[i:j:k]`             | slice of *s* from *i* to *j* with step *k*                   |
| `len(s)`               | length of *s*                                                |
| `min(s)`               | smallest item of *s*                                         |
| `max(s)`               | largest item of *s*                                          |
| `s.index(x[, i[, j]])` | index of the first occurrence of *x* in *s* (at or after index *i* and before index *j*) |
| `s.count(x)`           | total number of occurrences of *x* in *s*                    |



#### Immutable Sequence Types

The only operation that immutable sequence types generally implement that is not also implemented by mutable sequence types is support for the [`hash()`](https://docs.python.org/3/library/functions.html#hash) built-in.

This support allows immutable sequences, such as [`tuple`](https://docs.python.org/3/library/stdtypes.html#tuple) instances, to be used as [`dict`](https://docs.python.org/3/library/stdtypes.html#dict) keys and stored in [`set`](https://docs.python.org/3/library/stdtypes.html#set) and [`frozenset`](https://docs.python.org/3/library/stdtypes.html#frozenset) instances.

Attempting to hash an immutable sequence that contains unhashable values will result in [`TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError).



#### Mutable Sequence Types

The operations in the following table are defined on mutable sequence types. The [`collections.abc.MutableSequence`](https://docs.python.org/3/library/collections.abc.html#collections.abc.MutableSequence) ABC is provided to make it easier to correctly implement these operations on custom sequence types.

| Operation                 | Result                                                       |
| :------------------------ | :----------------------------------------------------------- |
| `s[i] = x`                | item *i* of *s* is replaced by *x*                           |
| `s[i:j] = t`              | slice of *s* from *i* to *j* is replaced by the contents of the iterable *t* |
| `del s[i:j]`              | same as `s[i:j] = []`                                        |
| `s[i:j:k] = t`            | the elements of `s[i:j:k]` are replaced by those of *t*      |
| `del s[i:j:k]`            | removes the elements of `s[i:j:k]` from the list             |
| `s.append(x)`             | appends *x* to the end of the sequence (same as `s[len(s):len(s)] = [x]`) |
| `s.clear()`               | removes all items from *s* (same as `del s[:]`)              |
| `s.copy()`                | creates a shallow copy of *s* (same as `s[:]`)               |
| `s.extend(t)` or `s += t` | extends *s* with the contents of *t* (for the most part the same as `s[len(s):len(s)] = t`) |
| `s *= n`                  | updates *s* with its contents repeated *n* times             |
| `s.insert(i, x)`          | inserts *x* into *s* at the index given by *i* (same as `s[i:i] = [x]`) |
| `s.pop([i])`              | retrieves the item at *i* and also removes it from *s*       |
| `s.remove(x)`             | remove the first item from *s* where `s[i]` is equal to *x*  |
| `s.reverse()`             | reverses the items of *s* in place                           |



#### List

##### Basic Operation

Example:

``` python
l = []
l.append(1)
l.append('123')
l.extend([2,'456'])
l.insert(9, '88')
l.insert(0, '0')
print(l)

print(l.pop(1))
print(l)

ll = l.copy()
l.clear()
print(l)
l.extend(ll)

# ll and l contain different items
ll.pop(2)
print(l)
print(ll)

l.extend([1,2,1,1,2,1])
print(l)
print(l.count(1)) # Return the number of times '1' appears in the list.
```

Output:

``` console
['0', 1, '123', 2, '456', '88']
1
['0', '123', 2, '456', '88']
[]
['0', '123', 2, '456', '88']
['0', '123', '456', '88']
['0', '123', 2, '456', '88', 1, 2, 1, 1, 2, 1]
4
```

Slice operation:

All slice operations return a new list containing the requested elements. This means that the following slice returns a [shallow copy](https://docs.python.org/3/library/copy.html#shallow-vs-deep-copy) of the list:

``` python
# slice operation
print(l[:3])
print(l[2:5])
print(l[-3:])
```

> The difference between shallow and deep copying is only relevant for compound objects (objects that contain other objects, like lists or class instances):
>
> - A *shallow copy* constructs a new compound object and then (to the extent possible) inserts *references* into it to the objects found in the original.
> - A *deep copy* constructs a new compound object and then, recursively, inserts *copies* into it of the objects found in the original.

##### Sort

``` python
# sort
student_tuple = [
    ("Jack", 12),
    ("Mark", 10),
    ("Jim", 15),
]
student_tuple.sort(key=lambda student: student[1])
print(student_tuple)

class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __repr__(self):
        return repr((self.name, self.age))

student_obj = [
    Student('Jack', 12),
    Student('Mark', 10),
    Student('Jim', 15),
]

from operator import itemgetter, attrgetter

print(sorted(student_tuple, key=itemgetter(1)))
print(sorted(student_obj, key=attrgetter('age')))

# list comprehensions: a concise way to create lists
print(list(range(10)))
print(list(range(5, 10)))
```

Output:

``` console
[('Mark', 10), ('Jack', 12), ('Jim', 15)]     
[('Mark', 10), ('Jack', 12), ('Jim', 15)]
[('Mark', 10), ('Jack', 12), ('Jim', 15)]
```

##### Creation

Example:

``` python
# list comprehensions: a concise way to create lists
print(list(range(10)))
print(list(range(5, 10)))

## for in clause
### (result) for x in sequences
print([x * 2 for x in range(3)])
### equivalent to
sq = []
for x in range(3):
    sq.append(x * 2)
print(sq)

## if clause
print([(x, y) for x in [1,2,3] for y in [3, 1,4] if x!=y])
### equivalent to
sq = []
for x in [1, 2, 3]:
    for y in [3, 1, 4]:
        if (x != y):
            sq.append((x, y))
print(sq)

## lambda
print(list(map(lambda x: x**2, range(10))))
### equivalent to
print([x**2 for x in range(10)])

from math import pi
[str(round(pi, i)) for i in range(1, 6)]
```

Output:

``` console
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
[5, 6, 7, 8, 9]
[0, 2, 4]
[0, 2, 4]
[(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]
[(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
['3.1', '3.14', '3.142', '3.1416', '3.14159']
```



#### Tuples

Example:

``` python
>>> t = 12345, 54321, 'hello!'
>>> t[0]
12345
>>> t
(12345, 54321, 'hello!')
>>> # Tuples may be nested:
... u = t, (1, 2, 3, 4, 5)
>>> u
((12345, 54321, 'hello!'), (1, 2, 3, 4, 5))
>>> # Tuples are immutable:
... t[0] = 88888
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>> # but they can contain mutable objects:
... v = ([1, 2, 3], [3, 2, 1])
>>> v
([1, 2, 3], [3, 2, 1])
```

#### Sets

Example:

``` python
st = {'apple', 'orange', 'grape', 'grape', 'apple'}
print(st)

print('apple' in st)
print('cat' in st)

s1 = {1, 2, 3, 4, 5}
s2 = {4, 5, 6, 7, 8}

# in both a and b
print(s1 & s2)
# in a or b or both
print(s1 | s2)
# in a but not in b
print(s1 - s2)
# in b but not in a
print(s2 - s1)

# in a or b but not both
print(s1 ^ s2)

# comprehensions 
print({x for x in 'abcdefgh' if x not in 'efg'})
```

Output:

``` console
{'apple', 'orange', 'grape'}
True
False
{4, 5}
{1, 2, 3, 4, 5, 6, 7, 8}
{1, 2, 3}
{8, 6, 7}
{1, 2, 3, 6, 7, 8}
{'c', 'a', 'd', 'h', 'b'}
```



#### Dictionaries

Example:

``` python
d = {'a': 1, 'b':2}

# return keys list
print(list(d))
# get the number of items
print(len(d))

print(d['a'])
d['c'] = 3
print(d)
# delete item
del d['c']
print(d)

# remove all items
d.clear()
print(d)

# raise KeyError when no key in dict
import sys
try:
    print(d['e'])
except:
    print('Get error from sys')
    print(sys.exc_info())
    # raise

print('after error')

d = {'a': 1, 'b':2}
# return None when no such key in dict so that it will never raise the KeyError
print(d.get('e'))
print(d.get('e', 0))

print(d.keys())
print(d.items())
for k, v in d.items():
    print(k, v)
print(d.values())

it = d.__iter__()
for key in it:
    print(key, d[key])
```

Output:

``` console
['a', 'b']
2
1
{'a': 1, 'b': 2, 'c': 3}
{'a': 1, 'b': 2}
{}
Get error from sys
(<class 'KeyError'>, KeyError('e'), <traceback object at 0x000001FF722B2D48>)
after error
None
0
dict_keys(['a', 'b'])
dict_items([('a', 1), ('b', 2)])
a 1
b 2
dict_values([1, 2])
a 1
b 2
```



## F

### Classes

#### Namespaces And Scopes

##### Namespaces

A *namespace* is a mapping from names to objects. Most namespaces are currently implemented as Python dictionaries, but that’s normally not noticeable in any way (except for performance), and it may change in the future. 

Examples of namespaces are: 

- the set of built-in names (containing functions such as [`abs()`](https://docs.python.org/3/library/functions.html#abs), and built-in exception names); 
- the global names in a module; 
- the local names in a function invocation;

In a sense the set of attributes of an object also form a namespace. 

Namespaces are created at **different moments** and have different lifetimes. 

- The namespace containing the built-in names is created when **the Python interpreter starts up**, and is never deleted. 
- The global namespace for a module is created when **the module definition is read in**; normally, module namespaces also last until the interpreter quits. 
- The local namespace for a function is created **when the function is called**, and deleted when the function returns or raises an exception that is not handled within the function. 

##### Scopes

A *scope* is a textual region of a Python program where a namespace is directly accessible. “Directly accessible” here means that an unqualified reference to a name attempts to find the name in the namespace.

##### `global` and `nonlocal` statement

The [`global`](https://docs.python.org/3/reference/simple_stmts.html#global) statement is a declaration which holds for the entire current code block. It means that the listed identifiers are to be interpreted as globals. It would be impossible to assign to a global variable without `global`, although free variables may refer to globals without being declared global.

The [`nonlocal`](https://docs.python.org/3/reference/simple_stmts.html#nonlocal) statement causes the listed identifiers to refer to previously bound variables in the nearest enclosing scope excluding globals. This is important because the default behavior for binding is to search the local namespace first. The statement allows encapsulated code to rebind variables outside of the local scope besides the global (module) scope.

```python
def scope_test():
    def do_local():
        spam = "local spam"		# current enclosing scope (here is `do_local()`)

    def do_nonlocal():
        nonlocal spam			# up level enclosing scope (here is `scope_test()`)
        spam = "nonlocal spam"

    def do_global():
        global spam				# global scope (entire current code block)
        spam = "global spam"

    spam = "test spam"
    do_local()
    print("After local assignment:", spam)
    do_nonlocal()
    print("After nonlocal assignment:", spam)
    do_global()
    print("After global assignment:", spam)

scope_test()
print("In global scope:", spam)
```

Output:

```console
fter local assignment: test spam
After nonlocal assignment: nonlocal spam
After global assignment: nonlocal spam
In global scope: global spam
```

Note how the *local* assignment (which is default) didn’t change *scope_test*’s binding of *spam*. The [`nonlocal`](https://docs.python.org/3/reference/simple_stmts.html#nonlocal) assignment changed *scope_test*’s binding of *spam*, and the [`global`](https://docs.python.org/3/reference/simple_stmts.html#global) assignment changed the module-level binding.



#### Defining A Class

``` python
class Person:
    """here is __doc__ content\
    """

    # class variables/attributes which be shared in all instances
    kind = 'human_being'

    # construct function
    def __init__(self, name, age):
        super().__init__()
        # instance's vairables/attributes
        self.name, self.age = name, age

        # private attr with one underscores
        self._sname = '_' + name

        # private attr with at lease two underscores
        self.__ssname = '__' + name

    # common function
    def changename(self, name):
        self.name = name

    def getsname(self):
        return self._sname

    def getssname(self):
        # mangling: Any identifier of the form __spam is textually replaced with _classname__spam
        return self._Person__ssname
```

The code above has shown that:

1. how to define a class
2. construct function
3. private field & static field
4. some weird behavior of attribute naming

You might notice that every function's definition has the `self` argument as the first parameter. With this argument, this function will be defined as a instance function and can not be called by using `MyClass.func()` form.

So how do we define a static function? --- By using the `@staticmethod` decorator, or `@classmethod` as well.

``` python
class New:
    @classmethod
    def printc(cls):
        print('This is an class method')
        print(cls)
    @staticmethod
    def prints(name):
        print('This is a static method with name: {}'.format(name))

New.printc()
New.prints('Name')
```

Output:

``` console
This is an class method
<class '__main__.New'>
This is a static method with name: Name
cls
```

#### Inheritance

``` python
# inheritance
class Worker(Person):
    def __init__(self, name, age, career):
        super().__init__(name, age)
        self.career = career

w = Worker('Jim', 22, 'Driver')
print(w.career)
```

Python has two built-in functions that work with inheritance:

- Use [`isinstance()`](https://docs.python.org/3/library/functions.html#isinstance) to check an instance’s type: `isinstance(obj, int)` will be `True` only if `obj.__class__` is [`int`](https://docs.python.org/3/library/functions.html#int) or some class derived from [`int`](https://docs.python.org/3/library/functions.html#int).
- Use [`issubclass()`](https://docs.python.org/3/library/functions.html#issubclass) to check class inheritance: `issubclass(bool, int)` is `True` since [`bool`](https://docs.python.org/3/library/functions.html#bool) is a subclass of [`int`](https://docs.python.org/3/library/functions.html#int). However, `issubclass(float, int)` is `False` since [`float`](https://docs.python.org/3/library/functions.html#float) is not a subclass of [`int`](https://docs.python.org/3/library/functions.html#int).

#### Multiple Inheritance

Python supports a form of multiple inheritance as well. A class definition with multiple base classes looks like this:

```python
class DerivedClassName(Base1, Base2, Base3):
    <statement-1>
    .
    <statement-N>
```

#### Iterating Instances

If we want our self-make instance iterable (iterating some attribute of it), we should implement the `__iter__` and the `__next__` function

``` python
# iterator: object can be looped over using a for statement
class Str:
    def __init__(self, str):
        super().__init__()
        self.str = str
        self.index = 0
    
    # make object iterable
    def __iter__(self):
        return self

    def __next__(self):
        if self.index == len(self.str):
            # raise StopIteration to stop the for loop
            raise StopIteration
        else:
            rs = self.str[self.index]
            self.index = self.index + 1
            return rs

for c in Str('abcde'):
    print(c, end=' ')
print()
# a b c d e
```

#### Printing Instances

Example:

``` python
class Person:
    def __init__(self, name, age):
        super().__init__()
        self.__name = name
        self.__age = age

    def __repr__(self):
        # we use json form so that it can be recreated in another application
        return '{{name: {}, age: {}}}'.format(self.__name, self.__age)

    def __str__(self):
        return 'Person name: {}, age: {}'.format(self.__name, self.__age)

p = Person('Jack', 12)
print(p)
print(repr(p))
```

Output:

``` console
Person name: Jack, age: 12
{name: Jack, age: 12}
```

And if we remove the implementation of `__repr__()`, it will pinrt:

``` console
Person name: Jack, age: 12
<__main__.Person object at 0x000001F84F086630>
```

There are two ways in python that we can print a readable string of a instance -- to implement the `__repr__()` or `__str__()` .

Technically, there is no different between these two methods, but we should follow some rules when we implement them:

> For `__repr__`:
>
> Called by the [`repr()`](https://docs.python.org/3/library/functions.html#repr) built-in function to compute the “official” string representation of an object. If at all possible, this should look like a valid Python expression that could be used to recreate an object with the same value (given an appropriate environment). If this is not possible, a string of the form `<...some useful description...>` should be returned. The return value must be a string object. If a class defines [`__repr__()`](https://docs.python.org/3/reference/datamodel.html#object.__repr__) but not [`__str__()`](https://docs.python.org/3/reference/datamodel.html#object.__str__), then [`__repr__()`](https://docs.python.org/3/reference/datamodel.html#object.__repr__) is also used when an “informal” string representation of instances of that class is required.

> For `__str__`:
>
> Called by [`str(object)`](https://docs.python.org/3/library/stdtypes.html#str) and the built-in functions [`format()`](https://docs.python.org/3/library/functions.html#format) and [`print()`](https://docs.python.org/3/library/functions.html#print) to compute the “informal” or nicely printable string representation of an object. The return value must be a [string](https://docs.python.org/3/library/stdtypes.html#textseq) object.



#### More On Private Attributes

It is clear that we set an attribute to private for safely visitation, but it make the attribute visitation syntactically more complicated.

We can use `@property` and  `@attr.setter` decorators to make it simple. 

What's more , we can use `@attr.deleter`.

``` python
class Person:
    # a getter for age
    @property
    def age(self):
        return self._age

    # a setter for age
    @age.setter
    def age(self, age):
        if not isinstance(age, int):
            raise ValueError('Age should be an integer.')
        if age < 0 or age > 100:
            raise ValueError('Age should between 0 ~ 100')
        else:
            self._age = age
    
    @age.deleter
    def age(self):
        # more logic can be put in here
        del self._age

    def __str__(self):
        return 'Person: age:{}'.format(self._age)

p = Person()
import traceback
try:
    p.age = 1000
except:
    print(100 * '-')
    traceback.print_exc()
    print(100 * '-')

p.age = 99
print(p)
```

Output: 

``` console
----------------------------------------------------------------------------------------------------
Traceback (most recent call last):
  File "d:/Workshop/MyPython/practice/class/property.py", line 28, in <module>
    p.age = 1000
  File "d:/Workshop/MyPython/practice/class/property.py", line 14, in age
    raise ValueError('Age should between 0 ~ 100')
ValueError: Age should between 0 ~ 100
----------------------------------------------------------------------------------------------------
Person: age:99
```

reference: https://docs.python.org/3/library/functions.html#property

### Errors And Exceptions

#### Error

There is one error in python:

``` python
while True print('Hello world')
  File "<stdin>", line 1
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

#### Exceptions

##### Handling Exceptions

``` python
# handling exceptions
try:
    print(1 / 0)
except Exception as exc:
    import sys
    print(sys.exc_info()[0]) # exception type
    print(sys.exc_info()[1]) # exception value
    print(sys.exc_info()[2]) # exception tracback object
    import traceback
    traceback.print_exception(*sys.exc_info())
    print(100 * '-')
    # equvilent to .print_exception(*sys.exc_info())
    traceback.print_exc()
```

Output:

``` console
<class 'ZeroDivisionError'>
division by zero
<traceback object at 0x000001C8C4E12888>
Traceback (most recent call last):
  File "d:/Workshop/MyPython/practice/exception/exc.py", line 3, in <module>
    print(1 / 0)
ZeroDivisionError: division by zero
----------------------------------------------------------------------------------------------------
Traceback (most recent call last):
  File "d:/Workshop/MyPython/practice/exception/exc.py", line 3, in <module>
    print(1 / 0)
ZeroDivisionError: division by zero
```

The [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) statement works as follows.

- First, the *try clause* (the statement(s) between the [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) and [`except`](https://docs.python.org/3/reference/compound_stmts.html#except) keywords) is executed.
- If no exception occurs, the *except clause* is skipped and execution of the [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) statement is finished.
- If an exception occurs during execution of the try clause, the rest of the clause is skipped. Then if its type matches the exception named after the [`except`](https://docs.python.org/3/reference/compound_stmts.html#except) keyword, the except clause is executed, and then execution continues after the [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) statement.
- If an exception occurs which does not match the exception named in the except clause, it is passed on to outer [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) statements; if no handler is found, it is an *unhandled exception* and execution stops with a message as shown above.

The [`try`](https://docs.python.org/3/reference/compound_stmts.html#try) … [`except`](https://docs.python.org/3/reference/compound_stmts.html#except) statement has an optional *else clause*, which, when present, must follow all except clauses. It is useful for code that must be executed if the try clause does not raise an exception.

``` python
# seperate exception raising code and follow up code
try:
    v =  (1 / 10)
except Exception as exc:
    print(exc)
else:
    # continue when no exception is raised
    print(v)
# 0.1
```

##### Raising Exceptions

With `raise` statement:

```python
raise NameError('HiThere') # with msg
----------------------
raise ValueError # shorthand for 'raise ValueError()'
----------------------
try:
    raise NameError('HiThere')
except NameError:
    print('An exception flew by!')
    raise # raise it again in except clause
```

##### User-defined Exceptions

``` python
class InputError(Error):
    """Exception raised for errors in the input.

    Attributes:
        expression -- input expression in which the error occurred
        message -- explanation of the error
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message
```

##### Cleaning Up Actions

With `finally` statement:

```python
try:
    raise KeyboardInterrupt
finally:
    print('Goodbye, world!')
```
