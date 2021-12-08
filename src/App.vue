<template>
  <TopBar />
  <div class="main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";

export default {
  name: "App",

  data: () => ({
    //
  }),
  components: {
    TopBar,
  },
};
</script>

<style scoped lang="less">
@import "../src/assets/css/index.less";
.main {
  position: absolute;
  top: @top-bar-height;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: azure;
}
</style>
