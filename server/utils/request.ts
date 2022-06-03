import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export type RequestReturnType<T = any> = RequestFailReturn | RequestSuccessReturn<T>

type RequestFailReturn = [
  errMsg: string,
  successRes:null,
]

type RequestSuccessReturn<T> = [
  errMsg: null,
  successRes: null | { status: number; data: T },
]

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
