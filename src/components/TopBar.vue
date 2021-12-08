<template>
  <n-card class="top-bar" :bordered="false" content-style="padding: 0;">
    <n-space class="tab-box unselectable" justify="start">
      <n-tabs type="line" size="small" tab-style="tab-style">
        <n-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          @click="goTo(tab.route)"
          >{{ tab.text }}
        </n-tab>
      </n-tabs>
    </n-space>
  </n-card>
</template>

<script>
import { NTabs, NTab, NSpace, NCard } from "naive-ui";

export default {
  name: "TopBar",
  components: {
    NCard,
    NTabs,
    NTab,
    NSpace,
  },
  data: () => ({
    tabs: [
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
      {
        name: "about",
        text: "About",
        route: "/about",
      },
    ],
  }),
  methods: {
    goTo(url) {
      this.$router.push(url).catch(() => {});
    },
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
