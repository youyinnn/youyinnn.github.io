$(function () {
  $('#homebut').bind('click', function () {
    location = '/'
  })
  $('#postsbut').bind('click', function () {
    location = '/' + '?panel=posts'
  })
  $('#aboutbut').bind('click', function () {
    location = '/' + '?panel=about'
  })
  $('#friendlinkbut').bind('click', function () {
    location = '/' + '?panel=friendlinked'
  })
})