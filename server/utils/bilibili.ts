
import type { BaseReturnType } from '../types/returnType'
import { request } from './request'

const BILIBILI_API = {
  VIDEO_LIST: {
    methods: 'get',
    url: 'https://api.bilibili.com/x/space/arc/search',
  },
  VIDEO_COMMENT: {
    methods: 'get',
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
      method: BILIBILI_API.VIDEO_LIST.methods,
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
