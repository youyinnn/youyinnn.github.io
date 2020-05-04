const nodejieba = require("nodejieba");

const path = require('path')

let extradictpath = path.join(__dirname, 'dict')

nodejieba.load({
    userDict: path.join(extradictpath, 'THUOCL_it.txt')
})

nodejieba.load({
    userDict: path.join(extradictpath, 'juejin-tags.txt')
})

function rawStringToKeywords(raw) {
    raw = raw.replace(/([-:\r\n#。，,？?\/\\*<>《》()（）\[\]：‘’“”''"+=`·~!！@$￥%\^……&{}|;\s、【】——])/gm, ' ')
    // let rs = nodejieba.cutForSearch(raw, false)
    let rs = nodejieba.extract(raw, 300)
    let newrs = []
    for (rss of rs) {
        newrs.push(rss.word)
    }
    return newrs
}

module.exports.rawStringToKeywords = rawStringToKeywords