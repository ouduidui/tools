interface BaseRes {
  code: number
  message: string
}

interface SuccessRes<T = unknown> extends BaseRes {
  code: 1
  data?: T
}

/**
 * 处理成功返回结果
 * @param message
 * @param data
 * @returns
 */
export const successHandler = <T = unknown>(message: string, data?: T): SuccessRes<T> => {
  const response: SuccessRes<T> = {
    code: 1,
    message,
  }
  data && (response.data = data)
  return response
}

export const failHandler = (message: string, code = -1): BaseRes => {
  return {
    code,
    message,
  }
}
