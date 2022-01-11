/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
const htmlparser2 = require("htmlparser2");

function read(sourceFilePath, htm) {
  // console.log("Read header for " + sourceFilePath);
  const reg = /<h[123456].*<\/h[123456]>/gm;
  const found = htm.match(reg);
  // console.log("Found : " + (found === null ? 0 : found.length) + " headers.");
  if (found !== null) {
    // const hMap = {};
    const toc = [];

    var firstLevel = 999;
    for (let f of found) {
      var level = Number(f.charAt(2));
      if (firstLevel === 999) firstLevel = level;
      const id = f
        .match(/id=".*"/gm)[0]
        .split('id="')[1]
        .split('"')[0];

      // const header1 = f.replace(/<h[123456]/gm, "<div");
      // const header2 = header1.replace(/<\/h[123456]/gm, "</div");
      // console.log(htmlparser2.parseDocument(f).children[0].children[0].data);
      // hMap[id] = header2;
      // hMap[id] = htmlparser2.parseDocument(f).children[0].children[0].data;
      // hMap[id] = htmlparser2.DomUtils.textContent(htmlparser2.parseDocument(f));
      // hMap[id] = htmlparser2.DomUtils.getInnerHTML(
      //   htmlparser2.parseDocument(f)
      // );
      toc.push({
        id,
        level,
        content: htmlparser2.DomUtils.textContent(htmlparser2.parseDocument(f)),
        child: [],
      });
    }
    const nonFlattenToc = [];
    for (let i = 0; i < toc.length; i++) {
      let t = toc[i];
      if (nonFlattenToc.length === 0) {
        nonFlattenToc.push(t);
      } else {
        // find current parent
        if (t.level === firstLevel) {
          nonFlattenToc.push(t);
        } else {
          for (let j = i - 1; j >= 0; j--) {
            let preT = toc[j];
            if (preT.level < t.level) {
              preT.child.push(t);
              break;
            }
          }
        }
      }
    }
    return nonFlattenToc;
  }
  return null;
}

module.exports.read = read;
