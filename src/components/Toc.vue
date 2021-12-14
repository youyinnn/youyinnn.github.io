<template>
  <transition v-show="tocShow" name="fade5" mode="out-in">
    <div id="toc-box" class="toc-box">
      <n-anchor :show-background="true" ignore-gap :bound="winHeight / 2">
        <transition-group
          name="staggered-fade"
          :css="false"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <n-anchor-link
            v-for="(toc, index) in tocList"
            :key="toc.id"
            :data-index="index"
            :title="toc.content"
            :href="'#' + toc.id"
          />
        </transition-group>
      </n-anchor>
    </div>
  </transition>
</template>

<script>
import { NAnchor, NAnchorLink } from "naive-ui";
import gsap from "gsap";

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
    tocList: [],
  }),
  mounted() {
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
    // if (this.tocList.length > 0) {
    this.tocList.splice(0, this.tocList.length);
    for (let it of this.toc) {
      this.tocList.push(it);
    }
    // }
  },
  watch: {
    winWidth() {
      if (this.getLeft() >= 120) {
        this.tocShow = true;
      } else {
        this.tocShow = false;
      }
    },
    // eslint-disable-next-line no-unused-vars
    toc(nv) {
      while (this.tocList.length > 0) {
        this.tocList.splice(0, 1);
      }
      for (let it of nv) {
        this.tocList.splice(this.tocList.length + 1, 0, it);
      }
      // setTimeout(() => {
      //   this.tocList.splice(this.tocList.length + 1, 0, nv[0]);
      // }, 100);
    },
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    // eslint-disable-next-line no-unused-vars
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: "1em",
        delay: el.dataset.index * 0.03,
        onComplete: done,
      });
    },
    // eslint-disable-next-line no-unused-vars
    leave(el) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0.01,
        // onComplete: done,
      });
    },
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
