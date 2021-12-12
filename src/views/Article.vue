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
    <div class="serie-box unselectable" v-if="hasSerie">
      <n-divider style="margin-top: 0; margin-bottom: 10px" />
      <n-collapse>
        <n-collapse-item :title="'Serie:' + postSerie.se" name="1">
          <div v-for="item of postSerie.ps" :key="item.abbrlink">
            <n-el
              :class="{
                'serie-item-box': true,
                'se-unselected': item.abbrlink !== postMetadata.abbrlink,
                'se-selected': item.abbrlink === postMetadata.abbrlink,
              }"
            >
              {{ item.name }}
            </n-el>
          </div>
        </n-collapse-item>
      </n-collapse>
      <n-divider style="margin-top: 10px; margin-bottom: 10px" />
    </div>
    <n-divider v-else style="margin-top: 10px" />
    <markdown-body :content="content" :key="$route.params.articleId" />
    <toc :toc="toc" />
  </div>
</template>

<script>
import resources from "@/assets/resources/resources.js";
import { NSkeleton, NDivider, NCollapse, NCollapseItem, NEl } from "naive-ui";
import dayjs from "dayjs";
import Toc from "@/components/Toc.vue";
import MarkdownBody from "@/components/MarkdownBody.vue";
// eslint-disable-next-line no-unused-vars

export default {
  name: "Article",
  components: {
    NSkeleton,
    NDivider,
    Toc,
    MarkdownBody,
    NCollapse,
    NCollapseItem,
    NEl,
  },
  data: () => ({
    content: null,
    postMetadata: null,
    loading: true,
    toc: {},
    postSerie: null,
    dayjs,
  }),
  computed: {
    hasSerie() {
      return this.postSerie !== null;
    },
  },
  mounted: function () {
    const aId = this.$route.params.articleId;
    const src = require(`raw-loader!@/assets/articles/${aId}.htm`);
    this.content = src.default;
    // console.log(this.content);

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
    const series = JSON.parse(sessionStorage.postSeries);
    for (let serie of series) {
      for (let name of serie.ps) {
        if (name.indexOf(this.postMetadata.abbrlink) > -1) {
          for (let i = 0; i < serie.ps.length; i++) {
            let split = serie.ps[i].split("===");
            serie.ps[i] = {
              name: split[0],
              abbrlink: split[1],
            };
          }
          this.postSerie = serie;
          console.log(serie);
          break;
        }
      }
    }
    setTimeout(() => {
      this.loading = false;
    }, 100);
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

<style scoped></style>

<style>
@media only screen and (max-width: 800px) {
  .article-metadata {
    padding: 0 1rem;
  }
}
.serie-box {
  margin-bottom: 1rem;
}
.serie-item-box {
  cursor: pointer;
  background-color: var(--color);
  color: var(--text-color-base);
  padding: 1px 10px;
  border-left: 3px solid var(--success-color);
  border-right: 3px solid var(--success-color);
}
.se-unselected:hover {
  border-left: 3px solid var(--info-color-hover);
  border-right: 3px solid var(--info-color-hover);
  background-color: var(--divider-color);
}
.se-selected {
  background-color: var(--border-color);

  border-left: 3px solid var(--error-color);
  border-right: 3px solid var(--error-color);
}
</style>
