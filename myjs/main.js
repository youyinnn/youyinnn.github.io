var searchone = 0
var searchtext
var totalpages
var nowpage = 1

function render_md(text) {
    rmclass(md, 'myhide')
    adclass(md, 'myshow')
    if (text.substring(0, 3) === '---') {
        let endindex = text.indexOf('---', 3) + 3
        let hexo_metadata = gethexofrontmatter(text)
        hexo_metadata = yaml.load(hexo_metadata.replace(/\r\n/gm, '\n'))
        window.postcomment = hexo_metadata.comments
        showhexometadata(hexo_metadata)
        text = text.substring(endindex, text.length)
    }
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
        showsaying(md, saying)
    }
    let cobs = text.match(/<cob.*\/>/g)
    if (cobs !== null) {
        cobs.forEach(cob => {
            let cobtg = cob.substring(cob.indexOf('"', 0) + 1, cob.indexOf('"', cob.indexOf('"', 0) + 1))
            text = text.replace(cob, '<span class="collbut" tg="#' + cobtg + '">点击展开</span>')
        });
    }
    let cos = text.match(/<co .*>/g)
    if (cos !== null) {
        cos.forEach(co => {
            let newco = co.replace('co', 'div class="mycoll"')
            text = text.replace(co, newco)
            text = text.replace('</co>', '</div><hr>')
        });
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
    text = text.replace('<acob/>', '<span id="acob">全部展开</span>')
    editormd.markdownToHTML('md', {
        markdown: text,
        htmlDecode: 'style,script',
        tocm: true, // Using [TOCM]
        tocContainer: '#sidetoc',
        taskList: true,
        // tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
    });
    let as = $('#md a')
    for (let i = 0; i < as.length; i++) {
        as[i].target = '_blank'
    }
    $('pre, pre code').each(function(i, block) {
        hljs.highlightBlock(block)
        hljs.lineNumbersBlock(block)
    })
    $('.reference-link').each(function() {
        this.setAttribute('name', this.getAttribute('name').replace(/\s*$/g, ''))
    })
    $('.gifbtn').each(function() {
        bindev(this, 'click', function() {
            let noshow = this.getAttribute('show') === 'no'
            if (noshow) {
                $(this).after('<img id="' + this.innerText.substring(0, this.innerText.length - 4) + '" src="' + this.getAttribute('lk') + '"></img>')
                this.setAttribute('show', 'yes')
            } else {
                $('#' + this.innerText.substring(0, this.innerText.length - 4)).remove()
                this.setAttribute('show', 'no')
            }
        })
    })
    var $root = $('html, body')
    $('.markdown-toc a').click(function() {
        if ($(md).hasClass('panelup')) {
            $root.animate({
                scrollTop: $('[name="' + $.attr(this, 'href').substring(1, $.attr(this, 'href').length).replace(/\s*$/g, '') + '"]').offset().top - 15
            }, 600)
        }
        if (getstyle(topbar, 'height') === '48px' && !hasclass(topbar, 'hidetopbar')) {
            $root.animate({
                scrollTop: $('[name="' + $.attr(this, 'href').substring(1, $.attr(this, 'href').length).replace(/\s*$/g, '') + '"]').offset().top - 15 - 48
            }, 600)
        }
        if (getstyle(topbar, 'height') === '96px' && !hasclass(topbar, 'hidetopbar')) {
            $root.animate({
                scrollTop: $('[name="' + $.attr(this, 'href').substring(1, $.attr(this, 'href').length).replace(/\s*$/g, '') + '"]').offset().top - 15 - 96
            }, 600)
        }
    })
    $('.katex').parent().addClass('katexp')
    $('thead').each(function() {
        let trs = $(this).next().find('tr')
        let trl = $(trs[0]).find('td').length
        let lasttr = $(trs[trs.length - 1])
        if (lasttr.find('td').length !== trl) {
            lasttr.append(c('td'))
        }
    })
    adclass(md, 'post')
    setimg()
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
    adclass(sidetoccontainer, 'tochide')
    rmclass(sidetoccontainer, 'tocshow')
    scriptsearcher.style.left = '0%'
    if (getclientw() < 700) {
        md.style.filter = ''
    }
}

function showsidetoc() {
    rmclass(sidetoccontainer, 'tochide')
    adclass(sidetoccontainer, 'tocshow')
    scriptsearcher.style.left = '-23%'
    if (getclientw() < 700) {
        md.style.filter = 'blur(2px)'
    }
}

function searchscript(text) {
    if (searchtext !== text) {
        searchone = 0
    }
    searchtext = text
    if (text === '#l' || text === '#last') {
        $('html,body').animate({
            scrollTop: $('#search-' + (searchcount - 1)).offset().top - 52
        }, 300);
        return
    }
    if (text.search(/#[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?/g) !== -1) {
        let searchid = '#search-' + text.split('#')[1]
        let search = $(searchid)
        if (search[0] !== undefined) {
            $('html,body').animate({
                scrollTop: search.offset().top - 52
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
        scrollTop: $('#' + elementid)[0].oset - 52
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

function getdocwithnohexofrontmatter(text) {
    if (text.substring(0, 3) === '---') {
        let endindex = text.indexOf('---', 3) + 3
        let body = text.substring(endindex, text.length)
        return body
    } else {
        return text
    }
}

function searchpost(text) {
    if (text !== '') {
        if (filter_posts_cache.length === 0) {
            for (let i = 0; i < posts_cache.length; i++) {
                if (posts_cache[i].title.search(new RegExp(text, 'ig')) !== -1) {
                    postsearchrs.push(posts_cache[i])
                }
            }
        } else {
            for (let i = 0; i < filter_posts_cache.length; i++) {
                if (filter_posts_cache[i].title.search(new RegExp(text, 'ig')) !== -1) {
                    postsearchrs.push(filter_posts_cache[i])
                }
            }
        }
        if (postsearchrs.length === 0) {
            $('#postsearchtext').addClass('getnothing')
            searchbut.innerText = 'No get'
            setTimeout(function() {
                $('#postsearchtext').removeClass('getnothing')
            }, 1000, 'swing')
        } else {
            $('#pgboxbox').remove()
            $('.pagination').remove()
            rstopaging(postsearchrs)
            postsearchrs = new Array()
        }
    } else {
        cleansearch()
    }
}

function postsmetadatahandle(postmetadata) {
    let postcache = postmetadata
    for (let i = 0; i < postcache.categories.length; i++) {
        // handle cates_tree_body
        let cate = b64.encode(postcache.categories[i], true)
        if ($('#' + cate + '_treenode').length === 0) {
            let node = c('li')
            node.id = cate + '_treenode'
            adclass(node, 'treenode')
            let noa = c('div')
            noa.innerText = postcache.categories[i]
            $(noa).bind('click', function(event) {
                catetreenodeclick(this, true, true)
            })
            appendc(node, noa)
            // root category add on cates_tree_body directly
            if (i === 0) {
                appendliwithorder(cates_tree_body, node)
            } else {
                // if not find parent root element and add child element
                let parentnodeid = b64.encode(postcache.categories[i - 1], true)
                appendliwithorder($('#' + parentnodeid + '_treenode')[0], node)
            }
        }

        // handle cates panel
        let haved = false
        for (let j = 0; j < all_cates.length; j++) {
            if (all_cates[j] === postcache.categories[i]) {
                haved = true
            }
        }
        if (!haved) {
            all_cates.push(postcache.categories[i])
            cates.innerHTML += '<button id="' + b64.encode(postcache.categories[i], true) + '_catetag" class="stgc btn btn-light">' + postcache.categories[i] + '</button>'
        }
    }
    // handle tags panel
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
}

// set order by string natural order for categories panel
function appendliwithorder(parentelement, newchildelement) {
    let cns = parentelement.childNodes
    let newchildcatename = b64.decode(newchildelement.id.split('_')[0])
    for (let i = 0; i < cns.length; i++) {
        if (cns[i].tagName === 'LI') {
            let brothercatename = b64.decode(cns[i].id.split('_')[0])
            if (brothercatename > newchildcatename) {
                $(cns[i]).before(newchildelement)
                return
            }
        }
    }
    $(parentelement).append(newchildelement)
}

function catetagclick(catetag, isfilter, clicknode) {
    let stgcs = $('.stgc')
    let stgts = $('.stgt')
    if (hasclass(catetag, 'btn-light')) {
        filter_posts_cache = new Array()
        stgts.attr('disabled', true)
        stgcs.attr('disabled', true)
        rmclass(catetag, 'btn-light')
        catetag.disabled = false
        adclass(catetag, 'btn-success')
        for (let k = 0; k < posts_cache.length; k++) {
            for (let l = 0; l < posts_cache[k].categories.length; l++) {
                if (posts_cache[k].categories[l] === catetag.innerText) {
                    filter_posts_cache.push(posts_cache[k])
                }
            }
        }
    } else {
        stgts.attr('disabled', false)
        stgcs.attr('disabled', false)
        rmclass(catetag, 'btn-success')
        adclass(catetag, 'btn-light')
    }
    if (isfilter) {
        filter()
    }
    if (clicknode) {
        catetreenodeclick($('#' + b64.encode(catetag.innerText, true) + '_treenode').children('div')[0], false, false)
    }
    scrollToTop(0)
}

function catetreenodeclick(catenode, isfilter, clicktag) {
    if (!hasclass(catenode, 'adisable')) {
        filter_posts_cache = new Array()
        if (!catenode.asel) {
            catenode.asel = true
            $('#cates_tree_body div').addClass('adisable')
            rmclass(catenode, 'adisable')
            for (let k = 0; k < posts_cache.length; k++) {
                for (let l = 0; l < posts_cache[k].categories.length; l++) {
                    if (posts_cache[k].categories[l] === catenode.innerText) {
                        filter_posts_cache.push(posts_cache[k])
                    }
                }
            }
            $('.stgt').attr('disabled', true)
        } else {
            catenode.asel = false
            $('.stgt').attr('disabled', false)
            $('#cates_tree_body div').removeClass('adisable')
        }
        if (isfilter) {
            filter()
        }
        if (clicktag) {
            catetagclick($('#' + b64.encode(catenode.innerText, true) + '_catetag')[0], false, false)
        }
    }
    scrollToTop(0)
}

function setheightfordocpanel() {
    let pbh = parseFloat($('.pagebox').not('.pageboxhide').css('height').split('px')[0]) + 140
    if (pbh < window.getclienth() - $(topbar)[0].clientHeight) {
        pbh = window.getclienth() - $(topbar)[0].clientHeight
    }
    $(docpanel).css('height', pbh)
}

function filter() {
    nowpage = 1
    $('#pgboxbox').addClass('pageboxhide')
    $('.pagination').addClass('myhide')
    setTimeout(function() {
        $('#pgboxbox').remove()
        $('.pagination').remove()
        if (filter_posts_cache.length === 0) {
            rstopaging(posts_cache)
        } else {
            rstopaging(filter_posts_cache)
        }
        postsearchrs = new Array()
    }, 100);
}

function rstopaging(posts) {
    let totalpages = Math.ceil(posts.length / perpageitem)
    let pagesboxs = new Array(totalpages)
    let pageboxbox = c('div')
    pageboxbox.id = 'pgboxbox'
    adclass(pageboxbox, 'myhide')
    appendc(docpanel, pageboxbox)
    for (let i = 0; i < totalpages; i++) {
        let pagebox = c('div')
        adclass(pagebox, 'pagebox')
        pagebox.id = 'pagebox-' + (i + 1)
        appendc(pageboxbox, pagebox)
        pagesboxs[i] = pagebox
    }
    for (let i = 0; i < posts.length; ++i) {
        createpostcard(posts[i], Math.ceil((i + 1) / perpageitem))
    }
    let as = $('.postshortmsg a')
    for (let i = 0; i < as.length; i++) {
        as[i].target = '_blank'
    }
    $('pre, pre code').each(function(i, block) {
        hljs.highlightBlock(block)
        hljs.lineNumbersBlock(block)
    })
    $('.reference-link').each(function() {
        this.setAttribute('name', this.getAttribute('name').replace(/\s*$/g, ''))
    })
    $('.gifbtn').each(function() {
        bindev(this, 'click', function() {
            let noshow = this.getAttribute('show') === 'no'
            if (noshow) {
                $(this).after('<img id="' + this.innerText.substring(0, this.innerText.length - 4) + '" src="' + this.getAttribute('lk') + '"></img>')
                this.setAttribute('show', 'yes')
            } else {
                $('#' + this.innerText.substring(0, this.innerText.length - 4)).remove()
                this.setAttribute('show', 'no')
            }
        })
    })
    window.totalpages = totalpages
    setTimeout(function() {
        rmclass(pageboxbox, 'myhide')
    }, 100);
    pagination()
}

function scrollToTop(interval) {
    $('html,body').animate({
        scrollTop: 0
    }, interval);
}

function pagination() {
    nowpage = 1
    let pbs = $('.pagebox')
    for (let i = 1; i < pbs.length; i++) {
        adclass(pbs[i], 'pageboxhide')
    }
    let pn = c('ul')
    adclass(pn, 'pagination unselectable')
    adclass(pn, 'myhide')

    let first = c('li')
    first.id = 'fpg'
    adclass(first, 'page-item')
    let firstl = c('div')
    adclass(firstl, 'page-link')
    firstl.innerText = 'F'
    appendc(first, firstl)
    appendc(pn, first)
    $(first).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== 1) {
            if (totalpages > 3) {
                $('#pg-1 > div')[0].innerText = 1
                $('#pg-2 > div')[0].innerText = 2
                $('#pg-3 > div')[0].innerText = 3
            }
            adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
            rmclass($('#pagebox-' + 1)[0], 'pageboxhide')
            rmclass($('.active')[0], 'active')
            adclass($('#pg-' + 1)[0], 'active')
            nowpage = 1
            scrollToTop(0)
            $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
        }
        setheightfordocpanel()
    })

    let pre = c('li')
    pre.id = 'ppg'
    adclass(pre, 'page-item')
    adclass(pre, 'page-item')
    let prel = c('div')
    adclass(prel, 'page-link')
    prel.innerText = '<'
    appendc(pre, prel)
    appendc(pn, pre)
    $(pre).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== 1) {
            if ($('#pg-1').hasClass('active')) {
                $('#pg-1 > div')[0].innerText = parseInt($('#pg-1 > div')[0].innerText) - 1
                $('#pg-2 > div')[0].innerText = parseInt($('#pg-2 > div')[0].innerText) - 1
                $('#pg-3 > div')[0].innerText = parseInt($('#pg-3 > div')[0].innerText) - 1
            }
            adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
            rmclass($('#pagebox-' + (nowpage - 1))[0], 'pageboxhide')
            if ($('#pg-3').hasClass('active')) {
                $('#pg-3').removeClass('active')
                $('#pg-2').addClass('active')
            } else if ($('#pg-2').hasClass('active')) {
                $('#pg-2').removeClass('active')
                $('#pg-1').addClass('active')
            }
            nowpage--
            setheightfordocpanel()
            scrollToTop(0)
            $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
        }
    })

    for (let i = 0; i < pbs.length; i++) {
        if (i > 2) break
        let pg = c('li')
        pg.id = 'pg-' + (i + 1)
        adclass(pg, 'page-item')
        let pgl = c('div')
        adclass(pgl, 'page-link')
        pgl.innerHTML = i + 1
        if (i === 0) {
            adclass(pg, 'active')
        }
        appendc(pg, pgl)
        appendc(pn, pg)
        $(pg).bind('click', function(ev) {
            let clickpg = parseInt(this.innerText)
            if (clickpg !== nowpage) {
                adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
                rmclass($('#pagebox-' + clickpg)[0], 'pageboxhide')
                rmclass($('.active')[0], 'active')
                adclass($('#pg-' + this.id.split('-')[1])[0], 'active')
                nowpage = clickpg
                setheightfordocpanel()
                scrollToTop(0)
                $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
            }
        })
    }

    let next = c('li')
    next.id = 'npg'
    adclass(next, 'page-item')
    let nextl = c('div')
    adclass(nextl, 'page-link')
    nextl.innerText = '>'
    appendc(next, nextl)
    appendc(pn, next)
    $(next).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== totalpages) {
            if ($('#pg-3').hasClass('active')) {
                $('#pg-1 > div')[0].innerText = parseInt($('#pg-1 > div')[0].innerText) + 1
                $('#pg-2 > div')[0].innerText = parseInt($('#pg-2 > div')[0].innerText) + 1
                $('#pg-3 > div')[0].innerText = parseInt($('#pg-3 > div')[0].innerText) + 1
            } else {
                rmclass($('.active')[0], 'active')
                adclass($('#pg-' + (nowpage + 1))[0], 'active')
            }
            adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
            rmclass($('#pagebox-' + (nowpage + 1))[0], 'pageboxhide')
            nowpage++
            setheightfordocpanel()
            scrollToTop(0)
            $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
        }
    })

    let last = c('li')
    last.id = 'lpg'
    adclass(last, 'page-item')
    let lastl = c('div')
    adclass(lastl, 'page-link')
    lastl.innerText = 'L'
    appendc(last, lastl)
    appendc(pn, last)
    $(last).bind('click', function(ev) {
        if (totalpages !== 0 && nowpage !== totalpages) {
            adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
            rmclass($('#pagebox-' + totalpages)[0], 'pageboxhide')
            rmclass($('.active')[0], 'active')
            if (totalpages >= 3) {
                adclass($('#pg-3')[0], 'active')
                $('#pg-1 > div')[0].innerText = totalpages - 2
                $('#pg-2 > div')[0].innerText = totalpages - 1
                $('#pg-3 > div')[0].innerText = totalpages
            } else {
                adclass($('#pg-2')[0], 'active')
            }
            nowpage = totalpages
            setheightfordocpanel()
            scrollToTop(0)
            $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
        }
    })
    appendc($('#pgboxbox')[0], pn)
    $('.pagination')[0].style.top = getstyle($('#pagebox-' + nowpage)[0], 'height')
    setTimeout(function() {
        rmclass(pn, 'myhide')
    }, 100)
    setheightfordocpanel()
}

function cleansearch() {
    $('#pgboxbox').remove()
    $('.pagination').remove()
    if (filter_posts_cache.length !== 0) {
        rstopaging(filter_posts_cache)
    } else {
        rstopaging(posts_cache)
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
    postsearchrs = new Array()
}

function showbbt() {
    $('#bbt').removeClass('myhide')
}

function no_label(label) {
    rmclass(docpanel, 'myhide')
    adclass(docpanel, 'myshow')
    docpanel.innerHTML = '<div id="nolabel"><i class="em-svg em-warning"></i><span>No label on repo\'s issues : [' + label + '].</span></div>'
}

function hidetopbar() {
    if (getclientw() > 700) {
        adclass(topbar, 'hidetopbar')
        adclass(md, 'panelup')
    }
}

function showtopbar() {
    if (getclientw() > 700) {
        rmclass(topbar, 'hidetopbar')
        rmclass(md, 'panelup')
    }
}

function cgtopbut() {
    if (hasclass(md, 'myshow')) {
        if (hasclass(topbar, 'hidetopbar')) {
            showtopbar()
        } else {
            hidetopbar()
        }
    }
}

function setcoll() {
    let collbuts = $('.collbut')
    $('#acob').bind('click', function() {
        if ($('#toc').hasClass('myhide')) {
            $('#toc')[0].style.display = 'inline-block'
            this.innerText = '全部隐藏'
            $('#toc').removeClass('myhide')
            setTimeout(function() {
                $('#toc').tooltip('show')
            }, 600);
            setTimeout(function() {
                $('#toc').tooltip('hide')
            }, 3000);
            collbuts.each(function() {
                if (this.innerText === '点击展开') {
                    this.click()
                }
            })
        } else {
            this.innerHTML = '全部展开'
            $('#toc').addClass('myhide')
            $('#toc')[0].style.display = 'none'
            collbuts.each(function() {
                if (this.innerText === '点击隐藏') {
                    this.click()
                }
            })
        }
    })
    for (let i = 0; i < collbuts.length; ++i) {
        let tg = $(collbuts[i].getAttribute('tg'))[0]
        tg.setAttribute('h', getstyle(tg, 'height'))
        tg.style.height = '0px'
        bindev(collbuts[i], 'click', function() {
            let h
            if (getstyle(tg, 'height') === '0px') {
                h = tg.getAttribute('h')
                collbuts[i].innerText = '点击隐藏'
            } else {
                h = '0px'
                collbuts[i].innerText = '点击展开'
            }
            $('#' + tg.id).animate({
                height: h
            }, 800);
        })
    }
}

function setimg() {
    let postimgs = $('.post img')
    postimgs.attr('title', 'click to focus')
    postimgs.bind('click', function() {
        if (getclientw() > 700 && getclienth() > 700) {
            let w = getclientw()
            let h = getclienth()
            let fixw = w * 0.85
            let fixh = h * 0.85
            let imgw = this.naturalWidth
            let imgh = this.naturalHeight
            let lg = fixh / imgh
            if (imgh > h * 2) {
                return
            }
            if (imgw * lg > fixw) {
                lg = fixw / imgw
            }
            $('#md').attr('style', 'filter:blur(2px);')
            let img = c('img')
            let curtain = c('div')
            curtain.style.height = getclienth() + 'px'
            curtain.style.width = getclientw() + 'px'
            adclass(curtain, 'curtain')
            img.src = this.src
            img.title = 'click to reduction'
            if (imgw > w) {
                img.style.width = '100%'
            }
            img.style.transform = 'scale(' + lg + ')'
            adclass(img, 'imglg')
            appendc(curtain, img)
            appendc($('body')[0], curtain)
            setTimeout(function() {
                img.style.opacity = 1
            }, 100);
            $(curtain).bind('click', function() {
                img.style.opacity = 0
                setTimeout(function() {
                    $('.curtain').remove()
                    $('#md').attr('style', '')
                }, 300);
            })
        }
    })
}

function daybefore(pastdayjs) {
    let now = dayjs().set('hour', 0).set('minute', 0).set('second', 0)
    let before = now.diff(pastdayjs)
    before /= 3600000
    if (before < 24) {
        if (before > now.hour()) {
            return ' <x style="color:#46bbcd;">昨天</x>'
        } else {
            return ' <x style="color:#46bbcd;">今天</x>'
        }
    }
    if (before > 24 && before < 48) return ' <x style="color:#46bbcd;">前天</x>'
    return Math.ceil(before / 24)
}

function postcarddate(pastdayjs) {
    let daybeforers = daybefore(pastdayjs)
    let daynumber = parseInt(daybeforers)
    if (Number.isNaN(daynumber)) {
        return daybeforers
    } else {
        return ' <x style="color:#46bbcd;">' + daynumber + '天前</x>'
    }
}

function setarrow() {
    let arrows = $('.parrow h1, .parrow h2, .parrow h6, .parrow h3, .parrow h4, .parrow h5')
    $(window).scroll(function() {
        let stop = window.scrollY + 14
        let sbotton = (window.scrollY + getclienth(0.4))
        for (let i = 0; i < arrows.length; i++) {
            let ofs = arrows[i].offsetTop
            if (ofs >= stop && ofs <= sbotton) {
                if (arrows[i].inscreen === undefined || arrows[i].inscreen === false) {
                    arrows[i].inscreen = true
                    adclass(arrows[i], 'showarrow')
                }
            } else {
                if (arrows[i].inscreen === true) {
                    arrows[i].inscreen = false
                    rmclass(arrows[i], 'showarrow')
                }
            }
        }
    })
}

function showseries(ps) {
    let sb = $('#seriesbox')
    let nownumber = location.href.split('number=')[1].split('#')[0]
    for (let i = 0; i < ps.length; i++) {
        let sa = c('a')
        let it = ps[i].split('===')
        if (it[1] === nownumber) {
            adclass(sa, 'adis')
        } else {
            sa.href = 'https://' + blog_repo + '/?to=post&number=' + it[1]
            sa.target = '_blank'
        }
        sa.innerText = it[0]
        appendc(sb[0], sa)
    }
    $('#series').addClass('seriesshow')
    $('#series').bind('click', function() {
        if (!hasclass(sb[0], 'seboxshow')) {
            adclass(sb[0], 'seboxshow')
        } else {
            rmclass(sb[0], 'seboxshow')
        }
    })
}

function md2png() {
    popmsg('processing...')
    setTimeout(function() {
        let opts = {
            async: false,
            useCORS: true,
            allowTaint: true,
            logging: false
        }
        html2canvas($('#md')[0], opts).then(function(canvas) {
            $('#png_box').html(canvas)
            $('#share_png_panel').removeClass('myhide')
            popmsg('done!')
        })
    }, 500);
}