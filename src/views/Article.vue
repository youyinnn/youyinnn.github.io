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
    <toc :toc="toc" />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-components */
// @ is an alias to /src
// import src from "raw-loader!@/assets/_posts/a.txt";
import resources from "@/assets/resources/resources.js";
import { NSkeleton, NDivider } from "naive-ui";
import dayjs from "dayjs";
import Toc from "@/components/Toc.vue";

export default {
  name: "Article",
  components: {
    NSkeleton,
    NDivider,
    Toc,
  },
  data: () => ({
    content: null,
    postMetadata: null,
    loading: true,
    toc: {},
    dayjs,
  }),
  mounted: function () {
    // console.log(this.$route.params);
    const aId = this.$route.params.articleId;
    const src = require(`raw-loader!@/assets/articles/${aId}.htm`);
    this.content = src.default;
    const tocSrc = require(`@/assets/articles/${aId}.htm.toc.json`);
    this.toc = tocSrc;

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
    goto(id) {
      var element = document.getElementById(id);
      var top = element.offsetTop;

      window.scrollTo(0, top);
    },
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css");
@import url("@/assets/css/editormd-0.0.1.preview.css");
@import url("@/assets/css/markdown-body.css");
@import url("@/assets/css/github-gist.css");
.article-metadata {
  min-height: 90px;
}
.title {
  margin: 0;
  font-size: 25px;
}
</style>

<style>
.katexp {
  text-align: center;
  background-color: #f8f9fa;
  padding: 0.5rem;
  font-size: 15px;
  border-right: 2px solid #80caff;
}

.katexp:hover {
  box-shadow: 0px 5px 10px -2px #777;
}
</style>
