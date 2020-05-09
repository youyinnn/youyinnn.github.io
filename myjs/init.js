var docpanel = $('#docpanel')[0]
var md = $('#md')[0]
var toc = $('#sidetoc')[0]
var toccontainer = $('#sidetoccontainer')[0]
var homepage = $('#homepage')[0]
var scriptsearcher = $('#scriptsearcher')[0]
var gohub = $('#gohub')[0]
var percent = $('#percent')[0]
var topbut = $('#topbut')[0]
var searchbut = $('#searchbut')[0]
var fldd = $('#fldd')[0]
var topbar = $('#topbar')[0]
var articles_cache = new Array()
var filter_articles_cache = new Array()
var tags = $('#all_tags')[0]
var cates = $('#all_cates')[0]
var all_tags = new Array()
var all_cates = new Array()
var articlesearchrs = new Array()
var articles_side_panel = $('#articles_side_panel')[0]
var cates_tree_body = $('#cates_tree_body')[0]
var perpageitem = 10
var articlecomment = false
var articlesync = false
var articlesod = false
var searchcount
var cachedcleaner
var cachedcleanerLock = false

var index

$(function() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        alert('不支持ie浏览器, 请使用edge或者chrome打开!')
        return
    }
    get_friendlinked()
    let pathname = location.pathname
    if (location.search === '?fromgithub=true') {
        popmsg('国内访问 已跳转到Coding Pages')
    }
    if (pathname === '/' || pathname === '/index.html') {
        hidesidetoc()
        rmclass(homepage, 'myhide')
        adclass(homepage, 'myshow')
        setgohub('My hub', 'https://github.com/' + username)
        showbbt()
        $('#slogan-text').text('I\'M WAITING')
    } else if (pathname === '/about/') {
        changepagetitle('about | youyinnn')
        new_render_md(true)
    } else if (pathname === '/resume/') {
        changepagetitle('resume | youyinnn')
        new_render_md(true)
        setgohub('Go hub', 'https://github.com/youyinnn/youyinnn.github.io/blob/master/_websrc/resume.md')
        showbbt()
        showtocbtn()
    } else if (pathname === '/scripts/') {
        $('html').css('overflowY', 'initial')
        changepagetitle('scripts | youyinnn')
        if (getclientw() >= 700) {
            scriptblock()
        } else {
            showbbt()
            showtocbtn()
        }
        new_render_md()
        showsidetoc()
        setTimeout(() => {
            if (location.hash === '') {
                $('#_toc_root').children().first().children().click()
                $('#_toc_root').children().first().children().children().first().click()
            } else {
                let lh = location.hash.split('#')[1].split('_')
                $(`[_target_sb=${lh[1]}]`).children().first().click()
                $(`[_target_sb=${lh[0]}]`).click()
            }
            $('.scripts h3').each((i, e) => {
                let root = $(`[_target_sb=${e.id}]`).parent().parent()
                let url = location.origin + location.pathname + '#' + `${e.id}_${root[0].getAttribute('_target_sb')}`
                $(e).attr('data-clipboard-text', url)
                new ClipboardJS(e).on('success', function(event) {
                    popmsg('Copy link successed.')
                    event.clearSelection()
                }).on('error', function(event) {
                    popmsg('Copy link failed.')
                    event.clearSelection()
                })
            })
        }, 200);

        $(md).addClass('scripts')
        setgohub('Go hub', 'https://github.com/youyinnn/youyinnn.github.io/blob/master/_websrc/scripts.md')
    } else if (pathname === '/todos/') {
        changepagetitle('scripts | youyinnn')
        new_render_md(true)
        setgohub('Go hub', 'https://github.com/youyinnn/youyinnn.github.io/blob/master/_websrc/todos.md')
        showbbt()
        showtocbtn()
    } else if (pathname === '/articles/') {
        changepagetitle('articles | youyinnn')
        let client = algoliasearch('31EZJEFZDH', 'b48e8af8c156bc2c932f4ad2e112c38b');
        index = client.initIndex('blog');
        get_articles()
    } else if (pathname.startsWith('/article/')) {
        $(md).addClass('no-transit')
        setTimeout(() => {
            $(md).removeClass('no-transit')
        }, 500);
        new_render_md(true)
        let metadata = getmetadatafromabbrlink(pathname.split('/')[2].split('.html')[0])
        createarticlehead(metadata)
        changepagetitle(metadata.title)

        // set parrow
        setarrow()

        // jump to anchro according to the url's hash
        jumpToAnchor()

        let end = `
            <hr>
            <div class="copyrightbox">
                <span style="font-weight:bold;font-size:18px;">Copyright Notices:</span>
                <br>
                Articles address: <a href="javascript:void(0);">https://youyinnn.github.io/article/${metadata.abbrlink}.html</a>
                <hr>
                1. All articles on this blog was powered by <span style="font-weight:bold;">youyinnn</span>@[<a href="javascript:void(0);">https://github.com/youyinnn</a>].
                <br>
                2. For reprint please contact the author@[<a href="mailto:youyinnn@gmail.com">youyinnn@gmail.com</a>] or comment below.
            </div>
            <div id="movebtn" class="mb-3">
                <button id="nextarticlebtn" class="btn btn-dark disabled" data-toggle="tooltip" data-trigger="manual" data-placement="right" data-original-title="" >Next</button>
                <button id="prearticlebtn" class="btn btn-dark disabled" style="float: right" data-trigger="manual" data-toggle="tooltip" data-placement="left" data-original-title="">Previous</button>
            </div>
            <div id="vcomments"></div>
            <div id="footer">2017-${new Date().getFullYear()}</div>
            `
        $(md).append(end)
        new Valine({
            el: '#vcomments',
            serverURLs: 'https://blogcomment.youyinnn.top',
            appId: 'BveJGLLsypBww2hn3mXgdHBg-gzGzoHsz',
            appKey: 'yrynpNAvYTsq3K6F9tWtWvgU',
            placeholder: 'Feel free to express your idea~',
            recordIP: true,
            avatar: 'hide',
            lang: 'en'
        })
        setTimeout(() => {
            $('.vwrap').addClass('shadow')
            $('.vcopy').html(`
                Comment plugin: <a href="https://valine.js.org" target="_blank">Valine</a>
            `)
            $($('.vrow')[1]).children().first().html('')
        }, 1000)

        seriesorderhandle(metadata.abbrlink, metadata.series,
            sessionStorage.getItem('pseries'),
            sessionStorage.getItem('pod'))

        setgohub('Go hub', 'https://github.com/youyinnn/youyinnn.github.io/blob/master/_posts/' + metadata.title + '.md')

        // remove empty p tag
        $('p').each((i, o) => {
            let oo = $(o)
            if (oo.text().trim().length === 0) {
                oo.remove()
            }
        })

        showbbt()
        showtocbtn()
    }
    $('.em-svg').on('mouseover', function() {
        $(this).animateCss('pulse')
    })
    $('[data-toggle="tooltip"]').tooltip()

    // remove null content code block
    $('code').each(function() {
        if (this.innerText.replace(/\s/, '') === '') {
            $(this).remove()
        }
    })
    $('a, img').on('dragstart', function() {
        return false
    })
})

$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});