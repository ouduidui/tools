import BaseController from './base';

export default class BiliBiliController extends BaseController {
  public async videoList() {
    const { ctx } = this;
    const uid = ctx.params.id;
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
}
