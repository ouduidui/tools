type FailReturn = [
  errMsg: string,
  successRes:null,
]

type SuccessReturn<T> = [
  errMsg: null,
  successRes: T,
]

export type BaseReturnType<T = any> = FailReturn | SuccessReturn<T>
