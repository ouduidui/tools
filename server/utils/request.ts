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

export const request = async(config: AxiosRequestConfig): Promise<RequestReturnType> => {
  try {
    const { status, data } = await axios(config)
    return [null, { status, data }]
  }
  catch (e) {
    return [e, null]
  }
}
