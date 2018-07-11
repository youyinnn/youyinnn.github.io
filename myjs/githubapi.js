var username = 'youyinnn'
var blog_repo = username + '.github.io'
var post_label = 'ypost'
var about_label = 'yabout'
var friend_linked_label = 'yfriendlinked'
var script_label = 'yscript'
var todo_label = 'ytodo'
var resume_label = 'yresume'
var api_url = 'https://api.github.com'
var oauth_token_base64 = 'YTVmZTQzMTNiZGRkMzA5Y2M5YjdiMjUwYmY2NWRhODk0NTkwYzBiOA=='
var oauth_token = b64.decode(oauth_token_base64)
var defaulttimeout

function settimeout() {
    let nowhour = dayjs().hour()
    defaulttimeout = (nowhour >= 19 || nowhour <= 6) ? 15000 : 10000
}

function getset(url, timeout) {
    if (timeout === undefined) {
        timeout = defaulttimeout
    }
    let basegetset = {
        'timeout': timeout,
        'async': true,
        'crossDomain': true,
        'method': 'GET',
        'url': url,
        'error': function(eve) {
            if (eve.status === 0 && eve.statusText !== 'error') {
                console.log('Maybe it\'s timeout because of github api!\r\n' + 'status:' + eve.status +
                    '\r\nresponseText: ' + eve.responseText +
                    '\r\nstatusText: ' + eve.statusText +
                    '\r\nwill return to the home page')
                eve.abort()
                location.reload()
            }
        }
    }
    return basegetset
}

function postset(url, form, timeout) {
    if (timeout === undefined) {
        timeout = defaulttimeout
    }
    let basepostset = {
        'timeout': timeout,
        'async': true,
        'crossDomain': true,
        'method': 'POST',
        'url': url,
        'mimeType': 'multipart/form-data',
        'data': form,
        'error': function(eve) {
            if (eve.status === 0 && eve.statusText !== 'error') {
                console.log('Maybe it\'s timeout because of github api!\r\n' + 'status:' + eve.status +
                    '\r\nresponseText: ' + eve.responseText +
                    '\r\nstatusText: ' + eve.statusText +
                    '\r\nwill return to the home page')
                eve.abort()
                location.reload()
            }
        }
    }
    return basepostset
}

function patchset(url, data, timeout) {
    if (timeout === undefined) {
        timeout = defaulttimeout
    }
    let basepatchset = {
        'timeout': timeout,
        'async': true,
        'crossDomain': true,
        'method': 'PATCH',
        'url': url,
        'data': data,
        'error': function(eve) {
            console.log('timeout')
        }
    }
    return basepatchset
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

function sendget(url, func, timeout) {
    $.ajax(getset(urlhandle(url), timeout)).done(function(response) {
        if (func !== undefined) {
            func(response)
        }
    })
}

function sendpost(url, form, func, timeout) {
    $.ajax(postset(urlhandle(url), form, timeout)).done(function(response) {
        if (func !== undefined) {
            func(response)
        }
    })
}

function sendpatch(url, data, func, timeout) {
    $.ajax(patchset(urlhandle(url), data)).done(function(response) {
        if (func !== undefined) {
            func(response)
        }
    })
}

function search_issues_by_label(label, func, timeout) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + label + '&per_page=9999'
    sendget(url, func, timeout)
}

function get_posts() {
    let url = api_url + '/repos/youyinnn/youyinnn.github.io/issues?labels=yconf&state=closed'
    setgohub('Go hub', 'https://github.com/' + username + '/' + blog_repo + '/issues')
    sendget(url, function(re) {
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
                    filter_posts_cache = new Array()
                    if (hasClass(this, 'btn-light')) {
                        stgts.attr('disabled', true)
                        stgcs.attr('disabled', true)
                        rmclass(this, 'btn-light')
                        this.disabled = false
                        adclass(this, 'btn-success')
                        for (let k = 0; k < posts_cache.length; k++) {
                            for (let l = 0; l < posts_cache[k].cates.length; l++) {
                                if (posts_cache[k].cates[l] === this.innerText) {
                                    filter_posts_cache.push(posts_cache[k])
                                }
                            }
                        }
                    } else {
                        stgts.attr('disabled', false)
                        stgcs.attr('disabled', false)
                        rmclass(this, 'btn-success')
                        adclass(this, 'btn-light')
                    }
                    filter()
                })
            }
            for (let i = 0; i < stgts.length; i++) {
                $(stgts[i]).bind('click', function(event) {
                    filter_posts_cache = new Array()
                    if (hasClass(this, 'btn-light')) {
                        stgts.attr('disabled', true)
                        stgcs.attr('disabled', true)
                        $('.treenode a').addClass('adisable')
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
                        $('.treenode a').removeClass('adisable')
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
            hideloading()
        })
    })
}

function get_post(number) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number
    sendget(url, function(re) {
        let page = re.html_url
        setgohub('Go hub', page)
        createposthead(re)
        let text = re.body
        let url2 = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments' + '?per_page=9999'
        sendget(url2, function(re) {
            text += '\r\n\r\n<div id="commentline"></div> \r\n\r\n'
            text += '## Post comments\r\n'
            if (re.length === 0) {
                text += '<div id="nocomment">No one has commented here yet \r\n <a href="' + page + '">Add comment</a></div>'
            } else {
                for (let i = 0; i < re.length; i++) {
                    text += createpostcomment(i, re[i])
                }
            }
            hideloading()
            render_md(text)
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
        })
    })
}

function get_about() {
    search_issues_by_label(about_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        render_md(re[0].body)
        showbbt()
        $('#toc')[0].style.display = 'inline-block'
        $('#toc').removeClass('myhide')
        hideloading()
    })
}

function get_resume() {
    search_issues_by_label(resume_label, function(re) {
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
            if (getClientW() > 700) {
                setTimeout(() => {
                    $('#gohub').tooltip('show')
                    $('#hb').tooltip('show')
                }, 1000);
                setTimeout(() => {
                    $('#gohub').tooltip('hide')
                    $('#hb').tooltip('hide')
                }, 3500);
            }
            $('#busuanzi_container_page_pv').addClass('mpgvresume')
        }
        hideloading()
    })
}

function get_friendlinked() {
    if (fldd.innerText === 'Fail to get link, retry.' || fldd.innerText === '') {
        let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + friend_linked_label + '&flash=' + (new Date()).getTime() + '&access_token=' + oauth_token
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
    sendget(url, function(re) {
        func(issuesbody, re)
        hideloading()
        showbbt()
    }, timeout)
}

function get_todo() {
    search_issues_by_label(todo_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createtodo)
    })
}

function get_script() {
    search_issues_by_label(script_label, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createscript)
        $('#toc')[0].style.display = 'inline-block'
        $('#toc').removeClass('myhide')
    })
}

function get_egg() {
    let url = api_url + '/repos/youyinnn/youyinnn.github.io/issues?labels=yegg&state=closed'
    sendget(url, function(re) {
        setgohub('Go hub', re[0].html_url)
        get_issues_comments(re[0].number, re[0].body, createegg)
    })
}

function syncatesToconfig() {
    if (!postsync) {
        $('#cates_tree_head').css('background-color', '#828f9c')
        $('#cates_tree_head').css('color', '#343a40')
        $('#cates_tree_head')[0].innerText = 'Sync started.'
        setTimeout(() => {
            $('#cates_tree_head')[0].innerText += '.'
        }, 1300);
        setTimeout(() => {
            $('#cates_tree_head')[0].innerText += '.'
        }, 2200);
        search_issues_by_label(post_label, function(re) {
            $('#cates_tree_head').css('background-color', 'rgb(179, 188, 187)')
            $('#cates_tree_head').css('color', '#828f9c')
            $('#cates_tree_head')[0].innerText = 'Fetching.'
            setTimeout(() => {
                $('#cates_tree_head')[0].innerText += '.'
            }, 1060);
            setTimeout(() => {
                $('#cates_tree_head')[0].innerText += '.'
            }, 2100);
            let newmsg = new Array()
            for (let i = 0; i < re.length; i++) {
                let rei = re[i]
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
                newmsg.push(metadata)
            }
            newmsg = yaml.dump(newmsg)
            let yamlobj = yaml.load(newmsg)
            let series = new Array()
            for (let i = 0 ; i < yamlobj.length ; i++) {
                let pseriesname = yamlobj[i].series
                if (pseriesname !== undefined) {
                    let pseries
                    for (let j = 0; j < series.length ; j++) {
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
                    pseries.push(ss)
                }
            }
            series = yaml.dump(series)
            let text = '{ "body":' + JSON.stringify(newmsg) + '}'
            let url = api_url + '/repos/youyinnn/youyinnn.github.io/issues?labels=yconf&state=closed'
            sendget(url, function(re) {
                $('#cates_tree_head').css('background-color', 'rgb(87, 101, 100)')
                $('#cates_tree_head').css('color', 'rgb(179, 188, 187)')
                $('#cates_tree_head')[0].innerText = 'Syncing.'
                setTimeout(() => {
                    $('#cates_tree_head')[0].innerText += '.'
                }, 1050);
                setTimeout(() => {
                    $('#cates_tree_head')[0].innerText += '.'
                }, 2080);
                get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
                    let posttreecommentid = re[0].id
                    let seriestreecommentid = re[1].id
                    url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + posttreecommentid
                    sendpatch(url, text, function(re) {
                        url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + seriestreecommentid
                        text = '{ "body":' + JSON.stringify(series) + '}'
                        sendpatch(url, text, function(re) {
                            $('#cates_tree_head').css('background-color', '#343a40')
                            $('#cates_tree_head').css('color', 'white')
                            $('#cates_tree_head')[0].innerText = 'done!'
                            setTimeout(() => {
                                $('#cates_tree_head')[0].innerText = 'Refresh the page.'
                            }, 2000);
                            postsync = true
                        })
                    })
                })
            })
        }, 30 * 1000)
    } else {
        location.reload()
    }
}