<template>
  <div class="about">
    <markdown-body :content="content" />
    <n-image
      style="width: 100%"
      class="about-octopus"
      width="70"
      preview-disabled
      :src="octopusGifSrc"
    />
  </div>
</template>

<script>
import MarkdownBody from "@/components/MarkdownBody.vue";
import { NImage } from "naive-ui";
import { getContent } from "@/plugins/get-md-content";

export default {
  name: "About",
  components: {
    MarkdownBody,
    NImage,
  },
  data: () => ({
    content: null,
  }),
  computed: {
    octopusGifSrc() {
      return process.env.NODE_ENV === "production"
        ? `https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/public/mona-loading-default.gif`
        : `/mona-loading-default.gif`;
    },
  },
  mounted: function () {
    // const src = require(`raw-loader!@/assets/about/index.htm`);
    // this.content = src.default;
    getContent("about", "index", this);
  },
};
</script>

<style>
.about-octopus {
  margin-top: 3rem;
}

.about-octopus img {
  margin: auto;
}
</style>
