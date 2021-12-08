---
title: Electron_配置相关与对象
categories:
  - front-end
  - electron
comments: true
tags:
  - electron
series: electron
date: 2019-10-10 09:03:21
---



### Introduction

有了一些铺垫之后，我们就能开始了解一下Electron的主体功能都提供了什么东西，具体的列表可以看：https://electronjs.org/docs/api

- 配置相关与对象
  - app：整个应用程序生命周期相关的api和事件
  - BrowserView：创建和控制视图
  - BrowserWindow：创建和控制浏览器窗口
  - webContent：渲染以及控制 web 页面
  - screen：检索有关屏幕大小、显示器、光标位置等的信息。
  - session：管理浏览器会话、cookie、缓存、代理设置等。
  - process：nodejs的process对象的扩展
- UI
  - 对话框
  - 菜单
  - 任务栏
  - 托盘
- 功能
  - 快捷键/系统快捷键：
  - 剪切板
  - 操作文件



### app

> 控制你的应用程序的事件生命周期。

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

下面的这个例子将会展示如何在最后一个窗口被关闭时退出应用：

```javascript
const { app } = require('electron')
app.on('window-all-closed', () => {
  app.quit()
})Copy
```

#### 事件

一些主要的事件如启动前后、退出先后的事件

- [事件: 'will-finish-launching'](https://electronjs.org/docs/api/app#事件-will-finish-launching)

- [事件: 'ready'](https://electronjs.org/docs/api/app#事件-ready)

- [事件: 'window-all-closed'](https://electronjs.org/docs/api/app#事件-window-all-closed)

- [事件：'before-quit'](https://electronjs.org/docs/api/app#事件：before-quit)

- [事件: 'will-quit'](https://electronjs.org/docs/api/app#事件-will-quit)

- [事件: 'quit'](https://electronjs.org/docs/api/app#事件-quit)

**其他事件：**

还有一些窗口blur和focus、webcontent创建、remote相关、crashed相关的事件

#### API

##### [`app.quit()`](https://electronjs.org/docs/api/app#appquit)

尝试关闭所有窗口 将首先发出 `before-quit` 事件。 如果所有窗口都已成功关闭, 则将发出 `will-quit` 事件, 并且默认情况下应用程序将终止。

此方法会确保执行所有`beforeunload` 和 `unload`事件处理程序。 可以在退出窗口之前的`beforeunload`事件处理程序中返回`false`取消退出。

##### [`app.exit([exitCode])`](https://electronjs.org/docs/api/app#appexitexitcode)

- `exitCode` Integer (可选)

立即退出程序并返回 `exitCode`。`exitCode` 的默认值是 0。

所有窗口都将立即被关闭，而不询问用户，而且 `before-quit` 和 `will-quit` 事件也不会被触发。

##### [`app.relaunch([options])`](https://electronjs.org/docs/api/app#apprelaunchoptions)

- `options` Object (可选)
  - `args` String
  - `execPath` String (可选)

从当前实例退出，重启应用。

默认情况下，新的实例将会使用和当前实例相同的工作目录以及命令行参数。 当设置了 `args` 参数时， `args` 将作为命令行参数传递。 当设置了 `execPath` ，`execPath` 将被执行以重新启动，而不是当前的应用程序。

请注意, 此方法在执行时不会退出当前的应用程序, 你需要在调用 `app.relaunch` 方法后再执行 `app. quit` 或者 `app.exit` 来让应用重启。

##### [`app.disableHardwareAcceleration()`](https://electronjs.org/docs/api/app#appdisablehardwareacceleration)

禁用当前应用程序的硬件加速。

这个方法只能在应用程序准备就绪（ready）之前调用。

##### [`app.disableDomainBlockingFor3DAPIs()`](https://electronjs.org/docs/api/app#appdisabledomainblockingfor3dapis)

默认情况下, 如果 GPU 进程频繁崩溃, Chromium 会禁用 3D api (例如 WebGL) 直到每个域重新启动。此函数禁用该行为。

这个方法只能在应用程序准备就绪（ready）之前调用。

##### [`app.getAppMetrics()`](https://electronjs.org/docs/api/app#appgetappmetrics)

返回 [`ProcessMetric[\]`](https://electronjs.org/docs/api/structures/process-metric): 包含所有与应用相关的进程的内存和CPU的使用统计的 `ProcessMetric` 对象的数组。

##### [`app.getGPUFeatureStatus()`](https://electronjs.org/docs/api/app#appgetgpufeaturestatus)

返回 [`GPUFeatureStatus`](https://electronjs.org/docs/api/structures/gpu-feature-status)-来自 `chrome://gpu/` 的图形功能状态。

##### [`app.getGPUInfo(infoType)`](https://electronjs.org/docs/api/app#appgetgpuinfoinfotype)

- `infoType` String - 值可以是基本信息的`basic`，也可以是完整信息的`complete`

##### 其他API

- 资源path相关
- 应用信息相关
- 任务栏List、最近打开文档相关
- 单例锁

### BrowserView

> 创建和控制视图

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

`BrowserView` 被用来让 [`BrowserWindow`](https://electronjs.org/docs/api/browser-window) 嵌入更多的 web 内容。 它就像一个子窗口，除了它的位置是相对于父窗口。 这意味着可以替代`webview`标签.

这个类有静态方法能够获取所有的BrowserView，也能够再窗口中创建新的Browser实例，也有destory等方法。

### BrowserWindow

> 创建和控制浏览器窗口

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

```javascript
// 在主进程中.
const { BrowserWindow } = require('electron')

// 或者从渲染进程中使用 `remote`.
// const { BrowserWindow } = require('electron').remote

let win = new BrowserWindow({ width: 800, height: 600 })
win.on('closed', () => {
  win = null
})

// 加载远程URL
win.loadURL('https://github.com')

// 或加载本地HTML文件
win.loadURL(`file://${__dirname}/app/index.html`)
```



#### API

[`new BrowserWindow([options])`](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions)

- `选项` Object (可选)
  - `width` Integer (可选) - 窗口的宽度，单位为像素。默认为`800`.
  - `height` Integer(可选) - 窗口的高度，单位为像素。默认为`600`.
  - `x` Integer (可选) (如果 y 存在时**必填**) - 窗口相对于屏幕左侧的偏移位置. 默认居中.
  - `y` Integer (可选) (如果 x 存在时**必填**) - 窗口相对于屏幕顶部的偏移位置. 默认居中.
  - `useContentSize` Boolean (可选) - `width` 和 `height` 将设置为 web 页面的尺寸(译注: 不包含边框), 这意味着窗口的实际尺寸将包括窗口边框的大小，稍微会大一点。 默认值为 `false`.
  - `center` Boolean (可选) - 窗口在屏幕居中.
  - `minWidth` Integer (可选) - 窗口的最小宽度, 默认值为 `0`.
  - `minHeight` Integer (可选) - 窗口的最小高度. 默认值为 `0`.
  - `maxWidth` Integer (可选) - 窗口的最大宽度, 默认无限制.
  - `maxHeight` Integer (可选) - 窗口的最大高度, 默认无限制.
  - `resizable` Boolean (可选) - 窗口是否可以改变尺寸. 默认值为`true`.
  - `movable` Boolean (可选) - 窗口是否可以移动. 在 Linux 中无效. 默认值为 `true`.
  - `minimizable` Boolean (可选) - 窗口是否可以最小化. 在 Linux 中无效. 默认值为 `true`.
  - `maximizable` Boolean (可选) - 窗口是否可以最大化动. 在 Linux 中无效. 默认值为 `true`.
  - `closable` Boolean (可选) - 窗口是否可以关闭. 在 Linux 中无效. 默认值为 `true`.
  - `focusable` Boolean (可选) - 窗口是否可以聚焦. 默认值为 `true`。 在 Windows 中设置 `focusable: false` 也意味着设置了`skipTaskbar: true`. 在 Linux 中设置 `focusable: false` 时窗口停止与 wm 交互, 并且窗口将始终置顶。
  - `alwaysOnTop` Boolean (可选) -窗口是否永远在别的窗口的上面. 默认值为`false`.
  - `fullscreen` Boolean (可选) - 窗口是否全屏. 当明确设置为 `false` 时，在 macOS 上全屏的按钮将被隐藏或禁用. 默认值为 `false`.
  - `fullscreenable` Boolean (可选) - 窗口是否可以进入全屏状态. 在 macOS上, 最大化/缩放按钮是否可用 默认值为 `true`。
  - `simpleFullscreen` Boolean (可选) - 在 macOS 上使用 pre-Lion 全屏. 默认为`false`.
  - `skipTaskbar` Boolean (可选) - 是否在任务栏中显示窗口. 默认值为`false`.
  - `kiosk` Boolean (可选) - kiosk 模式. 默认值为 `false`.
  - `title`String(可选) - 默认窗口标题 默认为`"Electron"`。 如果由`loadURL()`加载的HTML文件中含有标签`<title>`，此属性将被忽略。
  - `icon` ([NativeImage](https://electronjs.org/docs/api/native-image) | String) (可选) - 窗口的图标. 在 Windows 上推荐使用 `ICO` 图标来获得最佳的视觉效果, 默认使用可执行文件的图标.
  - `show` Boolean (可选) - 窗口创建的时候是否显示. 默认值为`true`.
  - `frame` Boolean (可选) - 设置为 `false` 时可以创建一个[Frameless Window](https://electronjs.org/docs/api/frameless-window). 默认值为 `true`.
  - `parent` BrowserWindow (可选) - 指定父窗口. 默认值为 `null`.
  - `modal` Boolean (可选) -是否为模态窗. 仅供子窗口使用. 默认值为`false`.
  - `acceptFirstMouse` Boolean (可选) - 是否允许单击页面来激活窗口. 默认值为 `false`.
  - `disableAutoHideCursor` Boolean (可选) - 是否在输入时隐藏鼠标. 默认值为`false`.
  - `autoHideMenuBar` Boolean (可选) - 自动隐藏菜单栏, 除非按了`Alt`键. 默认值为`false`.
  - `enableLargerThanScreen` Boolean (可选) - 是否允许改变窗口的大小时, 大于屏幕的尺寸. 默认值为`false`.
  - `backgroundColor` String(可选) - 窗口的背景颜色为十六进制值，例如`#66CD00`, `#FFF`, `#80FFFFFF` (设置`transparent`为`true`方可支持alpha属性，格式为#AARRGGBB)。 默认值为 `#FFF`（白色）。
  - `hasShadow` Boolean (可选) - 窗口是否有阴影. 仅在 macOS 上支持. 默认值为 `true`.
  - `opacity` Number (可选)-设置窗口初始的不透明度, 介于 0.0 (完全透明) 和 1.0 (完全不透明) 之间。仅支持 Windows 和 macOS 。
  - `darkTheme` Boolean (可选) - 强制窗口使用 dark 主题, 只在一些拥有 GTK+3 桌面环境上有效. 默认值为 `false`.
  - `transparent` Boolean (可选) - 使窗口 [透明](https://electronjs.org/docs/api/frameless-window). 默认值为 `false`.
  - `type` String (可选) - 窗口的类型, 默认为普通窗口. 下面可以查看更多.
  - `titleBarStyle` String (可选) - 窗口标题栏的样式. 默认值为 `default`. 可能的值有：
    - `default` - 标准灰色不透明的Mac标题栏
    - `hidden` - 隐藏标题栏, 内容充满整个窗口, 但它依然在左上角, 仍然受标准窗口控制.
    - `hiddenInset` - 隐藏标题栏, 显示小的控制按钮在窗口边缘
    - `customButtonsOnHover` Boolean (可选) - 在macOS的无框窗口上绘制自定义的关闭与最小化按钮. 除非鼠标悬停到窗口的左上角, 否则这些按钮不会显示出来. 这些自定义的按钮能防止, 与发生于标准的窗口工具栏按钮处的鼠标事件相关的问题. **注意:** 此选项目前是实验性的。
  - `fullscreenWindowTitle` Boolean (可选) - 在 macOS 全屏模式时，为所有带 `titleBarStyle` 选项的标题栏显示标题。默认值为 `false`。
  - `thickFrame` Boolean(可选)-对 Windows 上的无框窗口使用`WS_THICKFRAME` 样式，会增加标准窗口框架。 设置为 `false` 时将移除窗口的阴影和动画. 默认值为 `true`。
  - `vibrancy` String (可选) - 窗口是否使用 vibrancy 动态效果, 仅 macOS 中有效. 可以为 `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`, `sidebar`, `medium-light` 或 `ultra-dark`. 请注意，结合一个 vibrancy 值使用 `frame: false` ，需要确保`titleBarStyle`为一个非默认值。
  - `zoomToPageWidth` Boolean (可选) - 单击工具栏上的绿色信号灯按钮或单击 窗口>缩放 菜单项时的行为, 仅macOS中有效. 如果为 `true`, 窗口将放大到网页的本身宽度, `false` 将使其缩放到屏幕的宽度。 这也会影响直接调用 `maximize()` 时的行为。 默认值为 `false`.
  - `tabbingIdentifier` String (可选) - 选项组卡的名称，在macOS 10.12+上可使窗口在原生选项卡中打开. 具有相同标识符的窗口将被组合在一起。 这还会在窗口的标签栏中添加一个原生的新选项卡按钮, 并允许 `app` 和窗口接收 `new-window-for-tab` 事件。
  - `webPreferences` Object (可选) - 网页功能的设置
    - `devTools` Boolean (可选) - 是否开启 DevTools. 如果设置为 `false`, 则无法使用 `BrowserWindow.webContents.openDevTools ()` 打开 DevTools。 默认值为 `true`。
    - `nodeIntegration` Boolean (可选) - 是否集成Node，默认为`false`。
    - `nodeIntegrationInWorker` Boolean (可选) - 是否在Web工作器中启用了Node集成. 默认值为 `false`. 更多内容参见 [多线程](https://electronjs.org/docs/tutorial/multithreading).
    - `nodeIntegrationInSubFrames` Boolean (optional) - Experimental option for enabling Node.js support in sub-frames such as iframes and child windows. All your preloads will load for every iframe, you can use `process.isMainFrame` to determine if you are in the main frame or not.
    - `preload` String (可选) -在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径。 当 node integration 关闭时, 预加载的脚本将从全局范围重新引入node的全局引用标志 [参考示例](https://electronjs.org/docs/api/process#event-loaded).
    - `sandbox` Boolean (可选)-如果设置该参数, 沙箱的渲染器将与窗口关联, 使它与Chromium OS-level 的沙箱兼容, 并禁用 Node. js 引擎。 它与 `nodeIntegration` 的选项不同，且预加载脚本的 API 也有限制. [更多详情](https://electronjs.org/docs/api/sandbox-option). **注意:**改选项目前是为实验性质，可能会在 Electron 未来的版本中移除。
    - `enableRemoteModule` Boolean（可选）- 是否启用 [`Remote`](https://electronjs.org/docs/api/remote) 模块。 默认值为 `true`。
    - `session` [Session](https://electronjs.org/docs/api/session#class-session) (可选) - 设置页面的 session 而不是直接忽略 Session 对象, 也可用 `partition` 选项来代替，它接受一个 partition 字符串. 同时设置了`session` 和 `partition`时, `session` 的优先级更高. 默认使用默认的 session.
    - `partition` String (optional) - 通过 session 的 partition 字符串来设置界面session. 如果 `partition` 以 `persist:`开头, 该页面将使用持续的 session，并在所有页面生效，且使用同一个`partition`. 如果没有 `persist:` 前缀, 页面将使用 in-memory session. 通过分配相同的 `partition`, 多个页可以共享同一会话。 默认使用默认的 session.
    - `affinity` String (可选) - 当指定，具有相同`affinity` 的 web页面将在相同的渲染进程运行。 需要注意的是，由于渲染过程中会有代码重用，如 `webPreferences`的`preload`, `sandbox` 和 `nodeIntegration`等选项会在不同页面之间共用，即使你已经在不同页面中为同一选项设置过不同的值，它们仍会被共用。 因此，建议为`affinity`相同的页面，使用相同的 `webPreferences` *这一选项当前是实验性的*
    - `zoomFactor` Number (可选) - 页面的默认缩放系数, `3.0` 表示 `300%`. 默认值为 `1.0`.
    - `javascript` Boolean (可选) - 是否启用 JavaScript 支持. 默认值为 `true`.
    - `webSecurity` Boolean (可选) - 当设置为 `false`, 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的，还会把 `allowRunningInsecureContent`设置为 `true`. 默认值为 `true`。
    - `allowRunningInsecureContent` Boolean (可选) -允许一个 https 页面运行 http url 里的资源，包括 JavaScript, CSS 或 plugins. 默认值为 `false`.
    - `images` Boolean (可选) - 启动图像支持. 默认值为 `true`.
    - `textAreasAreResizable` Boolean (可选) - 让 TextArea 元素可以调整大小. 默认值为 `true`.
    - `webgl` Boolean (可选) - 启用 WebGL 支持. 默认值为 `true`.
    - `plugins` Boolean (可选) - 是否支持插件. 默认值为 `false`.
    - `experimentalFeatures` Boolean (optional) - 启用 Chromium 的实验功能. 默认值为 `false`.
    - `scrollBounce` Boolean (可选) - 在 macOS 启用弹力动画 (橡皮筋) 效果. 默认值为 `false`.
    - `enableBlinkFeatures`String(可选) - 以`逗号`分隔的需要启用的特性列表，譬如`CSSVariables,KeyboardEventKey` 在 [RuntimeEnabledFeatures.json5](https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/runtime_enabled_features.json5?l=70)文件中查看被支持的所有特性.
    - `disableBlinkFeatures` String (可选) - 以 `,`分隔的禁用特性列表, 如 `CSSVariables,KeyboardEventKey`. 在[RuntimeEnabledFeatures.json5](https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/runtime_enabled_features.json5?l=70) 文件中查看被支持的所有特性.
    - `defaultFontFamily` Object (可选) - 设置 font-family 的默认字体.
      - `standard` String (可选) - 默认值为 `Times New Roman`.
      - `serif` String (可选) - 默认值为 `Times New Roman`.
      - `sansSerif` String (可选) - 默认值为 `Arial`.
      - `monospace` String (可选) - 默认值为 `Courier New`.
      - `cursive` String (可选) - 默认值为 `Script`.
      - `fantasy` String (可选) - 默认值为 `Impact`.
    - `defaultFontSize` Integer (可选) - 默认值为 `16`.
    - `defaultMonospaceFontSize` Integer (可选) - 默认值为 `13`.
    - `minimumFontSize` Integer (可选) - 默认值为 `0`.
    - `defaultEncoding` String (可选) - 默认值为 `ISO-8859-1`.
    - `backgroundThrottling`Boolean (可选)-是否在页面成为背景时限制动画和计时器。 这也会影响到 [Page Visibility API](https://electronjs.org/docs/api/browser-window#page-visibility). 默认值为 `true`。
    - `offscreen` Boolean (optional) - 是否绘制和渲染可视区域外的窗口. 默认值为 `false`. 更多详情, 请参见 [offscreen rendering tutorial ](https://electronjs.org/docs/tutorial/offscreen-rendering)。
    - `contextIsolation` Boolean (可选) - 是否在独立 JavaScript 环境中运行 Electron API和指定的`preload` 脚本. 默认值为 `false`. `preload`脚本的运行环境仍然可以访问`document` 和 `window`全局变量，但它将使用自己内置的函数 (如`Array`, `Object`, `JSON`等)，并且将被加载的页面与对全局环境所做的任何更改隔离开来. Electron API 仅在 `preload` 脚本中有效，而不是加载的页面。 在加载可能不受信任的远程内容时, 应使用此选项, 以确保加载的内容不能篡改 `preload` 脚本和使用的 Electron APIs。 此选项使用 [Chrome Content Scripts ](https://developer.chrome.com/extensions/content_scripts#execution-environment)使用的相同技术。 通过在控制台选项卡顶部的组合框中选择 "Electron Isolated Context" 条目, 可以在开发工具中访问此上下文。
    - `nativeWindowOpen` Boolean (可选) - 是否使用原生的`window.open()`. 默认值为 `false`. Child windows will always have node integration disabled unless `nodeIntegrationInSubFrames` is true. **注意:** 此选项目前是实验性的。
    - `webviewTag` Boolean (可选) - 是否启用 [`` tag](https://electronjs.org/docs/api/webview-tag)标签. 默认值为 `false`. **注意:** 为 `< webview>` 配置的 `preload` 脚本在执行时将启用节点集成, 因此应确保远程或不受信任的内容无法创建恶意的 `preload` 脚本 。 可以使用 [webContents ](https://electronjs.org/docs/api/web-contents)上的 `will-attach-webview` 事件对 `preload` 脚本进行剥离, 并验证或更改 `<webview>` 的初始设置。
    - `additionalArguments` String[] (可选) - 一系列将会被附加至此app的渲染进程的`process.argv`的字符串. 对于将少量数据向下传至渲染进程的预加载脚本而言是十分实用的.
    - `safeDialogs` Boolean (可选) - 是否启用浏览器样式的持续对话框保护。 缺省为`false`。
    - `safeDialogsMessage` String (可选) - 当持续对话框保护被触发时显示的消息。 如果没有定义，那么将使用缺省的消息。注意：当前缺省消息是英文，并没有本地化。
    - `navigateOnDragDrop` Boolean (可选) - 将文件或链接拖放到页面上时是否触发页面跳转. 默认为`false`.
    - `autoplayPolicy` String (optional) - Autoplay policy to apply to content in the window, can be `no-user-gesture-required`, `user-gesture-required`, `document-user-activation-required`. Defaults to `no-user-gesture-required`.
    - `disableHtmlFullscreenWindowResize` Boolean (optional) - Whether to prevent the window from resizing when entering HTML Fullscreen. Default is `false`.

当使用 `minWidth`/`maxWidth`/`minHeight`/`maxHeight` 设置最小或最大窗口大小时, 它只限制用户。 它不会阻止您将不符合大小限制的值传递给 `setBounds`/`setSize` 或 `BrowserWindow` 的构造函数。

`type` 选项的可能值和行为与平台相关。可能的值为:

- 在 Linux 上, 可能的类型有 `desktop`、`dock`、`toolbar`、`splash`、`notification`。
- 在 macOS, 可能的类型是 `desktop`, `textured`.
  - `textured` 类型增加金属色泽的外观 (`NSTexturedBackgroundWindowMask`).
  - `desktop` 类型将窗口置于桌面背景级别 (`kCGDesktopWindowLevel - 1`). 注意，桌面窗口不会接收焦点、键盘或鼠标事件，但您可以使用`globalShortcut`接收快捷键的消息
- 在 Windows 上, 可能的类型为 `toolbar`.

##### 静态方法

[`BrowserWindow.getAllWindows()`](https://electronjs.org/docs/api/browser-window#browserwindowgetallwindows)

返回 `BrowserWindow[]` - 所有打开的窗口的数组

[`BrowserWindow.getFocusedWindow()`](https://electronjs.org/docs/api/browser-window#browserwindowgetfocusedwindow)

返回 `BrowserWindow | null` - 此应用程序中当前获得焦点的窗口，如果无就返回 `null`.

[`BrowserWindow.fromWebContents(webContents)`](https://electronjs.org/docs/api/browser-window#browserwindowfromwebcontentswebcontents)

- `webContents` [WebContents](https://electronjs.org/docs/api/web-contents)

返回 `BrowserWindow` - 拥有给定 `webContents` 的窗口.

[`BrowserWindow.fromBrowserView(browserView)`](https://electronjs.org/docs/api/browser-window#browserwindowfrombrowserviewbrowserview)

- `browserView` [BrowserView](https://electronjs.org/docs/api/browser-view)

返回 `BrowserWindow | null`-拥有给定 `browserView` 的窗口。如果给定视图未附加到任何窗口, 则返回 `null`。

[`BrowserWindow.fromId(id)`](https://electronjs.org/docs/api/browser-window#browserwindowfromidid)

- `id` Integer

返回 `BrowserWindow` -拥有给定 `id` 的窗口.

还有其他的静态方法能够控制浏览器扩展程序和开发者工具

##### 实例方法

各种窗口方法：缩放、最大化最小化、关闭、移动、未响应、展示隐藏、聚焦失焦、窗口位置设置、置顶设置、全屏设置、各种属性的获取、各种状态的获取、加载网页、文件、重启应用、添加删除显示隐藏菜单、子窗口父窗口、菜单可见性、浏览器可见性（透明度）

#### 事件

关于浏览器窗口的各种事件：缩放、最大化最小化、关闭、移动、未响应、展示隐藏、聚焦失焦

#### 例1：窗口关闭不退出程序

``` javascript
// 取消窗口关闭则推出应用的行为
window.onbeforeunload = (e) => {
    console.log('I don\'t want to be closed.')
    // 返回默认值会取消关闭
    e.returnValue = false
    // 直接调用hide方法 这样窗口会关闭 但应用还未推出 还能通过托盘还原
    win.hide()
}
```

#### 例2：透明度/kiosk模式/无边框/任务栏隐藏/窗口全屏大小

``` javascript
const {
    width,
    height
} = require('electron').screen.getPrimaryDisplay().workAreaSize

win = new BrowserWindow({
    width: width,
    height: height,
    // 窗口无边框
    // frame: false,

    // 透明度
    opacity: 0.8,

    // 是否在任务栏中显示窗口
    // skipTaskbar: true,

    // 终极全屏模式 配合上无边框之后 就像游戏的全屏模式一样
    // kiosk: true,
})
```



### webContents

> 渲染以及控制 web 页面

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

`webContents` 是 [EventEmitter ](https://nodejs.org/api/events.html#events_class_eventemitter)的实例， 负责渲染和控制网页, 是 [`BrowserWindow`](https://electronjs.org/docs/api/browser-window) 对象的一个属性。 这是一个访问 `webContents` 对象的例子:

```javascript
const { BrowserWindow } = require('electron')

let win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('http://github.com')

let contents = win.webContents
console.log(contents)
```

#### API

通过`webContents`模块可以访问以下方法：

```javascript
const { webContents } = require('electron')
console.log(webContents)Copy
```

[`webContents.getAllWebContents()`](https://electronjs.org/docs/api/web-contents#webcontentsgetallwebcontents)

[`webContents.getFocusedWebContents()`](https://electronjs.org/docs/api/web-contents#webcontentsgetfocusedwebcontents)

[`webContents.fromId(id)`](https://electronjs.org/docs/api/web-contents#webcontentsfromidid)

其他的api还有：

- load资源相关的：URL或者文件

- 页面停止加载、重载、前进后退导航

- 插入css或者执行js

- 放大缩小

- 页面音频静音

- 编辑命令：redo、undo、cut、copy、select等等

- 页面字符查找

- 截图

  ``` javascript
  $('#jietu').click(() => {
      // 截图
      let c = contents[0].capturePage()
      // 从promise中获取数据
      c.then(function (data) {
          const fs = require('fs')
          // 用fs处理buffer
          let bf = data.toPNG()
          // 写到文件
          fs.writeFile('a.png', bf, (err) => {})
      })
  })
  ```

- 打印机调用

- 打开关闭开发者工具

#### 事件

load相关、导航相关、页面寻找相关

### screen

> 检索有关屏幕大小、显示器、光标位置等的信息。

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

在 `app` 模块发出 `ready` 事件之前, 您不能引用或者使用此模块。

`screen` 是一个 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

**注意:** 在 renderer/DevTools 中, `window.screen` 是一个保留的 DOM 属性, 因此编写 `let { screen } = require('electron')` 将不起作用。

创建填充整个屏幕的窗口的示例:

```javascript
const electron = require('electron')
const { app, BrowserWindow } = electron

let win

app.on('ready', () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({ width, height })
  win.loadURL('https://github.com')
})Copy
```

另一个在外部显示器中创建窗口的例子

```javascript
const electron = require('electron')
const { app, BrowserWindow } = require('electron')

let win

app.on('ready', () => {
  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  if (externalDisplay) {
    win = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50
    })
    win.loadURL('https://github.com')
  }
})
```



### session

> 管理浏览器会话、cookie、缓存、代理设置等。

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

`session` 模块可用于创建新的 `session` 对象。

你还可以使用[`WebContents`](https://electronjs.org/docs/api/web-contents)的`session`属性或`session`模块访问现有页的`session`

```javascript
const { BrowserWindow } = require('electron')

let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('http://github.com')

const ses = win.webContents.session
console.log(ses.getUserAgent())
```

#### API

它的api包括：浏览器缓存清除、代理设置



### process

> 处理对象的扩展

进程： [Main](https://electronjs.org/docs/glossary#main-process), [Renderer](https://electronjs.org/docs/glossary#renderer-process)

Electron's `process` 对象继承 [Node.js `process` object](https://nodejs.org/api/process.html)。 它新增了以下事件、属性和方法

api新增了有内存信息、系统信息、CPU信息