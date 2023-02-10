<template>
  <div class="about">
    <markdown-body :content="content" />
  </div>
</template>

<script>
import MarkdownBody from "@/components/MarkdownBody.vue";
// import { getContent } from "@/plugins/get-md-content";

export default {
  name: "About",
  components: {
    MarkdownBody,
  },
  data: () => ({
    content: null,
  }),
  mounted: function () {
    const src = require(`raw-loader!@/../public/assets/about/index.htm`);
    this.content = src.default;
    // getContent("about", "index", this);
    this.$store.commit("tabChange", {
      tab: "about",
    });
  },
};
</script>
