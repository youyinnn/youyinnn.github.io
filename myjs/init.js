var docpanel = $('#docpanel')[0]
var md = $('#md')[0]
var toc = $('#sidetoc')[0]
var toccontainer = $('#sidetoccontainer')[0]
var loading = $('#loading')[0]
var homepage = $('#homepage')[0]
var scriptsearcher = $('#scriptsearcher')[0]
var gohub = $('#gohub')[0]
var percent = $('#percent')[0]
var topbut = $('#topbut')[0]
var scriptcount

$(function () {
  let topbarh = getFinalStyle($('#topbar')[0], 'height').split('px')[0]
  docpanel.style.height = parseInt(getWindowH()) - parseInt(topbarh) + 'px'
  // md.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
  toc.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
  let search = location.search
  if (search === '') {
    hideloading()
    removeClass(homepage, 'remove')
    addClass(homepage, 'show')
    setgohub('follow me', 'https://github.com/' + username)
  } else {
    showloading()
    let params = location.search.substring(1).split('&')
    let kv = params[0].split('=')
    let key = kv[0]
    let value = kv[1]
    if (key === 'panel' && value === 'posts') {
      get_posts()
    } else if (key === 'panel' && value === 'post') {
      get_post(params[1].split('=')[1])
    } else if (key === 'panel' && value === 'about') {
      get_about()
    } else if (key === 'panel' && value === 'friendlinked') {
      get_friendlinked()
    } else if (key === 'panel' && value === 'todo') {
      get_todo()
    } else if (key === 'panel' && value === 'script') {
      get_script()
    }
  }
})
