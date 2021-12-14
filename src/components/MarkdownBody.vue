<script>
import imgRouter from "@/plugins/img-router.js";
import failedToLoadImg from "/public/img/failed-to-load.png";
import { h, createApp } from "vue";
import { NImage, NEl } from "naive-ui";

var app = null;

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
  mounted() {
    this.renderMd(this.content);
  },
  watch: {
    //   when the content is load
    content: function (nv) {
      this.renderMd(nv);
    },
    currentThemeConfig() {
      this.codeThemeCssSetup();
    },
  },
  computed: {
    mdClass: function () {
      if (this.class !== null && this.class !== undefined) {
        return this.class;
      }
      return "article markdown-body editormd-html-preview animate__animated animate__fadeIn";
    },
    currentThemeConfig() {
      return this.$store.state.currentThemeConfig;
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
    codeThemeCssSetup() {
      const before = document.getElementById("codeThemeCssLink");
      if (before !== null) before.remove();
      var codeCssEl = document.createElement("link");

      codeCssEl.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.3.1/styles/${this.$store.state.currentThemeConfig.codeTheme}.css`;
      codeCssEl.id = "codeThemeCssLink";
      codeCssEl.rel = "stylesheet";
      codeCssEl.type = "text/css";

      const headEl = document.getElementsByTagName("head")[0];
      headEl.appendChild(codeCssEl);
      return codeCssEl;
    },
    renderMd(c) {
      if (c === null) {
        return;
      }

      const codeCssEl = this.codeThemeCssSetup();

      // pre route the img src before they actually render into the real dom
      const node = new DOMParser().parseFromString(c, "text/html");

      // add style on inline code block
      const codeEls = node.getElementsByTagName("code");
      for (let el of codeEls) {
        if (el.parentNode.nodeName === "P") {
          el.classList = "hljs hljs-bullet";
        }
      }

      imgRouter.routeElements(node.getElementsByTagName("img"));
      var innerHTML = node.children[0].children[1].innerHTML;

      // replace img with n-image
      innerHTML = this.imgReplacement(innerHTML);

      // escape the brace for not leting the vue compile the {{}} syntax
      innerHTML = innerHTML.replaceAll("{", "&#123;");
      innerHTML = innerHTML.replaceAll("}", "&#125;");

      // add css on code block without language specifying
      innerHTML = innerHTML.replaceAll(
        "<pre><code>",
        `<pre><code class="hljs">`
      );

      // render it
      if (app !== null) {
        app.unmount();
      }
      const body = {
        template: innerHTML,
        components: {
          NImage,
          codeCssEl,
        },
        data: () => ({}),
      };
      app = createApp(body);
      app.mount("#md");

      const renderedImgEl = document.getElementsByClassName("n-image");
      for (let el of renderedImgEl) {
        if (el.style.length === 0) {
          el.style.width = "100%";
        }
      }
    },
  },
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css");
@import url("@/assets/css/markdown-body.css");
.title {
  margin: 0;
  font-size: 25px;
}
img[data-error="true"] {
  width: 180px;
}
</style>
