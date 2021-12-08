<template>
  <n-card class="top-bar" :bordered="false" content-style="padding: 0;">
    <n-space class="tab-box unselectable" justify="start">
      <n-tabs
        class="tabs"
        :value="tabValue"
        type="line"
        size="small"
        tab-style="width: 50px; justify-content: center;"
      >
        <n-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          @click="goTo(tab)"
          >{{ tab.text }}
        </n-tab>
      </n-tabs>
      <n-gradient-text class="slogan" :size="16" type="success">
        déjà vu
      </n-gradient-text>
    </n-space>
  </n-card>
</template>

<script>
import { NTabs, NTab, NSpace, NCard, NGradientText } from "naive-ui";

const tabList = [
  {
    name: "about",
    text: "About",
    route: "/about",
  },
  {
    name: "articles",
    text: "Articles",
    route: "/",
  },
  {
    name: "script",
    text: "Script",
    route: "/",
  },
];

export default {
  name: "TopBar",
  components: {
    NCard,
    NTabs,
    NTab,
    NSpace,
    NGradientText,
  },
  data: () => ({
    tabValue: tabList[0].name,
    tabs: tabList,
  }),
  methods: {
    goTo(tab) {
      this.tabValue = tab.name;
      this.$router.push(tab.route).catch(() => {});
    },
  },
  mounted: function () {
    const hash = location.hash;
    if (hash === "#/about") {
      this.tabValue = tabList[0].name;
    }
    if (hash === "#/") {
      this.tabValue = tabList[1].name;
    }
    if (hash === "#/script") {
      this.tabValue = tabList[2].name;
    }
    if (hash.startsWith("#/article/")) {
      this.tabValue = tabList[1].name;
    }
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/index.less";

.top-bar {
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
  top: 0;
  height: @top-bar-height;
  border-radius: 0;
  // background-color: aquamarine;
}

.tab-box {
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
  margin-top: 1rem !important;
  max-width: @page-max-width;
  padding: 0 1rem;
}
.tabs {
  width: 400px;
}
.slogan {
  position: absolute;
  right: 0;
  top: 0;
  margin: auto;
  bottom: 0;
  margin-right: 2rem;
  line-height: 42px;
}
</style>

<style>
/* .n-tabs-tab__label {
  color: rgb(66, 69, 109) !important;
}
.n-tabs-bar {
  background-color: rgb(66, 69, 109) !important; */
/* } */
</style>
