var user = 'youyinnn'
var blog_repo = user + '.github.io'
var post_label = 'ypost'
var about_label = 'yabout'
var friend_link_label = 'yfirendlink'
var script_label = 'yscript'
var url = 'https://api.github.com'
var oauth_token_base64 = 'YTVmZTQzMTNiZGRkMzA5Y2M5YjdiMjUwYmY2NWRhODk0NTkwYzBiOA=='
var oauth_token = base64decode(oauth_token_base64)
var all

function getset(url) {
  let basegetset = {
    'async': true,
    'crossDomain': true,
    'method': 'GET',
    'url': url,
    'headers': {
      'Authorization': 'Bearer ' + oauth_token
    },
    'processData': false,
    'contentType': false,
  }
  return basegetset
}

function postset(url, form) {
  let basepostset = {
    'async': true,
    'crossDomain': true,
    'method': 'POST',
    'url': url,
    'headers': {
      'Authorization': 'Bearer ' + oauth_token
    },
    'mimeType': 'multipart/form-data',
    'data': form,
    'processData': false,
    'contentType': false,
  }
  return basepostset
}


function sendget(url, func) {
  $.ajax(getset(url)).done(function (response) {
    if (func !== undefined) {
      func(response)
    }
  })
}

function sendpost(url, form, func) {
  $.ajax(postset(url, form)).done(function (response) {
    if (func !== undefined) {
      func(response)
    }
  })
}

function list_issue_by_label(label, func) {
  let url = window.url + '/search/issues?q=+state:open+author:' + user + '+label:' + label
  sendget(url, func)
}

function get_posts() {
  list_issue_by_label('gitment', function (re) {
    for (let i = 0; i < re.items.length; ++i) {
      createpostcard(re.items[i], i)
    }
    let docpanel = $('#docpanel')[0]
    let posts = $('.post')
    for (let i = 0; i < posts.length; ++i) {
      let post = posts[i]
      removeClass(post, 'hide')
      addClass(post, 'show')
    }
    removeClass(docpanel, 'hide')
    addClass(docpanel, 'show')
  })
}

function get_post(number, func) {
  let url = window.url + '/repos/' + user + '/' + blog_repo + '/issues/' + number
  sendget(url, func)
}
