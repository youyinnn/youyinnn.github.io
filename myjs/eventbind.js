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
  $('#friendlinkbut').bind('click', function () {
    location = '/' + '?panel=friendlinked'
  })
  $('#aboutbut').bind('click', function () {
    location = '/' + '?panel=about'
  })
  $('#searchbut').bind('click', function () {
    searchscript($('#searchtext')[0].value)
  })
  $('#searchtext').bind('keyup', 'return', function () {
    searchscript(this.value)
  })
  $('#searchtext').bind('keyup', 'esc', function () {
    this.value = ''
  })
  $(window).scroll(function () {
    var scrollTo = $(window).scrollTop(),
    docHeight = $(document).height(),
    windowHeight = $(window).height();
    scrollPercent = (parseInt((scrollTo / (docHeight-windowHeight))  * 100)) + ' %';
      percent.innerText = scrollPercent
    
  })
  $('#topbut, #topbut2').bind('click', function () {
    $('html,body').animate({
      scrollTop: 0
    }, 300);
  })
})