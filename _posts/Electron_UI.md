---
title: Electron_UI
categories:
  - note
  - electron
comments: true
tags:
  - electron
series: electron
date: 2019-10-10 11:44:21
---



### 对话框

> 显示用于打开和保存文件、警报等的本机系统对话框。

线程：[主线程](https://electronjs.org/docs/glossary#main-process)

显示用于选择多个文件和目录的对话框的示例:

```javascript
const { dialog } = require('electron')
console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))Copy
```

这个对话框是从Electron的主线程上打开的。如果要使用渲染器进程中的对话框对象, 可以使用remote来获得:

```javascript
const { dialog } = require('electron').remote
console.log(dialog)
```

对话框的API大致分为：

- 获取文件路径的对话框
- 保存对话框
- 消息对话框 
- 错误对话框

#### 例子

``` javascript
// 同步的获取文件路径的对话框
$('#sopendialog').click(() => {
    let p = dialog.showOpenDialogSync(win, {})
    console.log(p)
})

// 异步的
$('#asopendialog').click(() => {
    let p = dialog.showOpenDialog(win, {})
    p.then((data) => {
        console.log(data)
        console.log(data.filePaths)
    })
})

$('#smsgboxdialog').click(() => {
    let rs = dialog.showMessageBoxSync(win, {
        // type: 'info',
        // type: 'error',
        type: 'question',
        title: 'Message',
        buttons: ['Option one', 'Option two'],
        message: 'This is a stupid box.',
        detail: 'Extra message.',
    })
    console.log(rs)
})
```



### 菜单

> 创建原生应用菜单和上下文菜单。

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

创建新菜单。

#### [静态方法](https://electronjs.org/docs/api/menu#静态方法)

[`Menu.setApplicationMenu(menu)`](https://electronjs.org/docs/api/menu#menusetapplicationmenumenu)

- `menu` Menu | null

当在MacOS、Windows、Linux中使用`menu`设置程序菜单时，会设置在各个程序窗体的顶层。

在Windows和Linux中，可以在菜单的顶层标签的某个字母前添加`&`以绑定快捷键。 例如，使用`&File`后可以使用`Alt-F`呼出File的子选项。 被绑定快捷键的字母将会以下划线标出。 `&`并不会在运行时显示

使用`null` 作为参数时将会隐藏默认菜单。在Windows和Linux上还有删除菜单的额外效果。

**Note:** 如果没有在app中设置一个菜单，系统会自动生成一个默认菜单， 默认生成的菜单中包含了一些初始选项，例如 `文件`,`编辑`, `视图`,`窗口`,`帮助`。

[`Menu.getApplicationMenu()`](https://electronjs.org/docs/api/menu#menugetapplicationmenu)

返回 `Menu | null` - 如果有设置, 则返回应用程序菜单， 如果没设置，则返回 `null`。

**注意:** 返回的 `menu` 实例不支持动态添加或删除菜单项。 但仍然可以动态修改 [实例属性 ](https://electronjs.org/docs/api/menu#instance-properties)。

[`Menu.buildFromTemplate(template)`](https://electronjs.org/docs/api/menu#menubuildfromtemplatetemplate)

- `template` (MenuItemConstructorOptions | MenuItem)[]

返回 `Menu`

一般来说 `template`是一个`options`类型的数组，用于构建一个 [MenuItem](https://electronjs.org/docs/api/menu-item)。使用情况可以在上文提及。

You can also attach other fields to the element of the `template` and they will become properties of the constructed menu items.

#### 例子

应用菜单
``` javascript
const template = [
    {
        label: 'Menu1',
        submenu: [
            new MenuItem({
                label: 'about',
                click() {
                    // 这行不会打在chrome调试控制台上 因为这里的console是nodejs后台
                    console.log('about')
                }
            }),
            { type: 'separator' },
            { role: 'about' },
            new MenuItem({
                label: 'xixi',
                type: 'checkbox',
                click() {
                    console.log('check')
                }
            }),
            new MenuItem({
                label: 'haha',
                type: 'radio',
                click() {
                    console.log('radio')
                }
            }),
        ]
    },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

```
右键菜单
``` javascript

// 自定义右键菜单
const menu = new Menu()
menu.append(new MenuItem({
    label: 'MenuItem1',
    click() {
        console.log('item 1 clicked')
    }
}))
menu.append(new MenuItem({
    type: 'separator'
}))
menu.append(new MenuItem({
    label: 'MenuItem2',
    type: 'checkbox',
    checked: true
}))
// 有下标
menu.append(new MenuItem({
    label: 'MenuItem3',
    type: 'radio',
    click(mi, bwin, event) {
        console.log(mi.overrideProperty)
    },
    sublabel: 'xixi',
}))
// 子菜单
menu.append(new MenuItem({
    label: 'MenuItem4',
    type: 'submenu',
    sublabel: 'xixi',
    submenu: [new MenuItem({
        label: 'lolo',
    })]
}))
```



### 任务栏

#### 任务菜单

Windows 允许应用程序定义一个自定义上下文菜单，用户可以看到该菜单 右键单击任务栏中的应用图标。 该上下文菜单被成为 `弹出列表`. 您可以在弹出列表的 `Tasks` 类别中指定自定义操作， 来自 MSDN 的引用：

> 应用程序的tasks应该是基于程序的功能和用户能用它做一些的关键性事情来制定的。 任务应当是上下文无关的，因为它不需要程序运行就可以工作 而且他们应该是统计上用户在这个应用上最多的行为例如: 撰写一封邮件或者在邮件程序里打开日历，word处理程序新建一个文档，以某一种模式启动应用程序，或者是启动应用程序的某些子命令。 一个应用程序不应当把菜单用一些用户不需要的高级功能的或者只会使用一次的动作例如注册给弄得杂乱无章。 不要将tasks功能用于广告项目例如升级或者特价产品之类。
>
> 强烈推荐task列表内容是静态的。 不管应用程序是什么状态或情形，它都应该是保持不变的。 尽管这个列表是动态可变的，你应该考虑到没想过这个列表会变的用户会被这个行为搞糊涂。

**Internet Explorer 的 任务:**

![](https://image.youyinnn.top/20191014094639.png)

不同于 macOS 的dock菜单，Windows 上的用户任务表现得更像一个快捷方式，比如当用户点击一个任务，一个程序将会被传入特定的参数并且运行。

你可以使用 [app.setUserTasks](https://electronjs.org/docs/api/app#appsetusertaskstasks-windows) API 来设置你的应用中的用户任务：

```javascript
const { app } = require('electron')
app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])
```

调用 `app.setUserTasks` 并传入空数组就可以清除你的任务列表：

```javascript
const { app } = require('electron')
app.setUserTasks([])
```

当你的应用关闭时，用户任务仍然会被显示，因此在你的应用被卸载之前，任务的图标和程序的路径必须是存在的。



### 托盘

> 添加图标和上下文菜单到系统通知区

进程：[主进程](https://electronjs.org/docs/glossary#main-process)

`Tray` 是一个 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

```javascript
const { app, Menu, Tray } = require('electron')

let tray = null
app.on('ready', () => {
  tray = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})Copy
```

**平台限制：**

- 在Linux上，如果支持，就使用应用程序指示器，否则将使用`GtkStatusIcon`。
- 在仅支持应用程序指标的Linux发行版中，必须安装`libappindicator1`才能使任务栏图标正常工作。
- 应用程序指标只有当它有一个上下文菜单时才会显示。
- 当在Linux上使用应用程序指标时，它的 `click`事件将被忽略
- 在Linux上，为了改变单独的`MenuItem`，你必须再次调用`setContextMenu`。 例如：

```javascript
const { app, Menu, Tray } = require('electron')

let appIcon = null
app.on('ready', () => {
  appIcon = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' }
  ])

  // Make a change to the context menu
  contextMenu.items[1].checked = false

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
})Copy
```

- 在 Windows 上, 建议使用 `ICO` 图标来获得最佳视觉效果。

如果要在所有平台上保持完全相同的行为, 则不应依赖 `click` 事件, 并且始终将上下文菜单附加到任务栏图标。

#### 事件

windows下托盘的事件有点击、左右键单击、双击等事件

