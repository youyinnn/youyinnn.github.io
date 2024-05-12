<template>
  <n-card class="top-bar" :bordered="false" content-style="padding: 0;" v-cloak>
    <n-space class="tab-box unselectable" justify="start" v-cloak>
      <n-tabs
        v-cloak
        class="tabs"
        :value="tabValue"
        size="small"
        tab-style="width: 50px; justify-content: center;"
      >
        <n-tab
          v-cloak
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          @click="goTo(tab)"
          >{{ tab.text }}
        </n-tab>
      </n-tabs>
      <div class="github-box" v-cloak v-if="!pathname.startsWith('/gallery/')">
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
              Settings
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
      <div class="github-box" style="margin-right: 2em" v-else>
        <n-button
          tiny
          strong
          secondary
          @click="toggleThemeSwitchHandle"
          class="gaThemeBtn"
        >
          <template #icon>
            <!-- <Transition name="fade10"> -->
            <n-icon v-show="!themeValue">
              <moon />
            </n-icon>
            <n-icon v-show="themeValue">
              <sun />
            </n-icon>
            <!-- </Transition> -->
          </template>
          <span style="width: 30px">{{ gThemeText }}</span>
        </n-button>
      </div>
    </n-space>
  </n-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { BrandGithub, Moon, Sun } from "@vicons/tabler";
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
    Moon,
    Sun,
  },
  data: () => ({
    tabs: [],
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
    pathname: location.pathname,
  }),
  created() {
    if (location.pathname.startsWith("/gallery")) {
      this.tabs = [{ name: "gallery", text: "Gallery", route: "/gallery" }];
    } else {
      this.tabs = [
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
          name: "scripts",
          text: "Scripts",
          route: "/scripts",
        },
      ];
    }
  },
  methods: {
    goTo(tab) {
      this.$changeTab(tab.name);
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
          codeTheme: "atom-one-dark",
        });
      } else {
        this.$store.commit("changeThemeConfig", {
          darkTheme: false,
          codeTheme: "atom-one-light",
        });
      }
    },
    codeThemeSelectHandle(value) {
      this.$store.commit("changeThemeConfig", {
        darkTheme: this.$store.state.currentThemeConfig.darkTheme,
        codeTheme: value,
      });
    },
    toggleThemeSwitchHandle() {
      this.themeSwitchHandle(!this.themeValue);
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
    gThemeText() {
      return this.$store.state.currentThemeConfig.darkTheme ? "Dark" : "Light";
    },
  },
  mounted: function () {
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

<style>
[v-cloak] {
  display: none !important;
}
</style>

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
  width: 320px;
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
.gaThemeBtn {
  transition: all 4s !important;
}
</style>
