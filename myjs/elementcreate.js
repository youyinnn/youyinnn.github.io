function createpostcard(item) {
  let post = document.createElement('div')
  let posttitle = document.createElement('div')
  let posttime = document.createElement('div')
  let sp1 = document.createElement('span')
  let sp2 = document.createElement('span')
  let sp3 = document.createElement('span')
  let sp4 = document.createElement('span')
  addClass(post, 'post hide')
  addClass(posttitle, 'posttitle center-to-head')
  addClass(posttime, 'posttime')
  addClass(sp1, 'font-weight-bold')
  addClass(sp3, 'font-weight-bold')
  posttitle.innerHTML = item.title
  posttitle.number = item.number
  sp1.innerHTML = 'PostTime:'
  sp2.innerHTML = item.created_at
  sp3.innerHTML = 'LastModTime:'
  sp4.innerHTML = item.updated_at
  appendC(post, posttitle)
  appendC(posttime, sp1)
  appendC(posttime, sp2)
  appendC(posttime, sp3)
  appendC(posttime, sp4)
  appendC(post, posttime)
  appendC(docpanel, post)
  $(posttitle).bind('click', function () {
    location = '/' + '?panel=post&number=' + posttitle.number
  })
}

function createposthead(re) {
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
  appendC(md, post)
}

function showhexometadata(hexometadata) {
  let metadatapanel = document.createElement('div')
  let metadatapanelhead = document.createElement('div')
  let metadatapanelbody = document.createElement('div')
  addClass(metadatapanel, 'metadata')
  addClass(metadatapanelhead, 'metadatahead')
  addClass(metadatapanelbody, 'metadatabody')
  metadatapanelhead.innerHTML = 'Hexo metadata'
  appendC($(metadatapanel)[0], metadatapanelhead)
  metadatapanelbody.innerHTML += hexometadata
  appendC($(metadatapanel)[0], metadatapanelbody)
  appendC(md, metadatapanel)
}

function showsaying(saying) {
  let sayingpanel = document.createElement('div')
  addClass(sayingpanel, 'saying')
  sayingpanel.innerHTML = saying
  appendC(md, sayingpanel)
}

function friendcard(friend) {
  let friendmsg = friend.substring(2, friend.length - 1).split('-')
  let htmltext = '<div class="friendcard card"><div class="card-header bg-dark" style="color:white;">' + friendmsg[0] + '</div><div class="card-body"><blockquote class="blockquote mb-0"><p>' + friendmsg[1] + '</p></blockquote></div></div>'
  return htmltext
}

function createtodo(issuesbody, re) {
  let todohead = document.createElement('div')
  todohead.innerHTML = '<i class="em-svg em-card_index"></i>Todo List'
  addClass(todohead, 'todohead unselectable')
  appendC(md, todohead)
  let fulltext = '\r\n' + issuesbody + '\r\n'
  for (let i = 0; i < re.length; ++i) {
    let head = re[i].created_at
    let text = re[i].body
    fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">ToDo <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"><p class="card-text">' + text + '</p></div></div><br>'
  }
  searchshowandrendermd(fulltext, re.length)
}

function createscript(issuesbody, re) {
  let scripthead = document.createElement('div')
  scripthead.innerHTML = '<i class="em-svg em-card_file_box"></i>Script Base'
  addClass(scripthead, 'todohead unselectable')
  appendC(md, scripthead)
  let fulltext = '\r\n' + issuesbody + '\r\n'
  for (let i = 0; i < re.length; ++i) {
    let head = re[i].created_at
    let text = re[i].body
    fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Script <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"><p class="card-text">' + ('\r\n' + text + '\r\n') + '</p></div></div><br>'
  }
  searchshowandrendermd(fulltext, re.length)
}

function createegg(issuesbody, re) {
  let egghead = document.createElement('div')
  egghead.innerHTML = '<i class="em-svg em-clown_face"></i> E GGgG gGGG Gggg ggGG'
  addClass(egghead, 'todohead unselectable')
  appendC(md, egghead)
  let fulltext = '\r\n' + issuesbody + '\r\n'
  for (let i = 0; i < re.length; ++i) {
    let head = re[i].created_at
    let text = re[i].body
    fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Egg <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"><p class="card-text">' + ('\r\n' + text + '\r\n') + '</p></div></div><br>'
  }
  searchshowandrendermd(fulltext, re.length)
}

function searchshowandrendermd(fulltext, relength) {
  removeClass(scriptsearcher, 'hide')
  addClass(scriptsearcher, 'searchshow')
  md.style.paddingBottom = '3rem'
  removeClass(md, 'hide')
  searchcount = relength
  render_md(fulltext)
}

function createpostcomment(i, comment) {
  let commentCard = '<div class="card" id="comment-' + i + '"><div class="card-header text-white bg-dark"><span style="font-weight:bold;">Comment <a href=" ' + comment.html_url + '" target="_blank">#' + i + '</a> by <a target="_blank" href=" ' + comment.user.html_url + ' ">' + comment.user.login + '</a> created at: </span>' + comment.created_at + '</div><div class="card-body"><p class="card-text">' + (comment.body) + '</p></div></div><br>'
  return commentCard
}