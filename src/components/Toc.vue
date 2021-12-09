<template>
  <transition name="fade5" mode="out-in">
    <div v-if="winWidth >= 900" class="toc">
      <n-anchor
        class="toc-box"
        type="block"
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
    timer: null,
  }),
  mounted: function () {
    this.winHeight = this.getWinHeight();
    this.winWidth = this.getWinWidth();
    window.onresize = () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.winHeight = this.getWinHeight();
        this.winWidth = this.getWinWidth();
      }, 300);
    };
  },
  computed: {
    computedTocList: function () {
      return this.$props.toc;
    },
  },
  methods: {
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
  top: 5rem;
  right: 1rem;
  bottom: 5rem;
  overflow: scroll;
  width: 200px;
}
.toc-item {
  text-align: end;
}
.n-anchor-rail {
  left: initial !important;
  right: 0 !important;
}
</style>
