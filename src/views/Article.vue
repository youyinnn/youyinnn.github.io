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
    <markdown-body :content="content" :key="$route.params.articleId" />
    <toc :toc="toc" />
  </div>
</template>

<script>
import resources from "@/assets/resources/resources.js";
import { NSkeleton, NDivider } from "naive-ui";
import dayjs from "dayjs";
import Toc from "@/components/Toc.vue";
import MarkdownBody from "@/components/MarkdownBody.vue";

export default {
  name: "Article",
  components: {
    NSkeleton,
    NDivider,
    Toc,
    MarkdownBody,
  },
  data: () => ({
    content: null,
    postMetadata: null,
    loading: true,
    toc: {},
    dayjs,
  }),
  mounted: function () {
    const aId = this.$route.params.articleId;
    const src = require(`raw-loader!@/assets/articles/${aId}.htm`);
    this.content = src.default;

    // get toc
    const tocSrc = require(`@/assets/articles/${aId}.htm.toc.json`);
    this.toc = tocSrc;

    const resourceList = resources.list;
    for (let rs of resourceList) {
      require(`@/assets/resources/${rs}`);
    }
    const postMetadatas = JSON.parse(sessionStorage.postMetadata);
    for (let d of postMetadatas) {
      if (d.abbrlink === aId) {
        this.postMetadata = d;
      }
    }
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

<style scoped></style>

<style></style>
