<template>
  <div class="home">
    <div class="article-list-box unselectable">
      <p style="padding: 0 1rem; text-align: end">
        {{ postMetadataLength }} posts since 2017-11-23
      </p>
      <n-list>
        <n-list-item
          class="list-item"
          v-for="data of postMetadata"
          :key="data.abbrlink"
          @click="goToPage(data.abbrlink)"
        >
          <div>
            <p class="card-title">{{ data.title }}</p>
            <p class="card-time">{{ dayjs(data.date).format("MM/DD/YYYY") }}</p>
          </div>
          <!-- <div class="articleshortmsg" v-html="data.short_content"></div> -->
        </n-list-item>
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
    NList,
    NListItem,
  },
  data: () => ({
    postMetadata: null,
    postMetadataLength: 0,
    dayjs,
  }),
  methods: {
    goToPage(abbrlink) {
      this.$router.push(`/article/${abbrlink}`).catch(() => {});
      const toTop = document.getElementsByClassName("n-back-top");
      if (toTop.length > 0) {
        toTop[0].click();
      }
    },
  },
  mounted: function () {
    this.postMetadata = JSON.parse(sessionStorage.postMetadata);
    this.postMetadataLength = this.postMetadata.length;
    this.$store.commit("tabChange", {
      tab: "articles",
    });
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

.list-item:hover {
  cursor: pointer;
  border-left: 3px solid rgb(30, 155, 92);
  border-right: 3px solid rgb(30, 155, 92);
  transform: scale(1.01);
}
</style>
