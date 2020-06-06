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
var hash = ''


var username = 'youyinnn'
var blog_repo = username + '.github.io'

if (location.search !== '') {
    let params = location.search.replace('?','').split('&')
    for (p of params) {
        if (p.startsWith('hash=')) {
            hash = p.substring(5)
        }
    }
}

var index

$(function() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        alert('不支持ie浏览器, 请使用edge或者chrome打开!')
        return
    }
    get_friendlinked()
    let pathname = location.pathname
    if (location.search === '?fromgithub=true') {
        if (location.origin.search('gitee') > -1) {
            popmsg('国内访问 已跳转到 Gitee Pages')
        } else {
            popmsg('国内访问 已跳转到 Coding Pages')
        }
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
        showtocbtn(true)
        $(md).css('margin', '0')
        $(md).css('maxWidth', 'initial')
        $(md).css('width',
            Number($('html').css('width').replace('px', '')) -
            Number($('#sidetoc').css('width').replace('px', '')) + 'px'
        )
        $(window).resize(function() {
            $(md).css('width',
                Number($('html').css('width').replace('px', '')) -
                Number($('#sidetoc').css('width').replace('px', '')) + 'px'
            )
        })
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
            if (hash === '') {
                $('#_toc_root').children().first().children().click()
                $('#_toc_root').children().first().children().children().first().click()
            } else {
                let lh = hash.split('_')
                $(`[_target_sb=${lh[1]}]`).children().first().click()
                $(`[_target_sb=${lh[0]}]`).click()
            }
            $('.scripts h3').each((i, e) => {
                let root = $(`[_target_sb=${e.id}]`).parent().parent()
                let url = location.origin + location.pathname + '?hash=' + `${e.id}_${root[0].getAttribute('_target_sb')}`
                $(e).attr('data-clipboard-text', url)
                new ClipboardJS(e).on('success', function(event) {
                    popmsg('Copy link succeeded.')
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
        let metadata = getmetadatafromabbrlink(pathname.split('/')[2].split('.html')[0])
        new_render_md(true, metadata.abbrlink)
        createarticlehead(metadata)
        changepagetitle(metadata.title)

        // set parrow
        setarrow()

        // jump to anchro according to the url's hash
        jumpToAnchor()

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
        $(this).addClass('animate__animated animate__pulse')
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