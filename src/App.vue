<template>
  <n-config-provider :theme="theme">
    <TopBar />
    <n-card class="main" :bordered="false" content-style="padding: 0;">
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
import { defineComponent, ref } from "vue";
import { darkTheme, NConfigProvider, NCard, NGlobalStyle } from "naive-ui";

export default defineComponent({
  setup() {
    return {
      darkTheme,
      theme: ref(null),
    };
  },
  name: "App",

  data: () => ({
    //
  }),
  components: {
    NCard,
    TopBar,
    NConfigProvider,
    NGlobalStyle,
  },
});
</script>

<style scoped lang="less">
@import "../src/assets/css/variables.less";
.main {
  margin: auto;
  top: @top-bar-height;
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
