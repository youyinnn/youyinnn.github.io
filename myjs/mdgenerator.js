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
    return `
          <h${level}>
            <a name="_root-${text}" class="reference-link" target="_blank">
              <span class="header-link"></span>
            </a>
            ${text}
          </h${level}>`;
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
    text = text.replace(/\{\% *cq *\%\}/gm, '<div class="saying mb-4">')
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
        <div id="_showpic_${picId}" class="showpicbtn">正在显示图片 >></div>
        <img id="_pic_${picId}" href=${href} class="hidepic" ></img>
        <script>
            let imgself${picId} = document.getElementById('_pic_${picId}')
            let isInViewPortOfTwo${picId} = function () {
                const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
                const top = imgself${picId}.getBoundingClientRect() && imgself${picId}.getBoundingClientRect().top
                if (top  <= viewPortHeight + 300) {
                    document.getElementById('_pic_${picId}').src = document.getElementById('_pic_${picId}').getAttribute('href')
                    document.getElementById('_pic_${picId}').classList = ['showpic']
                    document.getElementById('_showpic_${picId}').style.display = 'none'
                    window.removeEventListener('scroll', isInViewPortOfTwo${picId})
                    isInViewPortOfTwo${picId} = null
                }
            }
            isInViewPortOfTwo${picId} ()
            window.addEventListener('scroll', isInViewPortOfTwo${picId})
        </script>
    `
}

const articleDataExtract = require('./artricles-data-extract')

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
                let ss = data.metadata.title + '===' + abbrlink
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

allSeries = yaml.dump(allSeries.reverse())
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
md2html(
    path.join(websrcPath, 'scripts.md'),
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

fs.writeFileSync(path.join(resourcesPath, 'resources.js'), `
var resourcesList = ${JSON.stringify(resoucesList)}`)


// delete old cache file
let resourceFiles = fs.readdirSync(resourcesPath)
for (resf of resourceFiles) {
    if (resf.startsWith('cache') && resf !== cacheFileName)
        fs.unlinkSync(path.join(resourcesPath, resf), (err) => {
            if (err) throw err;
            console.log(resf, ' has been deleted.')
        })
}