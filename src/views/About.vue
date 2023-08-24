<template>
  <div class="about">
    <markdown-body :content="content" />
  </div>
</template>

<script>
import MarkdownBody from "@/components/MarkdownBody.vue";
// import { getContent } from "@/plugins/get-md-content";
import axios from "axios";

export default {
  name: "About",
  components: {
    MarkdownBody,
  },
  data: () => ({
    content: null,
    publicPath: process.env.BASE_URL,
  }),
  mounted: function () {
    const thiz = this;
    console.log(thiz.publicPath);
    axios.get(`./assets/about/index.htm`).then((response) => {
      thiz.content = response.data;
      // getContent("about", "index", this);
      this.$store.commit("tabChange", {
        tab: "about",
      });
    });
  },
};
</script>
