const fs = require('fs')
const path = require('path')
const marked = require('marked')
const yaml = require('js-yaml')
const {
    crc32
} = require('crc')
const dayjs = require('dayjs')


let postsPath = path.join(__dirname, '..', '_posts')
let htmlPath = path.join(__dirname, '..', 'index.html')

// transfer file to another file with handleFunc
function file2file(set) {
    let sourceStr = fs.readFileSync(set.sourceFilePath, {
        encoding: 'utf-8'
    })
    fs.writeFileSync(set.outputFilePath, set.handleFunc(sourceStr), {
        encoding: 'utf-8'
    })
}

var html = undefined
// Get reference
const renderer = new marked.Renderer();

// Override function
renderer.heading = function(text, level) {
    if (text.search('<a') > 0 || text.startsWith('<a')) {
        text = text.replace(/\<a href=".*"\>|<\/a>|<code>|<\/code>/g, '')
    }
    let hid = crc32(text+level).toString(16)
    return `
          <h${level} id="${hid}">${text}</h${level}>`;
}
renderer.html = renderer.text = function(text) {
    // convert emoji
    let emojis = text.match(/:[A-z]+[-|_]?[A-z|0-9]+:/gm)
    if (emojis !== null) {
        emojis.forEach(ej => {
            let splitors = text.split(ej)
            text = splitors.join(emoji.replace_colons(ej))
        })
    }

    // render {% cq %} {% endcq %}
    text = text.replace(/\{\% *cq *\%\}/gm, '<div class="saying mb-4"><div class="saying-quote saying-left-quote">“</div><div class="saying-quote saying-right-quote">”</div>')
    text = text.replace(/\{\% *endcq *\%\}/gm, '</div>')
    return text
}

function md2html(sourceFilePath, outputFilePath, sourceMdStrHandleFunc) {
    let sourceMdStr = fs.readFileSync(sourceFilePath, {
        encoding: 'utf-8'
    })
    if (html === undefined) {
        html = fs.readFileSync(htmlPath, {
            encoding: 'utf-8'
        })
    }
    if (sourceMdStrHandleFunc !== undefined) {
        sourceMdStr = sourceMdStrHandleFunc(sourceMdStr)
    }
    let htmlStr = marked(sourceMdStr, {
        gfm: true,
        breaks: true,
        renderer: renderer
    })
    let html2 = html.split('{{% md %}}')
    fs.writeFileSync(outputFilePath, html2[0] + htmlStr + html2[1], {
        encoding: 'utf-8'
    })
}

function mds2html(sourceFilePaths, outputFilePath, sourceMdStrHandleFunc) {
    let sourceMdStr = ''
    for (sourceFilePath of sourceFilePaths) {
        sourceMdStr += fs.readFileSync(sourceFilePath, {
            encoding: 'utf-8'
        })

        sourceMdStr += '\n'
    }
    if (html === undefined) {
        html = fs.readFileSync(htmlPath, {
            encoding: 'utf-8'
        })
    }
    if (sourceMdStrHandleFunc !== undefined) {
        sourceMdStr = sourceMdStrHandleFunc(sourceMdStr)
    }
    let htmlStr = marked(sourceMdStr, {
        gfm: true,
        breaks: true,
        renderer: renderer
    })
    let html2 = html.split('{{% md %}}')
    fs.writeFileSync(outputFilePath, html2[0] + htmlStr + html2[1], {
        encoding: 'utf-8'
    })
}

// articles 2 htm
let postsrs = fs.readdirSync(postsPath)
let articlesMetadata = new Array()
let allSeries = new Array()
let articlesOrder = new Array()

const {
    EmojiConvertor
} = require('emoji-js')
var emoji
emoji = new EmojiConvertor()
emoji.init_env()
emoji.replace_mode = 'unified'
emoji.allow_native = true

// iterating md files
var originalImgFunc = renderer.image

function imgscroll(href, title, text) {
    let picId = crc32(href).toString(16)
    return `
        <div class="_showpic_${picId} showpicbtn">Loading images >></div>
        <img href=${href} class="_pic_${picId} hidepic" picId="${picId}"></img>
        <script>
            {
                let imgself${picId}s = document.getElementsByClassName('_pic_${picId}')
                let showpicbtn${picId}s = document.getElementsByClassName('_showpic_${picId}')
                let isInViewPortOfTwo${picId} = function () {
                    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
                    const top = imgself${picId}s[0].getBoundingClientRect() && imgself${picId}s[0].getBoundingClientRect().top
                    if (top  <= viewPortHeight + 300) {
                        for (el of imgself${picId}s) {
                            el.src = el.getAttribute('href')
                            el.classList.add('showpic')
                            window.removeEventListener('scroll', isInViewPortOfTwo${picId})
                            isInViewPortOfTwo${picId} = null
                        }
                        for (el of showpicbtn${picId}s) {
                            el.style.display = 'none'
                        }
                    }
                }
                window.addEventListener('scroll', isInViewPortOfTwo${picId})
            }
        </script>
    `
}

const articleDataExtract = require('../myjs/artricles-data-extract')

renderer.image = imgscroll
for (pname of postsrs) {
    let abbrlink = crc32(pname).toString(36)
    md2html(
        path.join(postsPath, pname),
        path.join(__dirname, '..', 'article', abbrlink + '.html'),
        function(sourceMdStr) {
            let data = articleDataExtract.extract(sourceMdStr)
            data.metadata.short_content = marked(data.metadata.short_content, {
                gfm: true,
                breaks: true,
                renderer: renderer
            })
            data.metadata.abbrlink = abbrlink
            if (data.metadata.series !== undefined) {
                let seriesForThisArticles
                for (let j = 0; j < allSeries.length; j++) {
                    if (allSeries[j].se === data.metadata.series)
                        seriesForThisArticles = allSeries[j].ps
                }
                if (seriesForThisArticles === undefined) {
                    let item = {}
                    item.se = data.metadata.series
                    item.ps = seriesForThisArticles = []
                    allSeries.push(item)
                }
                let ss = data.metadata.title + '===' + abbrlink + '===' + (new Date(data.metadata.date).getTime())
                seriesForThisArticles.unshift(ss)
            }
            articlesMetadata.push(data.metadata)
            return data.body
        }
    )
}
renderer.image = originalImgFunc

// sort metadata with date
articlesMetadata = articlesMetadata.sort((a, b) => {
    return dayjs(a.date).isBefore(b.date) ? 1 : -1
})

for (m of articlesMetadata) {
    articlesOrder.push(m.title + '<=>' + m.abbrlink)
}

for (ss of allSeries) {
    ss.ps = ss.ps.sort((a, b) => {
        return Number(a.split('===')[2]) - Number(b.split('===')[2])
    })
}

allSeries = yaml.dump(allSeries)
articlesMetadata = yaml.dump(articlesMetadata)

let resourcesPath = path.join(__dirname, '..', 'resources')
let websrcPath = path.join(__dirname, '..', '_websrc')

fs.copyFileSync(
    htmlPath,
    path.join(__dirname, '..', 'articles', 'index.html'),
)

// about
md2html(
    path.join(websrcPath, 'about.md'),
    path.join(__dirname, '..', 'about', 'index.html')
)

// resume
md2html(
    path.join(websrcPath, 'resume.md'),
    path.join(__dirname, '..', 'resume', 'index.html')
)

// scripts
renderer.image = imgscroll

scriptsDir = fs.readdirSync(path.join(websrcPath, 'scripts'))
scriptsMds = []
for (md of scriptsDir) {
    if (md.endsWith('.md'))
        scriptsMds.push(path.join(websrcPath, 'scripts', md))
}

mds2html(
    scriptsMds,
    path.join(__dirname, '..', 'scripts', 'index.html')
)
renderer.image = originalImgFunc

// todos
md2html(
    path.join(websrcPath, 'todos.md'),
    path.join(__dirname, '..', 'todos', 'index.html')
)

// firends link
let friendslinkfilename = 'friendslink.js'
file2file({
    sourceFilePath: path.join(websrcPath, 'friendslink.json'),
    outputFilePath: path.join(resourcesPath, friendslinkfilename),
    handleFunc: function(src) {
        return `var friendslink = ${src}`
    }
})

let cacheFileName = `cache-${crc32(new Date().toString()).toString(36)}.js`

fs.writeFileSync(path.join(resourcesPath, cacheFileName), `
    sessionStorage.setItem('pseries', ${JSON.stringify(allSeries)});
    sessionStorage.setItem('pcbl', ${JSON.stringify(articlesMetadata)});
    sessionStorage.setItem('pod', ${JSON.stringify(articlesOrder.join('>--<'))});
    sessionStorage.setItem('cacheversion', ${new Date().getTime()});
`)

var resoucesList = [
    friendslinkfilename,
    cacheFileName
]
var resoucesListWithoutCache = [
    friendslinkfilename
]

fs.writeFileSync(path.join(resourcesPath, 'resources.js'), 
`var resourcesList;if (location.pathname.startsWith('/articles/')) {resourcesList = ${JSON.stringify(resoucesList)};} else {resourcesList = ${JSON.stringify(resoucesListWithoutCache)};}`)


// delete old cache file
let resourceFiles = fs.readdirSync(resourcesPath)
for (resf of resourceFiles) {
    if (resf.startsWith('cache') && resf !== cacheFileName)
        fs.unlinkSync(path.join(resourcesPath, resf), (err) => {
            if (err) throw err;
            console.log(resf, ' has been deleted.')
        })
}