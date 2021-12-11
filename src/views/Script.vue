<template>
  <div class="script">
    <n-grid x-gap="16" :cols="6">
      <n-gi span="1">
        <div>
          <n-menu
            v-if="menuValid"
            class="script-menu unselectable"
            v-model:value="activeKey"
            mode="vertical"
            :options="menuOptions"
            @update:value="onMenuItemClick"
          />
        </div>
      </n-gi>
      <n-gi style="border-left: 1px solid #eee" span="5">
        <markdown-body
          :key="activeKey"
          :content="content"
          :class="{
            'script-box': true,
            article: true,
            'markdown-body': true,
            'editormd-html-preview': true,
            animate__animated: true,
            animate__fadeIn: scriptChangeAnimate,
          }"
        />
      </n-gi>
    </n-grid>
    <toc
      :toc="toc"
      :class="{
        'script-toc-box': true,
        animate__animated: true,
        animate__fadeIn: scriptChangeAnimate,
      }"
    />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import resources from "@/assets/resources/resources.js";
import { NMenu, NGrid, NGi } from "naive-ui";
import Toc from "@/components/Toc.vue";
import MarkdownBody from "@/components/MarkdownBody.vue";

export default {
  name: "Script",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NMenu,
    NGrid,
    NGi,
    Toc,
    MarkdownBody,
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
  watch: {},
  mounted: function () {
    const resourceList = resources.list;
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
    const scriptId = this.$route.params.scriptId;
    if (scriptId === undefined) {
      this.onMenuItemClick(this.menuOptions[0].key);
    } else {
      this.showContent(scriptId);
    }
  },
  methods: {
    routeTo: function (key) {
      this.$router.push(`/script/${key}`).catch(() => {});
    },
    onMenuItemClick: function (key) {
      location.hash = "";
      this.routeTo(key);
      this.showContent(key);
    },
    showContent: function (key) {
      this.activeKey = key;
      this.scriptChangeAnimate = false;
      const src = require(`raw-loader!@/assets/scripts/${key}.htm`);
      this.content = src.default;

      const tocSrc = require(`@/assets/scripts/${key}.htm.toc.json`);
      this.toc = tocSrc;
      setTimeout(() => {
        this.scriptChangeAnimate = true;
      }, 100);
    },
  },
};
</script>

<style>
.n-menu-item {
  height: 30px !important;
}
.n-menu-item-content {
  padding: 4px 12px !important;
}
.script-box {
  padding: 1rem;
  padding-left: 2rem;
  opacity: 0;
  animation-duration: 1s;
}
.script-toc-box {
  opacity: 0;
  animation-delay: 0.3s;
  animation-duration: 1s;
}
.script-box h2 {
  border-bottom: none !important;
}
</style>
