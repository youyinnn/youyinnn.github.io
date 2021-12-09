import { createStore } from "vuex";

export default createStore({
  state: {
    currentTab: "about",
  },
  mutations: {
    tabChange(state, payload) {
      state.currentTab = payload.tab;
    },
  },
  actions: {},
  modules: {},
});
