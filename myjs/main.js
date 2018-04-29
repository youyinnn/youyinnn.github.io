var pageload
var nowerpage = 1
var totalpages
var postpanelheight
var postheight
var mainpanel = $('#docpanel')[0]

$(function () {

})

function render_md(text) {
  text = text.replace(/"/g, '\\"')
  text = text.replace(/'/g, '\'')
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
