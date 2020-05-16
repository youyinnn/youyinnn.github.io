$(function() {
    $('#homebut').bind('click', function() {
        location = '/'
    })
    $('#articlesbut').bind('click', function() {
        location = '/' + 'articles'
    })
    $('#scriptbut').bind('click', function() {
        location = '/' + 'scripts'
    })
    $('#todobut').bind('click', function() {
        location = '/' + 'todos'
    })
    $('#resumebut').bind('click', function() {
        location = '/' + 'resume'
    })
    $('#egg').bind('click', function() {
        location = '/' + 'img/egg'
    })
    $('#showmore').bind('click', function() {
        location = '/' + 'about'
    })
    $('#toarticles').bind('click', function() {
        location = '/' + 'articles'
    })
    $('#showhacknical').bind('click', function() {
        if ($('#hacknical_github_analysis').attr('src') === undefined) {
            $('#hacknical_github_analysis').attr('src', 'https://hacknical.com/youyinnn/github?locale=zh')
        }
        $('#ifwrapper').removeClass('hacknical_hide')
        $('#gohub').text('Hide HackNical')
        $('#gohub').tooltip('disable')
        $('#gohub').click((e) => {
            e.preventDefault()
        })
        let oldhref = $('#gohub').attr('href')
        $('#gohub').attr('href', 'javascript:void(0);')
        $('#gohub').click(function() {
            $('#gohub').tooltip('enable')
            $('#gohub').unbind('click')
            $('#gohub').attr('target', '_blank')
            $('#ifwrapper').addClass('hacknical_hide')
            $('#gohub').text('My Hub')
            setTimeout(function() {
                $('#gohub').attr('href', oldhref)
            }, 100);
        })
    })
    $('#searchbut').bind('click', function() {
        searchscript($('#searchtext')[0].value)
    })
    $('#articlesearchbut').bind('click', function() {
        searcharticle($('#articlesearchtext')[0].value)
    })
    $('#cleanbut').bind('click', function() {
        cleansearch()
    })
    $('#hb').bind('click', function() {
        $('#nextarticlebtn').tooltip('hide')
        $('#prearticlebtn').tooltip('hide')
        cgtopbut()
        setTimeout(function() {
            $('#nextarticlebtn').tooltip('show')
            $('#prearticlebtn').tooltip('show')
        }, 1200);
    })
    $('#toc').bind('click', function() {
        if ($('#sidetoccontainer').hasClass('tochide')) {
            showsidetoc()
        } else {
            hidesidetoc()
        }
    })
    $('*').bind('click', function(event) {
        if (this.id === 'toc' ||
            this.id === 'sidetoc' ||
            this.id === 'tags') {
            return false
        }
        if (!$('#sidetoccontainer').hasClass('tochide') && !location.pathname.startsWith('/resume/') && !location.pathname.startsWith('/scripts/')) {
            hidesidetoc()
        }
        if (!$('#all_tags').hasClass('myhide') && location.pathname.startsWith('/articles/')) {
            $('#all_tags').addClass('myhide')
        }
        // event.stopPropagation()
    })
    $('#searchtext').bind('keyup', 'return', function() {
        searchscript(this.value)
    })
    $('#articlesearchtext').bind('keyup', 'return', function() {
        searcharticle(this.value)
    })
    $('#searchtext').bind('keyup', 'esc', function() {
        this.value = ''
    })
    $('#articlesearchtext').bind('keyup', 'esc', function() {
        this.value = ''
    })
    $('#categories').bind('click', function() {
        if ($('#all_cates').hasClass('myhide')) {
            $('#all_cates').removeClass('myhide')
            $('#all_tags').addClass('myhide')
        } else {
            $('#all_cates').addClass('myhide')
        }
    })
    $('#tags').bind('click', function() {
        if ($('#all_tags').hasClass('myhide')) {
            $('#all_tags').removeClass('myhide')
            $('#all_cates').addClass('myhide')
        } else {
            $('#all_tags').addClass('myhide')
        }
    })

    $('#cates_tree_body').css('height', ($(window).height() - 48 - 8 - 38 - 6 - 8 - 38 - 156 - 8) + 'px')
    $(window).resize(() => {
        $('#cates_tree_body').css('height', ($(window).height() - 48 - 8 - 38 - 6 - 8 - 38 - 156 - 8) + 'px')
    })
    var valineCreated = false
    $(window).scroll(function() {
        let scrollTop = $(window).scrollTop(),
            docHeight = $(document).height(),
            windowHeight = $(window).height();
        let scrollPercent = parseInt((scrollTop / (docHeight - windowHeight)) * 100)
        scrollPercentText = (scrollPercent) + ' %';
        percent.innerText = scrollPercentText

        // hidetopbar when scrollTop > 0
        if (location.pathname.startsWith('/article/') ||
            location.pathname.startsWith('/resume/') ||
            location.pathname.startsWith('/scripts/') ||
            location.pathname.startsWith('/todos/')) {
            if (scrollTop === 0) {
                showtopbar()
            } else {
                hidetopbar()
            }
        }

        if (!valineCreated && scrollPercent === 99) {
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
            $('.vwrap').addClass('shadow')
            $('.vpower').html(`
                comment plugin: <a href="https://valine.js.org" target="_blank">Valine</a>
            `)
            $($('.vrow')[1]).children().first().html('')
            $('#vcomments').addClass('animate__animated animate__fadeIn')
            valineCreated = true
        }
    })
    $('#percent').bind('click', function() {
        scrollToTop(800)
        searchone = 0
    })
    $('#searchtext').focus(function() {
        $('#scriptsearcher')[0].style.opacity = '1'
    })
    $('#searchtext').blur(function() {
        $('#scriptsearcher')[0].style.opacity = '0.6'
    })
    $('#share_png_paned_close').bind('click', function() {
        $('#share_png_panel').addClass('myhide')
    })
})