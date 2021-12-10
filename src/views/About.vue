<template>
  <div class="about">
    <div
      class="article markdown-body editormd-html-preview animate__animated animate__fadeIn"
      v-html="content"
    ></div>
  </div>
</template>

<script>
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

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css");
@import url("@/assets/css/editormd-0.0.1.preview.css");
@import url("@/assets/css/markdown-body.css");
@import url("@/assets/css/github-gist.css");
</style>
