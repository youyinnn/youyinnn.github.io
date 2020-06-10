---
title: Python - Threading
categories:
  - python
  - concurrency-p
tags:
  - python
  - thread
series: Python Note
date: 2020-5-20 16:4:43
---





Introduce how to use multi-thread tech with python, refer to: https://docs.python.org/3/library/threading.html

### Lib - threading

Example of basic usage:

``` python
from threading import Thread
import threading
import time

def running():
    count = 0
    while count < 3:
        count = count + 1
        time.sleep(1)
        print('Thread running', count, ' ', threading.currentThread())

t = Thread(target=running)
t.start()

def trace():
    print('trace')

threading.settrace(trace)

print(threading.current_thread())
print(threading.main_thread())
print(threading.get_ident())
print(threading.enumerate())
print(threading.active_count())
```

Out:

``` console
<_MainThread(MainThread, started 9908)>
<_MainThread(MainThread, started 9908)>
9908
[<_MainThread(MainThread, started 9908)>, <Thread(Thread-1, started 7536)>]
2
Thread running 1   <Thread(Thread-1, started 7536)>
Thread running 2   <Thread(Thread-1, started 7536)>
Thread running 3   <Thread(Thread-1, started 7536)>
```



### Thread Object

Create a thread with:

*class* `threading.Thread`\(*group=None*, *target=None*, *name=None*, *args=()*, *kwargs={}*, *\**, *daemon=None*)

- *group* should be `None`; reserved for future extension when a `ThreadGroup` class is implemented.

- *target* is the callable object to be invoked by the [`run()`](https://docs.python.org/3/library/threading.html#threading.Thread.run) method. Defaults to `None`, meaning nothing is called.

- *name* is the thread name. By default, a unique name is constructed of the form “Thread-*N*” where *N* is a small decimal number.

- *args* is the argument tuple for the target invocation. Defaults to `()`.

- *kwargs* is a dictionary of keyword arguments for the target invocation. Defaults to `{}`.

- If not `None`, *daemon* explicitly sets whether the thread is daemonic. If `None` (the default), the daemonic property is inherited from the current thread.

  If the subclass overrides the constructor, it must make sure to invoke the base class constructor (`Thread.__init__()`) before doing anything else to the thread.

What is deamon thread?

> A thread can be flagged as a “daemon thread”. The significance of this flag is that the entire Python program exits when only daemon threads are left. The initial value is inherited from the creating thread. The flag can be set through the [`daemon`](https://docs.python.org/3/library/threading.html#threading.Thread.daemon) property or the *daemon* constructor argument.
>
> Daemon threads are abruptly stopped at shutdown. Their resources (such as open files, database transactions, etc.) may not be released properly. If you want your threads to stop gracefully, make them non-daemonic and use a suitable signalling mechanism such as an [`Event`](https://docs.python.org/3/library/threading.html#threading.Event).

Example:

``` python
from threading import Thread
import threading
def running():
    count = 0
    while True:
        count = count + 1
        print('Thread running', count, ' ', threading.currentThread())

t = Thread(target=running)
t.start()
```



### Lock Object

A primitive lock is a synchronization primitive that is not owned by a particular thread when locked. In Python, it is currently the lowest level synchronization primitive available, implemented directly by the [`_thread`](https://docs.python.org/3/library/_thread.html#module-_thread) extension module.

- `class threading.Lock`
  The class implementing primitive lock objects. Once a thread has acquired a lock, subsequent attempts to acquire it block, until it is released; any thread may release it.

  Note that Lock is actually a factory function which returns an instance of the most efficient version of the concrete Lock class that is supported by the platform.

  - `acquire(blocking=True, timeout=-1)`
    Acquire a lock, blocking or non-blocking.

    When invoked with the blocking argument set to True (the default), block until the lock is unlocked, then set it to locked and return True.

    When invoked with the blocking argument set to False, do not block. If a call with blocking set to True would block, return False immediately; otherwise, set the lock to locked and return True.

    When invoked with the floating-point timeout argument set to a positive value, block for at most the number of seconds specified by timeout and as long as the lock cannot be acquired. A timeout argument of -1 specifies an unbounded wait. It is forbidden to specify a timeout when blocking is false.

    The return value is True if the lock is acquired successfully, False if not (for example if the timeout expired).

  - `release()`
    Release a lock. This can be called from any thread, not only the thread which has acquired the lock.

    When the lock is locked, reset it to unlocked, and return. If any other threads are blocked waiting for the lock to become unlocked, allow exactly one of them to proceed.

    When invoked on an unlocked lock, a RuntimeError is raised.

    There is no return value.

  - `locked()`
    Return true if the lock is acquired.

Example:

``` python
from threading import Thread
from threading import Lock
import threading
import time

l = Lock()

money = 0

def addMoneyAction():
    if l.acquire():
        global money
        money = money + 100
        l.release()

def minusMoneyAction():
    if l.acquire():
        global money
        money = money - 50
        l.release()

def addMoneyProcess():
    count = 1
    while count <= 100000:
        count = count + 1
        addMoneyAction()

def minusMoneyProcess():
    count = 1
    while count <= 100000:
        count = count + 1
        minusMoneyAction()


t = Thread(target=addMoneyProcess)
t.start()

t2 = Thread(target=minusMoneyProcess)
t2.start()


while threading.activeCount() > 1:
    if l.acquire():
        print('check money:', money)
        l.release()
    time.sleep(1)
    
print('final money:', money)
```

Output:

``` console
check money: 3269550
final money: 5000000
```

The final money will always be 5000000.

### RLock Object

A reentrant lock is a synchronization primitive that may be acquired multiple times by the same thread. Internally, it uses the concepts of “owning thread” and “recursion level” in addition to the locked/unlocked state used by primitive locks. In the locked state, some thread owns the lock; in the unlocked state, no thread owns it.

To lock the lock, a thread calls its [`acquire()`](https://docs.python.org/3/library/threading.html#threading.RLock.acquire) method; this returns once the thread owns the lock. 

To unlock the lock, a thread calls its [`release()`](https://docs.python.org/3/library/threading.html#threading.Lock.release) method. [`acquire()`](https://docs.python.org/3/library/threading.html#threading.Lock.acquire)/[`release()`](https://docs.python.org/3/library/threading.html#threading.Lock.release) call pairs may be nested; only the final [`release()`](https://docs.python.org/3/library/threading.html#threading.Lock.release) (the [`release()`](https://docs.python.org/3/library/threading.html#threading.Lock.release) of the outermost pair) resets the lock to unlocked and allows another thread blocked in [`acquire()`](https://docs.python.org/3/library/threading.html#threading.Lock.acquire) to proceed.

Methods:

- `acquire(blocking=True, timeout=-1)`
  Acquire a lock, blocking or non-blocking.

- `release()`

  There is no return value.

Example:

``` python
from threading import Thread
from threading import RLock
import threading
import time

rl = RLock()

def running():
    if (rl.acquire()):
        print('aquire first')
        time.sleep(1)
        if (rl.acquire()):
            time.sleep(1)
            print('aquire second')
            if (rl.acquire()):
                time.sleep(1)
                print('aquire third')
                rl.release()
                print('release third')
            rl.release()
            print('release second')
        rl.release()
    print('release first')

t = Thread(target=running)
t.start()
                
def aq():
    while not rl.acquire(timeout=0):
        print('tring to aquire rl')
        time.sleep(0.5)
    print('rl aquired')

t2 = Thread(target=aq)
t2.start()
```

Out:

``` console
aquire first
tring to aquire rl
tring to aquire rl
tring to aquire rl
tring to aquire rl
aquire second
tring to aquire rl
tring to aquire rl
aquire third
release third
release second
release first
rl aquired
```



### Event Object

This is one of the simplest mechanisms for communication between threads: one thread signals an event and other threads wait for it.

An event object manages an internal flag that can be set to true with the [`set()`](https://docs.python.org/3/library/threading.html#threading.Event.set) method and reset to false with the [`clear()`](https://docs.python.org/3/library/threading.html#threading.Event.clear) method. The [`wait()`](https://docs.python.org/3/library/threading.html#threading.Event.wait) method blocks until the flag is true.

- `class threading.Event`
  Class implementing event objects. An event manages a flag that can be set to true with the set() method and reset to false with the clear() method. The wait() method blocks until the flag is true. **The flag is initially false**.

  - `is_set()`
    Return True if and only if the internal flag is true.

  - `set()`
    Set the internal flag to true. All threads waiting for it to become true are awakened. Threads that call wait() once the flag is true will not block at all.

  - `clear()`
    Reset the internal flag to false. Subsequently, threads calling wait() will block until set() is called to set the internal flag to true again.

  - `wait(timeout=None)`
    Block until the internal flag is true. If the internal flag is true on entry, return immediately. Otherwise, block until another thread calls set() to set the flag to true, or until the optional timeout occurs.

    When the timeout argument is present and not None, it should be a floating point number specifying a timeout for the operation in seconds (or fractions thereof).

    This method returns True if and only if the internal flag has been set to true, either before the wait call or after the wait starts, so it will always return True except if a timeout is given and the operation times out.

Example:

``` python
from threading import Thread
from threading import Event
import threading
import time

e = Event()

# the gate is opened when the flag is true
e.set()

release_count = 0
goods = 0

def collect():
    while True:        
        global release_count
        if (release_count == 3):
            print('Mission done, collecting process stop.')
            break
        if (e.isSet()):
            global goods
            print('collecting', ' ', goods)
            goods = goods + 200
            time.sleep(0.3)
        else:
            print('Wating the gate\'s opening')
            e.wait()

t = Thread(target=collect)
t.start()

def release():
    while True:
        global goods
        global release_count
        if (release_count == 3):
            print('Mission done, release process stop..')
            break
        if (goods == 1000):
            e.clear()
            release_count = release_count+ 1
            print('close the gate and release goods')
            goods = 0
            time.sleep(1)
            print('goods empty, open the gate')
            e.set()

t2 = Thread(target=release)
t2.start()
```

Out:

``` console
collecting   0
collecting   200
collecting   400
collecting   600
collecting   800
close the gate and release goods
Wating the gate's opening
goods empty, open the gate
collecting   0
collecting   200
collecting   400
collecting   600
collecting   800
close the gate and release goods
Wating the gate's opening
goods empty, open the gate
collecting   0
collecting   200
collecting   400
collecting   600
collecting   800
close the gate and release goods
Mission done, collecting process stop.
goods empty, open the gate
Mission done, release process stop..
```



### More on threading

#### Condition Objects

A condition variable is always associated with some kind of lock; this can be passed in or one will be created by default. Passing one in is useful when several condition variables must share the same lock. The lock is part of the condition object: you don’t have to track it separately.

The typical programming style using condition variables uses the lock to synchronize access to some shared state; threads that are interested in a particular change of state call [`wait()`](https://docs.python.org/3/library/threading.html#threading.Condition.wait) repeatedly until they see the desired state, while threads that modify the state call [`notify()`](https://docs.python.org/3/library/threading.html#threading.Condition.notify) or [`notify_all()`](https://docs.python.org/3/library/threading.html#threading.Condition.notify_all) when they change the state in such a way that it could possibly be a desired state for one of the waiters. For example, the following code is a generic producer-consumer situation with unlimited buffer capacity:

```python
# Consume one item
with cv:
    while not an_item_is_available():
        cv.wait()
    get_an_available_item()

# Produce one item
with cv:
    make_an_item_available()
    cv.notify()
```

The `while` loop checking for the application’s condition is necessary because [`wait()`](https://docs.python.org/3/library/threading.html#threading.Condition.wait) can return after an arbitrary long time, and the condition which prompted the [`notify()`](https://docs.python.org/3/library/threading.html#threading.Condition.notify) call may no longer hold true. This is inherent to multi-threaded programming. The [`wait_for()`](https://docs.python.org/3/library/threading.html#threading.Condition.wait_for) method can be used to automate the condition checking, and eases the computation of timeouts:

```python
# Consume an item
with cv:
    cv.wait_for(an_item_is_available)
    get_an_available_item()
```

#### Timer Objects

This class represents an action that should be run only after a certain amount of time has passed — a timer. [`Timer`](https://docs.python.org/3/library/threading.html#threading.Timer) is a subclass of [`Thread`](https://docs.python.org/3/library/threading.html#threading.Thread) and as such also functions as an example of creating custom threads.

Timers are started, as with threads, by calling their `start()` method. The timer can be stopped (before its action has begun) by calling the [`cancel()`](https://docs.python.org/3/library/threading.html#threading.Timer.cancel) method. The interval the timer will wait before executing its action may not be exactly the same as the interval specified by the user.

For example:

```python
def hello():
    print("hello, world")

t = Timer(30.0, hello)
t.start()  # after 30 seconds, "hello, world" will be printed
```

#### Barrier Objects

This class provides a simple synchronization primitive for use by a fixed number of threads that need to wait for each other. Each of the threads tries to pass the barrier by calling the [`wait()`](https://docs.python.org/3/library/threading.html#threading.Barrier.wait) method and will block until all of the threads have made their [`wait()`](https://docs.python.org/3/library/threading.html#threading.Barrier.wait) calls. At this point, the threads are released simultaneously.

The barrier can be reused any number of times for the same number of threads.

As an example, here is a simple way to synchronize a client and server thread:

```python
b = Barrier(2, timeout=5)

def server():
    start_server()
    b.wait()
    while True:
        connection = accept_connection()
        process_server_connection(connection)

def client():
    b.wait()
    while True:
        connection = make_connection()
        process_client_connection(connection)
```

#### Using locks, conditions, and semaphores in the `with` statement

All of the objects provided by this module that have `acquire()` and `release()` methods can be used as context managers for a [`with`](https://docs.python.org/3/reference/compound_stmts.html#with) statement. The `acquire()` method will be called when the block is entered, and `release()` will be called when the block is exited. Hence, the following snippet:

```
with some_lock:
    # do something...
```

is equivalent to:

```
some_lock.acquire()
try:
    # do something...
finally:
    some_lock.release()
```

Currently, [`Lock`](https://docs.python.org/3/library/threading.html#threading.Lock), [`RLock`](https://docs.python.org/3/library/threading.html#threading.RLock), [`Condition`](https://docs.python.org/3/library/threading.html#threading.Condition), [`Semaphore`](https://docs.python.org/3/library/threading.html#threading.Semaphore), and [`BoundedSemaphore`](https://docs.python.org/3/library/threading.html#threading.BoundedSemaphore) objects may be used as [`with`](https://docs.python.org/3/reference/compound_stmts.html#with) statement context managers.