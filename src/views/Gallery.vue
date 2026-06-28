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
      <span
        >{{ shownCount }} /
        {{ allContent ? getDataByYear(currentYear).length : 0 }} PHOTOS</span
      >
    </n-space>
    <div
      :id="`gallery-${currentYear}`"
      class="gallery"
      :style="{ padding: `${galleryPadding}px` }"
    >
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="gallery-row"
        :style="{ height: `${row.height}px`, marginBottom: `${margins}px` }"
      >
        <a
          v-for="cell in row.cells"
          :key="cell.item.src"
          class="gallery-item"
          :style="{
            width: `${cell.width}px`,
            height: `${row.height}px`,
            marginRight: `${cell.isLast ? 0 : margins}px`,
          }"
        >
          <Transition name="fade10">
            <div
              v-if="cell.showMonth"
              :id="`month-box-${cell.item.src}`"
              class="month-box"
              :m="`${cell.item.month}`"
            >
              <span>{{ months[cell.item.month - 1] }}</span>
            </div>
          </Transition>
          <n-image
            :id="`image-${cell.item.src}`"
            :src="cell.item.src"
            :width="cell.width"
            :height="row.height"
            object-fit="cover"
            :img-props="{
              class: 'no-margin',
              orientation: cell.item.orientation,
            }"
            :alt="`${cell.item.month}-${cell.item.day}`"
          />
        </a>
      </div>
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
    batchSize: 30,
    loading: false,
    allIsLoad: false,
    // 布局配置
    targetRowHeight: 400,
    margins: 18,
    galleryPadding: 18,
    containerWidth: 0,
    // 已加入布局的图片(按数据顺序)
    loaded: [],
    // 已定稿的完整行: { height, cells: [{ item, width, isLast, showMonth }] }
    completedRows: [],
    // 上一批结束后剩下、还没凑满一行的残余图片(尚未显示)
    pendingItems: [],
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
    seenMonths: {},
    resizeTimeout: undefined,
  }),
  computed: {
    // 模板渲染用的行集合。allIsLoad 时把残行也作为末行补上。
    rows() {
      if (this.allIsLoad && this.pendingItems.length > 0) {
        return this.completedRows.concat([
          this.buildLastRow(this.pendingItems),
        ]);
      }
      return this.completedRows;
    },
    shownCount() {
      let n = 0;
      for (const r of this.completedRows) n += r.cells.length;
      if (this.allIsLoad) n += this.pendingItems.length;
      return n;
    },
  },
  created: function () {
    this.currentYear = this.$route.params.year;
    const thiz = this;
    if (this.currentYear === undefined) {
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
        : Number(currentRoute.value.query.batchSize);
    console.log("Batch size: " + this.batchSize);
  },
  mounted: function () {
    console.log("Gallery mounted");
    document.title = "Gallery";
    const thiz = this;

    this.measureContainer();

    axios
      .get(`${process.env.BASE_URL}gallery_list.json`)
      .then((response) => {
        thiz.allContent = response.data;
        thiz.allContent.forEach((k) => {
          thiz.allYears.push({ label: k["year"], value: k["year"] });
        });
        global.load = thiz.load;
        global.downloadCanvas = thiz.downloadCanvas;
      })
      .finally(() => {
        thiz.load();
      });

    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount: function () {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    changeYear(value) {
      location.href = `/gallery/${value}`;
    },
    getDataByYear(year) {
      return this.allContent.find((e) => e["year"] === year)["data"];
    },
    // 容器内部可用宽度(减去左右 padding)。
    measureContainer() {
      const el = document.getElementById("gallery-" + this.currentYear);
      const ref = el || document.getElementById("gallery-canvas");
      if (ref) {
        this.containerWidth = ref.clientWidth - 2 * this.galleryPadding;
      }
    },
    aspect(item) {
      return item.width / item.height;
    },
    // 把一组图片按“铺满容器宽度”缩放成完整的一行，返回定稿后的行。
    justifyRow(items) {
      const totalMargins = (items.length - 1) * this.margins;
      const available = this.containerWidth - totalMargins;
      let aspectSum = 0;
      for (const it of items) aspectSum += this.aspect(it);
      const height = available / aspectSum;
      const cells = items.map((item, i) => ({
        item,
        width: this.aspect(item) * height,
        isLast: i === items.length - 1,
        showMonth: this.markMonth(item),
      }));
      return { height, cells };
    },
    // 末行(不铺满)：用目标行高，按原比例显示，左对齐。
    buildLastRow(items) {
      const height = this.targetRowHeight;
      const cells = items.map((item, i) => ({
        item,
        width: this.aspect(item) * height,
        isLast: i === items.length - 1,
        showMonth: this.markMonth(item),
      }));
      return { height, cells };
    },
    // 每个月份只在第一次出现时显示 month-box。
    markMonth(item) {
      const m = item.month;
      if (this.seenMonths[m]) return false;
      this.seenMonths[m] = true;
      return true;
    },
    // 把 pendingItems + 新加入的图片切成尽可能多的完整行，
    // 凑不满一行的尾部重新存回 pendingItems。已定稿的行永不改动。
    packRows() {
      if (this.containerWidth <= 0) return;
      let buffer = this.pendingItems.slice();
      let rowItems = [];
      let aspectSum = 0;
      this.pendingItems = [];

      for (const item of buffer) {
        const a = this.aspect(item);
        const margs = rowItems.length * this.margins;
        const projectedHeight = (this.containerWidth - margs) / (aspectSum + a);
        rowItems.push(item);
        aspectSum += a;
        // 当投影行高 <= 目标行高，说明这一行已经够满，定稿。
        if (projectedHeight <= this.targetRowHeight) {
          this.completedRows.push(this.justifyRow(rowItems));
          rowItems = [];
          aspectSum = 0;
        }
      }
      // 剩下凑不满的留待下一批。
      this.pendingItems = rowItems;
    },
    load() {
      const thiz = this;
      if (thiz.allContent === undefined || thiz.allIsLoad) return;

      this.offset =
        this.currentRoute.value.query.offset === undefined
          ? 0
          : Number(this.currentRoute.value.query.offset);

      this.measureContainer();
      thiz.loading = true;

      const curr = thiz.getDataByYear(thiz.currentYear);
      const start = thiz.loaded.length;
      const up = Math.min(start + thiz.batchSize, curr.length);
      const batch = [];
      for (let i = start; i < up; i++) {
        const item = curr[Math.min(this.offset + i, curr.length - 1)];
        if (item.src === undefined) continue;
        if (
          process.env.NODE_ENV === "production" &&
          !item.src.startsWith("http")
        ) {
          item.src = `https://hjalbum001.oss-cn-hangzhou.aliyuncs.com${item.src}`;
        }
        thiz.loaded.push(item);
        batch.push(item);
      }

      thiz.pendingItems = thiz.pendingItems.concat(batch);
      thiz.packRows();

      if (up === curr.length) {
        thiz.allIsLoad = true; // 触发 computed 把残行作为末行补上
      }
      thiz.loading = false;

      // 首批/小批可能填不满视口，没有滚动条就永远不会触发 onScroll。
      // 渲染后检查，如果还没填满视口且未加载完，继续加载。
      thiz.$nextTick(() => thiz.fillViewport());
    },
    fillViewport() {
      if (this.allIsLoad || this.loading) return;
      const html = document.documentElement;
      const docHeight = Math.max(
        document.body.scrollHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowHeight =
        "innerHeight" in window ? window.innerHeight : html.offsetHeight;
      if (docHeight <= windowHeight + 10) {
        this.load();
      }
    },
    onScroll() {
      const html = document.documentElement;
      const body = document.body;
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
      // 距底部还有一个视口高度时就预加载，避免滚到底才出现空白再等图片。
      const threshold = windowHeight;
      if (
        windowBottom + threshold >= docHeight &&
        !this.allIsLoad &&
        !this.loading
      ) {
        this.load();
      }
    },
    // 容器宽度变化时全量重排(已显示图片本就需要重新铺满，不可避免)。
    onResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        const prevWidth = this.containerWidth;
        this.measureContainer();
        if (this.containerWidth === prevWidth || this.containerWidth <= 0) {
          return;
        }
        this.relayout();
      }, 200);
    },
    relayout() {
      this.completedRows = [];
      this.pendingItems = this.loaded.slice();
      this.seenMonths = {};
      this.packRows();
    },
    downloadCanvas(scale, fm) {
      const thiz = this;
      const el = document.querySelector("#gallery-canvas");
      const format = fm === undefined ? "jpeg" : fm;
      const options = {
        backgroundColor: null,
        useCORS: true,
        scale: scale === undefined ? 2 : scale,
        type: format,
      };
      html2canvas(el, options).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/" + format);
        const addE = document.createElement("a");
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

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.gallery {
  max-width: 100%;
}
</style>

<style>
.gallery-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.gallery-item {
  position: relative;
  display: block;
  overflow: hidden;
}
.gallery-item .n-image,
.gallery-item img {
  width: 100%;
  height: 100%;
  display: block;
}
.no-margin {
  margin: 0 !important;
}

.n-image-preview-overlay {
  background: rgba(0, 0, 0, 0.9) !important;
}

#gallery-canvas {
  --anim-duration: 0.7s;
}

.month-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  font-size: 24pt;
  font-weight: 800;
  width: 100%;
  padding: 4px 0px;
  background: #000000a9;
  color: white !important;
}
.month-box span {
  margin: 10px 15px;
}
.load-more-btn {
  position: absolute;
  right: 0;
  left: 0;
  margin: auto;
}
#gallery-canvas {
  max-width: none !important;
}
</style>
