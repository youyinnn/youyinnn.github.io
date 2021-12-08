/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const yaml = require("js-yaml");
const { crc32 } = require("crc");
const dayjs = require("dayjs");
const { EmojiConvertor } = require("emoji-js");
const articleDataExtract = require("./artricles-data-extract");
const { exit } = require("process");

let postsPath = path.join(__dirname, "..", "assets/_posts");
// let htmlPath = path.join(__dirname, "..", "..", "/public/md.tmp");

// Get reference
const renderer = new marked.Renderer();

marked.setOptions({
  renderer: renderer,
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
renderer.heading = function (text, level) {
  if (text.search("<a") > 0 || text.startsWith("<a")) {
    text = text.replace(/<a href=".*">|<\/a>|<code>|<\/code>/g, "");
  }
  let hid = crc32(text + level).toString(16);
  return `
          <h${level} id="${hid}">${text}</h${level}>`;
};
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
  let htmlStr = marked.parse(sourceMdStr);
  fs.writeFileSync(outputFilePath, htmlStr, {
    encoding: "utf-8",
  });
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
  md2html(
    path.join(postsPath, pname),
    path.join(__dirname, "..", "assets", "articles", abbrlink + ".html"),
    function (sourceMdStr) {
      let data = articleDataExtract.extract(sourceMdStr);
      data.metadata.short_content = marked.parse(data.metadata.short_content);
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

allSeries = JSON.stringify(allSeries);
articlesMetadata = JSON.stringify(articlesMetadata);
articlesOrder = JSON.stringify(articlesOrder);

let resourcesPath = path.join(__dirname, "..", "assets/resources");

let cacheFileName = `cache-${crc32(new Date().toString()).toString(36)}.js`;

fs.writeFileSync(
  path.join(resourcesPath, cacheFileName),
  `
    sessionStorage.setItem('postSeries', ${JSON.stringify(allSeries)});
    sessionStorage.setItem('postMetadata', ${JSON.stringify(articlesMetadata)});
    sessionStorage.setItem('postOrder', ${JSON.stringify(articlesOrder)});
`
);

var resoucesList = [cacheFileName];

fs.writeFileSync(
  path.join(resourcesPath, "resources.js"),
  `/* eslint-disable no-unused-vars */
var resourcesList = ${JSON.stringify(resoucesList)};
module.exports.list = resourcesList
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

exit(0);

let websrcPath = path.join(__dirname, "..", "_websrc");

// about
md2html(
  path.join(websrcPath, "about.md"),
  path.join(__dirname, "..", "about", "index.html")
);

// resume
md2html(
  path.join(websrcPath, "resume.md"),
  path.join(__dirname, "..", "resume", "index.html")
);

// scripts
var scriptsDir = fs.readdirSync(path.join(websrcPath, "scripts"));
var scriptsMds = [];
var scriptsHeaderMd = "";
for (let md of scriptsDir) {
  if (md.endsWith(".md")) {
    scriptsMds.push(path.join(websrcPath, "scripts", md));
    let sourceStr = fs.readFileSync(path.join(websrcPath, "scripts", md), {
      encoding: "utf-8",
    });
    let headerMatch = sourceStr.match(/^#{1,6}\s.*/gm);
    for (let h of headerMatch) {
      scriptsHeaderMd += h + "\r\n";
    }
    let name = escapeHtml(path.basename(md.substring(0, md.length - 3))) + "2";
    let htmlStr = marked(sourceStr, {
      gfm: true,
      breaks: true,
      renderer: renderer,
    });
    htmlStr = htmlStr.replace(/<\/h3>/g, '</h3><sb class="hide-script-block">');
    htmlStr = htmlStr.replace(/<h3 /g, '</sb><h3 class="zip-tran"');
    htmlStr = htmlStr.replace(/<h2 /g, '<h2 class="zip-tran"');
    htmlStr = htmlStr.replace(/<\/sb>/, "");
    htmlStr += "</sb>";
    fs.writeFileSync(
      path.join(__dirname, "..", "scripts", crc32(name).toString(16) + ".htm"),
      htmlStr,
      {
        encoding: "utf-8",
      }
    );
  }
}
function escapeHtml(string) {
  var matchHtmlRegExp = /["'&<>]/;
  var str = "" + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = "";
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = "&quot;";
        break;
      case 38: // &
        escape = "&amp;";
        break;
      case 39: // '
        escape = "&#39;";
        break;
      case 60: // <
        escape = "&lt;";
        break;
      case 62: // >
        escape = "&gt;";
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

var scriptsHeaderHtml = marked(scriptsHeaderMd, {
  gfm: true,
  breaks: true,
  renderer: renderer,
});

// let htmls = html.split("{{% md %}}");

// fs.writeFileSync(
//   path.join(__dirname, "..", "scripts", "index.html"),
//   htmls[0] + scriptsHeaderHtml + htmls[1],
//   {
//     encoding: "utf-8",
//   }
// );

// todos
md2html(
  path.join(websrcPath, "todos.md"),
  path.join(__dirname, "..", "todos", "index.html")
);
