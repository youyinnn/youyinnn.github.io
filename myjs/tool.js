/*
  此方法兼容IE
  获取元素的样式：
    参数1：元素
    参数2：样式名
*/
function getStyle(obj, styleName) {
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
function bindev(obj, eventStr, callback) {
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
        obj.attachEvent('on' + eventStr, function() {
            callback.apply(obj)
        })
    }
}
/*
  为元素增加类样式
    参数1：元素
    参数2：类名
*/
function myaddclass(obj, cn) {
    if (!hasClass(obj, cn)) {
        obj.className += ' ' + cn
    }
}
/*
    为元素移除类样式
      参数1：元素
      参数2：类名
  */
function myremoveclass(obj, cn) {
    var rgx = new RegExp(' *' + cn + ' *')
    obj.className = obj.className.replace(rgx, ' ')
}
/*
  为元素改变类样式 有就移除 没有就增加
    参数1：元素
    参数2：类名
*/
function changeClass(obj, cn) {
    if (hasClass(obj, cn)) {
        myremoveclass(obj, cn)
    } else {
        myaddclass(obj, cn)
    }
}
/*
    查询元素是否有类样式
      参数1：元素
      参数2：类名
  */
function hasClass(obj, cn) {
    var rgx = new RegExp('\\b' + cn + '\\b')
    return rgx.test(obj.className)
}

/*
    获取元素的最终样式 也就是显示在浏览器上的样式
*/
function getFinalStyle(obj, attr) {
    var finalStyle = obj.currentStyle ? obj.currentStyle :
        document.defaultView.getComputedStyle(obj, null)

    return finalStyle[attr]
}

function appendC(parent, child) {
    parent.appendChild(child)
}

function removeLastC(parent) {
    parent.removeChild(parent.lastChild)
}

function strMapToObj(strMap) {
    let obj = Object.create(null)
    for (let [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v
    }
    return obj
}

function objToStrMap(obj) {
    let strMap = new Map()
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k])
    }
    return strMap
}

function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap))
}

function jsonToStrMap(jsonStr) {
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

function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
/**
 * utf16转utf8
 * @param {Object} str
 */
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else
        if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
/**
 * utf8转utf16
 * @param {Object} str
 */
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}

function c(elementlabel) {
    return document.createElement(elementlabel)
}