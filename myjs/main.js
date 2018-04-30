var pageload
var nowerpage = 1
var totalpages
var postpanelheight
var postheight

$(function () {

})

function render_md(text) {
  removeClass(md, 'hide')
  addClass(md, 'show')
  removeClass(toc, 'hide')
  addClass(toc, 'show')
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
  while (true) {
    let emojistart = text.search(/:[A-z|-]+[0-9]?:/g)
    if (emojistart === -1) break
    let emojiend = text.indexOf(':', emojistart + 1)
    let emoji = text.substring(emojistart, emojiend + 1)
    text = text.replace(emoji , '<i class="em em-' + emoji.substring(1, emoji.length -1) + '"></i>')
  }
  editormd.markdownToHTML('md', {
    markdown: text,
    lib: './lib/',
    theme: 'dark',
    previewTheme : 'github',
    editorTheme : 'pastel-on-dark',
    htmlDecode: 'style,script,iframe|on',
    tocm: true, // Using [TOCM]
    tocContainer: '#sidetoc',
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
  removeClass(loading, 'show')
  addClass(loading, 'hide')
  addClass(loading, 'remove')
}

function showloading() {
  removeClass(loading, 'remove')
  addClass(loading, 'show')
}

function hidesidetoc() {
  let sidetoc = toc
  addClass(sidetoc, 'remove')
  addClass(md, 'w-100')
}