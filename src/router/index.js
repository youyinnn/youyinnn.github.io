import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Article from "../views/Article.vue";
import Script from "../views/Script.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/script",
    name: "Script",
    component: Script,
  },
  {
    path: "/article/:articleId",
    name: "Article",
    component: Article,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
