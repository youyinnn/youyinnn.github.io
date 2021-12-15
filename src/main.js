import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/index.less";
import "animate.css";
import resources from "@/assets/resources/resources.js";

const resourceList = resources.list;
for (let rs of resourceList) {
  require(`@/assets/resources/${rs}`);
}

createApp(App).use(router).use(store).mount("#app");
