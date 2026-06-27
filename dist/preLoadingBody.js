function setBodyCss() {
  const initialCurrentThemeConfig = localStorage.getItem(
    "__currentThemeConfig"
  );
  const currentThemeConfig = JSON.parse(initialCurrentThemeConfig);
  const before = document.getElementById("preLoadingBodyCssElement");
  if (before !== null) before.remove();
  const preLoadingBodyCssElement = document.createElement("style");
  preLoadingBodyCssElement.id = "preLoadingBodyCssElement";
  preLoadingBodyCssElement.innerHTML = `
    body {
      transition: none !important;
      position: absolute !important;
      margin: auto !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      background-color: rgb(24, 24, 28) !important;
    }
    `;
  if (initialCurrentThemeConfig !== null) {
    if (!currentThemeConfig.darkTheme) {
      preLoadingBodyCssElement.innerHTML = `
        body {
          transition: none !important;
          position: absolute !important;
          margin: auto !important;
          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          background-color: white !important;
        }
      `;
    }
  }
  const ref = document.getElementById("preLoadingJs");
  insertAfter(ref, preLoadingBodyCssElement);

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}

setBodyCss();

try {
  module.exports.setBodyCss = setBodyCss;
} catch (error) {
  //
}
