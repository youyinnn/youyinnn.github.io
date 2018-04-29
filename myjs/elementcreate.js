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
  let friendmsg = friend.substring(2,friend.length - 1).split('-')
  let htmltext = '<div class="friendcard card"><div class="card-header bg-dark" style="color:white;">' + friendmsg[0] + '</div><div class="card-body"><blockquote class="blockquote mb-0"><p>' + friendmsg[1] + '</p></blockquote></div></div>'
  return htmltext
}