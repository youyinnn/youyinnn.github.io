const fs = require('fs')
const path = require('path')
const wordsegmentation = require('./wordsegmentation')

const {
    crc32
} = require('crc')

let postspath = path.join(__dirname, '..', '_posts')
let postfilenames = fs.readdirSync(postspath)

const tokws = wordsegmentation.rawStringToKeywords
const tokwsfs = wordsegmentation.rawStringToKeywordsForSearch

function getRecords(handle) {
    var records = []
    for (pn of postfilenames) {
        let raw = fs.readFileSync(path.join(postspath, pn), {
            encoding: 'utf-8'
        })
        records.push({
            objectID: crc32(pn).toString(36),
            title: pn,
            keywords: handle(raw),
        })
    }
    return records
}

function getKeywordRecords() {
    return getRecords(tokws)
}

function getSearchKeywordRecords() {
    return getRecords(tokwsfs)
}

// For the default version
const algoliasearch = require('algoliasearch');

function saveAllRecords(set) {
    let records = getKeywordRecords()
    let client
    let index
    client = algoliasearch(set.appId, set.apiKey)
    client.listIndices().then(({
        items
    }) => {
        if (items.find(i => i.name === set.index) !== undefined) {
            index = client.initIndex(set.index);
            index.saveObjects(records).then(({
                objectIDs
            }) => {
                console.log(JSON.stringify({
                    code: 'succeeded',
                    objectIDs: objectIDs
                }))
            }).catch(function(err) {
                console.error(JSON.stringify({
                    code: 'failed',
                    error: err
                }))
            })
        } else {
            console.error(JSON.stringify({
                code: 'failed',
                error: {
                    name: 'IndexError',
                    message: 'No Such Index In Your Application'
                }
            }))
        }
    }).catch(function(err) {
        console.error(JSON.stringify({
            code: 'failed',
            error: err
        }))
    })
}

if (process.argv.length > 2) {
    saveAllRecords({
        appId: process.argv[2],
        apiKey: process.argv[3],
        index: process.argv[4],
    })
}

module.exports.getKeywordRecords = getKeywordRecords
module.exports.getSearchKeywordRecords = getSearchKeywordRecords