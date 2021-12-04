import { Service } from 'egg';
import { VideoListResponse } from 'biliBili';

/**
 * BiliBili Service
 */
export default class BiliBili extends Service {

  /**
   * getVideoList
   * @param uid {string}
   * @public
   */
  public async getVideoList(uid: string): Promise<[string, any]> {
    return await this._getVideoList(uid);
  }

  /**
   * 获取视频列表
   * @param uid {string}
   * @private
   */
  private async _getVideoList(uid: string): Promise<[string, any]> {
    try {
      const { ctx } = this;
      const { status, data } = await ctx.curl(`https://api.bilibili.com/x/space/arc/search?mid=${uid}&jsonp=jsonp`, {
        dataType: 'json',
      });
      if (status === 200) {
        const { code, message } = data;
        if (code === 0) {
          return [ '', BiliBili._videoListResponseHandle(data.data.list.vlist) ] as [string, any];
        }
        return [ message, null ];
      }
      return [ data.message, null ] as [string, any];
    } catch (e) {
      console.log(e);
      return [ e.message, null ] as [string, any];
    }
  }

  /**
   * 处理视频数据
   * @param list {any}
   * @private
   */
  private static _videoListResponseHandle(list: any): VideoListResponse[] {
    return list.map(v => {
      return {
        id: v.aid,
        title: v.title,
        play: v.play,
        comment: v.comment,
        created: v.created,
      } as VideoListResponse;
    });
  }
}
