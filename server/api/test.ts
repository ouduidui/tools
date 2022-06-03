import { failHandler, successHandler } from '../utils/response'
import { request } from '../utils/request'

export default defineEventHandler(async() => {
  const [err, res] = await request({
    method: 'get',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
  })
  if (err) return failHandler(err)
  return successHandler('HelloWorld', res.data)
})
