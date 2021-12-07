const nodejieba = require("nodejieba")
const fs = require('fs')
const path = require('path')

let extradictpath = path.join(__dirname, 'dict')

nodejieba.load({
    userDict: path.join(extradictpath, 'THUOCL_it.txt')
})

nodejieba.load({
    userDict: path.join(extradictpath, 'juejin-tags.txt')
})


const cnign = fs.readFileSync(path.join(extradictpath, 'cn.ign'), {encoding: 'utf-8'})
const enign = fs.readFileSync(path.join(extradictpath, 'en.ign'), {encoding: 'utf-8'})
const cnignSet = new Set(cnign.split('\n'))
const enignSet = new Set(enign.split('\n'))

function handleRaw(raw) {
    return raw.replace(/([-:\r\n#。，,？?\/\\*<>《》()（）\[\]：‘’“”''"+=`·~!！@$￥%\^……&{}|;\s、【】——])/gm, ' ')
}

function rawStringToKeywords(raw) {
    raw = handleRaw(raw)
    // let rs = nodejieba.cutForSearch(raw, false)
    let rs = nodejieba.extract(raw, 500)
    let newrs = []
    for (rss of rs) {
        if (!cnignSet.has(rss.word) && !enignSet.has(rss.word.toLowerCase())) {
            newrs.push(rss.word)
        }
    }
    return newrs
}

function rawStringToKeywordsForSearch(raw) {
    raw = handleRaw(raw)
    let rs = nodejieba.cut(raw, false)
    let newrs = new Set()
    for (rss of rs) {
        if (!cnignSet.has(rss) && !enignSet.has(rss.toLowerCase())) {
            newrs.add(rss)
        }
    }
    return Array.from(newrs)
}

module.exports.rawStringToKeywords = rawStringToKeywords
module.exports.rawStringToKeywordsForSearch = rawStringToKeywordsForSearch