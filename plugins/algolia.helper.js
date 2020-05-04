const fs = require('fs')
const path = require('path')
const wordsegmentation = require('./wordsegmentation')

const {
    crc32
} = require('crc')
const dayjs = require('dayjs')

let postspath = path.join(__dirname, '..', '_posts')
let postfilenames = fs.readdirSync(postspath)

const tokws = wordsegmentation.rawStringToKeywords

let records = []
for (pn of postfilenames) {
    let raw = fs.readFileSync(path.join(postspath, pn), {
        encoding: 'utf-8'
    })
    records.push({
        objectID: crc32(pn).toString(36),
        title: pn,
        keywords: tokws(raw),
    })
}

// For the default version
const algoliasearch = require('algoliasearch');

function saveAllRecords(set) {
    const client = algoliasearch(set.appId, set.apiKey);
    const index = client.initIndex(set.index);

    index.saveObjects(records).then(({
        objectIDs
    }) => {
        return {
            code: 'success',
            objectIDs: objectIDs
        }
    }).catch(function(err) {
        return {
            code: 'error',
            err: err
        }
    })
}

module.exports.saveAllRecords = saveAllRecords