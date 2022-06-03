import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

type RequestReturnType = RequestFailReturn | RequestSuccessReturn

type RequestFailReturn = [
  errMsg: string,
  successRes:null,
]

type RequestSuccessReturn = [
  errMsg: null,
  successRes: null | { status: number; data: unknown },
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
