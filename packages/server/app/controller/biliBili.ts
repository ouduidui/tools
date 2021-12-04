import BaseController from './base';

export default class BiliBiliController extends BaseController {
  public async videoList() {
    const { ctx } = this;
    const uid = ctx.params.uid;
    if (!uid) {
      return await this.fail('请输入哔哩哔哩用户ID');
    }

    const [ errMsg, data ] = await ctx.service.biliBili.getVideoList(uid);
    if (data) {
      await this.success('获取列表成功', data);
    } else {
      await this.fail(errMsg || '获取列表失败');
    }
  }

  public async commentList() {
    const { ctx } = this;
    const vid = ctx.params.vid;
    const page = ctx.query.page || 1;
    if (!vid) {
      return await this.fail('请输入视频ID');
    }

    const [ errMsg, data ] = await ctx.service.biliBili.getCommentList(vid, Number(page));
    if (data) {
      await this.success('获取列表成功', data);
    } else {
      await this.fail(errMsg || '获取列表失败');
    }
  }
}
