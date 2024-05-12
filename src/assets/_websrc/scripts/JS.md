## JS

#### Draw.io Web Viewer

https://github.com/jgraph/drawio/discussions/3430

### Website

- https://javascript.info/js

### JS 获取元素样式

```javascript
/*
  此方法兼容IE
  获取元素的样式：
    参数1：元素
    参数2：样式名
*/
function getStyle(obj, styleName) {
  var cs = obj.currentStyle;
  if (cs === undefined) {
    return getComputedStyle(obj, null)[styleName];
  } else {
    return cs[styleName];
  }
}
```

### JS 事件绑定兼容

```javascript
/*
  事件绑定兼容
  首先要注意：
    addEventListener() 方法中的this是我们绑定的事件
    attachedEvent() 方法中的this是window

  参数：
    1、obj 要绑定的对象
    2、eventStr 绑定事件 (不要on)
    3、callback 回调函数
*/
function bindev(obj, eventStr, callback) {
  if (obj.addEventListener) {
    // 兼容大部分浏览器
    obj.addEventListener(eventStr, callback, false);
  } else {
    /*
      this是谁由调用方式决定
      由于attachEvent()的默认this是window
      为了统一this
      我们可以用下面的方式来指定this
      callback.apply(obj);
    */
    // IE
    obj.attachEvent("on" + eventStr, function () {
      callback.apply(obj);
    });
  }
}
```

### JS 滚动动画

```javascript
/*
  md的滚动条
  去到id为elementid的元素位置
  速度是 500
*/
$("#md").animate(
  {
    scrollTop: $("#elementid").offset().top,
  },
  500
);
```

### JS 滚动动画改进

```javascript
/*
  防止到了位置之后再滚动到该元素 而offset改变
*/
function scrolltoelement(elementid) {
  if ($("#" + elementid)[0].oset === undefined) {
    $("#" + elementid)[0].oset = $("#" + elementid).offset().top;
  }
  $("#md").animate(
    {
      scrollTop: $("#" + elementid)[0].oset,
    },
    500
  );
}
```

### JS 检测页面滚动代码

```JavaScript
$(window).scroll(function () {
  var scrollTo = $(window).scrollTop(),
  docHeight = $(document).height(),
  windowHeight = $(window).height();
  scrollPercent = (scrollTo / (docHeight-windowHeight)) * 100;
  percent.innerText = scrollPercent
})
```

### JS 小数

1. 丢弃小数部分,保留整数部分 `parseInt(7/2)`

2. 向上取整,有小数就整数部分加 1 `Math.ceil(7/2) `

3. 四舍五入 `Math.round(7/2) `

4. 向下取整 `Math.floor(7/2)`

5. 四舍五入 保留位数：

```javascript
var num = 2.446242342;
num = num.toFixed(2); // 输出结果为 2.45
```

### JS CSS 动态添加动画效果

```javascript
$("#searchtext").addClass("getnothing");
setTimeout(function () {
  $("#searchtext").removeClass("getnothing");
}, 1100);
```

```css
.getnothing {
  animation: getnothing 1s;
}

@keyframes getnothing {
  50% {
    background-color: rgba(247, 117, 117, 0.534);
  }
}
```

### JS 控制聚焦/失焦事件

```js
$("#searchtext").focus(function () {
  $("#scriptsearcher")[0].style.opacity = "1";
});
$("#searchtext").blur(function () {
  $("#scriptsearcher")[0].style.opacity = "0.3";
});
```

### AJAX 设置请求超时

```js
var ajaxTimeoutTest = $.ajax({
  url: "", //请求的URL
  timeout: 1000, //超时时间设置，单位毫秒
  type: "get", //请求方式，get或post
  data: {}, //请求所传参数，json格式
  dataType: "json", //返回的数据格式
  success: function (data) {
    //请求成功的回调函数
    alert("成功");
  },
  complete: function (XMLHttpRequest, status) {
    //请求完成后最终执行参数
    if (status == "timeout") {
      //超时,status还有success,error等值的情况
      ajaxTimeoutTest.abort();
      alert("超时");
    }
  },
});
```

函数写在 complete 中，因为无论 success 还是 error，complete 函数都会执行。

### [Async](https://github.com/caolan/async)

> JS Ajax JQ 同步请求库

[来源](https://segmentfault.com/q/1010000005789740)

[中文文档](https://blog.csdn.net/marujunyy/article/details/8695205)

### JS 刷新页面

#### :small_blue_diamond:手动 reload

```js
location.reload();
```

#### :small_blue_diamond:自动定时刷新

页面自动刷新：把如下代码加入<head>区域中

```js
<meta http-equiv="refresh" content="5">
```

### JS 获取图片原始尺寸

HTML5 提供了一个新属性 naturalWidth/naturalHeight 可以直接获取图片的原始宽高

```javascript
let imgw = this.naturalWidth;
let imgh = this.naturalHeight;
```

### JQuery 的高级选择器

```javascript
jQuery.parent(expr); //找父元素
jQuery.parents(expr); //找到所有祖先元素，不限于父元素
jQuery.children(expr); //查找所有子元素，只会找到直接的孩子节点，不会返回所有子孙
jQuery.contents(); //查找下面的所有内容，包括节点和文本。
jQuery.prev(); //查找上一个兄弟节点，不是所有的兄弟节点
jQuery.prevAll(); //查找所有之前的兄弟节点
jQuery.next(); //查找下一个兄弟节点，不是所有的兄弟节点
jQuery.nextAll(); //查找所有之后的兄弟节点
jQuery.siblings(); //查找兄弟节点，不分前后
jQuery.find(
  expr
); /*跟jQuery.filter(expr)完全不一样，jQuery.filter(expr)是从初始的
                               jQuery对象集合中筛选出一部分，而jQuery.find()的返回结果，不会有初始集中
                               筛选出一部分，而jQuery.find()的返回结果，不会有初始集合中的内容，比如：
                               $("p").find("span")是从元素开始找，等于$("p span") */
```

### js 取消事件冒泡

```javascript
$("form").bind("submit", function () {
  return false;
});
```

https://www.cnblogs.com/wangking/p/6113024.html#

### JS 判断字符串中是否含有 Emoji 表情

如果前端的字符串含有 Emoji 表情，那么在默认的情况下是不能存在 MySQL 数据库中的，因为编码的问题
原因如下：

> 本地数据库的默认编码是 utf8，默认保存的是 1 到 3 个字节，但是现在的 emoji 表情采用 4 个字节保存，所以抛出异常。
> 引自：https://blog.csdn.net/wang704987562/article/details/54093979

JS 判断：

```javascript
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2b05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (
        hs == 0xa9 ||
        hs == 0xae ||
        hs == 0x303d ||
        hs == 0x3030 ||
        hs == 0x2b55 ||
        hs == 0x2b1c ||
        hs == 0x2b1b ||
        hs == 0x2b50
      ) {
        return true;
      }
    }
  }
}
```

引自： https://blog.csdn.net/u014520745/article/details/52947466?locationNum=8&fps=1

### Javascript 使用字符串作为函数调用语句去调用

```javascript
function func_abc() {
  alert("a");
}
var str = "func_abc";
eval(str + "()"); //执行func_abc()函数
```

引自：https://blog.csdn.net/qq_26222859/article/details/75285784

### JS 数组排序

```javascript
var arr = [23, 9, 4, 78, 3];
var compare = function (x, y) {
  //比较函数
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
};
console.log(arr.sort(compare));
```

### JS 判断浏览器类型

ie 那段参考自：https://www.cnblogs.com/XCWebLTE/archive/2017/06/15/7017338.html

```javascript
var userAgent = navigator.userAgent;
var isOpera = userAgent.indexOf("Opera") > -1;

function ievertion() {
  var isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return "edge"; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}

function isSafari() {
  return userAgent.indexOf("Safari") > -1;
}

function isFF() {
  return userAgent.indexOf("Firefox") > -1;
}

function isChrome() {
  return userAgent.indexOf("Chrome") > -1;
}
```

### JavaScript 解除 xhr 获取 header 的限制

http://www.ruanyifeng.com/blog/2016/04/cors.html

需要后端的配合

### JS 锚点跳转动画

一般我们的锚点都长这样

```html
<a name="xxx" class="reference-link" target="_blank"></a>
```

因此我们就根据 name 去索引锚点

```javascript
var $root = $("html, body");
$(".markdown-toc a").click(function () {
  $root.animate(
    {
      scrollTop: $('[name="xxx"]').offset().top,
    },
    600
  );
});
```

### JS 监听元素任何变化

[mutationobserver](http://javascript.ruanyifeng.com/dom/mutationobserver.html)
[csdn blog](https://blog.csdn.net/u010419337/article/details/81474311)

```javascript
let MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver;
let observer = new MutationObserver(function (mutationList) {
  setTimeout(function () {
    // handle change
  }, 250);
});
let article = $("#docpanel")[0];
let options = {
  attributes: true,
  attributeOldValue: true,
};
observer.observe(article, options);
```

### JQuery UI 拖拽

https://www.runoob.com/jqueryui/example-draggable.html

### JQuery GIF 播放/暂停 JS-GIF 库

https://www.lanrenzhijia.com/pic/3719.html
https://github.com/buzzfeed/libgif-js

### 打开新网页

```js
function openInNewTab(url) {
  window.open(url, "_blank").focus();
}

//or just
window.open(url, "_blank").focus();
```

### 如何在不加载 dom 的情况下操作 dom

```js
const node = new DOMParser().parseFromString(html, "text/html").body
  .firstElementChild;
```

https://grrr.tech/posts/create-dom-node-from-html-string/

### JS Base64

https://stackoverflow.com/a/30106551/17094075





### String regex check

- https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not

- [Check if a JavaScript string is a URL](https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url)



