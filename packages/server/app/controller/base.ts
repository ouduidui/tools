import { Controller } from 'egg';

export default class BaseController extends Controller {
  // 成功返回
  public async success(message: string, data: any = null) {
    const { ctx } = this;

    ctx.body = {
      code: 0,
      message,
      data,
    };
  }

  // 错误返回
  public async fail(message: string) {
    const { ctx } = this;
    ctx.body = {
      code: -1,
      message,
    };
  }
}
