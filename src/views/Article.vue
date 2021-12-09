<template>
  <div class="article-box">
    <transition name="fade5" mode="out-in">
      <div
        v-if="loading"
        style="height: 90px"
        key="sk"
        class="article-metadata clearfix"
      >
        <n-skeleton text :repeat="3" />
        <n-skeleton text style="width: 60%" />
      </div>

      <div v-else key="mt" class="article-metadata clearfix">
        <p class="title">{{ postMetadata.title }}</p>
        <p style="margin-top: 10px">
          <span style="margin-right: 10px">
            Posted at: {{ dayjs(postMetadata.date).format("MM/DD/YYYY") }}
          </span>
          <span style="color: #46bbcd">
            {{ daybefore(dayjs(postMetadata.date)) }} days ago
          </span>
        </p>
      </div>
    </transition>
    <n-divider style="margin-top: 10px" />
    <div
      class="article markdown-body editormd-html-preview animate__animated animate__fadeIn"
      v-html="content"
    ></div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
// @ is an alias to /src
// import src from "raw-loader!@/assets/_posts/a.txt";
import resources from "@/assets/resources/resources.js";
// eslint-disable-next-line no-unused-vars
import markdowBody from "@/assets/css/markdown-body.css";
import { NSkeleton, NDivider } from "naive-ui";
import dayjs from "dayjs";

export default {
  name: "Article",
  components: {
    NSkeleton,
    NDivider,
  },
  data: () => ({
    content: null,
    postMetadata: null,
    loading: true,
    dayjs,
  }),
  mounted: function () {
    // console.log(this.$route.params);
    const aId = this.$route.params.articleId;
    const src = require(`raw-loader!@/assets/articles/${aId}.html`);
    this.content = src.default;

    const resourceList = resources.list;
    // console.log(resources);
    for (let rs of resourceList) {
      require(`@/assets/resources/${rs}`);
    }
    const postMetadatas = JSON.parse(sessionStorage.postMetadata);
    for (let d of postMetadatas) {
      if (d.abbrlink === aId) {
        this.postMetadata = d;
      }
    }
    // console.log(this.postMetadata);
    // console.log(this.postMetadata.abbrlink);
    setTimeout(() => {
      this.loading = false;
    }, 300);
  },
  methods: {
    daybefore: function (pastdayjs) {
      let now = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
      let before = now.diff(pastdayjs);
      before /= 3600000;
      if (before < 24) {
        if (before > now.hour()) {
          return ' <x style="color:#46bbcd;">Yesterday</x>';
        } else {
          return ' <x style="color:#46bbcd;">Today</x>';
        }
      }
      if (before > 24 && before < 48)
        return ' <x style="color:#46bbcd;">2 days ago</x>';
      return Math.ceil(before / 24);
    },
  },
};
</script>

<style scoped>
@import url("@/assets/css/editormd-0.0.1.preview.css");
@import url("@/assets/css/github-gist.css");
.article-metadata {
  min-height: 90px;
}
.title {
  margin: 0;
  font-size: 25px;
}
</style>
