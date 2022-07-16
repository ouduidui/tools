import { getVideoCommentsListByVid } from '~~/server/utils/bilibili'
import { failHandler, successHandler } from '~~/server/utils/response'

export default defineEventHandler(async (e) => {
  const { vid } = e.context.params
  if (!vid) return failHandler('请输入视频id')

  const { page = 1 } = useQuery(e)

  const [err, data] = await getVideoCommentsListByVid(vid, page as number)

  if (err) return failHandler(err)
  return successHandler('get comments list success', data)
})
