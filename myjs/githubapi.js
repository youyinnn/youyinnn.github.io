var username = 'youyinnn'
var blog_repo = username + '.github.io'
var post_label = 'ypost'
var about_label = 'yabout'
var friend_linked_label = 'yfriendlinked'
var script_label = 'yscript'
var todo_label = 'ytodo'
var api_url = 'https://api.github.com'
var oauth_token_base64 = 'YTVmZTQzMTNiZGRkMzA5Y2M5YjdiMjUwYmY2NWRhODk0NTkwYzBiOA=='
var oauth_token = base64decode(oauth_token_base64)
var all

function getset(url, asyn) {
  let basegetset = {
    'timeout': 5000,
    'async': true,
    'crossDomain': true,
    'method': 'GET',
    'url': url,
    'headers': {
      'Authorization': 'Bearer ' + oauth_token,
      'Accept': 'application/vnd.github.v3+json',
      'Accept': 'application/vnd.github.symmetra-preview+json',
    },
    'processData': false,
    'contentType': false,
    'error': function (eve) {
      if (eve.status === 0 && eve.statusText !== 'error') {
        alert('error on some thing~\r\n' + 'status:' + eve.status +
          '\r\nresponseText: ' + eve.responseText +
          '\r\nstatusText: ' + eve.statusText +
          '\r\nwill return to the home page')
        location.reload()
      }
    }
  }
  return basegetset
}

function postset(url, form, asyn) {
  let basepostset = {
    'timeout': 5000,
    'async': true,
    'crossDomain': true,
    'method': 'POST',
    'url': url,
    'headers': {
      'Authorization': 'Bearer ' + oauth_token,
      'Accept': 'application/vnd.github.v3+json',
      'Accept': 'application/vnd.github.symmetra-preview+json',
    },
    'mimeType': 'multipart/form-data',
    'data': form,
    'processData': false,
    'contentType': false,
    'error': function (eve) {
      if (eve.status === 0 && eve.statusText !== 'error') {
        alert('error on some thing~\r\n' + 'status:' + eve.status +
          '\r\nresponseText: ' + eve.responseText +
          '\r\nstatusText: ' + eve.statusText +
          '\r\nwill return to the home page')
        location.reload()
      }
    }
  }
  return basepostset
}


function sendget(url, func) {
  console.log('send get :' + url)
  $.ajax(getset(url)).done(function (response) {
    if (func !== undefined) {
      func(response)
    }
  })
}

function sendpost(url, form, func) {
  console.log('send post :' + url)
  $.ajax(postset(url, form)).done(function (response) {
    if (func !== undefined) {
      func(response)
    }
  })
}

function search_issues_by_label(label, func) {
  let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + label
  sendget(url, func)
}

function get_posts() {
  search_issues_by_label(post_label, function (re) {
    setgohub('Go hub', 'https://github.com/' + username + '/' + blog_repo + '/issues')
    for (let i = 0; i < re.length; ++i) {
      createpostcard(re[i])
    }
    let posts = $('.post')
    for (let i = 0; i < posts.length; ++i) {
      let post = posts[i]
      removeClass(post, 'hide')
      addClass(post, 'show')
    }
    removeClass(docpanel, 'hide')
    addClass(docpanel, 'show')
    pagehandler(posts[0], docpanel, posts.length)
    hideloading()
  })
}

function get_post(number) {
  let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number
  sendget(url, function (re) {
    setgohub('Go hub', re.html_url)
    createposthead(re)
    let text = re.body
    let url2 = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments'
    sendget(url2, function (re) {
      text += '\r\n\r\n<div id="commentline"></div> \r\n\r\n'
      text += '## Post comments\r\n'
      if (re.length === 0) {
        text += '<div id="nocomment">No one has commented here yet</div>'
      } else {
        for (let i = 0; i < re.length; i++) {
          text += createpostcomment(i, re[i])
        }
      }
      console.log(text)
      hideloading()
      render_md(text)
    })
  })
}

function get_about() {
  search_issues_by_label(about_label, function (re) {
    setgohub('Go hub', re[0].html_url)
    render_md(re[0].body)
    hideloading()
  })
}

function get_friendlinked() {
  search_issues_by_label(friend_linked_label, function (re) {
    setgohub('Go hub', re[0].html_url)
    let text = re[0].body
    let s = text.indexOf('@[', 0)
    let e = text.indexOf(']', s);
    while (s !== -1) {
      let friend = text.substring(s, e + 1)
      text = text.replace(/@\[.*-http.*\]/, friendcard(friend))
      s = text.indexOf('@[', 0)
      e = text.indexOf(']', s);
    }
    render_md(text)
    hidesidetoc()
    hideloading()
  })
}

function get_issues_comments(number, issuesbody, func) {
  let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments'
  sendget(url, function (re) {
    func(issuesbody, re)
    hidesidetoc()
    hideloading()
  })
}

function get_todo() {
  search_issues_by_label(todo_label, function (re) {
    setgohub('Go hub', re[0].html_url)
    get_issues_comments(re[0].number, re[0].body, createtodo)
  })
}

function get_script() {
  search_issues_by_label(script_label, function (re) {
    setgohub('Go hub', re[0].html_url)
    get_issues_comments(re[0].number, re[0].body, createscript)
  })
}

function get_egg() {
  let url = api_url + '/repos/youyinnn/youyinnn.github.io/issues?labels=yegg&state=closed'
  sendget(url, function (re) {
    setgohub('Go hub', re[0].html_url)
    get_issues_comments(re[0].number, re[0].body, createegg)
  })
}