const fs = require('fs')
const path = require('path')
const marked = require('marked')

let postsPath = path.join(__dirname, '..', '_posts')
let publicPath = path.join(__dirname, '..')

function file2file(set) {
    let sourceStr = fs.readFileSync(set.sourceFile, {
        encoding: 'utf-8'
    })
    sourceStr = set.handleFunc(sourceStr)
    fs.writeFileSync(set.outputFile, sourceStr, {
        encoding: 'utf-8'
    })
}

function md2htm(set) {
    file2file({
        sourceFile: set.mdFile,
        outputFile: set.outputFile,
        handleFunc: marked
    })
}

// articles 2 htm
let postsrs = fs.readdirSync(postsPath)
for (pname of postsrs) {
    md2htm({
        mdFile: path.join(postsPath, pname),
        outputFile: path.join(publicPath, 'articles', pname.split('.')[0] + '\.htm')
    })
}

let resourcesPath = path.join(__dirname, '..', 'resources')
let websrcPath = path.join(__dirname, '..', '_websrc')

// about
md2htm({
    mdFile: path.join(websrcPath, 'about.md'),
    outputFile: path.join(__dirname, '..', 'about', 'index.html')
})

// resume
md2htm({
    mdFile: path.join(websrcPath, 'resume.md'),
    outputFile: path.join(__dirname, '..', 'resume', 'index.html')
})

// scripts
md2htm({
    mdFile: path.join(websrcPath, 'scripts.md'),
    outputFile: path.join(__dirname, '..', 'scripts', 'index.html')
})

// todos
md2htm({
    mdFile: path.join(websrcPath, 'todos.md'),
    outputFile: path.join(__dirname, '..', 'todos', 'index.html')
})

// firends link
file2file({
    sourceFile: path.join(websrcPath, 'friendslink.json'),
    outputFile: path.join(resourcesPath, 'friendslink.js'),
    handleFunc: function (src) {
        return `var friendslink = ${src}`
    }
})