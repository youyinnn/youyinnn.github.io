var pageload
var nowerpage = 1
var totalpages
var postpanelheight
var postheight

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
          let text = re.body
          $('#md')[0].innerHTML = text
          editormd.markdownToHTML("md", {
            htmlDecode: "style,script,iframe", // you can filter tags decode
            emoji: true,
            taskList: true,
            tex: true, // 默认不解析
            flowChart: true, // 默认不解析
            sequenceDiagram: true, // 默认不解析
          });

        })
      }
    }
  }
})

function postspage(pageto) {
  $('#posts')[0].style.cssText = 'transform: translateY(-' + ((postpanelheight - 48) * (pageto - 1)) + 'px);'
}

function pagehandler(item, box, itemslength) {
  postheight = item.clientHeight + 48
  postpanelheight = box.clientHeight
  pageload = parseInt(postpanelheight / (postheight))
  totalpages = Math.round(itemslength / pageload)
}