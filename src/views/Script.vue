<template>
  <div class="script">
    <n-grid x-gap="6" :cols="6">
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
      <n-gi style="border-left: 1.5px solid var(--border-color)" span="5">
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
    <toc :toc="toc" />
  </div>
</template>

<script>
import { NMenu, NGrid, NGi } from "naive-ui";
import Toc from "@/components/Toc.vue";
import MarkdownBody from "@/components/MarkdownBody.vue";
// import { getContent, getToc } from "@/plugins/get-md-content";

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
  created: function () {
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
      this.$router.push(`/scripts/${key}`).catch(() => {});
      const toTop = document.getElementsByClassName("n-back-top");
      if (toTop.length > 0) {
        toTop[0].click();
      }
    },
    onMenuItemClick: function (key) {
      location.hash = "";
      this.routeTo(key);
      this.showContent(key);
    },
    showContent: function (key) {
      this.activeKey = key;
      this.scriptChangeAnimate = false;
      const src = require(`raw-loader!@/../public/assets/scripts/${key}.htm`);
      this.content = src.default;
      // getContent("scripts", key, this);

      try {
        const tocSrc = require(`@/../public/assets/scripts/${key}.htm.toc.json`);
        this.toc = tocSrc[0].child;
      } catch (error) {
        console.log("No toc for this article.");
      }
      // getToc("scripts", key, this);
      setTimeout(() => {
        this.scriptChangeAnimate = true;
      }, 100);
    },
  },
  beforeRouteEnter(to, from, next) {
    const scriptSections = JSON.parse(sessionStorage.scriptsMds);
    var sId = to.params.scriptId;
    let exist = false;
    for (let sc in scriptSections) {
      let existingSid = scriptSections[sc];
      if (sId === undefined) {
        sId = existingSid;
        exist = true;
        break;
      }
      if (existingSid === sId) {
        exist = true;
        break;
      }
    }
    if (exist) {
      next();
    } else {
      location.href = "/page-not-found";
    }
  },
  mounted: function () {
    this.$store.commit("tabChange", {
      tab: "scripts",
    });
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
  padding-left: 2rem;
  opacity: 0;
  animation-duration: 1s;
}

@media only screen and (max-width: 800px) {
  .script-box {
    padding-left: 0.5rem;
  }
}
.script-box h2 {
  border-bottom: none !important;
}
</style>
