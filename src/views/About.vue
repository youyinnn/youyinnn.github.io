<template>
  <div class="about">
    <markdown-body :content="content" />
  </div>
</template>

<script>
import MarkdownBody from "@/components/MarkdownBody.vue";

export default {
  name: "About",
  components: {
    MarkdownBody,
  },
  data: () => ({
    content: null,
  }),
  mounted: function () {
    const src = require(`raw-loader!@/assets/about/index.htm`);
    this.content = src.default;
  },
};
</script>
