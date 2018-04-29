var pageload
var nowerpage = 1
var totalpages
var postpanelheight
var postheight

$(function () {

})

function render_md(text) {
  let md = $('#md')[0]
  removeClass(md, 'hide')
  addClass(md, 'show')
  let sidetoc = $('#sidetoc')[0]
  removeClass(sidetoc, 'hide')
  addClass(sidetoc, 'show')
  if (text.substring(0, 3) === '---') {
    let endindex = text.indexOf('---', 3) + 3
    let hexo_metadata = text.substring(4, endindex - 3)
    hexo_metadata = hexo_metadata.replace(/\r\n/gm, '</br>')
    showhexometadata(hexo_metadata)
    text = text.substring(endindex, text.length)
  }
  let cq = text.match(/{%.*cq.*%}/gm)
  if (cq) {
    let saying = text.substring(text.indexOf(cq[0]) + cq[0].length + 2 , text.indexOf(cq[1]))
    saying = saying.replace(/\r\n/gm, '</br>')
    text = text.substring(text.indexOf(cq[1]) + cq[1].length, text.length)
    showsaying(saying)
  }
  editormd.markdownToHTML("md", {
    markdown: text,
    htmlDecode: "style,script,iframe|on",
    tocm: true, // Using [TOCM]
    tocContainer: "#sidetoc",
    taskList: true,
    readOnly: true,
    codeFold: true,
  });
  let as = $('#md a')
  for(let i = 0; i < as.length; i++) {
    as[i].target = '_blank'
  }
}

function postspage(pageto) {
  $('#docpanel')[0].style.cssText = 'transform: translateY(-' + ((postpanelheight - 48) * (pageto - 1)) + 'px);'
}

function pagehandler(item, box, itemslength) {
  postheight = item.clientHeight + 48
  postpanelheight = box.clientHeight
  pageload = parseInt(postpanelheight / (postheight))
  totalpages = Math.round(itemslength / pageload)
}

function hideloading() {
  let loading = $('#loading')[0]
  removeClass(loading, 'show')
  addClass(loading, 'hide')
  addClass(loading, 'remove')
}
