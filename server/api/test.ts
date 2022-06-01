import { successHandler } from '../controller/response'

export default defineEventHandler(() => {
  return successHandler('HelloWorld')
})
