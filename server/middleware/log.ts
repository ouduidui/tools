/* eslint-disable no-console */
export default defineEventHandler((event) => {
  console.log('New Request:', event.req.method, event.req.url)
})
