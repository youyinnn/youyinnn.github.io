import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vfonts/Lato.css";
import "./assets/css/index.less";
import "animate.css";
import resources from "@/assets/resources/resources.js";

if (sessionStorage.getItem("postMetadata") === null) {
  const resourceList = resources.list;
  for (let rs of resourceList) {
    require(`@/assets/resources/${rs}`);
  }
}

createApp(App).use(router).use(store).mount("#app");
