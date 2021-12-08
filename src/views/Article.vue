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

<style>
img {
  max-width: 100%;
}
pre {
  overflow: scroll;
}
.article {
  --animate-duration: 1s;
}
pre {
  border: none !important;
  background-color: #f8f9fa !important;
  border-left: 2px #17a2b8 solid !important;
  border-radius: 0 !important;
}

.markdown-body blockquote:hover,
.markdown-body .md-diagram-panel-preview:hover,
.markdown-body pre:hover,
.markdown-body .copyrightbox:hover,
.markdown-body .saying:hover,
.markdown-body img:hover {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 -1px 0.5px 0 rgba(0, 0, 0, 0.09);
}

.markdown-body code:after,
.markdown-body code:before {
  display: none;
}

td.hljs-ln-code {
  padding-left: 10px !important;
}

.hljs-ln span {
  margin: 0 !important;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: border-box;
  margin: auto;
  right: 0;
  display: block;
  margin: auto;
}

.editormd-html-preview blockquote,
.editormd-preview-container blockquote {
  padding-left: initial !important;
  padding: 10px !important;
  font-size: 13px !important;
  border-left: 2px #66c77d solid !important;
  background-color: ghostwhite;
}

a code {
  margin: 0 !important;
  padding: 0 !important;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  line-height: 1.4;
  padding-left: 14px;
}

.markdown-body h1 {
  border-left: 7px solid #17b888;
}
.markdown-body h2 {
  border-left: 6px solid #17b888;
}
.markdown-body h3 {
  border-left: 5px solid #17b888;
}
.markdown-body h4 {
  border-left: 4px solid #17b888;
}
.markdown-body h5 {
  border-left: 3px solid #17b888;
}
.markdown-body h6 {
  border-left: 2px solid #17b888;
}
</style>

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
