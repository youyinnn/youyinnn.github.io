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
  $(window).scroll(function () {
    var scrollTo = $(window).scrollTop(),
    docHeight = $(document).height(),
    windowHeight = $(window).height();
    scrollPercent = (parseInt((scrollTo / (docHeight-windowHeight))  * 100)) + ' %';
    if (scrollPercent === '0 %') {
      percent.innerText = ''
    } else {
      percent.innerText = scrollPercent
    }
  })
  $('#topbut').bind('click', function () {
    $('html,body').animate({
      scrollTop: 0
    }, 300);
  })
})