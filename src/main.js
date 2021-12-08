import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vfonts/Lato.css";
import "./assets/css/index.less";
import "animate.css";

createApp(App).use(router).use(store).mount("#app");
