var username = 'youyinnn'
var blog_repo = username + '.github.io'
var post_label = 'ypost'
var about_label = 'yabout'
var friend_linked_label = 'yfriendlinked'
var script_label = 'yscript'
var todo_label = 'ytodo'
var resume_label = 'yresume'
var egg_label = 'yegg'
var api_url = 'https://api.github.com'
var oauth_token_base64 = 'YTVmZTQzMTNiZGRkMzA5Y2M5YjdiMjUwYmY2NWRhODk0NTkwYzBiOA=='
var oauth_token = b64.decode(oauth_token_base64)
var defaulttimeout
var shortmsgline = 25

function settimeout() {
    let nowhour = dayjs().hour()
    defaulttimeout = (nowhour >= 19 || nowhour <= 6) ? 15000 : 10000
}

function timeoutfunc(eve) {
    if (eve.status === 0 && eve.statusText !== 'error') {
        console.log('Maybe it\'s timeout because of github api!\r\n' + 'status:' + eve.status +
            '\r\nresponseText: ' + eve.responseText +
            '\r\nstatusText: ' + eve.statusText +
            '\r\nwill return to the home page')
        eve.abort()
        location.reload()
    }
}

function urlhandle(url) {
    let urls = url.split('/')
    let params = urls[urls.length - 1]
    if (params.search(/\?/gm, 'gi') !== -1) {
        url += '&flash=' + (new Date()).getTime() + '&access_token=' + oauth_token
    } else {
        url += '?flash=' + (new Date()).getTime() + '&access_token=' + oauth_token
    }
    console.log('send post :' + url)
    return url
}


function get_posts() {
    $('#pgboxbox').remove()
    $('.treenode').remove()
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=yconf&state=closed'
    setgohub('Go hub', 'https://github.com/' + username + '/' + blog_repo + '/issues')
    sendget(urlhandle(url), function(re) {
        get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
            posts_cache = yaml.load(re[0].body)
            for (let i = 0; i < posts_cache.length; i++) {
                postsmetadatahandle(posts_cache[i])
            }
            $('#postsearchtext')[0].placeholder = 'ps:' + posts_cache.length + ',ts:' + all_tags.length + ',cs:' + all_cates.length
            rstopaging(posts_cache)
            let stgts = $('.stgt')
            let stgcs = $('.stgc')
            for (let i = 0; i < stgcs.length; i++) {
                $(stgcs[i]).bind('click', function(event) {
                    catetagclick(this, true, true)
                })
            }
            for (let i = 0; i < stgts.length; i++) {
                $(stgts[i]).bind('click', function(event) {
                    filter_posts_cache = new Array()
                    if (hasclass(this, 'btn-light')) {
                        stgts.attr('disabled', true)
                        stgcs.attr('disabled', true)
                        $('.treenode div').addClass('adisable')
                        rmclass(this, 'btn-light')
                        this.disabled = false
                        adclass(this, 'btn-info')
                        for (let k = 0; k < posts_cache.length; k++) {
                            if (posts_cache[k].tags !== undefined) {
                                for (let l = 0; l < posts_cache[k].tags.length; l++) {
                                    if (posts_cache[k].tags[l] === this.innerText) {
                                        filter_posts_cache.push(posts_cache[k])
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
            rmclass(cates_tree_panel, 'myhide')
            adclass(cates_tree_panel, 'myshow')
            showbbt()
            setheightfordocpanel()
            hideloading()
        })
    }, timeoutfunc)
}

function get_post(number) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number
    sendget(urlhandle(url), function(re) {
        let page = re.html_url
        setgohub('Go hub', page)
        createposthead(re)
        changepagetitle(re.title)
        let text = re.body
        let url2 = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments' + '?per_page=9999'
        sendget(urlhandle(url2), function(re) {
            let copytext
            text += '\r\n\r\n<div class="copyrightbox" style="padding: 1rem;background-color: #ff00000f;border-left: solid #c01f1f 4px;margin-bottom: 1rem;"><span style="font-weight:bold;font-size:18px;">Copyright Notices:</span><br>Articles address: http://youyinnn.github.io/?to=post&number=' + number + '<hr>1. All articles on this blog was powered by <span style="font-weight:bold;">youyinnn</span>@[https://github.com/youyinnn].<br>2. For reprint please contact the author@[<a href="mailto:youyinnn@gmail.com">youyinnn@gmail.com</a>] or comment below.</div>\r\n\r\n'
            copytext = text
            text += '\r\n\r\n<div id="postshare"><button id="sharetag" class="btn">Share:&nbsp;&nbsp;</button></div>\r\n\r\n'
            text += '\r\n\r\n<div id="movebtn"><button id="prepostbtn" class="btn btn-dark disabled" data-toggle="tooltip" data-placement="right" data-original-title="" data-trigger="manual">Privous</button><button id="nextpostbtn" class="btn btn-dark disabled" style="float: right" data-toggle="tooltip" data-placement="left" data-original-title="" data-trigger="manual">Next</button></div> \r\n\r\n'
            text += '\r\n\r\n<div id="commentline"></div> \r\n\r\n'
            text += '## Post comments\r\n'
            if (re.length === 0) {
                text += '<div id="nocomment">No one has commented here yet \r\n <a href="' + page + '">Add comment</a></div>'
            } else {
                for (let i = 0; i < re.length; i++) {
                    text += createpostcomment(i, re[i])
                }
            }
            render_md(text)
            hideloading()
            $(md).animateCss('fadeIn')
            adclass(md, 'parrow')
            setarrow()
            hidetopbar()
            showbbt()
            $('#toc')[0].style.display = 'inline-block'
            $('#toc').removeClass('myhide')
            if (re.length !== 0) {
                let addcomment = c('div')
                let a = c('a')
                addcomment.id = 'nocomment'
                addcomment.style.transform = 'translateY(-16px)'
                a.href = page
                a.target = '_blank'
                a.innerText = 'Add comment'
                appendc(addcomment, a)
                appendc(md, addcomment)
            }
            if (!postcomment) {
                $('#nocomment')[0].innerHTML = 'Can\'t comment on this post <br><a href="https://github.com/' + username + '" target="_blank">contact me</a>'
            }
            let tomdinnerHTML = '2 md'
            createsharebtn(tomdinnerHTML, function(btn) {
                $(btn)[0].setAttribute('data-clipboard-text', copytext)
                new ClipboardJS(btn).on('success', function(e) {
                    popmsg('Copy markdown text successed.')
                    e.clearSelection();
                }).on('error', function(e) {
                    popmsg('Copy markdown text failed.')
                    e.clearSelection();
                })
            })
            let topnginnerHTML = '2 png<span class="ml-2 badge badge-danger" data-toggle="tooltip" data-placement="top" data-original-title="canvas的渲染画布长度有限 如果是长文章就会丢失后部分内容">Limited ?</span/>'
            createsharebtn(topnginnerHTML, function(btn) {
                $(btn).click(function() {
                    md2png()
                })
                $('.ml-2.badge.badge-danger').tooltip()
            })
        }, timeoutfunc)
        let url3 = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=yconf&state=closed'
        let psname = yaml.load(gethexofrontmatter(re.body)).series
        sendget(urlhandle(url3), function(re) {
            get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
                if (psname !== undefined) {
                    let ses = yaml.load(re[1].body)
                    let ps
                    for (let i = 0; i < ses.length; i++) {
                        if (ses[i].se === psname) {
                            ps = ses[i].ps
                            showseries(ps)
                        }
                    }
                }
                let postorder = re[2].body.split('>--<')
                let preindex
                let nextindex
                postorder.find(function(now, nowindex) {
                    if (now === document.title + '<=>' + number) {
                        preindex = nowindex - 1
                        nextindex = nowindex + 1
                        return true
                    }
                })

                if (preindex === -1) {
                    $('#prepostbtn').removeClass('btn-dark')
                    $('#prepostbtn').addClass('btn-secondary disabled')
                } else {
                    $('#prepostbtn').removeClass('disabled')
                    let prearr = postorder[preindex].split('<=>')
                    let pretitle = prearr[0]
                    let prenumber = prearr[1]
                    $('#prepostbtn').attr('data-original-title', pretitle)
                    $('#prepostbtn').tooltip('show')
                    $('#prepostbtn').click(function() {
                        location = '/' + '?to=post&number=' + prenumber
                    })
                }
                if (nextindex === postorder.length) {
                    $('#nextpostbtn').removeClass('btn-dark')
                    $('#nextpostbtn').addClass('btn-secondary disabled')
                } else {
                    $('#nextpostbtn').removeClass('disabled')
                    let nextarr = postorder[nextindex].split('<=>')
                    let nexttitle = nextarr[0]
                    let nextnumber = nextarr[1]
                    $('#nextpostbtn').attr('data-original-title', nexttitle)
                    $('#nextpostbtn').tooltip('show')
                    $('#nextpostbtn').click(function() {
                        location = '/' + '?to=post&number=' + nextnumber
                    })
                }
            }, 100 * 1000)
        }, timeoutfunc)
    }, timeoutfunc)
}

function get_about() {
    get_issues_by_label(about_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        render_md(re[0].body)
        $(md).animateCss('fadeIn')
        showbbt()
        $('#toc')[0].style.display = 'inline-block'
        $('#toc').removeClass('myhide')
        hideloading()
        $(md).animateCss('fadeIn')
    }, true)
}

function get_resume() {
    get_issues_by_label(resume_label, function(re) {
        if (re.length === 0) {
            no_label(resume_label)
        } else {
            $('[data-toggle="tooltip"]').tooltip()
            setgohub('Go hub', re[0].html_url)
            render_md(re[0].body)
            adclass(md, 'resume')
            setcoll()
            hidetopbar()
            showbbt()
            if (getclientw() > 700) {
                setTimeout(function() {
                    $('#gohub').tooltip('show')
                    $('#hb').tooltip('show')
                }, 1000);
                setTimeout(function() {
                    $('#gohub').tooltip('hide')
                    $('#hb').tooltip('hide')
                }, 3500);
            }
            $('#busuanzi_container_page_pv').addClass('mpgvresume')
            $(md).animateCss('fadeIn')
        }
        hideloading()
        $(md).animateCss('fadeIn')
    }, true)
}

function get_friendlinked() {
    if (fldd.innerText === 'Fail to get link, retry.' || fldd.innerText === '') {

        let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + friend_linked_label + '&flash=' + (new Date()).getTime() + '&access_token=' + oauth_token + '&state=closed'
        let basegetset = {
            'timeout': defaulttimeout,
            'async': true,
            'url': url,
            'crossDomain': true,
            'method': 'GET',
            'error': function(eve) {
                fldd.innerHTML = '<a class=" dropdown-item" href="javaScript:get_friendlinked();">Fail to get link, retry.</a>'
            }
        }
        console.log('send get :' + url)
        $.ajax(basegetset).done(function(re) {
            fldd.innerHTML = ''
            let text = re[0].body
            let arr = text.split(',')
            for (let i = 0; i < arr.length; i++) {
                let msg = arr[i]
                if (msg !== '') {
                    let sp = msg.split('-')
                    let ditem = c('a')
                    adclass(ditem, 'dropdown-item')
                    ditem.href = sp[1]
                    ditem.target = '_blank'
                    ditem.innerText = sp[0].replace(/\r\n/g, '')
                    appendc(fldd, ditem)
                }
            }
        })
    }
}

function get_issues_comments(number, issuesbody, func, timeout) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments' + '?per_page=9999'
    sendget(urlhandle(url), function(re) {
        func(issuesbody, re)
        hideloading()
        showbbt()
    }, timeoutfunc, timeout)
}

function get_todo() {
    get_issues_by_label(todo_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createtodo)
    }, true)
}

function get_script() {
    get_issues_by_label(script_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createscript)
        $('#toc')[0].style.display = 'inline-block'
        $('#toc').removeClass('myhide')
    }, true)
}

function get_egg() {
    get_issues_by_label(egg_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createegg)
    }, true)
}

function get_issues_by_label(label, func, closed, timeout) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + label + '&per_page=9999'
    if (closed !== undefined && closed) {
        url += '&state=closed'
    }
    sendget(urlhandle(url), func, timeoutfunc, timeout)
}

function syncatesToconfig() {
    if (!postsync) {
        popmsg('Sync started.', 30000)
        setTimeout(function() {
            popmsg('Sync started..', 30000)
        }, 1300);
        setTimeout(function() {
            popmsg('Sync started...', 30000)
        }, 2200);
        get_issues_by_label(post_label, function(re) {
            popmsg('Fetching.')
            setTimeout(function() {
                popmsg('Fetching..', 30000)
            }, 1060);
            setTimeout(function() {
                popmsg('Fetching...', 30000)
            }, 2100);
            let newmsg = new Array()
            let postorder = new Array()
            for (let i = 0; i < re.length; i++) {
                let rei = re[i]
                postorder.push(rei.title + '<=>' + rei.number)
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
                metadata.number = rei.number
                metadata.created_at = rei.created_at
                metadata.updated_at = rei.updated_at
                let body = getdocwithnohexofrontmatter(rei.body)
                let short = body.split(/\r\n/, shortmsgline)
                while (short[0] === '\r\n') {
                    short.shift()
                }
                let shortcontant = ''
                let codeparecount = 0
                for (let j = 0; j < short.length; j++) {
                    if (short[j].search('```') === 0) {
                        codeparecount++
                    }
                    shortcontant += short[j]
                    shortcontant += '\r\n'
                }
                if (codeparecount % 2 !== 0) {
                    shortcontant += '```'
                    shortcontant += '\r\n'
                }
                metadata.short_contant = shortcontant
                newmsg.push(metadata)
            }
            newmsg = yaml.dump(newmsg)
            let yamlobj = yaml.load(newmsg)
            let series = new Array()
            for (let i = 0; i < yamlobj.length; i++) {
                let pseriesname = yamlobj[i].series
                if (pseriesname !== undefined) {
                    let pseries
                    for (let j = 0; j < series.length; j++) {
                        if (series[j].se === pseriesname)
                            pseries = series[j].ps
                    }
                    if (pseries === undefined) {
                        let item = new Object()
                        item.se = pseriesname
                        item.ps = pseries = new Array()
                        series.push(item)
                    }
                    let ss = yamlobj[i].title + '===' + yamlobj[i].number
                    pseries.unshift(ss)
                }
            }
            series = yaml.dump(series.reverse())
            let text = '{ "body":' + JSON.stringify(newmsg) + '}'
            let url = api_url + '/repos/youyinnn/youyinnn.github.io/issues?labels=yconf&state=closed'
            sendget(urlhandle(url), function(re) {
                popmsg('Syncing.')
                setTimeout(function() {
                    popmsg('Syncing..', 30000)
                }, 1050);
                setTimeout(function() {
                    popmsg('Syncing...', 30000)
                }, 2080);
                get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
                    let posttreecommentid = re[0].id
                    let seriestreecommentid = re[1].id
                    let postordercommentid = re[2].id
                    url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + posttreecommentid
                    popmsg('Updating post tree...', 30000)
                    sendpatch(urlhandle(url), text, function(re) {
                        url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + seriestreecommentid
                        text = '{ "body":' + JSON.stringify(series) + '}'
                        popmsg('Updating post series tree...', 30000)
                        sendpatch(urlhandle(url), text, function(re) {
                            url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + postordercommentid
                            text = '{ "body":' + JSON.stringify(postorder.join('>--<')) + '}'
                            popmsg('Updating post order...', 30000)
                            sendpatch(urlhandle(url), text, function(re) {
                                popmsg('Done!', 2000)
                                if (location.href.endsWith('to=posts')) {
                                    setTimeout(function() {
                                        get_posts()
                                    }, 2000);
                                }
                                postsync = true
                            })
                        })
                    })
                })
            }, timeoutfunc)
        }, false, 30 * 1000)
    } else {
        location.reload()
    }
}