import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/index.less";
import "@/assets/css/font/fonts.css";
import "animate.css";
import resources from "@/assets/resources/resources.js";

const resourceList = resources.list;
for (let rs of resourceList) {
  require(`@/assets/resources/${rs}`);
}

const vue = createApp(App);
console.log("Vue on: " + vue.version);
vue.use(router).use(store);

// global
vue.config.globalProperties.$changeTab = (tabName) => {
  console.log("");
  console.log("Global tab changing");
  store.commit("tabChange", {
    tab: tabName,
  });
  console.log("");
};

vue.mount("#app");
