function createpostcard(item, pagebelong) {
    let post = c('div')
    let posttitle = c('div')
    let posttime = c('div')
    let sp1 = c('span')
    let sp2 = c('span')
    let sp3 = c('span')
    let sp4 = c('span')
    adclass(post, 'post')
    adclass(posttitle, 'posttitle center-to-head')
    adclass(posttime, 'posttime')
    adclass(sp1, 'font-weight-bold')
    adclass(sp3, 'font-weight-bold')
    posttitle.innerHTML = item.title
    posttitle.number = item.number
    sp1.innerHTML = 'PostTime:'
    sp2.innerHTML = item.created_at
    sp3.innerHTML = 'LastModTime:'
    sp4.innerHTML = item.updated_at
    appendc(post, posttitle)
    appendc(posttime, sp1)
    appendc(posttime, sp2)
    appendc(posttime, sp3)
    appendc(posttime, sp4)
    appendc(post, posttime)
    appendc($('#pagebox-' + pagebelong)[0], post)
    $(posttitle).bind('click', function() {
        location = '/' + '?panel=post&number=' + posttitle.number
    })
}

function createposthead(re) {
    let title = re.title
    let post = c('div')
    let posttitle = c('div')
    let posttime = c('div')
    let sp1 = c('span')
    let sp2 = c('span')
    let sp3 = c('span')
    let sp4 = c('span')
    adclass(post, 'post onepost')
    adclass(posttitle, 'posttitle')
    adclass(posttime, 'posttime')
    adclass(sp1, 'font-weight-bold')
    adclass(sp3, 'font-weight-bold')
    sp1.innerHTML = 'PostTime:'
    sp2.innerHTML = re.created_at
    sp3.innerHTML = 'LastModTime:'
    sp4.innerHTML = re.updated_at
    posttitle.innerHTML = title
    appendc(posttime, sp1)
    appendc(posttime, sp2)
    appendc(posttime, sp3)
    appendc(posttime, sp4)
    appendc(post, posttitle)
    appendc(post, posttime)
    appendc(md, post)
}

function showhexometadata(hexometadata) {
    let metadatapanel = c('div')
    let metadatapanelhead = c('div')
    let metadatapanelbody = c('div')
    adclass(metadatapanel, 'metadata')
    adclass(metadatapanelhead, 'metadatahead')
    adclass(metadatapanelbody, 'metadatabody')
    metadatapanelhead.innerHTML = 'Hexo Front-matter'
    appendc($(metadatapanel)[0], metadatapanelhead)
    appendc($(metadatapanel)[0], metadatapanelbody)
    if (hexometadata.title !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Title:</span> ' + hexometadata.title + '<br>'
    }
    if (hexometadata.date !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Date:</span> ' + hexometadata.date + '<br>'
    }
    if (hexometadata.updated !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Updated:</span> ' + hexometadata.updated + '<br>'
    }
    if (hexometadata.comments !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Comments:</span> ' + hexometadata.comments + '<br>'
    }
    if (hexometadata.categories !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Categories:</span><br>'
        for (let i = 0; i < hexometadata.categories.length; i++) {
            metadatapanelbody.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="badge badge-info">' + hexometadata.categories[i] + '</span><br>'
        }
    }
    if (hexometadata.tags !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Tags:</span><br>'
        for (let i = 0; i < hexometadata.tags.length; i++) {
            metadatapanelbody.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="badge badge-info">' + hexometadata.tags[i] + '</span><br>'
        }
    }
    appendc(md, metadatapanel)
}

function showsaying(saying) {
    let sayingpanel = c('div')
    adclass(sayingpanel, 'saying')
    sayingpanel.innerHTML = saying
    appendc(md, sayingpanel)
}

function createtodo(issuesbody, re) {
    let todohead = c('div')
    todohead.innerHTML = '<i class="em-svg em-card_index"></i>Todo List'
    adclass(todohead, 'todohead unselectable')
    appendc(md, todohead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = 0; i < re.length; ++i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">ToDo <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"><p class="card-text">\r\n' + text + '\r\n</p></div></div><br>'
    }
    searchshowandrendermd(fulltext, re.length)
}

function createscript(issuesbody, re) {
    let scripthead = c('div')
    scripthead.innerHTML = '<i class="em-svg em-card_file_box"></i>Script Base'
    adclass(scripthead, 'todohead unselectable')
    appendc(md, scripthead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = 0; i < re.length; ++i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Script <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"><p class="card-text">\r\n' + text + '\r\n</p></div></div><br>'
    }
    searchshowandrendermd(fulltext, re.length)
}

function createegg(issuesbody, re) {
    let egghead = c('div')
    egghead.innerHTML = '<i class="em-svg em-clown_face"></i> E GGgG gGGG Gggg ggGG'
    adclass(egghead, 'todohead unselectable')
    appendc(md, egghead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = 0; i < re.length; ++i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Egg <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> Created at: </span>' + head + '</div><div class="card-body"> <p class="card-text">\r\n' + text + '\r\n</p></div></div><br>'
    }
    searchshowandrendermd(fulltext, re.length)
}

function searchshowandrendermd(fulltext, relength) {
    rmclass(scriptsearcher, 'myhide')
    adclass(scriptsearcher, 'searchshow')
    md.style.paddingBottom = '3rem'
    rmclass(md, 'myhide')
    searchcount = relength
    render_md(fulltext)
}

function createpostcomment(i, comment) {
    let commentCard = '<div class="card" id="comment-' + i + '"><div class="card-header text-white bg-dark"><span style="font-weight:bold;"><a target="_blank" href=" ' + comment.user.html_url + ' ">' + comment.user.login + '</a> commented <a href=" ' + comment.html_url + '" target="_blank">#' + i + '</a> at: </span>' + comment.created_at + '</div><div class="card-body"><p class="card-text">\r\n\r\n' + (comment.body) + '</p></div></div><br>'
    return commentCard
}