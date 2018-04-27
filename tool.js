/*
  此方法兼容IE
  获取元素的样式：
    参数1：元素
    参数2：样式名
*/
function getStyle (obj, styleName) {
  var cs = obj.currentStyle
  if (cs === undefined) {
    return getComputedStyle(obj, null)[styleName]
  } else {
    return cs[styleName]
  }
}

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
function bindev (obj, eventStr, callback) {
  if (obj.addEventListener) {
    // 兼容大部分浏览器
    obj.addEventListener(eventStr, callback, false)
  } else {
    /*
      this是谁由调用方式决定
      由于attachEvent()的默认this是window
      为了统一this
      我们可以用下面的方式来指定this
      callback.apply(obj);
    */
    // IE
    obj.attachEvent('on' + eventStr, function () {
      callback.apply(obj)
    })
  }
}
/*
  为元素增加类样式
    参数1：元素
    参数2：类名
*/
function addClass (obj, cn) {
  if (!hasClass(obj, cn)) {
    obj.className += ' ' + cn
  }
}
/*
    为元素移除类样式
      参数1：元素
      参数2：类名
  */
function removeClass (obj, cn) {
  var rgx = new RegExp(' *' + cn + ' *')
  obj.className = obj.className.replace(rgx, '')
}
/*
  为元素改变类样式 有就移除 没有就增加
    参数1：元素
    参数2：类名
*/
function changeClass (obj, cn) {
  if (hasClass(obj, cn)) {
    removeClass(obj, cn)
  } else {
    addClass(obj, cn)
  }
}
/*
    查询元素是否有类样式
      参数1：元素
      参数2：类名
  */
function hasClass (obj, cn) {
  var rgx = new RegExp('\\b' + cn + '\\b')
  return rgx.test(obj.className)
}

/*
    获取元素的最终样式 也就是显示在浏览器上的样式
*/
function getFinalStyle (obj, attr) {
  var finalStyle = obj.currentStyle ? obj.currentStyle
    : document.defaultView.getComputedStyle(obj, null)

  return finalStyle[attr]
}

function appendC (parent, child) {
  parent.appendChild(child)
}

function removeLastC (parent) {
  parent.removeChild(parent.lastChild)
}

function strMapToObj (strMap) {
  let obj = Object.create(null)
  for (let [k, v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v
  }
  return obj
}

function objToStrMap (obj) {
  let strMap = new Map()
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}

function strMapToJson (strMap) {
  return JSON.stringify(strMapToObj(strMap))
}

function jsonToStrMap (jsonStr) {
  return objToStrMap(JSON.parse(jsonStr))
}

function getClientW(zoom) {
  let w = document.documentElement.clientWidth
  if (zoom === null || zoom === undefined) {
    return w
  } else {
    return w * zoom
  }
}

function getClientH(zoom) {
  let h = document.documentElement.clientWidth
  if (zoom === null || zoom === undefined) {
    return h
  } else {
    return h * zoom
  }
}

function getWindowH(zoom) {
  let h = window.innerHeight
  if (zoom === null || zoom === undefined) {
    return h
  } else {
    return h * zoom
  }
}

function getWindowW(zoom) {
  let w = window.innerWidth
  if (zoom === null || zoom === undefined) {
    return w
  } else {
    return w * zoom
  }
}

function RandomNumBoth(Min,Max){
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}