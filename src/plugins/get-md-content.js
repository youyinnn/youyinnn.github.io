const axios = require("axios");

const preFix =
  process.env.NODE_ENV === "production"
    ? `https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/public/`
    : ``;

async function getContent(path, fileName, thiz) {
  try {
    const url = `${preFix}/assets/${path}/${fileName}.htm`;
    const response = await axios.get(url);
    thiz.content = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getToc(path, fileName, thiz) {
  try {
    const url = `${preFix}/assets/${path}/${fileName}.htm.toc.json`;
    const response = await axios.get(url);
    thiz.toc = response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports.getContent = getContent;
module.exports.getToc = getToc;
