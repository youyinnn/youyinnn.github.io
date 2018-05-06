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