const algoliaHelper = require('./algolia.helper')
const fs = require('fs');
const path = require('path');

let rs = algoliaHelper.getKeywordRecords()

fs.writeFileSync('./tmp/records.json', JSON.stringify(rs))