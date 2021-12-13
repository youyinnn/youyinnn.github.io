import { createStore } from "vuex";

const pathName = location.pathname;
var initialRoute = "about";

if (pathName.startsWith("/article")) {
  initialRoute = "articles";
}
if (pathName.startsWith("/script")) {
  initialRoute = "script";
}

const initialCurrentThemeConfig = localStorage.getItem("__currentThemeConfig");

export default createStore({
  state: {
    currentTab: initialRoute,
    currentThemeConfig:
      initialCurrentThemeConfig === null
        ? {
            darkTheme: true,
            codeTheme: "github-dark-dimmed",
          }
        : JSON.parse(initialCurrentThemeConfig),
  },
  mutations: {
    tabChange(state, payload) {
      state.currentTab = payload.tab;
    },
    changeThemeConfig(state, payload) {
      if (payload.codeTheme === undefined) {
        payload.codeTheme = state.currentThemeConfig.codeTheme;
      }
      state.currentThemeConfig = payload;
      localStorage.setItem(
        "__currentThemeConfig",
        JSON.stringify(state.currentThemeConfig)
      );
    },
  },
  actions: {},
  modules: {},
});
