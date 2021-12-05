import {createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/',
    component: () => import('../views/index.vue'),
  },
  {
    name: 'web-crawler-bilibili',
    path: '/web-crawler/bilibili',
    component: () => import('../views/webCrawler/biliBili/index.vue'),
    meta: {
      title: '哔哩哔哩'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 前置钩子
router.beforeEach((to: RouteLocationNormalized, from, next) => {
  to.meta.title && (document.title = to.meta.title as string);

  next();
});

export default router;
