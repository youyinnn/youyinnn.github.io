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
        console.log('Maybe it\'s timeout because of github api!\n' + 'status:' + eve.status +
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
    // console.log('send post :' + url)
    return url
}


function get_posts() {
    $('#pgboxbox').remove()
    $('.treenode').remove()
    $('#blog_statistic_body').addClass('myhide')
    // from localStorage
    let pcbl = localStorage.getItem('pcbl')
    let pcbl_timeout = localStorage.getItem('pcbl_timeout')
    setgohub('Go hub', 'https://github.com/' + username + '/' + blog_repo + '/issues')
    if (pcbl === null && pcbl_timeout === null) {
        // request
        let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=yconf&state=closed'
        sendget(urlhandle(url), function(re) {
            get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
                newpc = yaml.load(re[0].body)
                localStorage.setItem('pcbl', JSON.stringify(newpc))
                localStorage.setItem('pcbl_timeout',
                    new Date(new Date().getTime() + pcbl_timeout_period).getTime())
                localStorage.setItem('pseries', re[1].body)
                localStorage.setItem('pod', re[2].body)
                handlemetadata(newpc)
            })
        }, timeoutfunc)
    } else {
        let pcbl_timeout = parseInt(localStorage.getItem('pcbl_timeout'))
        let now = new Date().getTime()
        // timeout
        if (now > pcbl_timeout) {
            localStorage.removeItem('pcbl')
            localStorage.removeItem('pcbl_timeout')
            localStorage.removeItem('pseries')
            localStorage.removeItem('pod')
            get_posts()
            return
        } else {
            hideloading()
            handlemetadata(JSON.parse(pcbl))
            showbbt()
        }
    }
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
            let charlength = text.length
            text += '\n\n<div class="copyrightbox" style="padding: 1rem;background-color: #ff00000f;border-left: solid #c01f1f 4px;margin: 2rem 0 1rem;"><span style="font-weight:bold;font-size:18px;">Copyright Notices:</span><br>Articles address: http://youyinnn.github.io/?to=post&number=' + number + '<hr>1. All articles on this blog was powered by <span style="font-weight:bold;">youyinnn</span>@[https://github.com/youyinnn].<br>2. For reprint please contact the author@[<a href="mailto:youyinnn@gmail.com">youyinnn@gmail.com</a>] or comment below.</div>\n\n'
            copytext = text
            text += '\n\n<div id="postshare"><button id="sharetag" class="btn">Share:&nbsp;&nbsp;</button></div>\n\n'
            text += '\n\n<div id="movebtn"><button id="prepostbtn" class="btn btn-dark disabled" data-toggle="tooltip" data-placement="right" data-original-title="" >Privous</button><button id="nextpostbtn" class="btn btn-dark disabled" style="float: right" data-toggle="tooltip" data-placement="left" data-original-title="">Next</button></div> \n\n'
            text += '\n\n<div id="commentline"></div> \n\n'
            text += '## Post comments\n'
            if (re.length === 0) {
                text += '<div id="nocomment">No one has commented here yet \n <a href="' + page + '">Add comment</a></div>'
            } else {
                for (let i = 0; i < re.length; i++) {
                    text += createpostcomment(i, re[i])
                }
            }
            render_md(text)
            $('.mdcharlength').text(charlength + ' c')
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
        let pseries = localStorage.getItem('pseries')
        let pod = localStorage.getItem('pod')
        if (pseries !== null && pod !== null) {
            setTimeout(function() {
                seriesorderhandle(number, psname, pseries, pod)
            }, 1500);
        } else {
            sendget(urlhandle(url3), function(re) {
                get_issues_comments(re[0].number, re[0].body, function(issuesbody, re) {
                    seriesorderhandle(number, psname, re[1].body, re[2].body)
                }, 100 * 1000)
            }, timeoutfunc)
        }
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
        // console.log('send get :' + url)
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
                    ditem.innerText = sp[0].replace(/\n|\r\n/g, '')
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
        // clear
        localStorage.clear()
        postsearchrs = new Array()
        posts_cache = new Array()
        filter_posts_cache = new Array()

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
            let newpostmetadata = new Array()
            let series = new Array()
            let postorder = new Array()
            let pcbl = new Array()
            for (let i = 0; i < re.length; i++) {
                let rei = re[i]
                // order
                postorder.push(rei.title + '<=>' + rei.number)
                // metadata
                let metadata = syncreihandle2metadata(rei)
                newpostmetadata.push(metadata)
                // metadata finish

                // series
                let pseriesname = metadata.series
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
                    let ss = metadata.title + '===' + metadata.number
                    pseries.unshift(ss)
                }

                // post_cache bodys on localStorage
                let mtcopy = syncreihandle2metadata(rei)
                mtcopy.body = getbodyfrommdtext(rei.body)
                pcbl.push(mtcopy)
            }

            // dump obj to yaml
            series = yaml.dump(series.reverse())
            newpostmetadata = yaml.dump(newpostmetadata)

            console.log(newpostmetatata)
            return
            // store post_cache
            localStorage.setItem('pcbl', JSON.stringify(pcbl))
            localStorage.setItem('pcbl_timeout',
                new Date(new Date().getTime() + pcbl_timeout_period).getTime())
            localStorage.setItem('pseries', series)
            localStorage.setItem('pod', postorder.join('>--<'))

            // sync data
            let text = '{ "body":' + JSON.stringify(newpostmetadata) + '}'
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

function get_all_posts(handle) {
    get_issues_by_label(post_label, function(re) {
        handle(re)
    })
}