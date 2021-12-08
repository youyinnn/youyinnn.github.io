<template>
  <div
    class="article markdown-body editormd-html-preview article parrow"
    v-html="content"
  ></div>
</template>

<script>
// @ is an alias to /src
// import src from "raw-loader!@/assets/_posts/a.txt";
import resources from "@/assets/resources/resources.js";

export default {
  name: "Article",
  components: {},
  data: () => ({
    content: null,
  }),
  mounted: function () {
    // console.log(this.$route.params);
    const src = require(`raw-loader!@/assets/articles/${this.$route.params.articleId}.html`);
    this.content = src.default;

    const resourceList = resources.list;
    // console.log(resources);
    for (let rs of resourceList) {
      require(`@/assets/resources/${rs}`);
    }
  },
};
</script>

<style></style>

<style scoped>
/* @import url("@/assets/css/github-markdown-css.css"); */
</style>

<style lang="less"></style>
