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

var emoji
var index

$(function() {
    emoji = new EmojiConvertor()
    emoji.init_env()
    emoji.replace_mode = 'unified'
    emoji.allow_native = true
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        alert('不支持ie浏览器, 请使用edge或者chrome打开!')
        return
    }
    settimeout()
    get_friendlinked()
    let pathname = location.pathname
    if (pathname === '/') {
        hidesidetoc()
        rmclass(homepage, 'myhide')
        adclass(homepage, 'myshow')
        setgohub('My hub', 'https://github.com/' + username)
        showbbt()
    } else if (pathname === '/about/') {
        changepagetitle('about | youyinnn')
        new_render_md()
    } else if (pathname === '/resume/') {
        changepagetitle('resume | youyinnn')
        new_render_md()
    } else if (pathname === '/scripts/') {
        changepagetitle('scripts | youyinnn')
        new_render_md()
    } else if (pathname === '/todos/') {
        changepagetitle('scripts | youyinnn')
        new_render_md()
    } else if (pathname === '/articles/') {
        changepagetitle('articles | youyinnn')
        get_articles()
        hljs.initHighlightingOnLoad()
        $('pre').addClass('hljs')
        for (pre of $('pre')) {
            if (pre.innerText.trim().length === 0)
                $(pre).remove()
        }
    } else if (pathname.startsWith('/article/')) {
        new_render_md()
        let metadata = getmetadatafromabbrlink(pathname.split('/')[2].split('.html')[0])
        createarticlehead(metadata)
        changepagetitle(metadata.title)
        // fade in the md panel
        $(md).animateCss('fadeIn')

        // set parrow
        setarrow()

        // jump to anchro according to the url's hash
        jumpToAnchor()

        let end = `
            <div class="copyrightbox" style="padding: 1rem;background-color: #ff00000f;border-left: solid #c01f1f 4px;margin: 2rem 0 1rem;">
                <span style="font-weight:bold;font-size:18px;">Copyright Notices:</span>
                <br>
                Articles address: <a href="javascript:void(0);">https://youyinnn.github.io/article/${metadata.abbrlink}.html</a>
                <hr>
                1. All articles on this blog was powered by <span style="font-weight:bold;">youyinnn</span>@[<a href="javascript:void(0);">https://github.com/youyinnn</a>].
                <br>
                2. For reprint please contact the author@[<a href="mailto:youyinnn@gmail.com">youyinnn@gmail.com</a>] or comment below.
            </div>
            <br>
            <div id="movebtn">
                <button id="nextarticlebtn" class="btn btn-dark disabled" data-toggle="tooltip" data-placement="right" data-original-title="" >Next</button>
                <button id="prearticlebtn" class="btn btn-dark disabled" style="float: right" data-toggle="tooltip" data-placement="left" data-original-title="">Previous</button>
            </div>`
        $(md).append(end)

        seriesorderhandle(metadata.abbrlink, metadata.series,
            sessionStorage.getItem('pseries'),
            sessionStorage.getItem('pod'))

        setTimeout(() => {
            hidetopbar()
        }, 400);
    }
    $('.em-svg').on('mouseover', function() {
        $(this).animateCss('pulse')
    })
    var clear

    $('[data-toggle="tooltip"]').tooltip()

    // remove null content code block
    $('code').each(function() {
        if (this.innerText.replace(/\s/, '') === '') {
            $(this).remove()
        }
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