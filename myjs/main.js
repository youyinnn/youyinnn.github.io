var searchone = 0
var searchtext
var totalpages
var nowpage = 1

function new_render_md(regular_toc) {
    $('#md').addClass('article')
    let as = $('#md a')
    for (let i = 0; i < as.length; i++) {
        as[i].target = '_blank'
    }
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
    let listhtml = ''
    let selectheader = Boolean(regular_toc) ? 'h1, h2, h3, h4, h5, h6' : 'h2, h3'
    for (el of $(selectheader)) {
        let transferred = el.childNodes[1].name
            .split('_root-')[1]
            .trim()
            .replace(/>/gm, '&gt;')
            .replace(/</gm, '&lt;')
            .replace(/&/gm, '&amp;')
            .replace(/"/gm, '&quot;')
            .replace(/ /gm, '&nbsp;')
        listhtml += `
            <div class="toc-${el.tagName.toLowerCase()}" _target_sb="${el.id}">
                <a hreff="${el.childNodes[1].name}">
                    ${transferred}
                </a>
            </div>`
    }
    $('#sidetoc').append(listhtml)
    var $root = $('html, body')
    if (Boolean(regular_toc) || getclientw() < 700) {
        $('.markdown-toc a').click(function() {
            let tzhref = $.attr(this, 'hreff')
            $root.animate({
                scrollTop: $('[name="' + tzhref.trim() + '"]').offset().top - 15
            }, 600)
            if (getstyle(topbar, 'height') === '48px' && !hasclass(topbar, 'hidetopbar')) {
                $root.animate({
                    scrollTop: $('[name="' + tzhref.trim() + '"]').offset().top - 15
                }, 600)
            }
            if (getstyle(topbar, 'height') === '96px' && !hasclass(topbar, 'hidetopbar')) {
                $root.animate({
                    scrollTop: $('[name="' + tzhref.trim() + '"]').offset().top - 60
                }, 600)
            }
        })
    } else if (getclientw() >= 700) {
        $('.markdown-toc .toc-h3').click(function() {
            let tgsbid = this.getAttribute('_target_sb')

            let showsb = $('#md .show-script-block')
            showsb.removeClass('show-script-block')
            showsb.addClass('hide-script-block')

            let tgsb = $(`#_sb_${tgsbid}`)
            tgsb.removeClass('hide-script-block')
            tgsb.addClass('show-script-block')

            let showh3 = $('#md .no-zip-tran')
            showh3.removeClass('no-zip-tran')
            showh3.addClass('zip-tran')

            let tgsbh3 = tgsb.prev('h3')
            tgsbh3.removeClass('zip-tran')
            tgsbh3.addClass('no-zip-tran')

            tgsb.find('img').each((i, e) => {
                if (e.getAttribute('shown') !== 'true') {
                    let pics = $(`[picid=${e.getAttribute('picid')}]`)
                    pics.attr('src', pics.attr('href'))
                    pics.attr('shown', 'true')
                    pics.removeClass('hidepic')
                    $(`._showpic_${e.getAttribute('picid')}`).remove()
                }
            })
        })
        $('#sidetoc .toc-h3').addClass('zip-tran')
        let nowh2
        $('#sidetoc .toc-h2').click(function() {
            $('#sidetoc .no-zip-tran').addClass('zip-tran')
            $('#sidetoc .no-zip-tran').removeClass('no-zip-tran')
            if (nowh2 === this) {
                nowh2 = undefined
            } else {
                let h3 = $(this).next()
                while (h3[0] !== undefined && h3[0].className === 'toc-h3 zip-tran') {
                    h3.removeClass('zip-tran')
                    h3.addClass('no-zip-tran')
                    h3 = h3.next()
                } 
                nowh2 = this
            }
        })
    }
    $('.katex').parent().addClass('katexp')
    setimgclicktofocus()
    highlightBlock()
    setTimeout(() => {
        rmclass(md, 'myhide')
        adclass(md, 'myshow')
        $(md).animateCss('fadeIn')
    }, 200);
}

function highlightBlock() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    })
    for (pre of $('pre')) {
        if (pre.innerText.trim().length === 0)
            $(pre).remove()
    }
}

function articlespage(pageto) {
    docpanel.style.cssText = 'transform: translateY(-' + ((articlepanelheight - 48) * (pageto - 1)) + 'px);'
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
    // for last flag
    if (text === '#l' || text === '#last') {
        $('html,body').animate({
            scrollTop: $('#search-' + (searchcount - 1)).offset().top - 52
        }, 600);
        return
    }
    // for number flag
    if (text.search(/#[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?/g) !== -1) {
        let searchid = '#search-' + text.split('#')[1]
        let search = $(searchid)
        if (search[0] !== undefined) {
            $('html,body').animate({
                scrollTop: search.offset().top - 52
            }, 600);
            return
        }
    } else {
        // search context
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
                $('html,body').animate({
                    scrollTop: $('#' + search[0].id).offset().top - 52
                }, 600, 'swing');
                searchbut.innerText = 'Get #' + i
                clearTimeout(window.scc)
                window.scc = setTimeout(function() {
                    searchbut.innerText = 'Search'
                }, 1500, 'swing')
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

function getbodyfrommdtext(mdtext) {
    if (mdtext.substring(0, 3) === '---') {
        let endindex = mdtext.indexOf('---', 3) + 3
        let body = mdtext.substring(endindex, mdtext.length)
        return body
    }
    return mdtext
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

var pcbl_timeout_period = 24 * 60 * 60 * 1000

function searcharticle(text) {
    // search
    if (text !== '') {
        text = text.replace(/\s/gm, '')
        let rs = new Set()
        index.search(text, function(err, context) {
            for (let i = 0; i < context.hits.length; i++) {
                rs.add(context.hits[i].number)
            }
            // handle rs
            if (filter_articles_cache.length === 0) {
                for (let i = 0; i < articles_cache.length; i++) {
                    if (rs.has(articles_cache[i].number)) {
                        articlesearchrs.push(articles_cache[i])
                    }
                }
            } else {
                for (let i = 0; i < filter_articles_cache.length; i++) {
                    if (rs.has(filter_articles_cache[i].number)) {
                        articlesearchrs.push(filter_articles_cache[i])
                    }
                }
            }
            if (articlesearchrs.length === 0) {
                $('#articlesearchtext').addClass('getnothing')
                setTimeout(function() {
                    $('#articlesearchtext').removeClass('getnothing')
                }, 1000, 'swing')
            } else {
                $('#pgboxbox').remove()
                $('.pagination').remove()
                rstopaging(articlesearchrs)
                articlesearchrs = new Array()
            }
        })
    } else {
        cleansearch()
    }
}

function articlesmetadatahandle(articlemetadata) {
    let articlecache = articlemetadata
    if (articlecache.categories !== undefined) {
        for (let i = 0; i < articlecache.categories.length; i++) {
            // handle cates_tree_body
            let cate = b64.encode(articlecache.categories[i], true)
            if ($('#' + cate + '_treenode').length === 0) {
                let node = c('li')
                node.id = cate + '_treenode'
                adclass(node, 'treenode')
                let noa = c('div')
                noa.innerText = articlecache.categories[i]
                $(noa).bind('click', function(event) {
                    catetreenodeclick(this, true, true)
                })
                appendc(node, noa)
                // root category add on cates_tree_body directly
                if (i === 0) {
                    appendliwithorder(cates_tree_body, node)
                } else {
                    // if not find parent root element and add child element
                    let parentnodeid = b64.encode(articlecache.categories[i - 1], true)
                    appendliwithorder($('#' + parentnodeid + '_treenode')[0], node)
                }
            }

            // handle cates panel
            let haved = false
            for (let j = 0; j < all_cates.length; j++) {
                if (all_cates[j] === articlecache.categories[i]) {
                    haved = true
                }
            }
            if (!haved) {
                all_cates.push(articlecache.categories[i])
            }
        }
    }
    // handle tags panel
    if (articlecache.tags !== undefined) {
        for (let i = 0; i < articlecache.tags.length; i++) {
            let haved = false
            for (let j = 0; j < all_tags.length; j++) {
                if (all_tags[j] === articlecache.tags[i]) {
                    haved = true
                }
            }
            if (!haved) {
                all_tags.push(articlecache.tags[i])
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
        filter_articles_cache = new Array()
        stgts.attr('disabled', true)
        stgcs.attr('disabled', true)
        rmclass(catetag, 'btn-light')
        catetag.disabled = false
        adclass(catetag, 'btn-success')
        for (let k = 0; k < articles_cache.length; k++) {
            for (let l = 0; l < articles_cache[k].categories.length; l++) {
                if (articles_cache[k].categories[l] === catetag.innerText) {
                    filter_articles_cache.push(articles_cache[k])
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
    highlightBlock()
}

function catetreenodeclick(catenode, isfilter, clicktag) {
    if (!hasclass(catenode, 'adisable')) {
        filter_articles_cache = new Array()
        if (!catenode.asel) {
            catenode.asel = true
            $('#cates_tree_body div').addClass('adisable')
            rmclass(catenode, 'adisable')
            for (let k = 0; k < articles_cache.length; k++) {
                for (let l = 0; l < articles_cache[k].categories.length; l++) {
                    if (articles_cache[k].categories[l] === catenode.innerText) {
                        filter_articles_cache.push(articles_cache[k])
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

function filter() {
    nowpage = 1
    $('#pgboxbox').addClass('pageboxhide')
    $('.pagination').addClass('myhide')
    setTimeout(function() {
        $('#pgboxbox').remove()
        $('.pagination').remove()
        let pc
        if (filter_articles_cache.length === 0) {
            pc = articles_cache
        } else {
            pc = filter_articles_cache
        }
        if (articlesod) {
            pc = pc.sort(sortarticlebyupdatedate)
        } else {
            pc = pc.sort(sortarticlebycreatedate)
        }
        rstopaging(pc)
        articlesearchrs = new Array()
    }, 100);
}

function sortarticlebyupdatedate(a, b) {
    return a.updated_at > b.updated_at ? -1 :
        a.updated_at === b.updated_at ? 0 : 1
}

function sortarticlebycreatedate(a, b) {
    return a.created_at > b.created_at ? -1 :
        a.created_at === b.created_at ? 0 : 1
}

function rstopaging(articles) {
    let totalpages = Math.ceil(articles.length / perpageitem)
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
    for (let i = 0; i < articles.length; ++i) {
        createarticlecard(articles[i], Math.ceil((i + 1) / perpageitem))
    }
    let as = $('.articleshortmsg a')
    for (let i = 0; i < as.length; i++) {
        as[i].target = '_blank'
    }
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
    highlightBlock()
    window.totalpages = totalpages
    rmclass(pageboxbox, 'myhide')
    pagination()
}

function scrollToTop(interval) {
    $('html,body').animate({
        scrollTop: 0
    }, interval);
}

function pagination() {

    function pageFlesh() {
        scrollToTop(0)
        $('#pagebox-' + nowpage).animateCss('fadeInDown')
    }

    nowpage = 1
    let pbs = $('.pagebox')
    for (let i = 1; i < pbs.length; i++) {
        adclass(pbs[i], 'pageboxhide')
    }
    let pnbox = c('div')
    pnbox.id = 'pnbox'
    let pn = c('ul')
    adclass(pn, 'pagination unselectable')
    adclass(pn, 'myhide')

    let first = c('li')
    first.id = 'fpg'
    adclass(first, 'page-item')
    let firstl = c('div')
    adclass(firstl, 'page-link')
    firstl.innerText = '<<'
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
            pageFlesh()
        }
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
            let nonum = Number($('.active')[0].id.split('-')[1])
            if (nonum > 1) {
                $('.active').removeClass('active')
                $('#pg-' + (--nonum)).addClass('active')
            }
            nowpage--
            pageFlesh()
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
                pageFlesh()
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
            }
            let nonum = Number($('.active')[0].id.split('-')[1])
            if (nonum < 3) {
                $('.active').removeClass('active')
                $('#pg-' + (++nonum)).addClass('active')
            }
            adclass($('#pagebox-' + nowpage)[0], 'pageboxhide')
            rmclass($('#pagebox-' + (nowpage + 1))[0], 'pageboxhide')
            nowpage++
            pageFlesh()
        }
    })

    let last = c('li')
    last.id = 'lpg'
    adclass(last, 'page-item')
    let lastl = c('div')
    adclass(lastl, 'page-link')
    lastl.innerText = '>>'
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
            pageFlesh()
        }
    })
    appendc(pnbox, pn)
    appendc($('#pgboxbox')[0], pnbox)
    setTimeout(function() {
        rmclass(pn, 'myhide')
    }, 100)
}

function cleansearch() {
    $('#pgboxbox').remove()
    $('.pagination').remove()
    if (filter_articles_cache.length !== 0) {
        rstopaging(filter_articles_cache)
    } else {
        rstopaging(articles_cache)
        filter_articles_cache = new Array()
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
    articlesearchrs = new Array()
}

function showbbt() {
    $('#bbt').removeClass('myhide')
}

function showtocbtn() {
    $('#toc')[0].style.display = 'inline-block'
    $('#toc').removeClass('myhide')
}

function hidetopbar() {
    adclass(topbar, 'hidetopbar')
}

function showtopbar() {
    rmclass(topbar, 'hidetopbar')
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

function setimgclicktofocus() {
    let articleimgs = $('.article img')
    articleimgs.attr('title', 'click to focus')
    articleimgs.bind('click', function() {
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
    })
}

function daybefore(pastdayjs) {
    let now = dayjs().set('hour', 0).set('minute', 0).set('second', 0)
    let before = now.diff(pastdayjs)
    before /= 3600000
    if (before < 24) {
        if (before > now.hour()) {
            return ' <x style="color:#46bbcd;">yesterday</x>'
        } else {
            return ' <x style="color:#46bbcd;">today</x>'
        }
    }
    if (before > 24 && before < 48) return ' <x style="color:#46bbcd;">2 days ago</x>'
    return Math.ceil(before / 24)
}

function articlecarddate(pastdayjs) {
    let daybeforers = daybefore(pastdayjs)
    let daynumber = parseInt(daybeforers)
    if (Number.isNaN(daynumber)) {
        return daybeforers
    } else {
        return ' <x style="color:#46bbcd;">' + daynumber + ' days ago</x>'
    }
}

function setarrow() {
    adclass(md, 'parrow')
    let arrows = $('.parrow h1, .parrow h2, .parrow h6, .parrow h3, .parrow h4, .parrow h5')
    arrows.addClass('panchor')
    arrows.addClass('unselectable')
    arrows.each(function(e, i) {
        let link = c('div')
        link.innerText = '+'
        adclass(link, 'panchorlink')
        appendc(i, link)
        let url = location.href + '#' + encodeURI($(i).find('a')[0].name)
        $(i)[0].setAttribute('data-clipboard-text', url)
        new ClipboardJS(this).on('success', function(e) {
            popmsg('Copy link successed.')
            e.clearSelection();
        }).on('error', function(e) {
            popmsg('Copy link failed.')
            e.clearSelection();
        })
    })
    arrows.mouseover(function() {
        $(this).find('.panchorlink').css('opacity', '1')
    }).mouseout(function() {
        $(this).find('.panchorlink').css('opacity', '0')
    })
    $(window).scroll(function() {
        let stop = window.scrollY - 40
        let sbotton = (window.scrollY + getclienth(0.90))
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

function showseries(abbrlink, ps, psname) {
    $('#articlehead').after(`
        <div id="series-btn" class="unselectable">Series of <span style="color:#6146cd">${psname}</span> (Click To Show All Articles)</div>
        <div id="seriesbox" class="unselectable"></div>
    `)
    let sb = $('#seriesbox')
    for (let i = 0; i < ps.length; i++) {
        let sadiv = c('div')
        let sa = c('span')
        let it = ps[i].split('===')
        sa.innerText = it[0]
        let sdate = c('div')
        sdate.innerHTML = articlecarddate(dayjs(Number(it[2])))
        adclass(sdate, 'sdate')
        appendc(sadiv, sa)
        appendc(sadiv, sdate)
        appendc(sb[0], sadiv)
        if (it[1] === abbrlink) {
            adclass(sadiv, 'adis')
        } else {
            $(sadiv).click(() => {
                location.href = location.origin + '/article/' + it[1] + '.html'
            })
        }
    }
    sb.css('height', $('#seriesbox').css('height'))
    sb.addClass('seboxhide')
    $('#series-btn').bind('click', function() {
        if (!hasclass(sb[0], 'seboxhide')) {
            adclass(sb[0], 'seboxhide')
        } else {
            rmclass(sb[0], 'seboxhide')
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

function syncreihandle2metadata(rei) {
    let metadata = gethexofrontmatter(rei.body)
    if (metadata === undefined) {
        metadata = new Object()
        metadata.title = rei.title
        metadata.categories = new Array()
        metadata.categories.push('unclassfied')
        metadata.comments = true
        metadata.date = rei.created_at
        metadata = yaml.dump(metadata)
    }
    metadata = yaml.load(metadata)
    metadata.char_count = rei.body.length
    metadata.number = rei.number
    metadata.created_at = rei.created_at
    metadata.updated_at = rei.updated_at
    let body = getdocwithnohexofrontmatter(rei.body)
    let short = new Array()
    body = body.split(/\n/)
    for (let i = 0; i < shortmsgline; i++) {
        short.push(body[i])
    }
    while (short[0] === '\n') {
        short.shift()
    }
    let shortcontant = ''
    let codeparecount = 0
    let startpreindex = -1
    let endpreindex = -1
    for (let j = 0; j < short.length; j++) {
        if (short[j].search('```') === 0) {
            codeparecount++
        }
        let presi = short[j].search('<pre')
        let preei = short[j].search('</pre')
        startpreindex = presi !== -1 ? presi : startpreindex
        endpreindex = preei !== -1 ? preei : endpreindex
        shortcontant += short[j]
        shortcontant += '\n'
    }
    if (codeparecount % 2 !== 0) {
        shortcontant += '```'
        shortcontant += '\n'
    }
    if (startpreindex !== -1 && endpreindex < startpreindex) {
        for (let i = shortmsgline; endpreindex < startpreindex; i++) {
            if (i == 35) {
                shortcontant += '</pre>'
                shortcontant += '\n'
                break
            }
            endpreindex = body[i].search('</pre')
            shortcontant += body[i]
            shortcontant += '\n'
        }
    }
    metadata.short_contant = shortcontant.replace(/!\[.*\]\(.*\)/gm, '')
    return metadata
}

function handlemetadata(metadata) {
    let site_birthday = '2017-11-5'
    $('#stat_running').html('<x style="color:#494b78;">' + daybefore(dayjs(site_birthday)) + '</x> days')
    let totalchars = 0
    for (let i = 0; i < metadata.length; i++) {
        totalchars += metadata[i].char_count
        metadata[i].body = null
        if (metadata[i].tags !== undefined) {
            for (let j = 0; j < metadata[i].tags.length; j++) {
                metadata[i].tags[j] = metadata[i].tags[j].toLowerCase()
            }
        }
        articlesmetadatahandle(metadata[i])
        // push for page articles to load the data
        articles_cache.push(metadata[i])
    }
    // display tags btn
    all_tags.sort()
    for (let i = 0; i < all_tags.length; i++) {
        tags.innerHTML += '<button class="stgt btn btn-light">' + all_tags[i] + '</button>'
    }
    // display cats btn
    all_cates.sort()
    for (let i = 0; i < all_cates.length; i++) {
        cates.innerHTML += '<button id="' + b64.encode(all_cates[i], true) + '_catetag" class="stgc btn btn-light">' + all_cates[i] + '</button>'
    }
    $('#stat_typein').html('<x style="color:#494b78;">' + (totalchars || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '</x> chars')
    $('#stat_article_count').html('<x style="color:#494b78;">' + (metadata.length || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '</x> articles')
    $('#stat_cate_count').html('<x style="color:#494b78;">' + (all_cates.length || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '</x> cates')
    $('#stat_tag_count').html('<x style="color:#494b78;">' + (all_tags.length || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '</x> tags')
    $('#stat_last_update').html('<x style="color:#494b78;">' + dayjs(Number(sessionStorage.getItem('cacheversion'))).format('MMM-DD-YYYY, HH:mm') + '</x>')
    rstopaging(metadata.sort(sortarticlebycreatedate))
    let stgts = $('.stgt')
    let stgcs = $('.stgc')
    for (let i = 0; i < stgcs.length; i++) {
        $(stgcs[i]).bind('click', function(event) {
            catetagclick(this, true, true)
        })
    }
    for (let i = 0; i < stgts.length; i++) {
        $(stgts[i]).bind('click', function(event) {
            filter_articles_cache = new Array()
            if (hasclass(this, 'btn-light')) {
                stgts.attr('disabled', true)
                stgcs.attr('disabled', true)
                $('.treenode div').addClass('adisable')
                rmclass(this, 'btn-light')
                this.disabled = false
                adclass(this, 'btn-info')
                for (let k = 0; k < metadata.length; k++) {
                    if (metadata[k].tags !== undefined) {
                        for (let l = 0; l < metadata[k].tags.length; l++) {
                            if (metadata[k].tags[l] === this.innerText) {
                                filter_articles_cache.push(metadata[k])
                            }
                        }
                    }
                }
            } else {
                stgts.attr('disabled', false)
                stgcs.attr('disabled', false)
                $('.treenode div').removeClass('adisable')
                rmclass(this, 'btn-info')
                adclass(this, 'btn-light')
            }
            filter()
        })
    }
    rmclass(docpanel, 'myhide')
    adclass(docpanel, 'myshow')
    rmclass(articles_side_panel, 'myhide')
    adclass(articles_side_panel, 'myshow')
    $('#blog_statistic_body').removeClass('myhide')
}

function seriesorderhandle(abbrlink, psname, sbody, obody) {
    if (psname !== undefined) {
        let ses = yaml.load(sbody)
        for (let i = 0; i < ses.length; i++) {
            if (ses[i].se === psname) {
                showseries(abbrlink, ses[i].ps, psname)
                break
            }
        }
    }
    let articleorder = obody.split('>--<')
    let preindex
    let nextindex
    articleorder.find(function(now, nowindex) {
        if (now === document.title + '<=>' + abbrlink) {
            preindex = nowindex - 1
            nextindex = nowindex + 1
            return true
        }
    })

    if (preindex === -1) {
        $('#nextarticlebtn').removeClass('btn-dark')
        $('#nextarticlebtn').addClass('btn-secondary disabled')
    } else {
        $('#nextarticlebtn').removeClass('disabled')
        let prearr = articleorder[preindex].split('<=>')
        let pretitle = prearr[0]
        let preabbrlink = prearr[1]
        $('#nextarticlebtn').attr('data-original-title', pretitle)
        $('#nextarticlebtn').tooltip('show')
        $('#nextarticlebtn').click(function() {
            location = '/article/' + preabbrlink + '.html'
        })
    }
    if (nextindex === articleorder.length) {
        $('#prearticlebtn').removeClass('btn-dark')
        $('#prearticlebtn').addClass('btn-secondary disabled')
    } else {
        $('#prearticlebtn').removeClass('disabled')
        let nextarr = articleorder[nextindex].split('<=>')
        let nexttitle = nextarr[0]
        let nextabbrlink = nextarr[1]
        $('#prearticlebtn').attr('data-original-title', nexttitle)
        $('#prearticlebtn').tooltip('show')
        $('#prearticlebtn').click(function() {
            location = '/article/' + nextabbrlink + '.html'
        })
    }
}

function setcleancachedbtncolor(set) {
    setTimeout(function() {
        $('#cleancache').removeClass()
        $('#cleancache').addClass('mt-2 btn btn-' + set)
    }, 500);
}

function checkcache() {
    let pcbl_timeout = localStorage.getItem('pcbl_timeout')
    if (pcbl_timeout === null && pcbl_timeout === undefined) {
        setcleancachedbtncolor('dark')
    } else {
        let pcbl_timeout_int = parseInt(pcbl_timeout)
        let flash = dayjs(pcbl_timeout_int).diff(dayjs()) / 3600000
        if (flash > 22 && flash < 24) {
            setcleancachedbtncolor('success')
        } else if (flash > 16 && flash < 22) {
            setcleancachedbtncolor('info')
        } else if (flash > 10 && flash < 16) {
            setcleancachedbtncolor('warning')
        } else {
            setcleancachedbtncolor('danger')
        }
    }
}

function jumpToAnchor() {
    let hash = '[href="' + decodeURI(location.hash) + '"]'
    setTimeout(function() {
        $('.markdown-toc').find(hash).click()
    }, 1000);
}

function getmetadatafromabbrlink(abbrlink) {
    let articlesMetadate = yaml.load(sessionStorage.getItem('pcbl'))
    return articlesMetadate.find((v) => {
        return v.abbrlink === abbrlink
    })
}

function scriptblock() {
    $('#md').addClass('fixmd')
    $('#md').find('h2, h3').addClass('zip-tran')
    $('#sidetoccontainer').addClass('fixtoc')

    $('p').each((i, e) => {
        if (e.innerText.trim() === '') {
            $(e).remove()
        }
    })
    $('#md script').remove()
    let cd = $('#md').children()
    let h3p
    let bhtml = ''

    function wrapblock() {
        $(`[_script_block=${h3p.id}]`).remove()
        $(h3p).after(`
            <sb class="hide-script-block" id="_sb_${h3p.id}">
                ${bhtml}
            </sb>
        `)
    }
    cd.each((i, e) => {
        if (e.tagName === 'H3') {
            if (bhtml !== '') {
                wrapblock()
            }
            bhtml = ''
            h3p = e
        } else if (e.tagName !== 'H2') {
            if (h3p !== undefined) {
                let ee = $(e)
                ee.attr('_script_block', h3p.id)
                bhtml += e.outerHTML
            }
        }
    })
    wrapblock()
}