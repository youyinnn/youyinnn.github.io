function createpostcard(item, pagebelong) {
    let postcard = c('div')
    let posttitle = c('a')
    let posttime = c('div')
    let sp1 = c('span')
    let postshortmsg = c('div')
    let postmore = c('a')
    let tagsandcates = c('div')
    let tagsbox = c('div')
    let charsbox = c('div')
    let catestag = c('span')
    adclass(postcard, 'postcard')
    adclass(posttitle, 'postcardtitle font-weight-bold')
    adclass(posttime, 'postcardtime')
    adclass(tagsandcates, 'postcardtime')
    adclass(postshortmsg, 'postshortmsg')
    adclass(postmore, 'postmore')
    tagsbox.style.marginTop = '5px'
    charsbox.style.marginTop = '5px'
    posttitle.innerHTML = item.title
    posttitle.number = item.number
    posttitle.href = '/' + '?to=post&number=' + posttitle.number
    postcard.id = 'post_' + item.number
    postshortmsg.id = 'post_short_msg_' + item.number
    postmore.innerHTML = 'MORE_'
    postmore.href = '/' + '?to=post&number=' + posttitle.number
    $(posttitle).click(function () {
        location = '/' + '?to=post&number=' + posttitle.number
    })
    sp1.innerHTML = '# 创于 ' + postcarddate(dayjs(item.date)) + ' | 发于 ' + postcarddate(dayjs(item.created_at)) + ' | 更于' + postcarddate(dayjs(item.updated_at))
    let catestaghtml = ''
    let content = ''
    if (item.categories !== undefined && item.categories.length !== 0) {
        for (let i = 0; i < item.categories.length; i++) {
            content += item.categories[i]
            content += '-'
        }
        content = content.substring(0, content.length - 1)
    } else {
        content = 'nothing here'
    }
    catestaghtml = 'Categories: <span class="badge badge-dark" style="font-size: 100%;max-width: 100%;">' + content + '</span>'
    catestag.innerHTML = catestaghtml
    let tagsboxhtml = ''
    content = ''
    if (item.tags !== undefined && item.tags.length !== 0) {
        for (let i = 0; i < item.tags.length; i++) {
            content += '<span class="badge badge-dark" style="font-size: 100%;max-width: 100%;">' + item.tags[i] + '</span>&nbsp;'
        }
    } else {
        content = 'nothing here'
    }
    tagsboxhtml = 'Tags: ' + content
    tagsbox.innerHTML = tagsboxhtml
    charsbox.innerHTML = 'Chars: ' + item.char_count + ' c'
    appendc(postcard, posttitle)
    appendc(posttime, sp1)
    appendc(postcard, posttime)
    appendc(tagsandcates, catestag)
    appendc(tagsandcates, tagsbox)
    appendc(tagsandcates, charsbox)
    appendc(postcard, tagsandcates)
    appendc(postcard, postshortmsg)
    appendc(postcard, postmore)
    appendc($('#pagebox-' + pagebelong)[0], postcard)
    let text = item.short_contant
    let cq = text.match(/{%.*cq.*%}/gm)
    let emojis = text.match(/:[A-z]+[-|_]?[A-z|0-9]+:/g)
    if (emojis !== null) {
        emojis.forEach(emoji => {
            text = text.replace(emoji, window.emoji.replace_colons(emoji))
        });
    }
    if (cq) {
        let saying = text.substring(text.indexOf(cq[0]) + cq[0].length + 2, text.indexOf(cq[1]))
        saying = saying.replace(/\r\n/gm, '</br>')
        text = text.substring(text.indexOf(cq[1]) + cq[1].length, text.length)
        showsaying(postshortmsg, saying)
    }
    let gifs = text.match(/!\[.*\]\(.*.gif\)/g)
    if (gifs !== null) {
        gifs.forEach(gif => {
            let gifalt = gif.match(/\[.*\]/g)
            gifalt = gifalt[0].substring(1, gifalt[0].length - 1);
            let giflk = gif.match(/\(.*\)/g)
            giflk = giflk[0].substring(1, giflk[0].length - 1);
            let gifbut = '<button class="gifbtn stgt btn btn-dark" show="no" lk="' + giflk + '">查看或隐藏' + gifalt + '.gif</button>'
            text = text.replace(gif, gifbut)
        });
    }
    let katexmds = text.match(/\$\$.*\$\$/g)
    if (katexmds !== null) {
        katexmds.forEach(ktmd => {
            let kt = ktmd.replace(/\$\$/gm, '')
            let kthtml = katex.renderToString(kt, {
                throwOnError: false
            })
            text = text.replace(ktmd, kthtml)
        })
    }
    editormd.markdownToHTML(postshortmsg.id, {
        markdown: text,
        htmlDecode: 'style,script,iframe',
        tocm: true, // Using [TOCM]
        tocContainer: '#sidetoc',
        taskList: true,
        // tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
    })
}

function createposthead(re) {
    let title = re.title
    let posthead = c('div')
    let posttitle = c('div')
    let posttime = c('div')
    let sp1 = c('span')
    let sp2 = c('span')
    let sp3 = c('span')
    let sp4 = c('span')
    let sp5 = c('span')
    let sp6 = c('span')
    adclass(posthead, 'posthead onepost')
    adclass(posttitle, 'posttitle')
    adclass(posttime, 'posttime')
    adclass(sp1, 'font-weight-bold mr-2')
    adclass(sp3, 'font-weight-bold mr-2')
    adclass(sp5, 'font-weight-bold mr-2')
    adclass(sp6, 'mdcharlength')
    sp1.innerHTML = 'Post:'
    sp2.innerHTML = dayjs(re.created_at).format('MMM,DD YYYY') + postcarddate(dayjs(re.created_at))
    sp3.innerHTML = '<br>Mod:'
    sp4.innerHTML = dayjs(re.updated_at).format('MMM,DD YYYY') + postcarddate(dayjs(re.updated_at))
    sp5.innerHTML = '<br>Chars:'
    posttitle.innerHTML = title
    appendc(posttime, sp1)
    appendc(posttime, sp2)
    appendc(posttime, sp3)
    appendc(posttime, sp4)
    appendc(posttime, sp5)
    appendc(posttime, sp6)
    appendc(posthead, posttitle)
    appendc(posthead, posttime)
    appendc(md, posthead)
}

function showhexometadata(hexometadata) {
    let metadatapanel = c('div')
    let metadatapanelhead = c('div')
    let metadatapanelbody = c('div')
    adclass(metadatapanel, 'metadata ')
    adclass(metadatapanelhead, 'metadatahead')
    adclass(metadatapanelbody, 'metadatabody')
    metadatapanelhead.innerHTML = 'Hexo Front-matter'
    appendc($(metadatapanel)[0], metadatapanelhead)
    appendc($(metadatapanel)[0], metadatapanelbody)
    if (hexometadata.title !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Title:</span> ' + hexometadata.title + '<br>'
    }
    if (hexometadata.date !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Date:</span> ' + dayjs(hexometadata.date).set('hour', dayjs(hexometadata.date).hour() - 8).format('MMM,DD YYYY') + postcarddate(dayjs(hexometadata.date).set('hour', dayjs(hexometadata.date).hour() - 8)) + '<br>'
    }
    if (hexometadata.updated !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Updated:</span> ' + dayjs(hexometadata.updated).set('hour', dayjs(hexometadata.updated).hour() - 8).format('MMM,DD YYYY') + postcarddate(dayjs(hexometadata.updated).set('hour', dayjs(hexometadata.updated).hour() - 8)) + '<br>'
    }
    if (hexometadata.comments !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Comments:</span> ' + hexometadata.comments + '<br>'
    }
    if (hexometadata.categories !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Categories:</span><br>'
        for (let i = 0; i < hexometadata.categories.length; i++) {
            metadatapanelbody.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="badge badge-dark">' + hexometadata.categories[i] + '</span><br>'
        }
    }
    if (hexometadata.tags !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Tags:</span><br>'
        for (let i = 0; i < hexometadata.tags.length; i++) {
            metadatapanelbody.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="badge badge-dark">' + hexometadata.tags[i] + '</span><br>'
        }
    }
    appendc(md, metadatapanel)
}

function showsaying(addto, saying) {
    let sayingpanel = c('div')
    adclass(sayingpanel, 'saying mb-4')
    sayingpanel.innerHTML = saying
    appendc(addto, sayingpanel)
}

function createtodo(issuesbody, re) {
    let todohead = c('div')
    todohead.innerHTML = '<i class="em-svg em-card_index"></i>  Todo List'
    adclass(todohead, 'todohead unselectable')
    appendc(md, todohead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = re.length - 1; i >= 0; --i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card todo-card" id="search-' + (re.length - i - 1) + '"> <div class="card-header todo-head"> <span style="font-weight:bold;">ToDo <a href=" ' + re[i].html_url + '" target="_blank">#' + (re.length - i - 1) + '</a> created at: </span> <p style="margin:0; text-align: right">' + dayjs(head).format('MMM,DD YYYY') + postcarddate(dayjs(head).set('hour', dayjs(head).hour() - 8)) + ' </p> </div> <div class="card-body todo-body"> <p class="card-text todo-text">\r\n' + text + '\r\n</p> </div> </div><br>'
    }
    $(md).animateCss('fadeIn')
    searchshowandrendermd(fulltext, re.length)
}

function createscript(issuesbody, re) {
    let scripthead = c('div')
    scripthead.innerHTML = '<i class="em-svg em-card_file_box"></i>  Script Base'
    adclass(scripthead, 'todohead unselectable')
    appendc(md, scripthead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = 0; i < re.length; ++i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Script <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> created at: </span>' + dayjs(head).format('MMM,DD YYYY') + postcarddate(dayjs(head).set('hour', dayjs(head).hour() - 8)) + '</div><div class="card-body">\r\n' + text + '\r\n</div></div><br>'
    }
    $(md).animateCss('fadeIn')
    searchshowandrendermd(fulltext, re.length)
    $('.card-body')
}

function createegg(issuesbody, re) {
    let egghead = c('div')
    egghead.innerHTML = '<i class="em-svg em-clown_face"></i>  E GGgG gGGG Gggg ggGG'
    adclass(egghead, 'todohead unselectable')
    appendc(md, egghead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = 0; i < re.length; ++i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card" id="search-' + i + '"><div class="card-header"><span style="font-weight:bold;">Egg <a href=" ' + re[i].html_url + '" target="_blank">#' + i + '</a> created at: </span>' + dayjs(head).format('MMM,DD YYYY') + '</div><div class="card-body"> <p class="card-text">\r\n' + text + '\r\n</p></div></div><br>'
    }
    $(md).animateCss('fadeIn')
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
    let commentCard = '<div class="" id="comment-' + i + '"><div class="card-header text-white bg-dark"><span style="font-weight:bold;"><a target="_blank" href=" ' + comment.user.html_url + ' ">' + comment.user.login + '</a> commented <a href=" ' + comment.html_url + '" target="_blank">#' + i + '</a> @ : </span>' + dayjs(comment.created_at).format('MMM,DD YYYY') + ' ' + (comment.author_association === 'NONE' ? '' : (' <span class="badge badge-light">' + comment.author_association + '</span>')) + ' </div><div class="card-body"><p class="card-text">\r\n\r\n' + (comment.body) + '</p></div></div><br>'
    return commentCard
}

function createsharebtn(btinnerHTML, func) {
    let ps = $('#postshare')[0]
    let btn = c('button')
    adclass(btn, 'btn btn-dark ml-1')
    btn.innerHTML = btinnerHTML
    appendc(ps, btn)
    func(btn)
}