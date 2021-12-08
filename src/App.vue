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
  </n-config-provider>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import { defineComponent, ref } from "vue";
import { darkTheme, NConfigProvider, NCard } from "naive-ui";

export default defineComponent({
  setup() {
    return {
      darkTheme,
      theme: ref(darkTheme),
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
  },
});
</script>

<style scoped lang="less">
@import "../src/assets/css/index.less";
.main {
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
  top: @top-bar-height;
  bottom: 0;
  border-radius: 0;
}

.page {
  max-width: @page-max-width;
  margin-top: 0.5rem !important;
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
}
</style>
