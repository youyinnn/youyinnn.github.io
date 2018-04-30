var docpanel = $('#docpanel')[0]
var md = $('#md')[0]
var toc = $('#sidetoc')[0]
var loading = $('#loading')[0]
var homepage = $('#homepage')[0]

$(function () {
  let topbarh = getFinalStyle($('#topbar')[0], 'height').split('px')[0]
  docpanel.style.height = parseInt(getWindowH()) - parseInt(topbarh) + 'px'
  md.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
  toc.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
  let search = location.search
  if (search === '') {
    hideloading()
    removeClass(homepage, 'remove')
    addClass(homepage, 'show')
  } else {
    showloading()
    let params = location.search.substring(1).split('&')
    let kv = params[0].split('=')
    let key = kv[0]
    let value = kv[1]
    if (key === 'panel' && value === 'posts') {
      get_posts()
    } else if (key === 'panel' && value === 'post') {
      get_post(params[1].split('=')[1], function (re) {
        let title = re.title
        let post = document.createElement('div')
        let posttitle = document.createElement('div')
        let posttime = document.createElement('div')
        let sp1 = document.createElement('span')
        let sp2 = document.createElement('span')
        let sp3 = document.createElement('span')
        let sp4 = document.createElement('span')
        addClass(post, 'post onepost')
        addClass(posttitle, 'posttitle')
        addClass(posttime, 'posttime')
        addClass(sp1, 'font-weight-bold')
        addClass(sp3, 'font-weight-bold')
        sp1.innerHTML = 'PostTime:'
        sp2.innerHTML = re.created_at
        sp3.innerHTML = 'LastModTime:'
        sp4.innerHTML = re.updated_at
        posttitle.innerHTML = title
        appendC(posttime, sp1)
        appendC(posttime, sp2)
        appendC(posttime, sp3)
        appendC(posttime, sp4)
        appendC(post, posttitle)
        appendC(post, posttime)
        appendC($('#md')[0], post)
        let text = re.body
        render_md(text)
      })
    } else if (key === 'panel' && value === 'about') {
      get_about()
    } else if (key === 'panel' && value === 'friendlinked') {
      get_friendlinked()
    }
  }
})
