const fs = require("fs");
const { crc32 } = require("crc");
const path = require("path");

const assetsPath = path.join(__dirname, "..", "assets");
let resourcesPath = path.join(__dirname, "..", "assets/resources");

const cssFolderPath = fs.readdirSync(path.join(assetsPath, "css", "code"));

function gen() {
  const cssFileList = [];
  for (let cssFile of cssFolderPath) {
    if (cssFile.endsWith(".css")) {
      var name = cssFile.split(".css")[0];
      cssFileList.push(name);
    }
  }
  const cssFileName =
    "code-theme-css-" + crc32(JSON.stringify(cssFileList)).toString(16) + ".js";

  let resourceFiles = fs.readdirSync(resourcesPath);

  let shouldWrite = true;
  for (let resf of resourceFiles) {
    if (resf.startsWith("code-theme-css-")) {
      if (resf !== cssFileName) {
        fs.unlinkSync(path.join(resourcesPath, resf), (err) => {
          if (err) throw err;
          console.log(resf, " has been deleted.");
        });
        shouldWrite = true;
        break;
      } else {
        shouldWrite = false;
        break;
      }
    }
  }

  if (shouldWrite) {
    fs.writeFileSync(
      path.join(resourcesPath, cssFileName),
      `sessionStorage.setItem('codeThemeCss', ${JSON.stringify(
        JSON.stringify(cssFileList)
      )});`
    );
  }

  return cssFileName;
}

module.exports.gen = gen;
