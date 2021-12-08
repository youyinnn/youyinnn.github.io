<template>
  <div class="article"></div>
</template>

<script>
// @ is an alias to /src
// import src from "raw-loader!@/assets/_posts/a.txt";

export default {
  name: "Article",
  components: {},
  mounted: function () {
    const src = require("raw-loader!@/assets/_posts/a.txt");
    console.log(src.default);
    console.log(this.$route.params);
  },
};
</script>

<style lang="less"></style>
