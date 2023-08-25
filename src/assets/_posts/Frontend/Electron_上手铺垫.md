---
title: Electron_上手铺垫
categories:
  - front-end
  - electron
comments: true
tags:
  - electron
series: electron
date: 2019-10-03 22:35:21
---

## Introduction

官方指南不叫指南，叫 document，于是乎开始无教程纯瞎子摸石头，于是想着把整个官方指南都看一遍，然后梳理梳理。

- 关于 electron 的命名空间
- 主进程和渲染进程
  - 区别
  - 通信方式
- 添加功能
  - 通知
  - 任务栏进度 bar
  - 其他

## Electron Namespace

`electron` 模块所提供的功能都是通过命名空间暴露出来的。 比如说： `electron.app`负责管理 Electron 应用程序的生命周期， `electron.BrowserWindow`类负责创建窗口。

从 0.37 开始，可以使用 [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) (es6 解构赋值)来使内置模块更容易使用。

```javascript
const { app, BrowserWindow } = require('electron')

let win

app.on('ready', () => {
  win = new BrowserWindow()
  win.loadURL('https://github.com')
})Copy
```

如果您需要整个 `electron` 模块, 则可以`require`它, 然后使用 destructuring 从 `electron` 访问各个模块。

```javascript
const electron = require('electron')
const { app, BrowserWindow } = electron

let win

app.on('ready', () => {
  win = new BrowserWindow()
  win.loadURL('https://github.com')
})Copy
```

这等效于以下代码:

```javascript
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let win;

app.on("ready", () => {
  win = new BrowserWindow();
  win.loadURL("https://github.com");
});
```

## Process

Electron 运行 `package.json` 的 `main` 脚本的进程被称为**主进程**。 在主进程中运行的脚本通过创建 web 页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的**渲染进程**中。

> 在普通的浏览器中，web 页面通常在沙盒环境中运行，并且无法访问操作系统的原生资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

### Differences Between Main Process And Render Process

主进程使用 `BrowserWindow` 实例创建页面。 每个 `BrowserWindow` 实例都在自己的渲染进程里运行页面。 当一个 `BrowserWindow` 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的 web 页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

Node. js 的所有 [内置模块 ](https://nodejs.org/api/)都在 Electron 中可用， 第三方 node 模块中也完全支持 (包括 [原生模块 ](https://electronjs.org/docs/tutorial/using-native-node-modules))。

Electron 还为开发原生桌面应用程序提供了一些额外的内置模块。 某些模块仅在主进程中可用, 有些仅在渲染进程 (web 页) 中可用, 而有些在这两个进程中都可以使用。

**基本规则是: 如果一个模块是 [GUI ](https://en.wikipedia.org/wiki/Graphical_user_interface)或底层系统相关的, 那么它应该只在主进程中可用。**

### Communication Of Processes

进程之间的通信有 3 种：

- ipcMain 和 ipcRenderer：实现进程间的**异步同步消息通信**
- remote 模块 RPC 通信：**主进程 API**暴露到渲染进程
- 页面间共享对象：可以暴露对象也可以通信

#### IPC

`ipcMain`模块是[EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 类的一个实例。 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息。 从渲染器进程发送的消息将被发送到该模块。

`ipcRenderer` 是一个 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 的实例。 你可以使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主进程。 也可以接收主进程回复的消息。

在 main.js 中：

```javascript
// 主进程和渲染进程之间通信
const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg);
  // 通过event的reply方法 回复异步信息
  setTimeout(() => {
    event.reply("asynchronous-reply", "as-pong");
  }, 2000);
});
ipcMain.on("synchronous-message", (event, arg) => {
  console.log(arg);
  // 直接用event的returnValue值来回复消息
  event.returnValue = "s-pong";
});
```

在 render.js 中：

```javascript
const { ipcRenderer } = require("electron");
$("#asmessage").click(() => {
  // 异步信息 直接发送
  ipcRenderer.send("asynchronous-message", "as-ping");
});
// 监听异步信息的响应
ipcRenderer.on("asynchronous-reply", (event, arg) => {
  // pong
  console.log(arg);
});
$("#smessage").click(() => {
  // 同步信息 发送之后等待响应
  console.log(ipcRenderer.sendSync("synchronous-message", "s-ping"));
});
```

#### Remote

`remote` 模块为渲染进程（web 页面）和主进程通信（IPC）提供了一种简单方法。

在 Electron 中, GUI 相关的模块 (如 `dialog`、`menu` 等) 仅在主进程中可用, 在渲染进程中不可用。 为了在渲染进程中使用它们, `ipc` 模块是向主进程发送进程间消息所必需的。 使用 `remote` 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息, 类似于 Java 的 [RMI ](https://en.wikipedia.org/wiki/Java_remote_method_invocation)。
例如：从渲染进程创建浏览器窗口/获取 app 对象

```javascript
const { BrowserWindow } = require('electron').remote
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')Copy

const app = require('electron').remote.app
console.log(app)
```

**注意:** 反过来（如果需要从主进程访问渲染进程），可以使用 [webContents. executeJavascript ](https://electronjs.org/docs/api/web-contents#contentsexecutejavascriptcode-usergesture-callback)。

**注意事项：** 因为安全原因，remote 模块能在以下几种情况下被禁用：

- [`BrowserWindow`](https://electronjs.org/docs/api/browser-window) - 通过设置 `enableRemoteModule` 选项为 `false`。
- [`<webview>`](https://electronjs.org/docs/api/webview-tag) - 通过把 `enableremotemodule`属性设置成 `false`。

在上面的示例中, [`BrowserWindow`](https://github.com/electron/electron/blob/master/docs/api/browser-window.md)和`win` 都是远程对象, `new BrowserWindow` 在渲染过程中没有创建 `BrowserWindow` 对象。 取而代之的是，它在主进程中创建了一个 `BrowserWindow`对象，并且在渲染进程中返回相应的远程对象，即`win`对象。

**注意：** 当远程对象被第一次引用时，只有[可枚举的属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)可以通过远程访问。

**注意：** 当通过`remote`模块访问时，数组和缓冲区在 IPC 上复制。 在渲染进程中修改它们不会在主进程中修改它们，反之亦然。

Electron 确保只要渲染进程中的远程对象一直存在（换句话说，没有被回收），主进程中的相应对象就不会被释放。 当远程对象被垃圾回收后，主进程中的相应对象将被解除引用。

如果远程对象在渲染进程中泄露（例如存储在映射中，但从未释放），则主进程中的相应对象也将被泄漏，所以您应该非常小心，不要泄漏远程对象。

但是，字符串和数字等主要值的类型是通过复制发送的。

#### Sharing Object

在两个网页（渲染进程）间共享数据最简单的方法是使用浏览器中已经实现的 HTML5 API。 其中比较好的方案是用 [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage)， [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)，[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) 或者 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)。

你还可以用 `Electron` 内的 IPC 机制实现。将数据存在主进程的某个全局变量中，然后在多个渲染进程中使用 `remote` 模块来访问它。

主进程和渲染进程之间：

```javascript
// 在主进程中
let win = new BrowserWindow({...})

global.share = {
    win: win
}

const win = require('electron').remote.getGlobal('share').win
```

渲染进程之间：

```javascript
// 在主进程中
global.sharedObject = {
  someProperty: "default value",
};
// 在第一个页面中
require("electron").remote.getGlobal("sharedObject").someProperty = "new value";
// 在第二个页面中
console.log(require("electron").remote.getGlobal("sharedObject").someProperty);
```

## Optional Function

#### Notification

这个功能就是弹出系统的提示窗，但是支持很不友好，有很多 BUG，也许是我没调出来，但是 github 上也有专门的[issue](https://github.com/electron/electron/issues/10864)还在 open，说明我不是特例，我反正搞了好久没搞出来。

所有三个操作系统都提供了应用程序向用户发送通知的手段。 Electron 允许开发者使用 [HTML5 Notification API](https://notifications.spec.whatwg.org/) 发送通知，并使用当前运行的操作系统的本地通知 API 来显示它。

**注意:** 由于这是一个 HTML5 API，它只能在渲染器进程中使用。 如果你想在主进程中显示通知，请查看 [Notification](https://electronjs.org/docs/api/notification) 模块.

```javascript
let myNotification = new Notification("标题", {
  body: "通知正文内容",
});

myNotification.onclick = () => {
  console.log("通知被点击");
};
```

#### ProgressBar

可以设置托盘图标的绿色进度条

```javascript
let progress = 0;
$("#processbar").click(function () {
  if (progress === 0) {
    progress = 0.5;
  } else {
    progress = 0;
  }
  win.setProgressBar(progress);
});
```

#### Others

其他的功能还有自定义 Windows 的任务栏，键盘快捷键的设置，离线在线监测（仅根据网络的 connection 状态来判断的），任务栏托盘图标闪烁等，文件拖拽等。

```javascript
let flash = false;
$("#flash").click(function () {
  if (flash) {
    flash = false;
  } else {
    flash = true;
  }
  // win.once('focus', () => win.flashFrame(false))
  win.flashFrame(flash);
});
```
