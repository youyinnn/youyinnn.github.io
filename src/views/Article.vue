<template>
  <div class="article-box">
    <transition name="fade3" mode="out-in">
      <div :key="'mt-' + currentAbbrlink" class="article-metadata clearfix">
        <p class="title">{{ postMetadata.title }}</p>
        <p style="margin-top: 10px">
          <span style="margin-right: 10px">
            Posted at: {{ dayjs(postMetadata.date).format("MM/DD/YYYY") }}
          </span>
          <span style="color: #46bbcd">
            {{ daybefore(dayjs(postMetadata.date)) }}
          </span>
        </p>
      </div>
    </transition>
    <div class="serie-box unselectable" v-if="hasSerie">
      <n-divider style="margin-top: 0; margin-bottom: 10px" />
      <n-collapse>
        <n-collapse-item :title="postSerie.se">
          <div v-for="item of postSerie.ps" :key="item.abbrlink">
            <n-el
              :class="{
                'serie-item-box': true,
                'se-unselected': item.abbrlink !== postMetadata.abbrlink,
                'se-selected': item.abbrlink === postMetadata.abbrlink,
              }"
              @click="clickOtherPost(item.cate, item.abbrlink)"
            >
              {{ item.name }}
            </n-el>
          </div>
        </n-collapse-item>
      </n-collapse>
      <n-divider style="margin-top: 10px; margin-bottom: 10px" />
    </div>
    <n-divider v-else style="margin-top: 10px" />
    <transition name="fade3" mode="out-in">
      <markdown-body :content="content" :key="currentAbbrlink" />
    </transition>
    <n-divider style="margin-top: 3em; margin-bottom: 6em" />
    <Giscus
      id="comments"
      repo="youyinnn/youyinnn.github.io"
      repoId="MDEwOlJlcG9zaXRvcnkxMDk1ODc3NDk="
      category="Comment"
      categoryId="DIC_kwDOBogtJc4CBGni"
      mapping="specific"
      :term="postMetadata.title"
      reactionsEnabled="1"
      emitMetadata=""
      lang="en"
      :theme="giscusTheme"
      loading="lazy"
      inputPosition="top"
      host="https://giscus.app"
    />
    <toc :toc="toc" />
  </div>
</template>

<script>
import { NDivider, NCollapse, NCollapseItem, NEl } from "naive-ui";
import dayjs from "dayjs";
import Toc from "@/components/Toc.vue";
import MarkdownBody from "@/components/MarkdownBody.vue";
// eslint-disable-next-line no-unused-vars
import Giscus from "@giscus/vue";
import axios from "axios";

export default {
  name: "Article",
  components: {
    NDivider,
    Toc,
    MarkdownBody,
    NCollapse,
    NCollapseItem,
    NEl,
    // eslint-disable-next-line vue/no-unused-components
    Giscus,
  },
  data: () => ({
    content: null,
    postMetadata: null,
    loading: true,
    toc: [],
    postSerie: null,
    dayjs,
  }),
  computed: {
    hasSerie() {
      return this.postSerie !== null;
    },
    currentAbbrlink() {
      return this.$route.params.abbrlink;
    },
    articleLoaded() {
      return this.postMetadata != null;
    },
    giscusTheme() {
      return this.$store.state.currentThemeConfig.darkTheme
        ? "dark_tritanopia"
        : "light_protanopia";
    },
  },
  watch: {
    currentAbbrlink() {
      this.loadMd(this.$route.params.category, this.$route.params.abbrlink);
    },
  },
  created() {
    const cate = this.$route.params.category;
    const abbrlink = this.$route.params.abbrlink;
    this.loadMd(cate, abbrlink);
    const series = JSON.parse(sessionStorage.postSeries);
    for (let serie of series) {
      for (let name of serie.ps) {
        if (name.indexOf(this.postMetadata.abbrlink) > -1) {
          for (let i = 0; i < serie.ps.length; i++) {
            let split = serie.ps[i].split("===");
            serie.ps[i] = {
              name: split[0],
              cate: split[1],
              abbrlink: split[2],
            };
          }
          this.postSerie = serie;
          break;
        }
      }
    }
  },
  methods: {
    clickOtherPost(cate, abbrlink) {
      this.$router.push(`/article/${cate}/${abbrlink}`).catch(() => {});
    },
    loadMd(cate, abbrlink) {
      if (abbrlink === null || abbrlink === undefined) {
        return;
      }
      const postMetadatas = JSON.parse(sessionStorage.postMetadata);
      for (let d of postMetadatas) {
        if (d.abbrlink === abbrlink) {
          this.postMetadata = d;
        }
      }

      document.title = this.postMetadata.title;
      let metas = document.getElementsByTagName("meta");
      for (let meta of metas) {
        if (meta.name === "description") {
          meta.content = this.postMetadata.title;
        }
      }

      const thiz = this;
      axios
        .get(`${process.env.BASE_URL}assets/articles/${cate}/${abbrlink}.htm`)
        .then((response) => {
          thiz.content = response.data;
        });

      // get toc
      if (this.postMetadata.hasToc) {
        const tocSrc = require(`@/../public/assets/articles/${cate}/${abbrlink}.htm.toc.json`);
        this.toc = tocSrc;
      }
    },
    daybefore: function (pastdayjs) {
      let now = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
      let before = now.diff(pastdayjs);
      before /= 3600000;
      if (before < 24) {
        if (before > now.hour()) {
          return "Yesterday";
        } else {
          return "Today";
        }
      }
      if (before > 24 && before < 48) return "2 days ago";
      return Math.ceil(before / 24) + " days ago";
    },
  },
  beforeRouteEnter(to, from, next) {
    const postOrder = JSON.parse(sessionStorage.postOrder);
    const aId = to.params.abbrlink;
    let exist = false;
    for (let p of postOrder) {
      let pId = p.split("<=>")[1];
      if (pId === aId) {
        exist = true;
        break;
      }
    }
    if (exist) {
      next();
    } else {
      location.href = "/page-not-found";
    }
  },
};
</script>

<style scoped></style>

<style>
.giscus {
  margin-top: 3rem;
}
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
  transition: all 0.5s !important;
}
.se-unselected:hover {
  border-left: 3px solid var(--info-color-hover);
  border-right: 3px solid var(--info-color-hover);
  background-color: var(--divider-color);
}
.se-selected {
  cursor: not-allowed;
  background-color: var(--border-color);
  border-left: 3px solid var(--error-color);
  border-right: 3px solid var(--error-color);
}
</style>
