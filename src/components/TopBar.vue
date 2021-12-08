<template>
  <div class="top-bar">
    <n-space class="tab-box" justify="center">
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
  </div>
</template>

<script>
import { NTabs, NTab, NSpace } from "naive-ui";

export default {
  name: "TopBar",
  components: {
    NTabs,
    NTab,
    NSpace,
  },
  data: () => ({
    tabs: [
      {
        name: "home",
        text: "Home",
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
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  height: @top-bar-height;
  // background-color: aquamarine;
}

.tab-box {
  margin-top: 0rem !important;
  max-width: 800px;
}
</style>

<style>
.n-tabs-tab__label {
  color: rgb(66, 69, 109) !important;
}
.n-tabs-bar {
  background-color: rgb(66, 69, 109) !important;
}
</style>
