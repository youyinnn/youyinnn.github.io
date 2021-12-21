<template>
  <div id="pageNotFoundView" class="pageNotFoundView">
    <n-image width="300" :src="`${publicPath}not-found.png`" preview-disabled />
    <p>No such Page</p>
  </div>
</template>

<script>
import { NImage } from "naive-ui";

export default {
  name: "pageNotFound",
  components: {
    NImage,
  },
  data: () => ({
    publicPath: process.env.BASE_URL,
  }),
};
</script>

<style>
.pageNotFoundView {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 40%);
  margin: 0 !important;
}
</style>
