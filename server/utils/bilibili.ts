import type { RequestReturnType } from './request'
import { request } from './request'

const BILIBILI_API = {
  VIDEO_LIST: {
    methods: 'get',
    url: 'https://api.bilibili.com/x/space/arc/search',
  },
}

interface BVideoType {
  id: any
  title: string
  play: any
  comment: any
  created: any
}

interface BVideoListResponseType {
  list: {
    id: any
    title: string
    play: any
    comment: any
    created: any
  }[]
  page: {
    total: number
    currentPage: number
    pageSize: number
  }
}

const videoListResHandle = (list: any[]): BVideoType[] => {
  return list.map((v) => {
    return {
      id: v.id,
      title: v.title,
      play: v.play,
      comment: v.comment,
      created: v.created,
    }
  })
}

/**
 * 通过uid获取用户列表
 * @param uid
 * @returns
 */
export const getVideoListByUid = async(
  uid: string,
  page,
  limit,
): Promise<RequestReturnType<BVideoListResponseType>> => {
  try {
    const [err, res] = await request({
      url: BILIBILI_API.VIDEO_LIST.url,
      method: BILIBILI_API.VIDEO_LIST.methods,
      params: {
        jsonp: 'jsonp',
        mid: uid,
        pn: page,
        ps: limit,
      },
    })

    if (err) {
      return [err, null]
    }
    else {
      const { status, data } = res
      if (status === 200 && data.code === 0) {
        return [null, {
          status: 200,
          data: {
            list: videoListResHandle(data.data.list.vlist),
            page: {
              currentPage: data.data.page.pn,
              total: data.data.page.count,
              pageSize: data.data.page.ps,
            },
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
