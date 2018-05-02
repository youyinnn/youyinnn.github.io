/*  global getStyle getNextElement */
var timer
var extendBlank = null
var frame = 10

var BTitleFunction = function (btitle) {
  clearTimeout(timer)
  this.collapse = function (event) {
    event = event || window.event
    if (extendBlank === btitle) {
      // a is extend
      fold(btitle)
      extendBlank = null
    } else {
      // a is fold
      if (extendBlank === null) {
        // not other extend
        extend(btitle)
        extendBlank = btitle
      } else {
        // b is extend
        // 这里有一个折叠bug 折叠其extendblank的同时 伸展自己 结果把extendblank的timer给清除了
        // FIXED 拓展fold函数 添加一个形参用来展开其它的
        fold(extendBlank, btitle)
        extendBlank = btitle
      }
    }
    event.preventDefault ? event.preventDefault() : event.returnValue = false
  }


  function extend (btitle) {
    // 获取该title所属的blank
    var blank = btitle.parentElement
    // 获取该title对应的menu
    var menu = getNextElement(btitle)
    // 获取menu的height
    var menuHeight = Number(getStyle(menu, 'height').split('px')[0])
    // 最终展开的blank的height应该是menu的height+30
    var endHeight = 35 + menuHeight
    // 初速度定为endHeigt的二十分之一
    var v0 = endHeight / 15
    clearTimeout(timer)
    // 获取当前blank正在显示的height
    var currentBlankHeight = Number(getStyle(blank, 'height').split('px')[0])
    // 获取当前行程
    var currentDistance = endHeight - currentBlankHeight
    var increasex = 0
    var p1 = currentDistance * 0.25
    var p2 = currentDistance * 0.5
    var p3 = currentDistance * 0.7
    var p4 = currentDistance * 0.85
    var p5 = currentDistance * 0.9
    var movenx
    timer = setTimeout(function start () {
      if (increasex > p1 && increasex < p2) {
        increasex += v0 * 0.8
      } else if (increasex > p2 && increasex < p3) {
        increasex += v0 * 0.7
      } else if (increasex > p3 && increasex < p4) {
        increasex += v0 * 0.5
      } else if (increasex > p4 && increasex < p5) {
        increasex += v0 * 0.2
      } else if (increasex > p5 && increasex < currentDistance) {
        increasex += v0 * 0.1
      } else {
        increasex += v0
      }
      movenx = currentBlankHeight + increasex
      if (movenx > endHeight) {
        movenx = endHeight
      }
      // console.log(movenx)
      blank.style.height = movenx + 'px'
      timer = setTimeout(start, frame) // 再大就会卡了
      if (movenx === endHeight) {
        clearTimeout(timer)
      }
    }, 1)
  }

  function fold (btitle, x) {
    clearTimeout(timer)
    // 获取该title所属的blank
    var blank = btitle.parentElement
    // 获取该title对应的menu
    var menu = getNextElement(btitle)
    // 获取menu的height
    var menuHeight = Number(getStyle(menu, 'height').split('px')[0])
    // 最终展开的blank的height应该是menu的height+30
    var endHeight = 35 + menuHeight
    // 初速度定为endHeigt的二十分之一
    var v0 = endHeight / 15
    // 获取当前blank正在显示的height
    var currentBlankHeight = Number(getStyle(blank, 'height').split('px')[0])
    timer = setTimeout(function start () {
      currentBlankHeight -= v0 * 0.8
      if (currentBlankHeight < 30) {
        currentBlankHeight = 30
      }
      // console.log(currentBlankHeight)
      blank.style.height = currentBlankHeight + 'px'
      timer = setTimeout(start, frame) // 再大就会卡了
      if (currentBlankHeight === 30) {
        clearTimeout(timer)
        if (x !== undefined) {
          extend(x)
        }
      }
    }, 1)
  }
}
