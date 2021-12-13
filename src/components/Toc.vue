<template>
  <transition v-show="tocShow" name="fade5" mode="out-in">
    <div id="toc-box" class="toc-box">
      <n-anchor :show-background="true" ignore-gap :bound="winHeight / 2">
        <n-anchor-link
          class="toc-item"
          v-for="toc of computedTocList"
          :key="toc.id"
          :title="toc.content"
          :href="'#' + toc.id"
        />
      </n-anchor>
    </div>
  </transition>
</template>

<script>
import { NAnchor, NAnchorLink } from "naive-ui";

export default {
  props: ["toc"],
  components: {
    NAnchor,
    NAnchorLink,
  },
  data: () => ({
    winHeight: 0,
    winWidth: 0,
    resizeTimer: 0,
    tocShow: false,
  }),
  mounted: function () {
    this.winHeight = this.getWinHeight();
    this.winWidth = this.getWinWidth();
    this.adjustTocRight();
    setTimeout(() => {
      window.onresize = () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.adjustTocRight();
          this.winHeight = this.getWinHeight();
          this.winWidth = this.getWinWidth();
        }, 100);
      };
    }, 300);
  },
  computed: {
    computedTocList: function () {
      return this.$props.toc;
    },
  },
  watch: {
    winWidth() {
      if (this.getLeft() >= 120) {
        this.tocShow = true;
      } else {
        this.tocShow = false;
      }
    },
  },
  methods: {
    adjustTocRight: function () {
      const el = document.getElementById("toc-box");
      if (el !== null) {
        if (this.getLeft() - 60 < 0) {
          el.style.width = "0";
        } else {
          el.style.width = this.getLeft() - 60 + "px";
        }
        el.style.maxHeight = this.getWinHeight() * 0.8 + "px";
      }
    },
    getLeft: function () {
      return (this.getWinWidth() - 800) / 2;
    },
    getWinWidth: function () {
      let winWidth = 0;
      if (window.innerWidth) winWidth = window.innerWidth;
      else if (document.body && document.body.clientWidth)
        winWidth = document.body.clientWidth;
      return winWidth;
    },
    getWinHeight: function () {
      let winHeight = 0;
      if (window.innerHeight) winHeight = window.innerHeight;
      else if (document.body && document.body.clientHeight)
        winHeight = document.body.clientHeight;
      return winHeight;
    },
  },
};
</script>

<style>
.toc-box {
  position: fixed;
  top: 6rem;
  overflow: scroll;
  /* width: 200px; */
  right: 2rem;
  transition: all 0.5s;
}
</style>
