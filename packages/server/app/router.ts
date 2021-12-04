import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  // 通过哔哩哔哩用户ID获取视频列表
  router.get('/api/crawler/bili-bili/video-list/:uid', controller.biliBili.videoList);
  router.get('/api/crawler/bili-bili/comments-list/:vid', controller.biliBili.commentList);
};
