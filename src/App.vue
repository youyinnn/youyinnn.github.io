<template>
  <n-config-provider :theme="theme" v-cloak>
    <TopBar />
    <n-card class="main" :bordered="false" content-style="padding: 0;" v-cloak>
      <router-view v-slot="{ Component }" v-cloak>
        <transition name="fade1" mode="out-in" v-cloak>
          <component class="page" :is="Component" v-cloak />
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
    setTimeout(() => {
      const pre = document.getElementById("preLoadingBodyCssElement");
      if (pre !== null) pre.remove();
    }, 300);
  },
};
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
  top: 42px;
  border-radius: 0;
}

.page {
  max-width: @page-max-width;
  margin-top: 1rem !important;
  margin-bottom: 10rem !important;
  margin: auto;
  backface-visibility: hidden;
}
</style>
