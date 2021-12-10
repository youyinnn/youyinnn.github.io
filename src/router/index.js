import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/articles",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/script",
    name: "Script",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Script.vue"),
  },
  {
    path: "/article/:articleId",
    name: "Article",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Article.vue"),
  },
  {
    path: "/",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
