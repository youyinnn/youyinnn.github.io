<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="{
      common: overrideThemeCommon,
    }"
  >
    <n-message-provider placement="bottom-left">
      <TopBar />
      <Transition name="fade5">
        <n-card
          class="main"
          :bordered="false"
          content-style="padding: 0;"
          v-show="routeLoaded"
        >
          <router-view v-slot="{ Component }">
            <n-back-top :listen-to="body" />
            <transition :name="transitionName" mode="out-in">
              <component class="page" :is="Component" />
            </transition>
          </router-view>
        </n-card>
      </Transition>
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import {
  NConfigProvider,
  NCard,
  NGlobalStyle,
  darkTheme,
  NBackTop,
  NMessageProvider,
} from "naive-ui";

import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  name: "App",
  data: () => ({
    body: document,
    transitionName: null,
    overrideThemeCommon: {
      fontSize: "13px",
      fontFamily: "'Roboto', sans-serif",
      codeFontFamily: "Source Code Pro",
    },
  }),
  computed: {
    theme() {
      return this.$store.state.currentThemeConfig.darkTheme ? darkTheme : null;
    },
    routeLoaded() {
      return this.$store.state.firstRouteLazyLoaded;
    },
  },
  components: {
    NCard,
    TopBar,
    NConfigProvider,
    NGlobalStyle,
    NBackTop,
    NMessageProvider,
  },
  mounted() {
    // setTimeout(() => {
    //   const pre = document.getElementById("preLoadingBodyCssElement");
    //   if (pre !== null) pre.remove();
    // }, 300);
    setTimeout(() => {
      this.transitionName = "fade3";
    }, 300);
    console.log("App mounted, current tab: ", this.$store.state.currentTab);
    this.$changeTab(this.$store.state.currentTab);
  },
});
</script>

<style scoped lang="less">
@import "@/assets/css/variables.less";
.main {
  margin: auto;
  top: @top-bar-height;
  border-radius: 0;
  position: absolute;
  margin: auto;
  bottom: 0;
  left: 0;
  right: 0;
}

.page {
  max-width: @page-max-width;
  margin-top: 1rem !important;
  margin-bottom: 10rem !important;
  margin: auto;
  backface-visibility: hidden;
}
</style>
