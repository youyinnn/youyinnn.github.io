<template>
  <div class="home">
    <div class="article-list-box unselectable">
      <p style="padding: 0 1rem; text-align: end">
        {{ postMetadataLength }} posts since 2017-11-23
      </p>

      <n-list>
        <div
          v-for="cate of Array.from(postMetadataMap.keys())"
          :key="cate"
          @click="toggleCategoryCss"
        >
          <h1 style="margin-top: 2em">{{ cate }}</h1>
          <hr />
          <n-list-item
            class="list-item"
            v-for="post of postMetadataMap.get(cate)"
            :key="post.abbrlink"
            @click="goToPage(cate, post.abbrlink)"
          >
            <div>
              <p class="card-title">{{ post.title }}</p>
              <p class="card-time">
                {{ dayjs(post.date).format("MM/DD/YYYY") }}
              </p>
            </div>
          </n-list-item>
        </div>
      </n-list>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { NList, NListItem } from "naive-ui";
import dayjs from "dayjs";

export default {
  name: "Home",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NList,
    // eslint-disable-next-line vue/no-unused-components
    NListItem,
  },
  data: () => ({
    postMetadataMap: new Map(),
    postMetadataLength: 0,
    dayjs,
  }),
  methods: {
    goToPage(cate, abbrlink) {
      this.$router.push(`/article/${cate}/${abbrlink}`).catch(() => {});
      const toTop = document.getElementsByClassName("n-back-top");
      if (toTop.length > 0) {
        toTop[0].click();
      }
    },
    toggleCategoryCss() {
      let curr = document.getElementsByClassName("n-collapse-item--active")[0];
      if (curr !== undefined) {
        curr.classList.add("list-item-active");
      }
    },
  },
  mounted: function () {
    let postMetadata = JSON.parse(sessionStorage.postMetadata);
    for (let metadata of postMetadata) {
      if (this.postMetadataMap.get(metadata.category) === undefined) {
        this.postMetadataMap.set(metadata.category, []);
      }
      this.postMetadataMap.get(metadata.category).push(metadata);
    }
    this.postMetadataLength = postMetadata.length;
  },
};
</script>

<style>
.articleshortmsg {
  overflow: hidden !important;
  font-size: 14px !important;
  font-weight: normal !important;
  margin: 8px 0;
}

.articleshortmsg * {
  margin: 8px 0 !important;
  font-size: 14px !important;
  font-weight: 100 !important;
}

.articleshortmsg .saying {
  text-align: left !important;
  padding: 0 !important;
  background-color: transparent !important;
  border-bottom: none !important;
  font-size: 14px !important;
  font-weight: normal !important;
  margin: 0 !important;
}

.articleshortmsg hr {
  display: none;
}

.articleshortmsg h1,
.articleshortmsg h2,
.articleshortmsg h3,
.articleshortmsg h4,
.articleshortmsg h5,
.articleshortmsg h6 {
  display: none;
}

.articleshortmsg pre {
  padding: 10px;
}

.saying {
  text-align: center;
  padding: 0.5rem 1rem 1rem;
  background-color: var(--table-header-color);
  font-size: 1rem;
}

.saying-quote {
  font-size: 30px;
  width: 20px;
}

.saying-left-quote {
  float: left;
}

.saying-right-quote {
  float: right;
}
</style>

<style lang="less">
@import "../assets/css/index.less";
.card-title {
  float: left;
  margin: 0;
}
.card-time {
  margin: 0;
  float: right;
}

.list-item {
  padding-right: 1rem !important;
  padding-left: 1rem !important;
  transition: border-left 0.5s, border-right 0.5s, transform 0.25s !important;
  margin-bottom: 1rem;
  border-left: 3px solid rgba(0, 255, 128, 0);
  border-right: 3px solid rgba(0, 255, 128, 0);
}

.list-item:hover,
.list-item-active {
  cursor: pointer;
  border-left: 3px solid rgb(30, 155, 92);
  border-right: 3px solid rgb(30, 155, 92);
  transform: scale(1.01);
}
</style>
