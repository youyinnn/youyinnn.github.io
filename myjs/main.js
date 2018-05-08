var searchone = 0
var searchtext
var totalpages
var nowpage = 1

function render_md(text) {
    rmclass(md, 'myhide')
    adclass(md, 'myshow')
    rmclass(sidetoccontainer, 'myhide')
    adclass(sidetoccontainer, 'myshow')
    if (text.substring(0, 3) === '---') {
        let endindex = text.indexOf('---', 3) + 3
        let hexo_metadata = gethexofrontmatter(text)
        hexo_metadata = yaml.load(hexo_metadata.replace(/\r\n/gm, '\n'))
        showhexometadata(hexo_metadata)
        text = text.substring(endindex, text.length)
    }
    let cq = text.match(/{%.*cq.*%}/gm)
    if (cq) {
        let saying = text.substring(text.indexOf(cq[0]) + cq[0].length + 2, text.indexOf(cq[1]))
        saying = saying.replace(/\r\n/gm, '</br>')
        text = text.substring(text.indexOf(cq[1]) + cq[1].length, text.length)
        showsaying(saying)
    }
    while (true) {
        let emojistart = text.search(/:[A-z]+[-|_]?[A-z|0-9]+:/g)
        if (emojistart === -1) break
        let emojiend = text.indexOf(':', emojistart + 1)
        let emoji = text.substring(emojistart, emojiend + 1)
        text = text.replace(emoji, '<i class="em-svg em-' + emoji.substring(1, emoji.length - 1) + '"></i>')
    }
    editormd.markdownToHTML('md', {
        markdown: text,
        htmlDecode: 'style,script,iframe',
        tocm: true, // Using [TOCM]
        tocContainer: '#sidetoc',
        taskList: true,
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
    });
    let as = $('#md a')
    for (let i = 0; i < as.length; i++) {
        as[i].target = '_blank'
    }
    $('pre, pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

function postspage(pageto) {
    docpanel.style.cssText = 'transform: translateY(-' + ((postpanelheight - 48) * (pageto - 1)) + 'px);'
}

function hideloading() {
    rmclass(loading, 'myshow')
    adclass(loading, 'myhide')
}

function showloading() {
    rmclass(loading, 'myhide')
    adclass(loading, 'myshow')
}

function hidesidetoc() {
    adclass(sidetoccontainer, 'myhide')
    adclass(md, 'w-100')
}

function searchscript(text) {
    if (searchtext !== text) {
        searchone = 0
    }
    searchtext = text
    if (text === '#l' || text === '#last') {
        $('html,body').animate({
            scrollTop: $('#search-' + (searchcount - 1)).offset().top
        }, 300);
        return
    }
    if (text.search(/#[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?/g) !== -1) {
        let searchid = '#search-' + text.split('#')[1]
        let search = $(searchid)
        if (search[0] !== undefined) {
            $('html,body').animate({
                scrollTop: search.offset().top
            }, 300);
            return
        }
    } else {
        text = text.split('-i,')
        let isi = true
        if (text.length > 1) {
            isi = false
            text = text[1]
        } else {
            text = text[0]
        }
        text = text.replace(/ /g, '')
        let keywords = text.split(',')
        for (let i = 0; i < keywords.length; i++) {
            if (isi) {
                keywords[i] = new RegExp(keywords[i], 'gi')
            } else {
                keywords[i] = new RegExp(keywords[i], 'g')
            }
        }
        for (let i = searchone; i < searchcount; i++) {
            let search = $('#search-' + i)
            let scripttext = search[0].innerText
            let get = true
            for (let j = 0; j < keywords.length; j++) {
                get = scripttext.search(keywords[j]) === -1 ? get && false : get && true
            }
            if (get) {
                searchone = i + 1
                scrolltoelement(search[0].id)
                searchbut.innerText = 'Get #' + i
                setTimeout(function() {
                    searchbut.innerText = 'Search'
                }, 1000, 'swing')
                return
            }
        }
    }
    $('#searchtext').addClass('getnothing')
    searchbut.innerText = 'No get'
    setTimeout(function() {
        searchbut.innerText = 'Search'
        $('#searchtext').removeClass('getnothing')
    }, 1000, 'swing')
    searchone = 0
}

function scrolltoelement(elementid) {
    if ($('#' + elementid)[0].oset === undefined) {
        $('#' + elementid)[0].oset = $('#' + elementid).offset().top
    }
    $('html,body').animate({
        scrollTop: $('#' + elementid)[0].oset
    }, 600, 'swing');
}

function setgohub(text, href) {
    gohub.innerText = text
    gohub.href = href
}

function changepagetitle(text) {
    $('title')[0].innerText = text
}

function gethexofrontmatter(text) {
    if (text.substring(0, 3) === '---') {
        let endindex = text.indexOf('---', 3) + 3
        let hexo_metadata = text.substring(4, endindex - 3)
        return hexo_metadata
    }
}

function searchpost(text) {
    if (text !== '') {
        $('.pagebox').remove()
        $('.pagination').remove()
        if (filter_posts_cache.length === 0) {
            for (let i = 0; i < posts_cache.length; i++) {
                if (posts_cache[i].title.concat(posts_cache[i].body).search(new RegExp(text), 'gi') !== -1) {
                    postsearchrs.push(posts_cache[i])
                }
            }
        } else {
            for (let i = 0; i < filter_posts_cache.length; i++) {
                if (filter_posts_cache[i].title.concat(filter_posts_cache[i].body).search(new RegExp(text), 'gi') !== -1) {
                    postsearchrs.push(filter_posts_cache[i])
                }
            }
        }
        rstopaging(postsearchrs)
        postsearchrs = new Array()
    } else {
        cleansearch()
    }
}

function postscachehandle(post) {
    let postcache = new Object()
    let hexofrontmatter = gethexofrontmatter(post.body)
    if (hexofrontmatter !== undefined) {
        hexofrontmatter = yaml.load(hexofrontmatter.replace(/\r\n/gm, '\n'))
        postcache.title = hexofrontmatter.title
        postcache.tags = hexofrontmatter.tags
        postcache.cates = hexofrontmatter.categories
    } else {
        postcache.title = post.title
        postcache.cates = ['unclassified']
    }
    postcache.body = post.body
    postcache.created_at = post.created_at
    postcache.updated_at = post.updated_at
    postcache.number = post.number
    if (postcache.tags !== undefined) {
        for (let i = 0; i < postcache.tags.length; i++) {
            let haved = false
            for (let j = 0; j < all_tags.length; j++) {
                if (all_tags[j] === postcache.tags[i]) {
                    haved = true
                }
            }
            if (!haved) {
                all_tags.push(postcache.tags[i])
                tags.innerHTML += '<button class="stgt btn btn-light">' + postcache.tags[i] + '</button>'
            }
        }
    }
    for (let i = 0; i < postcache.cates.length; i++) {
        let haved = false
        for (let j = 0; j < all_cates.length; j++) {
            if (all_cates[j] === postcache.cates[i]) {
                haved = true
            }
        }
        if (!haved) {
            all_cates.push(postcache.cates[i])
            cates.innerHTML += '<button class="stgc btn btn-light">' + postcache.cates[i] + '</button>'
        }
    }
    posts_cache.push(postcache)
}

function filter() {
    nowpage = 1
    $('.pagebox').remove()
    $('.pagination').remove()
    if (filter_posts_cache.length === 0) {
        rstopaging(posts_cache)
    } else {
        rstopaging(filter_posts_cache)
    }
    postsearchrs = new Array()
}

function rstopaging(posts) {
    let totalpages = Math.ceil(posts.length / 5)
    let pagesboxs = new Array(totalpages)
    for (let i = 0; i < totalpages; i++) {
        let pagebox = c('div')
        adclass(pagebox, 'pagebox')
        pagebox.id = 'pagebox-' + (i + 1)
        appendc(docpanel, pagebox)
        pagesboxs[i] = pagebox
    }
    for (let i = 0; i < posts.length; ++i) {
        createpostcard(posts[i], Math.ceil((i + 1) / 5))
    }
    window.totalpages = totalpages
    pagination()
}

function pagination() {
    nowpage = 1
    let pbs = $('.pagebox')
    for (let i = 1; i < pbs.length; i++) {
        adclass(pbs[i], 'myhide')
    }
    let pn = c('ul')
    adclass(pn, 'pagination')

    let first = c('li')
    first.id = 'fpg'
    adclass(first, 'page-item')
    let firstl = c('a')
    adclass(firstl, 'page-link')
    firstl.href = 'javaScript:void(0)'
    firstl.innerText = 'F'
    appendc(first, firstl)
    appendc(pn, first)
    $(first).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== 1) {
            if (totalpages > 3) {
                $('#pg-1 > a')[0].innerText = 1
                $('#pg-2 > a')[0].innerText = 2
                $('#pg-3 > a')[0].innerText = 3
            }
            adclass($('#pagebox-' + nowpage)[0], 'myhide')
            rmclass($('#pagebox-' + 1)[0], 'myhide')
            rmclass($('.active')[0], 'active')
            adclass($('#pg-' + 1)[0], 'active')
            nowpage = 1
        }
    })

    let pre = c('li')
    pre.id = 'ppg'
    adclass(pre, 'page-item')
    adclass(pre, 'page-item')
    let prel = c('a')
    adclass(prel, 'page-link')
    prel.href = 'javaScript:void(0)'
    prel.innerText = '<'
    appendc(pre, prel)
    appendc(pn, pre)
    $(pre).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== 1) {
            if ($('#pg-1').hasClass('active')) {
                $('#pg-1 > a')[0].innerText = parseInt($('#pg-1 > a')[0].innerText) - 1
                $('#pg-2 > a')[0].innerText = parseInt($('#pg-2 > a')[0].innerText) - 1
                $('#pg-3 > a')[0].innerText = parseInt($('#pg-3 > a')[0].innerText) - 1
            }
            adclass($('#pagebox-' + nowpage)[0], 'myhide')
            rmclass($('#pagebox-' + (nowpage - 1))[0], 'myhide')
            if ($('#pg-3').hasClass('active')) {
                $('#pg-3').removeClass('active')
                $('#pg-2').addClass('active')
            } else if ($('#pg-2').hasClass('active')) {
                $('#pg-2').removeClass('active')
                $('#pg-1').addClass('active')
            }
            nowpage--
        }
    })

    for (let i = 0; i < pbs.length; i++) {
        if (i > 2) break
        let pg = c('li')
        pg.id = 'pg-' + (i + 1)
        adclass(pg, 'page-item')
        let pgl = c('a')
        adclass(pgl, 'page-link')
        pgl.href = 'javaScript:void(0)'
        pgl.innerHTML = i + 1
        if (i === 0) {
            adclass(pg, 'active')
        }
        appendc(pg, pgl)
        appendc(pn, pg)
        $(pg).bind('click', function(ev) {
            let clickpg = parseInt(this.innerText)
            if (clickpg !== nowpage) {
                adclass($('#pagebox-' + nowpage)[0], 'myhide')
                rmclass($('#pagebox-' + clickpg)[0], 'myhide')
                rmclass($('.active')[0], 'active')
                adclass($('#pg-' + this.id.split('-')[1])[0], 'active')
                nowpage = clickpg
            }
        })
    }

    let next = c('li')
    next.id = 'npg'
    adclass(next, 'page-item')
    let nextl = c('a')
    adclass(nextl, 'page-link')
    nextl.href = 'javaScript:void(0)'
    nextl.innerText = '>'
    appendc(next, nextl)
    appendc(pn, next)
    $(next).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== totalpages) {
            if ($('#pg-3').hasClass('active')) {
                $('#pg-1 > a')[0].innerText = parseInt($('#pg-1 > a')[0].innerText) + 1
                $('#pg-2 > a')[0].innerText = parseInt($('#pg-2 > a')[0].innerText) + 1
                $('#pg-3 > a')[0].innerText = parseInt($('#pg-3 > a')[0].innerText) + 1
            } else {
                rmclass($('.active')[0], 'active')
                adclass($('#pg-' + (nowpage + 1))[0], 'active')
            }
            adclass($('#pagebox-' + nowpage)[0], 'myhide')
            rmclass($('#pagebox-' + (nowpage + 1))[0], 'myhide')
            nowpage++
        }
    })

    let last = c('li')
    last.id = 'lpg'
    adclass(last, 'page-item')
    let lastl = c('a')
    adclass(lastl, 'page-link')
    lastl.href = 'javaScript:void(0)'
    lastl.innerText = 'L'
    appendc(last, lastl)
    appendc(pn, last)
    $(last).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== totalpages) {
            adclass($('#pagebox-' + nowpage)[0], 'myhide')
            rmclass($('#pagebox-' + totalpages)[0], 'myhide')
            rmclass($('.active')[0], 'active')
            if (totalpages >= 3) {
                adclass($('#pg-3')[0], 'active')
                $('#pg-1 > a')[0].innerText = totalpages - 2
                $('#pg-2 > a')[0].innerText = totalpages - 1
                $('#pg-3 > a')[0].innerText = totalpages
            } else {
                adclass($('#pg-2')[0], 'active')
            }
            nowpage = totalpages
        }
    })
    appendc(docpanel, pn)
}

function cleansearch() {
    $('.pagebox').remove()
    $('.pagination').remove()
    rstopaging(posts_cache)
    postsearchrs = new Array()
    filter_posts_cache = new Array()
    let stgts = $('.stgt')
    let stgcs = $('.stgc')
    for (let j = 0; j < stgcs.length; j++) {
        if (stgcs[j].disabled === false) {
            rmclass(stgcs[j], 'btn-success')
            adclass(stgcs[j], 'btn-light')
        }
        stgcs[j].disabled = false
    }
    for (let j = 0; j < stgts.length; j++) {
        if (stgts[j].disabled === false) {
            rmclass(stgts[j], 'btn-info')
            adclass(stgts[j], 'btn-light')
        }
        stgts[j].disabled = false
    }
}

function setmovetitle(title) {
    movetitle.innerText = '「' + title + '」'
}

function showmovetitle() {
    rmclass(movetitle, 'myhide')
}