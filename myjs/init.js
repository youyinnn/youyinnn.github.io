$(function () {
  // let body = $('body')[0]
  // body.style.height = getWindowH() + 'px'
  // body.style.width = getClientW() + 'px'
  let search = location.search
  if (search === '') {
    get_posts()
  } else {
    let params = location.search.substring(1).split('&')
    let kv = params[0].split('=')
    let key = kv[0]
    let value = kv[1]
    if (key === 'panel' && value === 'post') {
      get_post(params[1].split('=')[1], function (re) {
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
