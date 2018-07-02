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
var topbar = $('#topbar')[0]
var posts_cache = new Array()
var filter_posts_cache = new Array()
var tags = $('#all_tags')[0]
var cates = $('#all_cates')[0]
var all_tags = new Array()
var all_cates = new Array()
var postsearchrs = new Array()
var cates_tree_panel = $('#cates_tree_panel')[0]
var cates_tree = $('#cates_tree')[0]
var perpageitem = 10
var postcomment = false
var postsync = false
var searchcount

$(function() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        alert('不支持ie浏览器, 请使用edge或者chrome打开!')
        return
    }
    settimeout()
    get_friendlinked()
    let topbarh = getFinalStyle(topbar, 'height').split('px')[0]
    let search = location.search
    if (search === '') {
        $('#topbar').animateCss('flipInX')
        hideloading()
        hidesidetoc()
        rmclass(homepage, 'remove')
        adclass(homepage, 'myshow')
        setgohub('My hub', 'https://github.com/' + username)
        showbbt()
    } else {
        showloading()
        let params = location.search.substring(1).split('&')
        let kv = params[0].split('=')
        let key = kv[0]
        let value = kv[1]
        if (key === 'to' && value === 'posts') {
            changepagetitle('posts | youyinnn')
            get_posts()
        } else if (key === 'to' && value === 'post') {
            changepagetitle('post | youyinnn')
            get_post(params[1].split('=')[1])
        } else if (key === 'to' && value === 'about') {
            changepagetitle('about | youyinnn')
            get_about()
        } else if (key === 'to' && value === 'todo') {
            changepagetitle('todo | youyinnn')
            get_todo()
        } else if (key === 'to' && value === 'script') {
            changepagetitle('script | youyinnn')
            get_script()
        } else if (key === 'to' && value === 'resume') {
            changepagetitle('resume | youyinnn')
            get_resume()
        } else if (key === 'xixi' && value === 'haha') {
            changepagetitle('egg | youyinnn')
            get_egg()
        } else {
            alert('No such page.')
            location = '/'
        }
    }
    $('.em-svg').on('mouseover', function() {
        $(this).animateCss('pulse')
    })
    $('#showmore').animateCss('flipInX')
    $('#wolf-logo').animateCss('flipInX')
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