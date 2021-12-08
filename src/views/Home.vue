<template>
  <div class="home">
    <div class="article-list-box">
      <n-card>
        <n-space>
          <n-button @click="theme = darkTheme">深色</n-button>
          <n-button @click="theme = null">浅色</n-button>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { NCard, NSpace, NButton } from "naive-ui";

export default {
  name: "Home",
  components: {
    NCard,
    NSpace,
    NButton,
  },
};
</script>

<style lang="less"></style>
