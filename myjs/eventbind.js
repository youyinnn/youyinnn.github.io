$(function () {
  $('#homebut').bind('click', function () {
    location = '/'
  })
  $('#postsbut').bind('click', function () {
    location = '/' + '?panel=posts'
  })
  $('#scriptbut').bind('click', function () {
    location = '/' + '?panel=script'
  })
  $('#todobut').bind('click', function () {
    location = '/' + '?panel=todo'
  })
  $('#egg').bind('click', function () {
    location = '/' + '?xixi=haha'
  })
  $('#showmore').bind('click', function () {
    location = '/' + '?panel=about'
  })
  $('#searchbut').bind('click', function () {
    searchscript($('#searchtext')[0].value)
  })
  $('#postsearchbut').bind('click', function () {
    searchpost($('#postsearchtext')[0].value)
  })
  $('#cleanbut').bind('click', function () {
    cleansearch()
  })
  $('#searchtext').bind('keyup', 'return', function () {
    searchscript(this.value)
  })
  $('#postsearchtext').bind('keyup', 'return', function () {
    searchpost(this.value)
  })
  $('#searchtext').bind('keyup', 'esc', function () {
    this.value = ''
  })
  $('#postsearchtext').bind('keyup', 'esc', function () {
    this.value = ''
    cleansearch()
  })
  $('#categories').bind('click', function () {
    if ($('#all_cates').hasClass('myhide')) {
      $('.pagebox').addClass('myblur')
      $('.pagination').addClass('myblur')
      $('#gohub').addClass('myblur')
      $('#topbar').addClass('myblur')
      $('#all_cates').removeClass('myhide')
      $('#all_tags').addClass('myhide')
    } else {
      $('#all_cates').addClass('myhide')
      $('.pagebox').removeClass('myblur')
      $('.pagination').removeClass('myblur')
      $('#gohub').removeClass('myblur')
      $('#topbar').removeClass('myblur')
    }
  })
  $('#tags').bind('click', function () {
    if ($('#all_tags').hasClass('myhide')) {
      $('.pagebox').addClass('myblur')
      $('.pagination').addClass('myblur')
      $('#gohub').addClass('myblur')
      $('#topbar').addClass('myblur')
      $('#all_tags').removeClass('myhide')
      $('#all_cates').addClass('myhide')
    } else {
      $('#all_tags').addClass('myhide')
      $('.pagebox').removeClass('myblur')
      $('.pagination').removeClass('myblur')
      $('#gohub').removeClass('myblur')
      $('#topbar').removeClass('myblur')
    }
  })
  $(window).scroll(function () {
    var scrollTo = $(window).scrollTop(),
      docHeight = $(document).height(),
      windowHeight = $(window).height();
    scrollPercent = (parseInt((scrollTo / (docHeight - windowHeight)) * 100)) + ' %';
    percent.innerText = scrollPercent

  })
  $('#topbut, #topbut2').bind('click', function () {
    $('html,body').animate({
      scrollTop: 0
    }, 300);
    searchone = 0
  })
  $('#searchtext').focus(function () {
    $('#scriptsearcher')[0].style.opacity = '1'
  })
  $('#searchtext').blur(function () {
    $('#scriptsearcher')[0].style.opacity = '0.3'
  })
})