import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../src/views/home/index.vue"),
  },
  {
    path: "/fontes",
    name: "Fontes",
    component: () => import("../src/views/sources/index.vue"),
  },
  {
    path: "/noticias",
    name: "Notícias",
    component: () => import("../src/views/news/index.vue"),
  },
  {
    path: "/keywords",
    name: "Keywords",
    component: () => import("../src/views/keywords/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
