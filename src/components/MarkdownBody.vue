<script>
import imgRouter from "@/plugins/img-router.js";
import failedToLoadImg from "/public/img/failed-to-load.png";
import { h, createApp } from "vue";
import { NImage, NEl, NButton, NIcon } from "naive-ui";
import { CopySharp } from "@vicons/ionicons5";
import { toBinary, fromBinary } from "@/plugins/binary-base64-encoder.js";
// eslint-disable-next-line no-undef
var cbjs = ClipboardJS;
var clipboard = null;
var app = null;

import { useMessage } from "naive-ui";
import { defineComponent } from "vue";

// content
export default defineComponent({
  setup() {
    window.$message = useMessage();
  },
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
      return "article markdown-body editormd-html-preview";
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
    setupCopyElement(node) {
      const codeBlock = node.getElementsByTagName("code");
      const codeBlockFilter = [];
      for (let el of codeBlock) {
        if (el.parentNode.tagName === "PRE") {
          codeBlockFilter.push(el);
        }
      }
      // console.log(codeBlockFilter);
      for (let el of codeBlockFilter) {
        el.parentNode.style = "position: relative";
        el.parentNode.innerHTML =
          el.parentNode.innerHTML +
          `<n-button fromCode class="codeCopyBtn hideCodeCopyBtn" size="tiny" type="info" 
            data-clipboard-text="${toBinary(el.innerText)}">
            Copy
            <template #icon>
              <n-icon>
                <copy-sharp />
              </n-icon>
            </template>
          </n-button>`;
      }

      const katexBlock = node.getElementsByClassName("katexp");
      for (let el of katexBlock) {
        // console.log(fromBinary(el.getAttribute("katex-exp")));
        el.style = "position: relative";
        el.innerHTML =
          el.innerHTML +
          `<n-button class="codeCopyBtn hideCodeCopyBtn" size="tiny" type="info" 
            data-clipboard-text="${el.getAttribute("katex-exp")}">
            Copy
            <template #icon>
              <n-icon>
                <copy-sharp />
              </n-icon>
            </template>
          </n-button>`;
      }
    },
    setupCopyEvent() {
      const renderedCodePreEl = document.getElementsByTagName("pre");
      for (let el of renderedCodePreEl) {
        el.addEventListener("mouseover", () => {
          el.getElementsByClassName("codeCopyBtn")[0].classList.remove(
            "hideCodeCopyBtn"
          );
        });
        el.addEventListener("mouseout", () => {
          el.getElementsByClassName("codeCopyBtn")[0].classList.add(
            "hideCodeCopyBtn"
          );
        });
      }

      const renderedKatexBlockEl = document.getElementsByClassName("katexp");
      for (let el of renderedKatexBlockEl) {
        el.addEventListener("mouseover", () => {
          el.getElementsByClassName("codeCopyBtn")[0].classList.remove(
            "hideCodeCopyBtn"
          );
        });
        el.addEventListener("mouseout", () => {
          el.getElementsByClassName("codeCopyBtn")[0].classList.add(
            "hideCodeCopyBtn"
          );
        });
      }

      if (clipboard !== null) {
        clipboard.destroy();
      }
      clipboard = new cbjs(".codeCopyBtn", {
        text: function (trigger) {
          if (trigger.getAttribute("fromCode") === null) {
            window.$message.success("Katex Expression copied.");
          } else {
            window.$message.success("Code copied.");
          }
          return fromBinary(trigger.getAttribute("data-clipboard-text")).trim();
        },
      });
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
      this.setupCopyElement(node);

      var innerHTML = node.children[0].children[1].innerHTML;

      // replace img with n-image
      innerHTML = this.imgReplacement(innerHTML);

      // escape the brace for not leting the vue compile the {{}} syntax
      innerHTML = innerHTML.replaceAll("{", "&#123;");
      innerHTML = innerHTML.replaceAll("}", "&#125;");

      // add css on code block without language specifying
      innerHTML = innerHTML.replaceAll(
        `<pre style="position: relative;"><code>`,
        `<pre style="position: relative;"><code class="hljs">`
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
          NButton,
          NIcon,
          CopySharp,
        },
        data: () => ({}),
        methods: {},
      };

      app = createApp(body);
      app.mount("#md");

      const renderedImgEl = document.getElementsByClassName("n-image");
      for (let el of renderedImgEl) {
        if (el.style.length === 0) {
          el.style.width = "100%";
        }
      }
      this.setupCopyEvent();
    },
  },
});
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

.hideCodeCopyBtn {
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
}

.codeCopyBtn {
  margin: 0.4rem;
  position: absolute;
  right: 0;
  z-index: 5;
  top: 0;
}
</style>
