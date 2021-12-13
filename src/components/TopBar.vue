<template>
  <n-card
    class="top-bar animate__animated animate__fadeIn"
    :bordered="false"
    content-style="padding: 0;"
  >
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
      <div class="github-box">
        <n-tooltip
          placement="bottom-end"
          trigger="click"
          display-directive="show"
          :delay="0"
          :style="{ width: '200px' }"
        >
          <template #trigger>
            <n-button ghost type="tertiary">
              <template v-slot:icon>
                <n-icon :size="20"><brand-github /></n-icon>
              </template>
            </n-button>
          </template>
          <div class="setting-item">
            <div
              style="
                margin-right: 10px;
                display: inline-block;
                width: 79px;
                text-align: end;
              "
            >
              Theme:
            </div>
            <n-switch
              style="width: 111px"
              :value="themeValue"
              @update:value="themeSwitchHandle"
            >
              <template #checked>Light</template>
              <template #unchecked>Dark</template>
            </n-switch>
          </div>
          <div class="setting-item">
            <div style="margin-top: 10px; margin-bottom: 5px">Code theme:</div>
            <n-select
              :value="codeThemeValue"
              :options="codeThemeOptions"
              size="small"
              :virtual-scroll="false"
              @update:value="codeThemeSelectHandle"
            />
          </div>
          <div style="margin-top: 15px" class="setting-item">
            <n-button
              :style="{ width: '100%', padding: '0' }"
              type="success"
              tag="a"
              href="https://github.com/youyinnn"
              target="_blank"
              >Visit My Github</n-button
            >
          </div>
        </n-tooltip>
      </div>
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
  NSelect,
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
    NSelect,
  },
  data: () => ({
    tabs: tabList,
    adjustTimer: 0,
    document,
    codeThemeOptions: [
      {
        label: "Github",
        value: "github",
      },
      {
        label: "Github-Dark",
        value: "github-dark",
      },
    ],
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
          codeTheme: this.codeThemeValue,
        });
      } else {
        this.$store.commit("changeThemeConfig", {
          darkTheme: false,
          codeTheme: this.codeThemeValue,
        });
      }
    },
    codeThemeSelectHandle(value) {
      this.$store.commit("changeThemeConfig", {
        darkTheme: this.$store.state.currentThemeConfig.darkTheme,
        codeTheme: value,
      });
    },
  },
  computed: {
    tabValue() {
      return this.$store.state.currentTab;
    },
    themeValue() {
      return !this.$store.state.currentThemeConfig.darkTheme;
    },
    codeThemeValue() {
      return this.$store.state.currentThemeConfig.codeTheme;
    },
  },
  mounted: function () {
    clearTimeout(this.adjustTimer);
    this.adjustTimer = setTimeout(() => {
      this.adjustTabWidth();
      window.onresize = () => {
        this.adjustTabWidth();
      };
      if (screen !== undefined && screen.orientation !== undefined) {
        screen.orientation.onchange = () => {
          this.adjustTabWidth();
        };
      } else {
        window.onorientationchange = () => {
          this.adjustTabWidth();
        };
      }
    }, 300);
    const codeThemeCssFile = JSON.parse(sessionStorage.codeThemeCss);
    const codeThemeCssFileList = [];
    for (let cssFile of codeThemeCssFile) {
      codeThemeCssFileList.push({
        label: cssFile,
        value: cssFile,
      });
    }
    this.codeThemeOptions = codeThemeCssFileList;
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
  animation-delay: 0.2s;
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
  transition: all 0.5s;
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
.n-switch__rail {
  width: 100%;
}
.n-switch .n-switch__unchecked {
  padding-left: 42px;
}
.n-switch .n-switch__checked {
  padding-right: 42px;
}
/* .n-tabs-tab__label {
  color: rgb(66, 69, 109) !important;
}
.n-tabs-bar {
  background-color: rgb(66, 69, 109) !important; */
/* } */
</style>
