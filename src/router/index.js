import { createRouter, createWebHistory } from "vue-router";

import NotFound from "@/views/NotFound";

const routes = [
  {
    path: "/articles",
    name: "Articles",
    component: () => import("@/views/Articles.vue"),
  },
  {
    path: "/scripts",
    name: "ScriptInitial",
    component: () => import("@/views/Script.vue"),
  },
  {
    path: "/scripts/:scriptId",
    name: "Scripts",
    component: () => import("@/views/Script.vue"),
  },
  {
    path: "/article/:category/:abbrlink",
    name: "Article",
    component: () => import("@/views/Article.vue"),
  },
  {
    path: "/",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/About.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
