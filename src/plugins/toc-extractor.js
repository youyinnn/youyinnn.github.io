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
    for (let f of found) {
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
        content: htmlparser2.DomUtils.textContent(htmlparser2.parseDocument(f)),
      });
    }
    return toc;
  }
  return null;
}

module.exports.read = read;
