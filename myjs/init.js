var docpanel = $('#docpanel')[0]
var md = $('#md')[0]
var toc = $('#sidetoc')[0]
var toccontainer = $('#sidetoccontainer')[0]
var loading = $('#loading')[0]
var homepage = $('#homepage')[0]
var scriptsearcher = $('#scriptsearcher')[0]
var gohub = $('#gohub')[0]
var percent = $('#percent')[0]
var topbut = $('#topbut')[0]
var searchbut = $('#searchbut')[0]
var fldd = $('#fldd')[0]
var posts_cache = new Array()
var filter_posts_cache = new Array()
var tags = $('#all_tags')[0]
var cates = $('#all_cates')[0]
var all_tags = new Array()
var all_cates = new Array()
var postsearchrs = new Array()
var searchcount
var movetitle = $('#movetitle')[0]

$(function() {
    settimeout()
    get_friendlinked()
    let topbarh = getFinalStyle($('#topbar')[0], 'height').split('px')[0]
    // docpanel.style.height = parseInt(getWindowH()) - parseInt(topbarh) + 'px'
    // md.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
    toc.style.height = parseInt(getWindowH()) - parseInt(topbarh) - 1 + 'px'
    let search = location.search
    if (search === '') {
        hideloading()
        hidesidetoc()
        rmclass(homepage, 'remove')
        adclass(homepage, 'myshow')
        setgohub('My hub', 'https://github.com/' + username)
    } else {
        showloading()
        let params = location.search.substring(1).split('&')
        let kv = params[0].split('=')
        let key = kv[0]
        let value = kv[1]
        if (key === 'panel' && value === 'posts') {
            changepagetitle('posts | youyinnn')
            get_posts()
        } else if (key === 'panel' && value === 'post') {
            changepagetitle('post | youyinnn')
            get_post(params[1].split('=')[1])
        } else if (key === 'panel' && value === 'about') {
            changepagetitle('about | youyinnn')
            get_about()
        } else if (key === 'panel' && value === 'todo') {
            changepagetitle('todo | youyinnn')
            get_todo()
        } else if (key === 'panel' && value === 'script') {
            changepagetitle('script | youyinnn')
            get_script()
        } else if (key === 'xixi' && value === 'haha') {
            changepagetitle('egg | youyinnn')
            get_egg()
        } else {
            alert('No such page.')
            location = '/'
        }
    }
})
