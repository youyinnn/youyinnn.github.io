import { createRouter, createWebHistory } from "vue-router";
import About from "@/views/About.vue";
import Home from "@/views/Home.vue";
import Script from "@/views/Script.vue";
import Article from "@/views/Article.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/articles",
    name: "Home",
    component: Home,
  },
  {
    path: "/script",
    name: "ScriptInitial",
    component: Script,
  },
  {
    path: "/script/:scriptId",
    name: "Script",
    component: Script,
  },
  {
    path: "/article/:articleId",
    name: "Article",
    component: Article,
  },
  {
    path: "/",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
