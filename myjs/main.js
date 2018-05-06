var searchone = 0
var searchtext

function render_md(text) {
  removeClass(md, 'myhide')
  addClass(md, 'myshow')
  removeClass(sidetoccontainer, 'myhide')
  addClass(sidetoccontainer, 'myshow')
  if (text.substring(0, 3) === '---') {
    let endindex = text.indexOf('---', 3) + 3
    let hexo_metadata = gethexofrontmatter(text)
    hexo_metadata = yaml.load(hexo_metadata.replace(/\r\n/gm, '\n'))
    showhexometadata(hexo_metadata)
    text = text.substring(endindex, text.length)
  }
  let cq = text.match(/{%.*cq.*%}/gm)
  if (cq) {
    let saying = text.substring(text.indexOf(cq[0]) + cq[0].length + 2, text.indexOf(cq[1]))
    saying = saying.replace(/\r\n/gm, '</br>')
    text = text.substring(text.indexOf(cq[1]) + cq[1].length, text.length)
    showsaying(saying)
  }
  while (true) {
    let emojistart = text.search(/:[A-z]+[-|_]?[A-z|0-9]+:/g)
    if (emojistart === -1) break
    let emojiend = text.indexOf(':', emojistart + 1)
    let emoji = text.substring(emojistart, emojiend + 1)
    text = text.replace(emoji, '<i class="em-svg em-' + emoji.substring(1, emoji.length - 1) + '"></i>')
  }
  editormd.markdownToHTML('md', {
    markdown: text,
    htmlDecode: 'style,script,iframe',
    tocm: true, // Using [TOCM]
    tocContainer: '#sidetoc',
    taskList: true,
    tex: true, // 默认不解析
    flowChart: true, // 默认不解析
    sequenceDiagram: true, // 默认不解析
  });
  let as = $('#md a')
  for (let i = 0; i < as.length; i++) {
    as[i].target = '_blank'
  }
  $('pre, pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });
}

function postspage(pageto) {
  docpanel.style.cssText = 'transform: translateY(-' + ((postpanelheight - 48) * (pageto - 1)) + 'px);'
}

function pagehandler(totalPages) {
  $(docpanel).twbsPagination({
    totalPages: totalPages,
    hideOnlyOnePage: true,
    prev: '<',
    next: '>',
    first: 'F',
    last: 'L',
    loop: true,
    visiblePages: 3,
    onPageClick: function (event, page) {
      for (let i = 1; i <= totalPages; i++) {
        let pagebox = $('#pagebox-' + i)[0]
        if (i === page) {
          removeClass(pagebox, 'myhide')
          addClass(pagebox, 'myshow')
        } else {
          addClass(pagebox, 'myhide')
          removeClass(pagebox, 'myshow')
        }
      }
    }
  });
}

function hideloading() {
  removeClass(loading, 'myshow')
  addClass(loading, 'myhide')
}

function showloading() {
  removeClass(loading, 'myhide')
  addClass(loading, 'myshow')
}

function hidesidetoc() {
  addClass(sidetoccontainer, 'myhide')
  addClass(md, 'w-100')
}

function searchscript(text) {
  if (searchtext !== text) {
    searchone = 0
  }
  searchtext = text
  if (text === '#l' || text === '#last') {
    $('html,body').animate({
      scrollTop: $('#search-' + (searchcount - 1)).offset().top
    }, 300);
    return
  }
  if (text.search(/#[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?/g) !== -1) {
    let searchid = '#search-' + text.split('#')[1]
    let search = $(searchid)
    if (search[0] !== undefined) {
      $('html,body').animate({
        scrollTop: search.offset().top
      }, 300);
      return
    }
  } else {
    text = text.split('-i,')
    let isi = true
    if (text.length > 1) {
      isi = false
      text = text[1]
    } else {
      text = text[0]
    }
    text = text.replace(/ /g, '')
    let keywords = text.split(',')
    for (let i = 0; i < keywords.length; i++) {
      if (isi) {
        keywords[i] = new RegExp(keywords[i], 'gi')
      } else {
        keywords[i] = new RegExp(keywords[i], 'g')
      }
    }
    for (let i = searchone; i < searchcount; i++) {
      let search = $('#search-' + i)
      let scripttext = search[0].innerText
      let get = true
      for (let j = 0; j < keywords.length; j++) {
        get = scripttext.search(keywords[j]) === -1 ? get && false : get && true
      }
      if (get) {
        searchone = i + 1
        scrolltoelement(search[0].id)
        searchbut.innerText = 'Get #' + i
        setTimeout(function () {
          searchbut.innerText = 'Search'
        }, 1000, 'swing')
        return
      }
    }
  }
  $('#searchtext').addClass('getnothing')
  searchbut.innerText = 'No get'
  setTimeout(function () {
    searchbut.innerText = 'Search'
    $('#searchtext').removeClass('getnothing')
  }, 1000, 'swing')
  searchone = 0
}

function scrolltoelement(elementid) {
  if ($('#' + elementid)[0].oset === undefined) {
    $('#' + elementid)[0].oset = $('#' + elementid).offset().top
  }
  $('html,body').animate({
    scrollTop: $('#' + elementid)[0].oset
  }, 600, 'swing');
}

function setgohub(text, href) {
  gohub.innerText = text
  gohub.href = href
}

function changepagetitle(text) {
  $('title')[0].innerText = text
}

function gethexofrontmatter(text) {
  let endindex = text.indexOf('---', 3) + 3
  let hexo_metadata = text.substring(4, endindex - 3)
  console.log(hexo_metadata)
  return hexo_metadata
}