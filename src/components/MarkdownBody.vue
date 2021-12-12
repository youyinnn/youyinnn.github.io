<script>
/* eslint-disable no-unused-vars */
import imgRouter from "@/plugins/img-router.js";
import failedToLoadImg from "/public/img/failed-to-load.png";
import { h, createApp } from "vue";
import { NImage, NEl } from "naive-ui";

export default {
  components: {
    failedToLoadImg,
  },
  render() {
    return h(NEl, {
      id: "md",
      class: this.mdClass,
      key: this.key,
    });
  },
  props: ["content", "class", "key"],
  mounted: function () {
    this.renderMd(this.content);
  },
  watch: {
    //   when the content is load
    content: function (nV) {
      this.renderMd(nV);
    },
  },
  computed: {
    mdClass: function () {
      if (this.class !== null && this.class !== undefined) {
        return this.class;
      }
      return "article markdown-body editormd-html-preview animate__animated animate__fadeIn";
    },
  },
  methods: {
    imgReplacement(innerHTML) {
      innerHTML = innerHTML.replaceAll(
        "<img",
        `<n-image fallback-src="${failedToLoadImg}"`
      );
      var unhandleImageTagStart = innerHTML.indexOf("<n-image");
      const unhandleImageTagStringList = [];
      while (unhandleImageTagStart !== -1) {
        var unhandleImageTagEnd = innerHTML.indexOf(
          '">',
          unhandleImageTagStart + 8
        );
        unhandleImageTagStringList.push(
          innerHTML.substring(unhandleImageTagStart, unhandleImageTagEnd + 2)
        );
        unhandleImageTagStart = innerHTML.indexOf(
          "<n-image",
          unhandleImageTagEnd + 2
        );
      }
      for (let item of unhandleImageTagStringList) {
        innerHTML = innerHTML.replaceAll(
          item,
          item.substring(0, item.length - 1) + "/>"
        );
      }
      return innerHTML;
    },
    codeNodeSetup(root) {
      while (root.getElementsByTagName("code").length > 0) {
        var nodes = root.getElementsByTagName("code");
        for (let node of nodes) {
          const nCodeEl = document.createElement("n-code");
          if (node.parentNode.nodeName === "P") {
            // inline code
            nCodeEl.setAttribute("inline", "");
          } else {
            //
            const classList = node.classList[0];
            if (classList !== undefined) {
              nCodeEl.setAttribute("language", classList.split("language-")[1]);
            }
          }
          console.log(node.innerHTML);
          console.log(node.innerText);
          nCodeEl.setAttribute("code", node.innerHTML);
          // nCodeEl.setAttribute("codee", node.innerHTML);
          node.parentNode.replaceChild(nCodeEl, node);
        }
      }
    },
    renderMd(c) {
      import(`@/assets/css/code/an-old-hope.css`);
      if (c === null) {
        return;
      }
      // pre route the img src before they actually render into the real dom
      const node = new DOMParser().parseFromString(c, "text/html");
      imgRouter.routeElements(node.getElementsByTagName("img"));
      var innerHTML = node.children[0].children[1].innerHTML;

      // replace img with n-image
      innerHTML = this.imgReplacement(innerHTML);

      // escape the brace for not leting the vue compile the {{}} syntax
      innerHTML = innerHTML.replaceAll("{", "&#123;");
      innerHTML = innerHTML.replaceAll("}", "&#125;");

      // render it
      const body = {
        template: innerHTML,
        components: {
          NImage,
        },
        data: () => ({}),
      };
      createApp(body).mount("#md");
    },
  },
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css");
@import url("@/assets/css/markdown-body.css");
.article-metadata {
  min-height: 90px;
}
.title {
  margin: 0;
  font-size: 25px;
}
.n-image {
  width: 100%;
}
img[data-error="true"] {
  width: 180px;
}
</style>
