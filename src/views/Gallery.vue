<template>
  <div id="gallery-canvas" class="unselectable">
    <n-space
      id="year-select"
      v-if="allYears.length > 0"
      style="padding: 18px 18px 0 18px"
    >
      <n-select
        style="width: 160px"
        v-model:value="currentYear"
        :options="allYears"
        @update:value="changeYear"
        :key="`year-select-${currentYear}`"
      />
      <span>{{ currentContent.length }} PHOTOS</span>
    </n-space>
    <div :id="`gallery-${currentYear}`" class="gallery justified-gallery">
      <a v-for="item in currentContent" :key="item.src" class="gallery-item">
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
              height: item.height,
              width: item.width,
              orientation: item.orientation,
            }"
            :alt="`${item.month}-${item.day}`"
          />
        </Transition>
      </a>
    </div>
    <div style="text-align: center; margin: 1em">
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

import html2canvas from "html2canvas";

import { useRouter } from "vue-router";

import { NImage, NIcon, NButton, NSelect, NSpace } from "naive-ui";

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
    NSpace,
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
    allYears: [],
    loadingTimeout: undefined,
    norewindTimeout: undefined,
  }),
  created: function () {
    this.currentYear = this.$route.params.year;
    const thiz = this;
    if (this.currentYear === undefined) {
      // this.currentYear = this.allYears[0].value;
      axios.get(`${process.env.BASE_URL}gallery_list.json`).then((response) => {
        thiz.allContent = response.data;
        location.href =
          location.origin + "/gallery/" + thiz.allContent[0]["year"];
      });
    }
    const { currentRoute } = useRouter();
    this.currentRoute = currentRoute;

    this.batchSize =
      currentRoute.value.query.batchSize === undefined
        ? this.batchSize
        : currentRoute.value.query.batchSize;
    console.log("Batch size: " + this.batchSize);
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
        global.downloadCanvas = thiz.downloadCanvas;
        global.currentContent = thiz.currentContent;
        thiz.allContent.forEach((k) => {
          thiz.allYears.push({
            label: k["year"],
            value: k["year"],
          });
        });
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
    transformJsonData(originalData) {
      const rs = {};
      for (let i = 0; i < originalData.length; i++) {
        rs[originalData[i]["year"]] = originalData[i]["data"];
      }
      return rs;
    },
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
          rowHeight: 350,
          margins: 18,
          selector: "#gallery-" + thiz.currentYear + " > a",
          imgSelector: "> div > img",
          // lastRow: "center",
          refreshTime: 5000,
          captions: false,
          waitThumbnailsLoad: false,
        })
        .on("jg.complete", function () {
          thiz.show();
        });
    },
    getDataByYear(year) {
      return this.allContent.find((e) => e["year"] === year)["data"];
    },
    load() {
      var thiz = this;
      if (thiz.allContent === undefined) {
        return;
      }
      this.offset =
        this.currentRoute.value.query.offset === undefined
          ? 0
          : Number(this.currentRoute.value.query.offset);

      thiz.loading = true;
      let currentSize = Object.keys(thiz.justifiedGalleryComplete).length;
      var curr = thiz.getDataByYear(thiz.currentYear);
      let up = Math.min(currentSize + thiz.batchSize, curr.length);
      for (let i = currentSize; i < up; i++) {
        let item = curr[Math.min(this.offset + i, curr.length - 1)];
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
        if (up === curr.length) {
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
        console.log("Error occurred while calling norewind method:", error);
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
    downloadCanvas(scale, fm) {
      let thiz = this;
      let el = document.querySelector("#gallery-canvas");
      let format = fm === undefined ? "jpeg" : fm;
      let options = {
        backgroundColor: null,
        useCORS: true,
        scale: scale === undefined ? 2 : scale,
        type: format,
      };
      html2canvas(el, options).then((canvas) => {
        // console.log(canvas);
        // console.log(thiz.currentYear);
        let dataUrl = canvas.toDataURL("image/" + format);
        var addE = document.createElement("a");
        addE.href = dataUrl;
        addE.download = "gallery-" + thiz.currentYear + "." + format;
        document.body.appendChild(addE);
        addE.click();
        document.body.removeChild(addE);
      });
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

.gallery-item:hover {
  /* transform: scale(1.02); */
}

.no-margin,
.jg-entry {
  transition: opacity 1.2s ease-in-out !important;
  transition: height 1.8s ease-in-out 1s, left 1.8s ease-in-out 1s,
    width 1.8s ease-in-out 1s !important;
}

.gallery {
  transition: all 2.5s ease-in-out !important;
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
#gallery-canvas {
  max-width: none !important;
}
</style>
