import { createStore } from "vuex";

const pathName = location.pathname;
var initialRoute = "about";

if (pathName.startsWith("/article")) {
  initialRoute = "articles";
}
if (pathName.startsWith("/script")) {
  initialRoute = "script";
}

export default createStore({
  state: {
    currentTab: initialRoute,
  },
  mutations: {
    tabChange(state, payload) {
      state.currentTab = payload.tab;
    },
  },
  actions: {},
  modules: {},
});
