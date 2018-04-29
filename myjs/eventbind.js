$(function () {
  $('#homebut').bind('click', function () {
    location = '/'
  })
  $('#aboutbut').bind('click', function () {
    location = '/' + '?panel=about'
  })
  $('#friendlinkbut').bind('click', function () {
    location = '/' + '?panel=friendlinked'
  })
})