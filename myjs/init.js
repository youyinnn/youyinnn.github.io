$(function () {
  let search = location.search
  if (search === '') {
    get_posts()
  } else {
    let params = location.search.substring(1).split('&')
    for (let i = 0; i < params.length; i++) {
      let kv = params[i].split('=')
      let key = kv[0]
      let value = kv[1]
      if (key === 'post') {
        get_post(value, function (re) {
          let md = $('#md')[0]
          removeClass(md, 'hide')
          addClass(md, 'show')
          let sidetoc = $('#sidetoc')[0]
          removeClass(sidetoc, 'hide')
          addClass(sidetoc, 'show')
          let text = re.body
          if (text.substring(0, 3) === '---') {
            let endindex = text.indexOf('---', 3)+3
            let hexo_metadata = text.substring(4, endindex - 3)
            hexo_metadata = hexo_metadata.replace(/\r\n/gm, '</br>')
            showhexometadata(hexo_metadata)
            text = text.substring(endindex, text.length)
          }
          let cq = text.match(/{%.*cq.*%}/gm)
          if (cq.length !== 0) {
            let saying = text.substring(text.indexOf(cq[0]), text.indexOf(cq[1]) + cq[1].length)
            text = text.substring(text.indexOf(cq[1]) + cq[1].length, text.length)
            console.log(saying)
          }
          render_md(text)
        })
      }
    }
  }
})

