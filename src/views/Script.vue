<template>
  <div class="script">
    <n-grid x-gap="16" :cols="5">
      <n-gi span="1">
        <div>
          <n-menu
            v-if="menuValid"
            class="script-menu unselectable"
            v-model:value="activeKey"
            mode="vertical"
            :options="menuOptions"
          />
        </div>
      </n-gi>
      <n-gi style="border-left: 1px solid #eee" span="4">
        <div
          :class="{
            'script-box': true,
            article: true,
            'markdown-body': true,
            'editormd-html-preview': true,
            animate__animated: true,
            animate__fadeIn: scriptChangeAnimate,
          }"
          v-html="content"
        ></div>
      </n-gi>
    </n-grid>
    <toc :toc="toc" />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import resources from "@/assets/resources/resources.js";
import { NMenu, NGrid, NGi } from "naive-ui";
import Toc from "@/components/Toc.vue";

export default {
  name: "Script",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NMenu,
    NGrid,
    NGi,
    Toc,
  },
  data: () => ({
    content: null,
    activeKey: null,
    menuOptions: [],
    scriptChangeAnimate: false,
    toc: {},
  }),
  computed: {
    menuValid() {
      return this.menuOptions.length > 0;
    },
  },
  watch: {
    activeKey: function (nv) {
      this.scriptChangeAnimate = false;
      const src = require(`raw-loader!@/assets/scripts/${nv}.htm`);
      this.content = src.default;
      const tocSrc = require(`@/assets/scripts/${nv}.htm.toc.json`);
      this.toc = tocSrc;
      setTimeout(() => {
        this.scriptChangeAnimate = true;
      }, 100);
    },
  },
  mounted: function () {
    const resourceList = resources.list;
    // console.log(resources);
    for (let rs of resourceList) {
      require(`@/assets/resources/${rs}`);
    }
    const scriptSections = JSON.parse(sessionStorage.scriptsMds);
    for (let sectionName in scriptSections) {
      this.menuOptions.push({
        label: sectionName,
        key: scriptSections[sectionName],
      });
    }
    this.activeKey = this.menuOptions[0].key;
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css");
@import url("@/assets/css/editormd-0.0.1.preview.css");
@import url("@/assets/css/markdown-body.css");
@import url("@/assets/css/github-gist.css");
</style>

<style>
.n-menu-item {
  height: 30px !important;
}
.n-menu-item-content {
  padding: 4px 12px !important;
}
.script-box {
  padding: 1rem;
  padding-left: 3rem;
  opacity: 0;
  animation-duration: 1s;
}
.script-box h2 {
  border-bottom: none !important;
}
</style>
