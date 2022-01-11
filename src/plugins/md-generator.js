/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const marked = require("../../node_modules/marked");
const { crc32 } = require("../../node_modules/crc");
const dayjs = require("../../node_modules/dayjs");
const { EmojiConvertor } = require("../../node_modules/emoji-js");
const katex = require("../../node_modules/katex");
const htmlparser2 = require("../../node_modules/htmlparser2");

const articleDataExtract = require("./artricles-data-extract");
const tocExtractor = require("./toc-extractor");
const { gen } = require("./list-code-theme-css-file");
const { toBinary } = require("./binary-base64-encoder");

let postsPath = path.join(__dirname, "..", "assets/_posts");

// Get reference
const renderer = new marked.Renderer();

marked.setOptions({
  renderer: renderer,
  headerIds: true,
  highlight: function (code, lang) {
    const hljs = require("highlight.js");
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

// Override function
renderer.html = renderer.text = function (text) {
  // convert emoji
  let emojis = text.match(/:[A-z]+[-|_]?[A-z|0-9]+:/gm);
  if (emojis !== null) {
    emojis.forEach((ej) => {
      let splitors = text.split(ej);
      text = splitors.join(emoji.replace_colons(ej));
    });
  }

  // render {% cq %} {% endcq %}
  text = text.replace(
    /\{% *cq *%\}/gm,
    '<div class="saying mb-4"><div class="saying-quote saying-left-quote">“</div><div class="saying-quote saying-right-quote">”</div>'
  );
  text = text.replace(/\{% *endcq *%\}/gm, "</div>");
  return text;
};

function md2html(sourceFilePath, outputFilePath, sourceMdStrHandleFunc) {
  let sourceMdStr = fs.readFileSync(sourceFilePath, {
    encoding: "utf-8",
  });

  if (sourceMdStrHandleFunc !== undefined) {
    sourceMdStr = sourceMdStrHandleFunc(sourceMdStr);
  }

  sourceMdStr = blockKatexRendering(sourceMdStr);
  // marked parse
  let htmlStr = marked.parse(sourceMdStr);

  htmlStr = inlineKatexRendering(htmlStr);

  if (htmlStr.match("KaTeX parse error")) {
    console.log("Katex parse error on: " + sourceFilePath);
  }

  var hMap;
  hMap = tocExtractor.read(sourceFilePath, htmlStr);
  if (hMap !== null) {
    fs.writeFileSync(outputFilePath + ".toc.json", JSON.stringify(hMap), {
      encoding: "utf-8",
    });
  }

  // if (htmlStr.indexOf("<code>")) {
  //   console.warn(
  //     "Code blocks without language specifying found at: " + sourceFilePath
  //   );
  // }

  fs.writeFileSync(outputFilePath, htmlStr, {
    encoding: "utf-8",
  });

  return hMap;
}

function blockKatexRendering(htmlStr) {
  // katex rendering
  htmlStr = htmlStr.replace(/&amp;/g, "&");
  // htmlStr = htmlStr.replace(/&&/g, "&");
  let crossLineRegex = /(^\$\$|^> \$\$)[^$]*\$\$$/gm;
  let inp = htmlStr.match(crossLineRegex);
  while (inp !== null) {
    let e = htmlStr.match(crossLineRegex)[0];
    let exp =
      e[0] === ">"
        ? e.substring(6, e.length - 4)
        : e.substring(2, e.length - 2);

    let ehtml =
      (e[0] === ">" ? ">" : "") +
      '<div class="katex-display katexp" katex-exp="' +
      toBinary(exp) +
      '">' +
      katex.renderToString(exp, {
        displayMode: true,
        throwOnError: false,
        output: "html",
        // ignore chinese charactor
        strict: false,
      }) +
      "</div>";
    htmlStr = htmlStr.replace(inp[0], ehtml);
    inp = htmlStr.match(crossLineRegex);
  }
  return htmlStr;
}

function inlineKatexRendering(htmlStr) {
  const dom = htmlparser2.parseDocument(htmlStr);
  const els = htmlparser2.DomUtils.filter(
    (node) => {
      return (
        node.data !== undefined && RegExp(/\$[^$]*\$/, "gm").test(node.data)
      );
    },
    dom,
    true
  );
  let find = [];
  for (let textEl of els) {
    if (RegExp(/\$[^$]*\$/, "gm").test(textEl.data)) {
      let currentEl = textEl;
      let upperParent = currentEl.parent;
      let inCode = false;
      while (upperParent.name !== undefined) {
        if (upperParent.name === "code") {
          inCode = true;
        }
        currentEl = upperParent;
        upperParent = currentEl.parent;
      }
      if (!inCode) {
        find.push(textEl);
      }
    }
  }
  const replaceMap = [];
  for (let el of find) {
    const dataBefore = el.data;
    const match = [...dataBefore.matchAll(/\$[^$]*\$/gm)];
    for (let mc of match) {
      let mcText = mc[0];
      let exp = mcText.substring(1, mcText.length - 1).trim();
      let ehtml =
        '<span class="" katex-exp="' +
        toBinary(exp) +
        '">' +
        katex.renderToString(exp, {
          throwOnError: false,
          output: "html",
          strict: false,
        }) +
        "</span>";
      replaceMap.push({
        before: mcText,
        after: ehtml,
      });
    }
  }
  for (let rp of replaceMap) {
    htmlStr = htmlStr.replace(rp.before, rp.after);
  }
  return htmlStr;
}

// articles 2 htm
let postsrs = fs.readdirSync(postsPath);
let articlesMetadata = new Array();
let allSeries = new Array();
let articlesOrder = new Array();

var emoji;
emoji = new EmojiConvertor();
emoji.init_env();
emoji.replace_mode = "unified";
emoji.allow_native = true;

// iterating md files
for (let pname of postsrs) {
  let abbrlink = crc32(pname).toString(36);
  const hMap = md2html(
    path.join(postsPath, pname),
    path.join(process.cwd(), "public", "assets", "articles", abbrlink + ".htm"),
    function (sourceMdStr) {
      let data = articleDataExtract.extract(sourceMdStr);
      // data.metadata.short_content = marked.parse(data.metadata.short_content);
      data.metadata.abbrlink = abbrlink;
      if (data.metadata.series !== undefined) {
        let seriesForThisArticles;
        for (let j = 0; j < allSeries.length; j++) {
          if (allSeries[j].se === data.metadata.series)
            seriesForThisArticles = allSeries[j].ps;
        }
        if (seriesForThisArticles === undefined) {
          let item = {};
          item.se = data.metadata.series;
          item.ps = seriesForThisArticles = [];
          allSeries.push(item);
        }
        let ss =
          data.metadata.title +
          "===" +
          abbrlink +
          "===" +
          new Date(data.metadata.date).getTime();
        seriesForThisArticles.unshift(ss);
      }
      articlesMetadata.push(data.metadata);
      return data.body;
    }
  );
  for (let metadata of articlesMetadata) {
    if (metadata.abbrlink === abbrlink) {
      metadata.hasToc = hMap !== null;
    }
  }
}

// sort metadata with date
articlesMetadata = articlesMetadata.sort((a, b) => {
  return dayjs(a.date).isBefore(b.date) ? 1 : -1;
});

for (let m of articlesMetadata) {
  articlesOrder.push(m.title + "<=>" + m.abbrlink);
}

for (let ss of allSeries) {
  ss.ps = ss.ps.sort((a, b) => {
    return Number(a.split("===")[2]) - Number(b.split("===")[2]);
  });
}

let websrcPath = path.join(__dirname, "..", "assets/_websrc");

// about
md2html(
  path.join(websrcPath, "about.md"),
  path.join(process.cwd(), "public", "assets", "about", "index.htm")
);

// scripts
var scriptsDir = fs.readdirSync(path.join(websrcPath, "scripts"));
var scriptsMds = {};
for (let md of scriptsDir) {
  if (md.endsWith(".md")) {
    const mdAbbrlink = crc32(md).toString(16);
    scriptsMds[md.split(".md")[0]] = mdAbbrlink;
    let sourceStr = fs.readFileSync(path.join(websrcPath, "scripts", md), {
      encoding: "utf-8",
    });

    sourceStr = blockKatexRendering(sourceStr);

    let htmlStr = marked.parse(sourceStr);

    htmlStr = inlineKatexRendering(htmlStr);

    if (htmlStr.match("KaTeX parse error")) {
      console.log("Katex parse error on: " + md);
    }

    const hMap = tocExtractor.read(md, htmlStr);
    if (hMap !== null) {
      fs.writeFileSync(
        path.join(
          process.cwd(),
          "public",
          "assets",
          "scripts",
          mdAbbrlink + ".htm.toc.json"
        ),
        JSON.stringify(hMap),
        {
          encoding: "utf-8",
        }
      );
    }
    fs.writeFileSync(
      path.join(
        process.cwd(),
        "public",
        "assets",
        "scripts",
        mdAbbrlink + ".htm"
      ),
      htmlStr,
      {
        encoding: "utf-8",
      }
    );
  }
}

allSeries = JSON.stringify(allSeries);
articlesMetadata = JSON.stringify(articlesMetadata);
articlesOrder = JSON.stringify(articlesOrder);
scriptsMds = JSON.stringify(scriptsMds);

let resourcesPath = path.join(__dirname, "..", "assets/resources");

// write cache.js file
let cacheFileName = `cache-${crc32(new Date().toString()).toString(36)}.js`;
fs.writeFileSync(
  path.join(resourcesPath, cacheFileName),
  `
    console.log('Loading cache: ${cacheFileName}')
    sessionStorage.setItem('postSeries', ${JSON.stringify(allSeries)});
    sessionStorage.setItem('postMetadata', ${JSON.stringify(articlesMetadata)});
    sessionStorage.setItem('postOrder', ${JSON.stringify(articlesOrder)});
    sessionStorage.setItem('scriptsMds', ${JSON.stringify(scriptsMds)});
`
);

// delete old cache file
let resourceFiles = fs.readdirSync(resourcesPath);
for (let resf of resourceFiles) {
  if (resf.startsWith("cache") && resf !== cacheFileName)
    fs.unlinkSync(path.join(resourcesPath, resf), (err) => {
      if (err) throw err;
      console.log(resf, " has been deleted.");
    });
}

var resoucesList = [cacheFileName, gen()];

fs.writeFileSync(
  path.join(resourcesPath, "resources.js"),
  `/* eslint-disable no-unused-vars */
var resourcesList = ${JSON.stringify(resoucesList)};
module.exports.list = resourcesList
  `
);

exit(0);

// resume
md2html(
  path.join(websrcPath, "resume.md"),
  path.join(__dirname, "..", "resume", "index.html")
);

// todos
md2html(
  path.join(websrcPath, "todos.md"),
  path.join(__dirname, "..", "todos", "index.html")
);
