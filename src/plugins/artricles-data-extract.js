const yaml = require("js-yaml");

let shortMsgLine = 10;
function syncreihandle2metadata(text) {
  let endIndex = text.indexOf("---", 3) + 3;
  let metadata = text.substring(4, endIndex - 3);
  metadata = yaml.load(metadata);
  let body = text.substring(endIndex, text.length);
  metadata.char_count = body.length;
  // eslint-disable-next-line no-unused-vars
  let shortContent = "";
  if (body.trim().length > 0) {
    let short = new Array();
    body = body.split(/\n/);
    for (let i = 0; i < shortMsgLine; i++) {
      short.push(body[i]);
    }
    while (short[0] === "\n") {
      short.shift();
    }
    let codePareCount = 0;
    let startPreIndex = -1;
    let endPreIndex = -1;
    for (let j = 0; j < short.length; j++) {
      if (short[j].search("```") === 0) {
        codePareCount++;
      }
      let presi = short[j].search("<pre");
      let preei = short[j].search("</pre");
      startPreIndex = presi !== -1 ? presi : startPreIndex;
      endPreIndex = preei !== -1 ? preei : endPreIndex;
      shortContent += short[j];
      shortContent += "\n";
    }
    if (codePareCount % 2 !== 0) {
      shortContent += "```";
      shortContent += "\n";
    }
    if (startPreIndex !== -1 && endPreIndex < startPreIndex) {
      for (let i = shortMsgLine; endPreIndex < startPreIndex; i++) {
        if (i == 35) {
          shortContent += "</pre>";
          shortContent += "\n";
          break;
        }
        endPreIndex = body[i].search("</pre");
        shortContent += body[i];
        shortContent += "\n";
      }
    }
  }
  // metadata.short_content = shortContent.replace(/!\[.*\]\(.*\)/gm, '')
  return metadata;
}

function extract(sourceMdStr) {
  let metadata = syncreihandle2metadata(sourceMdStr);
  let endIndex = sourceMdStr.indexOf("---", 3) + 3;
  let body = sourceMdStr.substring(endIndex, sourceMdStr.length);
  return {
    metadata: metadata,
    body: body,
  };
}

module.exports.extract = extract;
