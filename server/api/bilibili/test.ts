import { successHandler } from '~~/server/utils/response'

export default defineEventHandler(() => successHandler('Test get handler'))
