<template>
  <div class="about">
    <div
      class="article markdown-body editormd-html-preview animate__animated animate__fadeIn"
      v-html="content"
    ></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import markdowBody from "@/assets/css/markdown-body.css";

export default {
  name: "About",
  components: {},
  data: () => ({
    content: null,
  }),
  mounted: function () {
    const src = require(`raw-loader!@/assets/about/index.htm`);
    this.content = src.default;
  },
};
</script>
