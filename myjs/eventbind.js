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
    $('*').bind('click', function() {
        if (this.id === 'toc' ||
            this.id === 'sidetoc') {
            return false
        }
        if (!$('#sidetoccontainer').hasClass('tochide') && !location.pathname.startsWith('/scripts/')) {
            hidesidetoc()
        }
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
    $(window).scroll(function() {
        let scrollTop = $(window).scrollTop(),
            docHeight = $(document).height(),
            windowHeight = $(window).height();
        scrollPercent = (parseInt((scrollTop / (docHeight - windowHeight)) * 100)) + ' %';
        percent.innerText = scrollPercent

        // hidetopbar when scrollTop > 0
        if (location.pathname.startsWith('/article/') ||
            location.pathname.startsWith('/resume/') ||
            location.pathname.startsWith('/todos/')) {
            if (scrollTop === 0) {
                showtopbar()
            } else {
                hidetopbar()
            }
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