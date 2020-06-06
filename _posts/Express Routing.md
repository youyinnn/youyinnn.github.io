---
title: Express Routing
categories:
  - front-end
  - nodejs
  - express
tags:
  - express
  - nodejs
series: express
date: 2019-10-03 13:38:00
---



{% cq %}

翻译自官方文档

{% endcq %}

##  Routing

**Routing（路由）**指的是一个应用服务器的endpoints（URLs）怎么去响应客户端的请求。

你可以通过使用Express的`app`对象中和HTTP请求名称对应的方法去定义应用的路由行为；比如，`app.get()`方法用于处理GET请求或者使用`app.post()`方法去处理POST请求。完整的方法列表可以参考[app.METHOD](http://www.expressjs.com.cn/en/4x/api.html#app.METHOD)。你还可以使用[app.all()](http://www.expressjs.com.cn/en/4x/api.html#app.all) 去处理所有的HTTP方法，也可以使用[app.use()](http://www.expressjs.com.cn/en/4x/api.html#app.use) 去指定特定的回调方法 （参考[Using middleware](http://www.expressjs.com.cn/en/guide/using-middleware.html) ）。

这些路由方法指定一个回调方法（有时候又称为Handler方法）在Web应用收到对特定路由（endpoints）发出特定方式的请求的时候被调用。换句话说，应用程序能够监听所有请求，如果监听到请求的路由路径和请求方式有与之相配的路由方法，那么就调用该回调方法。

事实上，路由方法可以有多个回调函数作为参数，当设计这样的路由处理的时候，提供一个`next`方法作为参数到回调函数中是很有必要的，调用`next()`在回调方法体内来传递到下一个回调方法中。

下面这段代码展示了一个最基本的路由：

```javascript
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
```

### Route methods

一个路由方法是从一个HTTP方法中获取的，并且它附着于`express`类的实例上。

下面这段代码展示了GET路由和POST路由：

```javascript
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
})
```

Express支持所有HTTP请求。

还有一个特殊的 路由方法，`app.all()`用于加载中间件方法到所有的HTTP请求方法上。比如下面的例子会将回调方法应用到以任何方式请求到路径“/secret”上的请求：

```javascript
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})
```

### Route paths

路由路径和请求方法的组合共同定义了究竟是请求到哪一个回调逻辑中。路由路径可以是字符串，字符串pattern，或者是正则表达式。

字符 `?`, `+`, `*`, and `()`可以用于正则表达式， 连字符(`-`) 和点(`.`) 用于字符串表示的路径。

如果你需要在路径中使用美元符号，你需要用`([`和`])`括起来，比如要处理“`/data/$book`”，应该写为 “`/data/([\$])book`”。

Express使用[path-to-regexp](https://www.npmjs.com/package/path-to-regexp)来匹配路由路径。[Express Route Tester](http://forbeslindesay.github.io/express-route-tester/)是一个用于测试Express路由的工具，虽然它不支持模式匹配。

查询字符串不属于路由路径的一部分，下面是一些基本的例子：

Here are some examples of route paths based on strings.

This route path will match requests to the root route, `/`.

```javascript
app.get('/', function (req, res) {
  res.send('root')
})
```

This route path will match requests to `/about`.

```javascript
app.get('/about', function (req, res) {
  res.send('about')
})
```

This route path will match requests to `/random.text`.

```javascript
app.get('/random.text', function (req, res) {
  res.send('random.text')
})
```

Here are some examples of route paths based on string patterns.

This route path will match `acd` and `abcd`.

```javascript
app.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})
```

This route path will match `abcd`, `abbcd`, `abbbcd`, and so on.

```javascript
app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
```

This route path will match `abcd`, `abxcd`, `abRANDOMcd`, `ab123cd`, and so on.

```javascript
app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})
```

This route path will match `/abe` and `/abcde`.

```javascript
app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
```

Examples of route paths based on regular expressions:

This route path will match anything with an “a” in it.

```javascript
app.get(/a/, function (req, res) {
  res.send('/a/')
})
```

This route path will match `butterfly` and `dragonfly`, but not `butterflyman`, `dragonflyman`, and so on.

```javascript
app.get(/.*fly$/, function (req, res) {
  res.send('/.*fly$/')
})
```

### Route parameters

路由参数是被命名了的URL片段，用于捕捉URL中特定位置的值。被捕捉到的值会被移植到`req.params`对象上，以键值对的形式存储它们的值。

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

要定义带路由参数的路由，仅需像下面这样做：

```javascript
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
```

路由参数必须只能由大小写和数字组成，连字符和点可以正常使用，不受路由参数的影响：

```
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }
Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

为了更好地控制路由参数，你可以使用正则表达式去定位参数，将表达式用`()`括起来就可以了：

```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```

Because the regular expression is usually part of a literal string, be sure to escape any `\` characters with an additional backslash, for example `\\d+`.

In Express 4.x, [the `*` character in regular expressions is not interpreted in the usual way](https://github.com/expressjs/express/issues/2495). As a workaround, use `{0,}` instead of `*`. This will likely be fixed in Express 5.

### Route handlers

你能够提供多个像中间件一样处理请求的回调函数。唯一是例外就是这些回调函数会涉及到`next('route')`来传递到剩余的回调方法中。你能够使用这个机制去传递一些前置条件到路由中。

多个路由处理器能够构成到一个方法当中，一组方法数组，或者两者的结合都行，就像下面的例子一样：

一个单一的方法作为处理：

```javascript
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
```

多个回调方法，注意要调用`next()`方法：

```javascript
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})
```

回调方法的数组：

```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

两者之间的结合：

```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
```

### Response methods

response对象的方法都在下表中，可以发送响应到客户端并且终止请求响应周期。如果不调用下列的方法，请求就会被一直挂起

| Method                                                       | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [res.download()](http://www.expressjs.com.cn/en/4x/api.html#res.download) | Prompt a file to be downloaded.                              |
| [res.end()](http://www.expressjs.com.cn/en/4x/api.html#res.end) | End the response process.                                    |
| [res.json()](http://www.expressjs.com.cn/en/4x/api.html#res.json) | Send a JSON response.                                        |
| [res.jsonp()](http://www.expressjs.com.cn/en/4x/api.html#res.jsonp) | Send a JSON response with JSONP support.                     |
| [res.redirect()](http://www.expressjs.com.cn/en/4x/api.html#res.redirect) | Redirect a request.                                          |
| [res.render()](http://www.expressjs.com.cn/en/4x/api.html#res.render) | Render a view template.                                      |
| [res.send()](http://www.expressjs.com.cn/en/4x/api.html#res.send) | Send a response of various types.                            |
| [res.sendFile()](http://www.expressjs.com.cn/en/4x/api.html#res.sendFile) | Send a file as an octet stream.                              |
| [res.sendStatus()](http://www.expressjs.com.cn/en/4x/api.html#res.sendStatus) | Set the response status code and send its string representation as the response body. |

### app.route()

你能够通过使用`app.route()`方法为路由路径创建一个链式的路由。因为路径是指定到一个单一地点的，创建模块化的路由实际上对于简化代码很有帮助，更多信息请参考：[Router() documentation](http://www.expressjs.com.cn/en/4x/api.html#router)。

```javascript
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```

### express.Router

使用 `express.Router`类来创建模块化，可挂载的路由处理器。一个`Router`实例是一个完整的中间件和路由系统，因此它也被称为“mini-app”。

下面的例子创建了一个路由器作为模块，并加载了中间件功能，定义了一些路由然后挂载这个路由器到主程序的一个路径上面。

创建一个作路由用的文件 `birds.js` ：

```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
```

挂载路由器模块到app：

```javascript
var birds = require('./birds')

// ...

app.use('/birds', birds)
```

现在程序能够处理`/birds` 和 `/birds/about`路由，同时也能够调用中间件方法`timeLog`。