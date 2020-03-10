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

var emoji = new EmojiConvertor()
emoji.init_env()
emoji.replace_mode = 'unified'
emoji.allow_native = true

var index
var origins = [
    '127.0.0.1',
    'https://api.github.com/',
    'https://youyinnn.github.io',
]

$(function() {
    const main_urls = [
        '?to=about',
        '?to=articles',
        '?to=script',
        '?to=todo',
        '?to=resume',
    ]
    quicklink({
        priority: true,
        origins: origins,
        urls: main_urls
    })
})

$(function() {
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
    }  else if (pathname.startsWith('/article/')) {
        changepagetitle('article | youyinnn')
        new_render_md()
    } else {
        // showloading()
        // let params = location.search.substring(1).split('&')
        // let kv = params[0].split('=')
        // let key = kv[0]
        // let value = kv[1]
        // if (key === 'to' && value === 'articles') {
        //     changepagetitle('articles | youyinnn')
        //     get_articles()
        //     let client = algoliasearch('31EZJEFZDH', 'cf5795da3477bcd0310fb9218f814fb9');
        //     index = client.initIndex('blog');
        //     checkcache()
        // } else if (key === 'to' && value === 'article') {
        //     changepagetitle('article | youyinnn')
        //     get_article(params[1].split('=')[1])
        // } else if (key === 'to' && value === 'todo') {
        //     changepagetitle('todo | youyinnn')
        //     get_todo()
        // } else if (key === 'to' && value === 'script') {
        //     changepagetitle('script | youyinnn')
        //     get_script()
        // } else if (key === 'xixi' && value === 'haha') {
        //     changepagetitle('egg | youyinnn')
        //     get_egg()
        // } else {
        //     alert('No such page.')
        //     location = '/'
        // }
    }
    $('.em-svg').on('mouseover', function() {
        $(this).animateCss('pulse')
    })
    var clear
    $(window).resize(function() {
        if (location.href.endsWith('?to=articles')) {
            clearTimeout(clear)
            clear = setTimeout(function() {
                setheightfordocpanel()
            }, 200);
        }
    })
    $('[data-toggle="tooltip"]').tooltip()

    // observer for docpanel height & pagationbox top fix
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let observer = new MutationObserver(function(mutationList) {
        setTimeout(function() {
            setheightfordocpanel()
        }, 250);
    })
    let article = $('#docpanel')[0]
    let options = {
        'attributes': true,
        'attributeOldValue': true
    };
    observer.observe(article, options);

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