import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/fontes",
    name: "Fontes",
    component: () => import("../src/views/Sources.vue"),
  },
  {
    path: "/noticias",
    name: "Notícias",
    component: () => import("../src/views/News.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
