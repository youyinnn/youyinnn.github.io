const initialCurrentThemeConfig = localStorage.getItem("__currentThemeConfig");
const before = document.getElementById("preLoadingBodyCssElement");
if (before !== null) before.remove();
const preLoadingBodyCssElement = document.createElement("style");
// preLoadingBodyCssElement.type = "text/css";
preLoadingBodyCssElement.id = "preLoadingBodyCssElement";
if (initialCurrentThemeConfig !== null) {
  const currentThemeConfig = JSON.parse(initialCurrentThemeConfig);
  if (currentThemeConfig.darkTheme) {
    preLoadingBodyCssElement.innerHTML = `
        body {
          position: absolute !important;
          margin: auto !important;
          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          background-color: rgb(24, 24, 28) !important;
        }
      `;
  } else {
    preLoadingBodyCssElement.innerHTML = `
        body {
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
  const ref = document.getElementById("preLoadingJs");
  //   headEl.appendChild(preLoadingBodyCssElement);
  insertAfter(ref, preLoadingBodyCssElement);
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
