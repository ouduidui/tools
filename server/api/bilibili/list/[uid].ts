import type { VideoListOptions } from '~~/server/utils/bilibili'
import { getVideoListByUid } from '~~/server/utils/bilibili'
import { failHandler, successHandler } from '~~/server/utils/response'

export default defineEventHandler(async(e) => {
  const { uid } = e.context.params
  if (!uid) return failHandler('请输入用户id')

  const { page = 1, limit = 30, sort = 'pubdate', keyword = '' } = useQuery(e)

  const [err, data] = await getVideoListByUid(uid, {
    page,
    limit,
    sort,
    keyword,
  } as VideoListOptions)
  if (err) return failHandler(err)
  return successHandler('get list success', data)
})
