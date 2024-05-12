import { createStore } from "vuex";
import { setBodyCss } from "../../public/preLoadingBody";

const pathName = location.pathname;
var initialRoute = "none";
if (pathName === "/") {
  initialRoute = "about";
}

if (pathName.startsWith("/article")) {
  initialRoute = "articles";
}
if (pathName.startsWith("/scripts")) {
  initialRoute = "scripts";
}

if (pathName.startsWith("/gallery")) {
  initialRoute = "gallery";
}

const initialCurrentThemeConfig = localStorage.getItem("__currentThemeConfig");

export default createStore({
  state: {
    firstRouteLazyLoaded: false,
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
      console.log("Change tab to: ", payload);
      state.currentTab = payload.tab;
      state.firstRouteLazyLoaded = true;
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
      setBodyCss();
    },
    routeLoad(state, payload) {
      console.log(payload);
      state.firstRouteLazyLoaded = payload.load;
    },
  },
  actions: {},
  modules: {},
});
