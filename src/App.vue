<template>
  <n-config-provider :theme="theme">
    <TopBar />
    <n-card
      class="main animate__animated animate__fadeIn"
      :bordered="false"
      content-style="padding: 0;"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade3" mode="out-in">
          <component class="page" :is="Component" />
        </transition>
      </router-view>
    </n-card>
    <n-global-style />
  </n-config-provider>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import { NConfigProvider, NCard, NGlobalStyle, darkTheme } from "naive-ui";

export default {
  name: "App",
  data: () => ({}),
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
  },
  mounted() {
    const pre = document.getElementById("preLoadingBodyCssElement");
    if (pre !== null) pre.remove();
  },
};
</script>

<style scoped lang="less">
@import "../src/assets/css/variables.less";
.main {
  margin: auto;
  top: 42px;
  border-radius: 0;
  animation-delay: 0.35s;
}

.page {
  max-width: @page-max-width;
  margin-top: 1rem !important;
  margin-bottom: 10rem !important;
  margin: auto;
  backface-visibility: hidden;
}
</style>
