import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/web-crawler/bilibili',
    component: () => import('../views/webCrawler/biliBili/index.vue')
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
