function routeElements(elements) {
  for (let imgEl of elements) {
    //   just route img src on this site
    if (imgEl.outerHTML.indexOf("../../../public/img/") !== -1) {
      const split = imgEl.src.split("/");
      imgEl.src = route(split[split.length - 1]);
    }
  }
}

function route(filename) {
  return process.env.NODE_ENV === "production"
    ? `https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/public/img/${filename}`
    : `/img/${filename}`;
}

module.exports.routeElements = routeElements;
