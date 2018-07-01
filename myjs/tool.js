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
function adclass(obj, cn) {
    if (!hasClass(obj, cn)) {
        obj.className += ' ' + cn
    }
}
/*
    为元素移除类样式
      参数1：元素
      参数2：类名
  */
function rmclass(obj, cn) {
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
        rmclass(obj, cn)
    } else {
        adclass(obj, cn)
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

function appendc(parent, child) {
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
    let h = document.documentElement.clientHeight
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

function c(elementlabel) {
    return document.createElement(elementlabel)
}

var b64 = new base64()

function base64() {  

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  

    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  

    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  

        }  
        return utftext;  
    }  

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}