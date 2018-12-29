$(function() {
    $('#homebut').bind('click', function() {
        location = '/'
    })
    $('#postsbut').bind('click', function() {
        location = '/' + '?to=posts'
    })
    $('#scriptbut').bind('click', function() {
        location = '/' + '?to=script'
    })
    $('#todobut').bind('click', function() {
        location = '/' + '?to=todo'
    })
    $('#resumebut').bind('click', function() {
        location = '/' + '?to=resume'
    })
    $('#egg').bind('click', function() {
        location = '/' + '?xixi=haha'
    })
    $('#showmore').bind('click', function() {
        location = '/' + '?to=about'
    })
    $('#showhacknical').bind('click', function() {
        if ($('#hacknical_github_analysis').attr('src') === undefined) {
            $('#hacknical_github_analysis').attr('src', 'https://hacknical.com/youyinnn/github?locale=zh')
        }
        $('#ifwrapper').removeClass('hacknical_hide')
        $('#gohub').text('Hide HackNical')
        let oldhref = $('#gohub').attr('href')
        $('#gohub').attr('href', 'javascript:void(0);')
        $('#gohub').click(function() {
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
    $('#postsearchbut').bind('click', function() {
        searchpost($('#postsearchtext')[0].value)
    })
    $('#cleanbut').bind('click', function() {
        cleansearch()
    })
    $('#hb').bind('click', function() {
        cgtopbut()
    })
    $('#toc').bind('click', function() {
        if ($('#sidetoccontainer').hasClass('tochide')) {
            showsidetoc()
        } else {
            hidesidetoc()
        }
    })
    $('*').bind('click', function() {
        if (this.id === 'toc' || this.id === 'sidetoc') {
            return false
        } else if (!$('#sidetoccontainer').hasClass('tochide')) {
            hidesidetoc()
        }
    })
    $('#searchtext').bind('keyup', 'return', function() {
        searchscript(this.value)
    })
    $('#postsearchtext').bind('keyup', 'return', function() {
        searchpost(this.value)
    })
    $('#searchtext').bind('keyup', 'esc', function() {
        this.value = ''
    })
    $('#postsearchtext').bind('keyup', 'esc', function() {
        this.value = ''
    })
    $(window).bind('keyup', 'alt+s', function() {
        syncatesToconfig()
    })
    $(window).bind('keyup', 'alt+p', function() {
        if (location.href.search(/\?to=post&/) !== -1) {
            md2png()
        }
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
        let scrollTo = $(window).scrollTop(),
            docHeight = $(document).height(),
            windowHeight = $(window).height();
        scrollPercent = (parseInt((scrollTo / (docHeight - windowHeight)) * 100)) + ' %';
        percent.innerText = scrollPercent

    })
    $('#percent').bind('click', function() {
        scrollToTop(800)
        searchone = 0
    })
    $('#searchtext').focus(function() {
        $('#scriptsearcher')[0].style.opacity = '1'
    })
    $('#searchtext').blur(function() {
        $('#scriptsearcher')[0].style.opacity = '0.3'
    })
    $('#share_png_paned_close').bind('click', function() {
        $('#share_png_panel').addClass('myhide')
    })
    $('#corder').bind('click', function() {
        $('#corder').attr('disabled', '')
        $('#norder').removeAttr('disabled')
        postsod = false
        filter()
    })
    $('#norder').bind('click', function() {
        $('#norder').attr('disabled', '')
        $('#corder').removeAttr('disabled')
        postsod = true
        filter()
    })
})