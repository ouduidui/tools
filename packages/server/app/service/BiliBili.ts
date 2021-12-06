import { Service } from 'egg';
import { CommentListResponse, CommentType, PaginationType, VideoListResponse } from 'biliBili';

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
   * getVideoList
   * @public
   * @param vid {string}
   * @param page {number}
   */
  public async getCommentList(vid: string, page = 1): Promise<[string, any]> {
    return await this._getCommentList(vid, page);
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
          return [ '', this._videoListResponseHandle(data.data.list.vlist) ] as [string, any];
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
  private _videoListResponseHandle(list: any): VideoListResponse[] {
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

  /**
   * 获取评论
   * @param vid {string}
   * @param page {number}
   * @private
   */
  private async _getCommentList(vid :string, page = 1): Promise<[string, any]> {
    try {
      const { ctx } = this;
      const { status, data } = await ctx.curl(`https://api.bilibili.com/x/v2/reply?type=1&pn=${page}&oid=${vid}&sort=0`, {
        dataType: 'json',
      });
      if (status === 200) {
        const { code, message } = data;
        if (code === 0) {
          return [ '', this._commentListResponseHandle(data.data) ] as [string, any];
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
   * 评论数据处理
   * @param data {any}
   * @private
   */
  private _commentListResponseHandle(data: any): CommentListResponse {
    const { page, replies } = data;
    const pagination: PaginationType = {
      pages: Math.ceil(page.count / page.size),
      page: page.num,
      total: page.count,
      limit: page.size,
    };

    const comments: CommentType[] = [];
    BiliBili._commentsPushHandle(comments, replies);

    return {
      pagination,
      comments,
    };
  }

  private static _commentsPushHandle(comments: CommentType[], replies: any) {
    for (let i = 0; i < replies.length; i++) {
      const r:any = replies[i];
      comments.push({
        member: {
          uid: r.member.mid,
          name: r.member.uname,
          sex: r.member.sex,
          level: r.member.level_info.current_level,
        },
        content: r.content.message,
        created: r.ctime,
        like: r.like,
        reply: r.rcount,
      });

      if (r.replies && r.replies.length) {
        BiliBili._commentsPushHandle(comments, r.replies);
      }
    }
  }
}
