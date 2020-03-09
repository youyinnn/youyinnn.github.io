const fs = require('fs')
const path = require('path')
const marked = require('marked')

let postsPath = path.join(__dirname, '..', '_posts')
let htmlPath = path.join(__dirname, '..', 'index.html')

var html = undefined

function file2file(set) {
    let sourceStr = fs.readFileSync(set.sourceFilePath, {
        encoding: 'utf-8'
    })
    fs.writeFileSync(set.outputFilePath, set.handleFunc(sourceStr), {
        encoding: 'utf-8'
    })
}

function md2html(sourceFilePath, outputFilePath) {
    let sourceMdStr = fs.readFileSync(sourceFilePath, {
        encoding: 'utf-8'
    })
    if (html === undefined) {
        html = fs.readFileSync(htmlPath, {
            encoding: 'utf-8'
        })
    }
    let mdStr = marked(sourceMdStr, {
        gfm: true,
        breaks: true
    })
    fs.writeFileSync(outputFilePath, html.replace(/\{\{\% md \%\}\}/, mdStr), {
        encoding: 'utf-8'
    })
}

// articles 2 htm
let postsrs = fs.readdirSync(postsPath)
for (pname of postsrs) {
    
}

let resourcesPath = path.join(__dirname, '..', 'resources')
let websrcPath = path.join(__dirname, '..', '_websrc')

// about
md2html(
    path.join(websrcPath, 'about.md'),
    path.join(__dirname, '..','about', 'index.html')
)

// resume
md2html(
    path.join(websrcPath, 'resume.md'),
    path.join(__dirname, '..','resume', 'index.html')
)

// scripts


// todos


// firends link
file2file({
    sourceFilePath: path.join(websrcPath, 'friendslink.json'),
    outputFilePath: path.join(resourcesPath, 'friendslink.js'),
    handleFunc: function (src) {
        return `var friendslink = ${src}`
    }
})
