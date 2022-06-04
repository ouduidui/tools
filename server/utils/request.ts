import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { BaseReturnType } from '../types/returnType'

type RequestReturnType = BaseReturnType<null | { status: number; data: any }>

axios.interceptors.response.use(
  res => res,
  (err) => {
    if (err && err.response && err.response.status)
      return Promise.resolve(err.response)
    else
      return Promise.reject(err)
  },
)

export const request = async(config: AxiosRequestConfig): Promise<RequestReturnType> => {
  try {
    const { status, data } = await axios(config)
    return [null, { status, data }]
  }
  catch (e) {
    return [e.message, null]
  }
}
