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
renderer.text = function (text) {
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
let articlemetadata = new Array()
let series = new Array()
let articleorder = new Array()
let shortmsgline = 25
// iterating md files
for (pname of postsrs) {
    let abbrlink = crc32(pname).toString(36)
    md2html(
        path.join(postsPath, pname),
        path.join(__dirname, '..', 'article', abbrlink + '.html'),
        function(sourceMdStr) {
            sourceMdStr = sourceMdStr.replace('---', `---\nabbrlink: ${abbrlink}`)
            let metadata = syncreihandle2metadata(sourceMdStr)
            articlemetadata.push(metadata)
            let pseriesname = metadata.series
            if (pseriesname !== undefined) {
                let pseries
                for (let j = 0; j < series.length; j++) {
                    if (series[j].se === pseriesname)
                        pseries = series[j].ps
                }
                if (pseries === undefined) {
                    let item = new Object()
                    item.se = pseriesname
                    item.ps = pseries = new Array()
                    series.push(item)
                }
                let ss = metadata.title + '===' + abbrlink
                pseries.unshift(ss)
            }
            let endindex = sourceMdStr.indexOf('---', 3) + 3
            let body = sourceMdStr.substring(endindex, sourceMdStr.length)
            return body
        }
    )
}

// sort metadata with date
articlemetadata = articlemetadata.sort((a, b) => {
    return dayjs(a.date).isBefore(b.date) ? 1 : -1
})

for (m of articlemetadata) {
    articleorder.push(m.title + '<=>' + m.abbrlink)
}

series = yaml.dump(series.reverse())
articlemetadata = yaml.dump(articlemetadata)

function syncreihandle2metadata(text) {
    let endindex = text.indexOf('---', 3) + 3
    let metadata = text.substring(4, endindex - 3)
    metadata = yaml.load(metadata)
    let body = text.substring(endindex, text.length)
    metadata.char_count = body.length
    let short = new Array()
    body = body.split(/\n/)
    for (let i = 0; i < shortmsgline; i++) {
        short.push(body[i])
    }
    while (short[0] === '\n') {
        short.shift()
    }
    let shortcontant = ''
    let codeparecount = 0
    let startpreindex = -1
    let endpreindex = -1
    for (let j = 0; j < short.length; j++) {
        if (short[j].search('```') === 0) {
            codeparecount++
        }
        let presi = short[j].search('<pre')
        let preei = short[j].search('</pre')
        startpreindex = presi !== -1 ? presi : startpreindex
        endpreindex = preei !== -1 ? preei : endpreindex
        shortcontant += short[j]
        shortcontant += '\n'
    }
    if (codeparecount % 2 !== 0) {
        shortcontant += '```'
        shortcontant += '\n'
    }
    if (startpreindex !== -1 && endpreindex < startpreindex) {
        for (let i = shortmsgline; endpreindex < startpreindex; i++) {
            if (i == 35) {
                shortcontant += '</pre>'
                shortcontant += '\n'
                break
            }
            endpreindex = body[i].search('</pre')
            shortcontant += body[i]
            shortcontant += '\n'
        }
    }
    metadata.short_contant = marked(shortcontant.replace(/!\[.*\]\(.*\)/gm, ''), {
        gfm: true,
        breaks: true,
        renderer: renderer
    })
    return metadata
}

let resourcesPath = path.join(__dirname, '..', 'resources')
let websrcPath = path.join(__dirname, '..', '_websrc')
fs.writeFileSync(path.join(resourcesPath, 'cache.js'), `
    console.log('Cached file version: ${new Date().toString()})
    sessionStorage.setItem('pseries', ${JSON.stringify(series)});
    sessionStorage.setItem('pcbl', ${JSON.stringify(articlemetadata)});
    sessionStorage.setItem('pod', ${JSON.stringify(articleorder.join('>--<'))});
`)
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
md2html(
    path.join(websrcPath, 'scripts.md'),
    path.join(__dirname, '..', 'scripts', 'index.html')
)

// todos
md2html(
    path.join(websrcPath, 'todos.md'),
    path.join(__dirname, '..', 'todos', 'index.html')
)

// firends link
file2file({
    sourceFilePath: path.join(websrcPath, 'friendslink.json'),
    outputFilePath: path.join(resourcesPath, 'friendslink.js'),
    handleFunc: function(src) {
        return `var friendslink = ${src}`
    }
})