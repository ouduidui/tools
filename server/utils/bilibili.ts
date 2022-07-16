
import type { BaseReturnType } from '../types/returnType'
import { request } from './request'

const BILIBILI_API = {
  VIDEO_LIST: {
    method: 'get',
    url: 'https://api.bilibili.com/x/space/arc/search',
  },
  VIDEO_COMMENT: {
    method: 'get',
    url: 'https://api.bilibili.com/x/v2/reply',
  },
  VIDEO_COMMENT_REPLY: {
    method: 'get',
    url: 'https://api.bilibili.com/x/v2/reply/reply',
  },
}

interface BVideoType {
  id: number
  bvid: string
  title: string
  play: number
  comment: number
  created: number
}

interface BVideoListResponseType {
  list: BVideoType[]
  page: {
    total: number
    currentPage: number
    pageSize: number
  }
}

interface BVideoCommentListResponseType {
  list: CommentResType[]
  page: {
    total: number
    currentPage: number
    pageSize: number
  }
}

interface BCommentsType {
  page: {
    num: number
    size: number
    count: number
  }
  replies: BCommentReplyType[]
}

interface BCommentReplyType {
  rpid: number
  oid: number
  rcount: number // reply count
  like: number
  ctime: number
  content: {
    message: string
  }
  member: {
    mid: string
    uname: string
    sex: string
    level_info: {
      current_level: number
    }
  }
}

interface CommentResType {
  content: string
  created: number
  like: number
  reply: number
  member: {
    uid: string
    name: string
    sex: string
    level: number
  }
}

const videoListResHandle = (list: any[]): BVideoType[] => {
  return list.map((v) => {
    return {
      id: v.aid,
      title: v.title,
      play: v.play,
      comment: v.comment,
      created: v.created,
      bvid: v.bvid,
    }
  })
}

export interface VideoListOptions {
  page: number
  limit: number
  sort: 'stow' | 'click' | 'pubdate'
  keyword: string
}

/**
 * 通过uid获取用户列表
 * @param uid
 * @returns
 */
export const getVideoListByUid = async (
  uid: string,
  {
    page: pn,
    limit: ps,
    sort: order,
    keyword,
  }: VideoListOptions,
): Promise<BaseReturnType<BVideoListResponseType>> => {
  try {
    const [err, res] = await request({
      url: BILIBILI_API.VIDEO_LIST.url,
      method: BILIBILI_API.VIDEO_LIST.method,
      params: {
        jsonp: 'jsonp',
        mid: uid,
        pn,
        ps,
        order,
        keyword,
      },
    })

    if (err) {
      return [err, null]
    }
    else {
      const { status, data } = res
      if (status === 200 && data.code === 0) {
        return [null, {
          list: videoListResHandle(data.data.list.vlist),
          page: {
            currentPage: data.data.page.pn,
            total: data.data.page.count,
            pageSize: data.data.page.ps,
          },
        }]
      }
      else { return [data.message, null] }
    }
  }
  catch (error) {
    return [error.message, null]
  }
}

const getCommentReply = async (
  rpid: number,
  oid: number,
  page = 1): Promise<BaseReturnType<BCommentsType>> => {
  try {
    const [err, res] = await request({
      url: BILIBILI_API.VIDEO_COMMENT_REPLY.url,
      method: BILIBILI_API.VIDEO_COMMENT_REPLY.method,
      params: {
        type: 1,
        pn: page,
        oid,
        root: rpid,
        sort: 0,
      },
      headers: {
        dataType: 'json',
      },
    })

    if (err) return [err, null]
    const { status, data } = res
    if (status === 200 && data.code === 0)
      return [null, data.data as BCommentsType]
    else
      return [data.message, null]
  }
  catch (err) {
    return [err.message, null]
  }
}

const commentFormat = (reply: BCommentReplyType) => ({
  content: reply.content.message,
  created: reply.ctime,
  like: reply.like,
  reply: reply.rcount,
  member: {
    uid: reply.member.mid,
    name: reply.member.uname,
    sex: reply.member.sex,
    level: reply.member.level_info.current_level,
  },
})

const videoCommentsListResHandle = async (vid: string, { replies }: BCommentsType): Promise<BaseReturnType<CommentResType[]>> => {
  const result: CommentResType[] = []
  for await (const reply of replies) {
    result.push(commentFormat(reply))

    // 获取评论回复
    if (reply.rcount) {
      const [err, res] = await getCommentReply(reply.rpid, reply.oid)
      if (err) return [err, null]

      const { page, replies } = res
      result.push(...replies.map(r => commentFormat(r)))

      const pages = Math.ceil(page.count / page.size)
      if (pages > 1) {
        for (let p = 2; p <= pages; p++) {
          const [err, res] = await getCommentReply(reply.rpid, reply.oid)
          if (err) return [err, null]
          const { replies } = res
          result.push(...replies.map(r => commentFormat(r)))
        }
      }
    }
  }

  return [null, result]
}

/**
 * 获取视频评论列表
 * @param vid
 * @param page
 * @returns
 */
export const getVideoCommentsListByVid = async (
  vid: string,
  page = 1,
): Promise<BaseReturnType<BVideoCommentListResponseType>> => {
  try {
    const [err, res] = await request({
      url: BILIBILI_API.VIDEO_COMMENT.url,
      method: BILIBILI_API.VIDEO_COMMENT.method,
      params: {
        type: 1,
        pn: page,
        ps: 10,
        oid: vid,
        sort: 1,
      },
      headers: {
        dataType: 'json',
      },
    })

    if (err) {
      return [err, null]
    }
    else {
      const { status, data } = res
      if (status === 200 && data.code === 0) {
        const mainData = data.data as BCommentsType
        const [err, res] = await videoCommentsListResHandle(vid, mainData)
        if (err) return [err, null]

        const { page } = mainData

        return [null, {
          list: res,
          page: {
            total: page.count,
            currentPage: page.num,
            pageSize: page.size,
          },
        }]
      }

      else { return [data.message, null] }
    }
  }
  catch (err) {
    return [err.message, null]
  }
}
