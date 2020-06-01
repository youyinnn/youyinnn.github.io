## :star: JS&Node.js库

### React Native 


> 可以做桌面应用

网址: https://proton-native.js.org/#/


### Layui


> 给后端用的前端框架

[官网](http://www.layui.com)


### wangEditor 轻量级前端富文本编辑器


![image](https://user-images.githubusercontent.com/23525754/39693997-65bd7248-5218-11e8-849b-15417cd9dda2.png)

[官网](http://www.wangeditor.com/)


### KaTeX 最快的数学公式渲染库


官方link : https://khan.github.io/KaTeX/function-support.html

editor.md的Demo : http://pandao.github.io/editor.md/examples/katex.html

![image](https://user-images.githubusercontent.com/23525754/39822606-93ef96f2-53dd-11e8-9381-d3d607eaf2eb.png)


### JQuery 日期选择控件


网站：https://xdsoft.net/jqplugins/datetimepicker/


### JS 数据可视化

有哪些值得推荐的数据可视化工具？ - 李启方的回答 - 知乎
https://www.zhihu.com/question/19929609/answer/383055223

### html2canvas 页面输出为canvas

超级棒的插件：
教程和踩坑：https://segmentfault.com/a/1190000011478657
hub：https://github.com/niklasvh/html2canvas

#### :small_blue_diamond:生成的canvas没有图片的坑：

要求CDN的图片配置好CORS。CDN配置好后，通过chrome开发者工具可以看到响应头中应含有Access-Control-Allow-Origin的字段。
开启html2canvas的useCORS配置项。即作如下设置： 

``` javascript
var opts = {useCORS: true};
html2canvas(element, opts);
```


### JS工具库 lodash

https://www.lodashjs.com/

是一个一致性、模块化、高性能的 JavaScript 实用工具库。

#### 为什么要用lodash？

Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。Lodash 的模块化方法 非常适用于：

- 遍历 array、object 和 string
- 对值进行操作和检测
- 创建符合功能的函数

### Express

https://www.expressjs.com.cn/

基于 Node.js 平台，快速、开放、极简的 Web 开发框架。

### systeminformation

> Lightweight collection of 40+ functions to retrieve detailed hardware, system and OS information. For Linux, macOS, partial Windows, FreeBSD, OpenBSD, NetBSD and SunOS support

https://systeminformation.io/

### websocket - Node.js

> Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js

https://github.com/websockets/ws

### jieba中文分词 - Node.js

#### 介绍

`NodeJieba`是"结巴"中文分词的 Node.js 版本实现， 由[CppJieba](https://github.com/yanyiwu/cppjieba.git)提供底层分词算法实现， 是兼具高性能和易用性两者的 Node.js 中文分词组件。

#### 特点

- 词典载入方式灵活，无需配置词典路径也可使用，需要定制自己的词典路径时也可灵活定制。
- 底层算法实现是C++，性能高效。
- 支持多种分词算法，各种分词算法见[CppJieba](https://github.com/yanyiwu/cppjieba.git)的README.md介绍。
- 支持动态补充词库。

对实现细节感兴趣的请看如下博文：

- [Node.js的C++扩展初体验之NodeJieba](http://yanyiwu.com/work/2014/02/22/nodejs-cpp-addon-nodejieba.html)
- [由NodeJieba谈谈Node.js异步实现](http://yanyiwu.com/work/2015/03/21/nodejs-asynchronous-insight.html)

https://github.com/yanyiwu/nodejieba

### 文件变动检查库 chokidar

https://github.com/paulmillr/chokidar

#### Why？

Node.js `fs.watch`:

- Doesn't report filenames on MacOS.
- Doesn't report events at all when using editors like Sublime on MacOS.
- Often reports events twice.
- Emits most changes as `rename`.
- Does not provide an easy way to recursively watch file trees.

Node.js `fs.watchFile`:

- Almost as bad at event handling.
- Also does not provide any recursive watching.
- Results in high CPU utilization.

Chokidar resolves these problems.

Initially made for **[Brunch](https://brunch.io/)** (an ultra-swift web app build tool), it is now used in [Microsoft's Visual Studio Code](https://github.com/microsoft/vscode), [gulp](https://github.com/gulpjs/gulp/), [karma](https://karma-runner.github.io/), [PM2](https://github.com/Unitech/PM2), [browserify](http://browserify.org/), [webpack](https://webpack.github.io/), [BrowserSync](https://www.browsersync.io/), and [many others](https://www.npmjs.com/browse/depended/chokidar). It has proven itself in production environments.

### 命令行执行库 execa

https://github.com/sindresorhus/execa

#### Why？

This package improves [`child_process`](https://nodejs.org/api/child_process.html) methods with:

- Promise interface.
- [Strips the final newline](https://github.com/sindresorhus/execa#stripfinalnewline) from the output so you don't have to do `stdout.trim()`.
- Supports [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) binaries cross-platform.
- [Improved Windows support.](https://github.com/IndigoUnited/node-cross-spawn#why)
- Higher max buffer. 100 MB instead of 200 KB.
- [Executes locally installed binaries by name.](https://github.com/sindresorhus/execa#preferlocal)
- [Cleans up spawned processes when the parent process dies.](https://github.com/sindresorhus/execa#cleanup)
- [Get interleaved output](https://github.com/sindresorhus/execa#all) from `stdout` and `stderr` similar to what is printed on the terminal. [*(Async only)*](https://github.com/sindresorhus/execa#execasyncfile-arguments-options)
- [Can specify file and arguments as a single string without a shell](https://github.com/sindresorhus/execa#execacommandcommand-options)
- More descriptive errors.

### nodemon

https://github.com/remy/nodemon

> nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
>
> nodemon does **not** require *any* additional changes to your code or method of development. nodemon is a replacement wrapper for `node`. To use `nodemon`, replace the word `node` on the command line when executing your script.



### pm2

https://pm2.keymetrics.io/docs/usage/quick-start/

> PM2 is a daemon process manager that will help you manage and keep your application online. 
>
> Getting started with PM2 is straightforward, it is offered as a simple and intuitive CLI, installable via NPM.

#### Windows设置pm2开机启动服务

https://www.jianshu.com/p/6cb523c0ced8

https://www.npmjs.com/package/pm2-windows-service

#### windows下fork模式弹出窗口问题

https://github.com/Unitech/pm2/issues/2182#issuecomment-629601292

```javascript
module.exports = {
  apps : [{
    name: 'winmon',
    script: 'index.js',
    watch: false,
    instances  : 1,
    exec_mode: 'cluster'
  }],
};
```