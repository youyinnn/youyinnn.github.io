<template>
  <n-config-provider
    :theme="theme"
    v-cloak
    :theme-overrides="{
      common: overrideThemeCommon,
    }"
  >
    <n-message-provider placement="bottom-left">
      <TopBar />
      <n-card
        class="main"
        :bordered="false"
        content-style="padding: 0;"
        v-cloak
      >
        <router-view v-slot="{ Component }" v-cloak>
          <n-back-top :listen-to="body" />
          <transition :name="transitionName" mode="out-in" v-cloak>
            <component class="page" :is="Component" v-cloak />
          </transition>
        </router-view>
      </n-card>
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
      fontSize: "15.2px",
      fontFamily: "'IBM Plex Serif',ibm-plex-serif,Georgia,Times,serif",
    },
  }),
  computed: {
    theme() {
      return this.$store.state.currentThemeConfig.darkTheme ? darkTheme : null;
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
      this.transitionName = "fade1";
    }, 300);
  },
});
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>

<style scoped lang="less">
@import "../src/assets/css/variables.less";
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
