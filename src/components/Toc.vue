<template>
  <transition name="fade5" mode="out-in">
    <div id="toc-box" class="toc-box">
      <n-anchor
        v-if="winWidth >= 900"
        :show-background="true"
        ignore-gap
        :bound="winHeight / 2"
      >
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
  }),
  mounted: function () {
    this.winHeight = this.getWinHeight();
    this.winWidth = this.getWinWidth();
    this.adjustTocRight();
    window.onresize = () => {
      this.adjustTocRight();
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.winHeight = this.getWinHeight();
        this.winWidth = this.getWinWidth();
      }, 100);
    };
  },
  computed: {
    computedTocList: function () {
      return this.$props.toc;
    },
  },
  methods: {
    adjustTocRight: function () {
      const el = document.getElementById("toc-box");
      if (el !== null) el.style.width = this.getLeft() - 60 + "px";
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
  bottom: 4rem;
  overflow: scroll;
  /* width: 200px; */
  right: 2rem;
}
</style>
