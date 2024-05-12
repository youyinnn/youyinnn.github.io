<template>
  <div class="unselectable">
    <div
      id="year-select"
      v-if="allYears.length > 0"
      style="margin-bottom: 1em; width: 100px"
    >
      <n-select
        v-model:value="currentYear"
        :options="allYears"
        @update:value="changeYear"
        :key="`year-select-${currentYear}`"
      />
    </div>
    <div :id="`gallery-${currentYear}`" class="gallery justified-gallery">
      <a v-for="item in currentContent" :key="item.src">
        <Transition name="fade10">
          <div
            :id="`month-box-${item.src}`"
            :class="{
              'month-box': true,
            }"
            :m="`${item.month}`"
            style="opacity: 0"
          >
            <span>{{ months[item.month - 1] }}</span>
          </div>
        </Transition>
        <Transition name="fade10">
          <n-image
            v-show="justifiedGalleryComplete[item.src]"
            :id="`image-${item.src}`"
            :src="item.src"
            :img-props="{
              class: 'no-margin',
            }"
            :alt="`${item.month}-${item.day}`"
          />
        </Transition>
      </a>
    </div>
    <div style="text-align: center; padding: 1em">
      <Transition name="fade10">
        <n-button
          text
          v-if="!allIsLoad"
          :loading="loading"
          class="load-more-btn"
        >
          <template #icon>
            <n-icon>
              <arrow-down-circle />
            </n-icon>
          </template>
          Load more
        </n-button>
        <n-button text v-else class="load-more-btn">
          <template #icon>
            <n-icon>
              <ice-cream />
            </n-icon>
          </template>
          That's all
        </n-button>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ArrowDownCircle, IceCream } from "@vicons/ionicons5";
// eslint-disable-next-line no-unused-vars
import jQuery from "jquery";

import "justifiedGallery/dist/js/jquery.justifiedGallery.min.js";

import { NImage, NIcon, NButton, NSelect } from "naive-ui";

import axios from "axios";

export default {
  name: "Gallery",
  components: {
    NImage,
    NIcon,
    NButton,
    ArrowDownCircle,
    IceCream,
    NSelect,
  },
  data: () => ({
    allContent: undefined,
    currentContent: undefined,
    batchSize: 10,
    justifiedGalleryComplete: {},
    loading: false,
    allIsLoad: false,
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    allYears: [
      {
        label: "2024",
        value: "2024",
      },
      {
        label: "2023",
        value: "2023",
      },
      {
        label: "2022",
        value: "2022",
      },
      {
        label: "2021",
        value: "2021",
      },
      {
        label: "2020",
        value: "2020",
      },
      {
        label: "2019",
        value: "2019",
      },
      {
        label: "2018",
        value: "2018",
      },
      {
        label: "2017",
        value: "2017",
      },
    ],
    loadingTimeout: undefined,
    norewindTimeout: undefined,
  }),
  created: function () {
    this.currentYear = this.$route.params.year;
    if (this.currentYear === undefined) {
      this.currentYear = this.allYears[0].value;
    }
  },
  mounted: function () {
    console.log("Gallery mounted");
    document.title = "Gallery";
    const thiz = this;
    axios
      .get(`${process.env.BASE_URL}gallery_list.json`)
      .then((response) => {
        thiz.allContent = response.data;
        thiz.currentContent = [];
        // thiz.load();
        global.load = thiz.load;
        global.norewind = thiz.norewind;
        global.destory = thiz.destory;
        global.buildGallery = thiz.buildGallery;
        global.showMonthBox = thiz.showMonthBox;
        thiz.buildGallery();
      })
      .finally(() => {
        thiz.load();
      });

    window.addEventListener("scroll", () => {
      const body = document.body;
      const html = document.documentElement;
      const windowHeight =
        "innerHeight" in window ? window.innerHeight : html.offsetHeight;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.scrollY;
      // console.log(windowBottom, docHeight);
      if (windowBottom + 10 >= docHeight && !thiz.allIsLoad && !thiz.loading) {
        // console.log("load more");
        thiz.load();
      }
    });
  },
  methods: {
    changeYear(value) {
      location.href = `/gallery/${value}`;
    },
    show() {
      var thiz = this;
      for (let i = 0; i < thiz.currentContent.length; i++) {
        setTimeout(() => {
          thiz.justifiedGalleryComplete[thiz.currentContent[i].src] = true;
        }, 100);
      }
    },
    hasScrollBar() {
      return (
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight)
      );
    },
    buildGallery() {
      var thiz = this;
      jQuery("#gallery-" + thiz.currentYear)
        .justifiedGallery({
          rowHeight: 250,
          margins: 10,
          selector: "#gallery-" + thiz.currentYear + " > a",
          imgSelector: "> div > img",
          // lastRow: "center",
          waitThumbnailsLoad: false,
          refreshTime: 1500,
          captions: false,
        })
        .on("jg.complete", function () {
          thiz.show();
        });
    },
    load() {
      var thiz = this;
      if (thiz.allContent === undefined) {
        return;
      }
      thiz.loading = true;
      let currentSize = Object.keys(thiz.justifiedGalleryComplete).length;
      let up = Math.min(
        currentSize + thiz.batchSize,
        thiz.allContent[thiz.currentYear].length
      );
      for (let i = currentSize; i < up; i++) {
        let item = thiz.allContent[thiz.currentYear][i];
        if (
          item.src !== undefined &&
          thiz.justifiedGalleryComplete[item.src] === undefined
        ) {
          if (process.env.NODE_ENV === "production") {
            item.src = `https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/public/${item.src}`;
          }
          thiz.currentContent.push(item);
          thiz.justifiedGalleryComplete[item.src] = false;
        }
      }
      thiz.norewindTimeout = setTimeout(() => {
        clearTimeout(thiz.norewindTimeout);
        if (up === thiz.allContent[thiz.currentYear].length) {
          thiz.allIsLoad = true;
        }
        thiz.norewind();
      }, 400);
      thiz.loadingTimeout = setTimeout(() => {
        clearTimeout(thiz.loadingTimeout);
        thiz.loading = false;
        thiz.showMonthBox();
      }, 800);
    },
    norewind() {
      try {
        jQuery("#gallery-" + this.currentYear).justifiedGallery("norewind");
      } catch (error) {
        // Add your modifications here
        // console.log("Error occurred while calling norewind method:", error);
      }
    },
    destory() {
      jQuery("#gallery-" + this.currentYear).justifiedGallery("destroy");
    },
    showMonthBox() {
      let mb = document.getElementsByClassName("month-box");
      let monthMap = {};
      for (let i = 0; i < mb.length; i++) {
        let month = mb[i].getAttribute("m");
        if (monthMap[month] === undefined) {
          monthMap[month] = true;
          mb[i].style.opacity = 1;
        }
      }
    },
  },
};
</script>

<style lang="css" scoped>
@import "justifiedGallery/dist/css/justifiedGallery.min.css";
</style>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.gallery {
  max-width: 100%;
}
</style>

<style>
.no-margin {
  margin: 0 !important;
}

.no-margin {
  transition: all 1s !important;
}
.jg-entry {
  transition: all 1s !important;
}
.gallery {
  transition: all 3.5s !important;
}
.load-more-btn {
  position: absolute;
  right: 0;
  left: 0;
  margin: auto;
}
.month-box {
  position: absolute;
  font-size: large;
  font-weight: 800;
  width: 100%;
  padding: 4px 0px;
  background: #000000a9;
  transition: all 1.2s !important;
  color: white !important;
}
.month-box span {
  margin: 10px 15px;
}
</style>
