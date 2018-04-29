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
  appendC($('#docpanel')[0], post)
  $(posttitle).bind('click', function () {
    location = location.href + '?post=' + posttitle.number
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
  appendC($('#md')[0], metadatapanel)
}