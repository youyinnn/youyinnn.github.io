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
var timeout

function settimeout() {
  let nowhour = dayjs().hour()
  timeout = (nowhour >= 19 || nowhour <= 6)  ? 10000 : 5000
  console.log('timeout is [' + timeout + ']')
}

function getset(url, asyn) {
  let basegetset = {
    'timeout': timeout,
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
        alert('Maybe it\'s timeout because of github api!\r\n' + 'status:' + eve.status +
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
    'timeout': timeout,
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
        alert('Maybe it\'s timeout because of github api!\r\n' + 'status:' + eve.status +
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
    let totalpages = Math.ceil(re.length / 5)
    let pagesboxs = new Array(totalpages)
    for (let i = 0; i < totalpages; i++) {
      let pagebox = document.createElement('div')
      addClass(pagebox, 'pagebox')
      pagebox.id = 'pagebox-' + (i + 1)
      appendC(docpanel, pagebox)
      pagesboxs[i] = pagebox
    }
    console.log(pagesboxs)
    for (let i = 0; i < re.length; ++i) {
      createpostcard(re[i], Math.ceil((i + 1) / 5))
    }
    removeClass(docpanel, 'myhide')
    addClass(docpanel, 'myshow')
    pagehandler(totalpages)
    hideloading()
  })
}

function get_post(number) {
  let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number
  sendget(url, function (re) {
    let page = re.html_url
    setgohub('Go hub', page)
    createposthead(re)
    let text = re.body
    let url2 = api_url + '/repos/' + username + '/' + blog_repo + '/issues/' + number + '/comments'
    sendget(url2, function (re) {
      text += '\r\n\r\n<div id="commentline"></div> \r\n\r\n'
      text += '## Post comments\r\n'
      if (re.length === 0) {
        text += '<div id="nocomment">No one has commented here yet \r\n <a href="' + page + '">Add comment</a></div>'
      } else {
        for (let i = 0; i < re.length; i++) {
          text += createpostcomment(i, re[i])
        }
      }
      hideloading()
      render_md(text)
      if (re.length !== 0) {
        let addcomment = document.createElement('div')
        let a = document.createElement('a')
        addcomment.id = 'nocomment'
        addcomment.style.transform = 'translateY(-16px)'
        a.href = page
        a.target = '_blank'
        a.innerText = 'Add comment'
        appendC(addcomment, a)
        appendC(md, addcomment)
      }
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
  if (fldd.innerText === 'Fail to get link, retry.' || fldd.innerText === '') {
    let url = api_url + '/repos/' + username + '/' + blog_repo + '/issues?labels=' + friend_linked_label
    let basegetset = {
      'timeout': 3000,
      'async': true,
      'url': url,
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
        fldd.innerHTML = '<a class=" dropdown-item" href="javaScript:get_friendlinked();">Fail to get link, retry.</a>'
      }
    }
    console.log('send get :' + url)
    $.ajax(basegetset).done(function (re) {
      fldd.innerHTML = ''
      let text = re[0].body
      let arr = text.split(',')
      for (let i = 0; i < arr.length; i++) {
        let msg = arr[i]
        if (msg !== '') {
          let sp = msg.split('-')
          let ditem = document.createElement('a')
          addClass(ditem, 'dropdown-item')
          ditem.href = sp[1]
          ditem.target = '_blank'
          ditem.innerText = sp[0].replace(/\r\n/g, '')
          appendC(fldd, ditem)
        }
      }
    })
  }
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