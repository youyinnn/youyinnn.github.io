<template>
  <n-card class="top-bar" :bordered="false" content-style="padding: 0;">
    <n-space class="tab-box unselectable" justify="start">
      <n-tabs
        class="tabs"
        :value="tabValue"
        type="line"
        size="small"
        tab-style="width: 50px; justify-content: center;"
      >
        <n-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          @click="goTo(tab)"
          >{{ tab.text }}
        </n-tab>
      </n-tabs>
      <!-- <n-icon size="28">
        < />
      </n-icon> -->
      <div class="github-box">
        <n-tooltip
          placement="bottom-end"
          trigger="click"
          display-directive="show"
          :delay="0"
        >
          <template #trigger>
            <n-button ghost type="tertiary">
              <template v-slot:icon>
                <n-icon :size="20"><brand-github /></n-icon>
              </template>
            </n-button>
          </template>
          <div class="setting-item">
            <div style="margin-right: 10px; display: inline-block">Theme:</div>
            <n-switch :value="themeValue" @update:value="themeSwitchHandle">
              <template #checked>Light Theme</template>
              <template #unchecked>Dark Theme</template>
            </n-switch>
          </div>
        </n-tooltip>
      </div>
      <!-- <n-gradient-text  :size="16" type="success"> -->
      <!-- déjà vu -->
      <!-- </n-gradient-text> -->
    </n-space>
  </n-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { BrandGithub } from "@vicons/tabler";
import {
  NTabs,
  NTab,
  NSpace,
  NCard,
  NGradientText,
  NIcon,
  NButton,
  NTooltip,
  NSwitch,
} from "naive-ui";

const tabList = [
  {
    name: "about",
    text: "About",
    route: "/",
  },
  {
    name: "articles",
    text: "Articles",
    route: "/articles",
  },
  {
    name: "script",
    text: "Script",
    route: "/script",
  },
];

export default {
  name: "TopBar",
  components: {
    NCard,
    NTabs,
    NTab,
    NSpace,
    // eslint-disable-next-line vue/no-unused-components
    NGradientText,
    NIcon,
    BrandGithub,
    NButton,
    NTooltip,
    NSwitch,
  },
  data: () => ({
    tabs: tabList,
    adjustTimer: 0,
    document,
  }),
  methods: {
    goTo(tab) {
      this.$store.commit("tabChange", {
        tab: tab.name,
      });
      this.$router.push(tab.route).catch(() => {});
    },
    getPageWidth() {
      const pageEl = document.getElementsByClassName("page");
      if (pageEl.length >= 1) {
        return document.getElementsByClassName("page")[0].clientWidth;
      } else {
        return this.getWinWidth();
      }
    },
    getWinWidth: function () {
      let winWidth = 0;
      if (window.innerWidth) winWidth = window.innerWidth;
      else if (document.body && document.body.clientWidth)
        winWidth = document.body.clientWidth;
      return winWidth;
    },
    adjustTabWidth() {
      document.getElementsByClassName("tabs")[0].style.width =
        this.getPageWidth() - 90 + "px";
    },
    themeSwitchHandle(value) {
      if (!value) {
        this.$store.commit("changeThemeConfig", {
          darkTheme: true,
        });
      } else {
        this.$store.commit("changeThemeConfig", {
          darkTheme: false,
        });
      }
    },
  },
  computed: {
    tabValue() {
      return this.$store.state.currentTab;
    },
    themeValue() {
      return !this.$store.state.currentThemeConfig.darkTheme;
    },
  },
  mounted: function () {
    clearTimeout(this.adjustTimer);
    this.adjustTimer = setTimeout(() => {
      this.adjustTabWidth();
      window.onresize = () => {
        this.adjustTabWidth();
      };
    }, 300);
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/index.less";

.top-bar {
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
  top: 0;
  height: @top-bar-height;
  border-radius: 0;
  // background-color: aquamarine;
}

.tab-box {
  position: absolute;
  margin: auto;
  right: 0;
  left: 0;
  margin-top: 1rem !important;
  max-width: @page-max-width;
  padding: 0 1rem;
  height: 40px;
}
.tabs {
  width: 300px;
  position: absolute;
}
.github-box {
  position: absolute;
  right: 0;
  top: 0;
  margin: auto;
  bottom: 0;
  margin-right: 1rem;
}
.setting-item {
  margin: 5px 0;
}
</style>

<style>
/* .n-tabs-tab__label {
  color: rgb(66, 69, 109) !important;
}
.n-tabs-bar {
  background-color: rgb(66, 69, 109) !important; */
/* } */
</style>
