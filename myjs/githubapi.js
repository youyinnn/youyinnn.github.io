var user = 'youyinnn'
var blog_repo = user + '.github.io'
var post_label = 'ypost'
var about_label = 'yabout'
var friend_link_label = 'yfirendlink'
var script_label = 'yscript'
var url = 'https://api.github.com'
var client_id = '890ef13704c744878bac'
var client_secret = '1144f5bf192b5100f7018b15cdb8e2dabcc3467b'
var all

function getset(url) {
  let basegetset = {
    'async': true,
    'crossDomain': true,
    'method': 'GET',
    'url': url,
    'headers': {
      'Authorization': 'Bearer ' + auth_token,
      'Upgrade-Insecure-Requests': 1
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
      // 'Authorization': 'Bearer ' + auth_token,
      'Cookie':'_ga=GA1.2.421864759.1520090149; _octo=GH1.1.612402754.1520090149; tz=Asia%2FShanghai; user_session=YoZCN69eAa7qv-K_C5-qu6t-jkk8B1Ml9w8gj9LG6cenDfQr; logged_in=yes; dotcom_user=youyinnn; _gid=GA1.2.683521117.1524844524; _gat=1; _gh_sess=KzlaRytvREdIUktPcXBjTmQ5TkVXbHczU0NGQTQ3NFIzOFRxbWcyLzFQeFVBdWFURHg1a2RlaVkvNTAwdko5TWtMVlREaWE4b1VLeTFZRnZadGZmSGhLTE5UWlNmM1pGSmdCcDdQSHMwRndvVW1MWGVjNjNxVFc5RTJSQzYxWDczcnJFMGU2bm1laWJnQkpqZ3BuZlhtckszekdVc3Z5dmRvNWd4VmlTMnFpRzBxK1Y5djJiaWUwNmQybExydElSZGpGdU1xdllZamxzMzArd0F5bm0yZ3lVdEJLWVR6UXdDbHUxbEhBOFg3V1hsUE85WWgyb3NXY2gyRFhlam01OXhRTGpSVmVLdjc0WS9nTC9kMzBZcitXMmJ4Q2xzN1FpN3FLSXA0aG5LNjgvMlVjSEk5aDFkaUZhdXowM1h3MkY0dEpqc2ttbWF4ODR3dlF4ek1uWGZaakhscURwYjZveFFtNGhmelM1cW5XcHU0S1JvUjRuVkw5cjdHcGRJWWw3dU9ncGtpS0svaVk2ems4d2FQalR6L2xYRnVoNENrUHFlYm5WME4vS0YwMmJJWURFekY1MkJuUGtzcTdUQzVENUo2aEhSQUl5YVJCS1lZaStGS3JHWHA0Ky9ZME4vSS9YbWpEa0xCdVkyeDVtdFVBRDdndG5WZmxXdnVuajRWVjJhdFJQWFJLRE85UTdiSXZXcTFrU1FVVFZoZ1Zlb0xQRVlmUkxCT1JkcVNDanRhUzF1VVltMzNrQ2l6MHp5VTFqLS0xaFdCNXFYNHRic1hXQUVNdktkNTlnPT0%3D--dabaa6d6458ac4e461568608f3fb7fecb3fbec26'
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
