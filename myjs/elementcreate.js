function createarticlecard(item, pagebelong) {
    let articlecard = c('div')
    let articletitle = c('a')
    let articletime = c('div')
    let sp1 = c('span')
    let articleshortmsg = c('div')
    let articlemore = c('a')
    let tagsandcates = c('div')
    let tagsbox = c('div')
    let charsbox = c('div')
    let catestag = c('span')
    adclass(articlecard, 'articlecard')
    adclass(articletitle, 'articlecardtitle font-weight-bold')
    adclass(articletime, 'articlecardtime')
    adclass(tagsandcates, 'articlecardtime')
    adclass(articleshortmsg, 'articleshortmsg')
    adclass(articlemore, 'articlemore')
    tagsbox.style.marginTop = '5px'
    charsbox.style.marginTop = '5px'
    articletitle.innerHTML = item.title
    articletitle.abbrlink = item.abbrlink
    articletitle.href = '/article/' + articletitle.abbrlink + '.html'
    articlecard.id = 'article_' + item.abbrlink
    articleshortmsg.id = 'article_short_msg_' + item.abbrlink
    articlemore.innerHTML = 'more'
    articlemore.href = '/article/' + articletitle.abbrlink + '.html'
    sp1.innerHTML = '# 创于 ' + articlecarddate(dayjs(item.date)) + ' | 发于 ' + articlecarddate(dayjs(item.created_at)) + ' | 更于' + articlecarddate(dayjs(item.updated_at))
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
    catestaghtml = 'Categories: <span class="bdgonarticlecard badge badge-dark" style="font-size: 100%;max-width: 100%;border-radius: .25rem !important;">' + content + '</span>'
    catestag.innerHTML = catestaghtml
    let tagsboxhtml = ''
    content = ''
    if (item.tags !== undefined && item.tags.length !== 0) {
        for (let i = 0; i < item.tags.length; i++) {
            content += '<span class="bdgonarticlecard badge badge-dark" style="font-size: 100%;max-width: 100%;border-radius: .25rem !important;">' + item.tags[i] + '</span>&nbsp;'
        }
    } else {
        content = 'nothing here'
    }
    tagsboxhtml = 'Tags: ' + content
    tagsbox.innerHTML = tagsboxhtml
    charsbox.innerHTML = 'Chars: ' + item.char_count + ' c'
    appendc(articlecard, articletitle)
    appendc(articletime, sp1)
    appendc(articlecard, articletime)
    appendc(tagsandcates, catestag)
    appendc(tagsandcates, tagsbox)
    appendc(tagsandcates, charsbox)
    appendc(articlecard, tagsandcates)
    appendc(articlecard, articleshortmsg)
    appendc(articlecard, articlemore)
    appendc($('#pagebox-' + pagebelong)[0], articlecard)
    let text = item.short_contant
    let cq = text.match(/{%.*cq.*%}/gm)
    let emojis = text.match(/:[A-z]+[-|_]?[A-z|0-9]+:/g)
    if (emojis !== null) {
        emojis.forEach(emoji => {
            text = text.replace(emoji, window.emoji.replace_colons(emoji))
        });
    }
    if (cq) {
        for (let i = 0; i < cq.length; i += 2) {
            let cqindex = text.search(cq[i]);
            let endcqindex = text.search(cq[i + 1]);
            let saying = text.substring(cqindex, endcqindex + 11)
            let newsaying = '<div class="saying mb-4">' + text.substring(cqindex + cq[i].length + 2, endcqindex).replace(/\r\n|\r|\n/gm, '') + '</div>'
            text = text.replace(saying, newsaying)
        }
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
    editormd.markdownToHTML(articleshortmsg.id, {
        markdown: text,
        htmlDecode: 'style,script,iframe',
        tocm: true, // Using [TOCM]
        tocContainer: '#sidetoc',
        taskList: true,
        // tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
    })
    let pres = $('pre')
    for (p of pres) {
        if (p.innerText === '') {
            $(p).remove()
        }
    }
}

function createarticlehead(re) {
    let title = re.title
    let articlehead = c('div')
    let articletitle = c('div')
    let articletime = c('div')
    let sp1 = c('span')
    let sp2 = c('span')
    let sp3 = c('span')
    let sp4 = c('span')
    let sp5 = c('span')
    let sp6 = c('span')
    adclass(articlehead, 'articlehead onearticle')
    adclass(articletitle, 'articletitle')
    adclass(articletime, 'articletime')
    adclass(sp1, 'font-weight-bold mr-2')
    adclass(sp3, 'font-weight-bold mr-2')
    adclass(sp5, 'font-weight-bold mr-2')
    adclass(sp6, 'mdcharlength')
    sp1.innerHTML = 'Post:'
    sp2.innerHTML = dayjs(re.created_at).format('MMM,DD YYYY') + articlecarddate(dayjs(re.created_at))
    sp3.innerHTML = '<br>Mod:'
    sp4.innerHTML = dayjs(re.updated_at).format('MMM,DD YYYY') + articlecarddate(dayjs(re.updated_at))
    sp5.innerHTML = '<br>Chars:'
    articletitle.innerHTML = title
    appendc(articletime, sp1)
    appendc(articletime, sp2)
    appendc(articletime, sp3)
    appendc(articletime, sp4)
    appendc(articletime, sp5)
    appendc(articletime, sp6)
    appendc(articlehead, articletitle)
    appendc(articlehead, articletime)
    appendc(md, articlehead)
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
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Date:</span> ' + dayjs(hexometadata.date).set('hour', dayjs(hexometadata.date).hour() - 8).format('MMM,DD YYYY') + articlecarddate(dayjs(hexometadata.date).set('hour', dayjs(hexometadata.date).hour() - 8)) + '<br>'
    }
    if (hexometadata.updated !== undefined) {
        metadatapanelbody.innerHTML += '<span class="badge badge-light">Updated:</span> ' + dayjs(hexometadata.updated).set('hour', dayjs(hexometadata.updated).hour() - 8).format('MMM,DD YYYY') + articlecarddate(dayjs(hexometadata.updated).set('hour', dayjs(hexometadata.updated).hour() - 8)) + '<br>'
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

function createtodo(issuesbody, re) {
    let todohead = c('div')
    todohead.innerHTML = '<i class="em-svg em-card_index"></i>  Todo List'
    adclass(todohead, 'todohead unselectable')
    appendc(md, todohead)
    let fulltext = '\r\n' + issuesbody + '\r\n'
    for (let i = re.length - 1; i >= 0; --i) {
        let head = re[i].created_at
        let text = re[i].body
        fulltext += '<div class="card todo-card" id="search-' + (re.length - i - 1) + '"> <div class="card-header todo-head"> <span style="font-weight:bold;">ToDo <a href=" ' + re[i].html_url + '" target="_blank">#' + (re.length - i - 1) + '</a> created at: </span> <p style="margin:0; text-align: right">' + dayjs(head).format('MMM,DD YYYY') + articlecarddate(dayjs(head).set('hour', dayjs(head).hour() - 8)) + ' </p> </div> <div class="card-body todo-body"> <p class="card-text todo-text">\r\n' + text + '\r\n</p> </div> </div><br>'
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
        fulltext += `<div class="card" id="search-${i}"><div class="card-header"><span style="font-weight:bold;">Script <a href="${re[i].html_url}" target="_blank">#${i}</a> created at: </span>${dayjs(head).format('MMM,DD YYYY') + articlecarddate(dayjs(head).set('hour', dayjs(head).hour() - 8))}</div><div class="card-body">${'\r\n\r\n' + text + '\r\n\r\n'}</div></div><br>`
    }
    $(md).animateCss('fadeIn')
    searchshowandrendermd(fulltext, re.length)
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

function createarticlecomment(i, comment) {
    let commentCard = '<div class="comment" id="comment-' + i + '"><div class="card-header text-white bg-dark" style="border-radius: .25rem .25rem 0 0;"><span style="font-weight:bold;"><a target="_blank" href=" ' + comment.user.html_url + ' ">' + comment.user.login + '</a> commented <a href=" ' + comment.html_url + '" target="_blank">#' + i + '</a> @ : </span>' + dayjs(comment.created_at).format('MMM,DD YYYY') + ' ' + (comment.author_association === 'NONE' ? '' : (' <span class="align-text-top badge badge-light ml-1">' + comment.author_association + '</span>')) + ' </div><div class="card-body"><p class="card-text">' + (comment.body) + '</p></div></div><br>'
    return commentCard
}

function createsharebtn(btinnerHTML, func) {
    let ps = $('#articleshare')[0]
    let btn = c('button')
    adclass(btn, 'btn btn-dark ml-1')
    btn.innerHTML = btinnerHTML
    appendc(ps, btn)
    func(btn)
}
