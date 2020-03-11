var username = 'youyinnn'
var blog_repo = username + '.github.io'
var article_label = 'yarticle'
var about_label = 'yabout'
var friend_linked_label = 'yfriendlinked'
var script_label = 'yscript'
var todo_label = 'ytodo'
var resume_label = 'yresume'
var egg_label = 'yegg'
var api_url = 'https://api.github.com'
var oauth_token_base64 = 'ZWIzMTYzNTA1YzZjNWMzMzFiN2U3ZThiZTk4MjRjYTk3YWY1YTQxYw=='
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
        url += '&flash=' + (new Date()).getTime()
    } else {
        url += '?flash=' + (new Date()).getTime()
    }
    // console.log('send article :' + url)
    return {
        url: url,
        headers: {
            "Authorization": `token ${oauth_token}`
        }
    }
}

function get_articles() {
    $('#pgboxbox').remove()
    $('.treenode').remove()
    $('.stgt.btn').remove()
    all_cates = new Array()
    all_tags = new Array()
    $('#blog_statistic_body').addClass('myhide')
    // from localStorage
    let pcbl = sessionStorage.getItem('pcbl')
    handlemetadata(yaml.load(pcbl))
}

function get_article(number) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number
    sendget(urlhandle(url), function(re) {
        let page = re.html_url
        setgohub('Go hub', page)
        createarticlehead(re)
        changepagetitle(re.title)
        let text = re.body
        let url2 = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments' + '?per_page=9999'
        sendget(urlhandle(url2), function(re) {
            let charlength = text.length
            text += '\n\n<div class="copyrightbox" style="padding: 1rem;background-color: #ff00000f;border-left: solid #c01f1f 4px;margin: 2rem 0 1rem;"><span style="font-weight:bold;font-size:18px;">Copyright Notices:</span><br>Articles address: <a href="javascript:void(0);">https://youyinnn.github.io/?to=article&number=' + number + '</a><hr>1. All articles on this blog was powered by <span style="font-weight:bold;">youyinnn</span>@[<a href="javascript:void(0);">https://github.com/youyinnn</a>].<br>2. For reprint please contact the author@[<a href="mailto:youyinnn@gmail.com">youyinnn@gmail.com</a>] or comment below.</div>\n\n'
            copytext = text
            text += '\n\n<div id="articleshare"><button id="sharetag" class="btn">Share:&nbsp;&nbsp;</button></div>\n\n'
            text += '\n\n<div id="movebtn"><button id="nextarticlebtn" class="btn btn-dark disabled" data-toggle="tooltip" data-placement="right" data-original-title="" >Next</button><button id="prearticlebtn" class="btn btn-dark disabled" style="float: right" data-toggle="tooltip" data-placement="left" data-original-title="">Previous</button></div> \n\n'
            text += '\n\n<div id="commentline"></div> \n\n'
            text += '## Article comments\n'
            if (re.length === 0) {
                text += '<div id="nocomment">No one has commented here yet \n <a href="' + page + '">Add comment</a></div>'
            } else {
                for (let i = 0; i < re.length; i++) {
                    text += createarticlecomment(i, re[i])
                }
            }
            // render the md text
            render_md(text)

            // set mdcharlength
            $('.mdcharlength').text(charlength + ' c')

            // hide loading animation
            hideloading()

            // fade in the md panel
            $(md).animateCss('fadeIn')

            // set parrow
            setarrow()

            // jump to anchro according to the url's hash
            jumpToAnchor()
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
            if (!articlecomment) {
                $('#nocomment')[0].innerHTML = 'Can\'t comment on this article <br><a href="https://github.com/' + username + '" target="_blank">contact me</a>'
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

function get_friendlinked() {
    let keys = Object.keys(friendslink)
    for (key of keys) {
        let ditem = c('a')
        adclass(ditem, 'dropdown-item')
        ditem.href = friendslink[key]
        ditem.target = '_blank'
        ditem.innerText = key.replace(/\n|\r\n/g, '')
        appendc(fldd, ditem)
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

function get_issues_by_label(label, func, closed, timeout, page) {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + label + '&per_page=100&page=' + (page === undefined ? 1 : page)
    if (closed !== undefined && closed) {
        url += '&state=closed'
    }
    sendget(urlhandle(url), func, timeoutfunc, timeout)
}

var allarticle

function get_all_articles(page, all) {
    popmsg('Fetching.')
    setTimeout(function() {
        popmsg('Fetching..', 30000)
    }, 1060);
    setTimeout(function() {
        popmsg('Fetching...', 30000)
    }, 2100);
    get_issues_by_label(article_label, function(re, textStatus, jqXHR) {
        if (jqXHR.getResponseHeader('link').split(';')[2] !== ' rel="last"') {
            // the last page
            allarticle = all.concat(re)
            let newarticlemetadata = new Array()
            let series = new Array()
            let articleorder = new Array()
            let pcbl = new Array()
            for (let i = 0; i < allarticle.length; i++) {
                let rei = allarticle[i]
                // order
                articleorder.push(rei.title + '<=>' + rei.number)
                // metadata
                let metadata = syncreihandle2metadata(rei)
                newarticlemetadata.push(metadata)
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

                // article_cache bodys on localStorage
                let mtcopy = syncreihandle2metadata(rei)
                mtcopy.body = getbodyfrommdtext(rei.body)
                pcbl.push(mtcopy)
            }

            // dump obj to yaml
            series = yaml.dump(series.reverse())
            newarticlemetadata = yaml.dump(newarticlemetadata)

            // store article_cache
            localStorage.setItem('pcbl', JSON.stringify(pcbl))
            localStorage.setItem('pcbl_timeout',
                new Date(new Date().getTime() + pcbl_timeout_period).getTime())
            localStorage.setItem('pseries', series)
            localStorage.setItem('pod', articleorder.join('>--<'))

            // sync data
            let text = '{ "body":' + JSON.stringify(newarticlemetadata) + '}'
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
                    let articletreecommentid = re[0].id
                    let seriestreecommentid = re[1].id
                    let articleordercommentid = re[2].id
                    url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + articletreecommentid
                    popmsg('Updating article tree...', 30000)
                    sendpatch(urlhandle(url), text, function(re) {
                        url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + seriestreecommentid
                        text = '{ "body":' + JSON.stringify(series) + '}'
                        popmsg('Updating article series tree...', 30000)
                        sendpatch(urlhandle(url), text, function(re) {
                            url = api_url + '/repos/youyinnn/youyinnn.github.io/issues/comments/' + articleordercommentid
                            text = '{ "body":' + JSON.stringify(articleorder.join('>--<')) + '}'
                            popmsg('Updating article order...', 30000)
                            sendpatch(urlhandle(url), text, function(re) {
                                popmsg('Done!', 2000)
                                if (location.href.endsWith('to=articles')) {
                                    setTimeout(function() {
                                        get_articles()
                                    }, 2000);
                                }
                                articlesync = true
                            })
                        })
                    })
                })
            }, timeoutfunc)
        } else {
            get_all_articles(++page, all.concat(re))
        }
    }, false, 30 * 10000, page)
}
