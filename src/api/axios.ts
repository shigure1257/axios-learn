import axios from 'axios'
import type { IAnyObj, FcResponse } from '../interface/Api'
import {
  handleRequestHeader,
  handleAuth,
  handleAuthError,
  handleGenralError,
  handleNetworkError
} from './tools'
type Fn = (data: FcResponse<any>) => unknown

/** 全局请求拦截器配置 */
axios.interceptors.request.use(
  (config) => {
    config = handleRequestHeader(config)
    config = handleAuth(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

/** 全局响应拦截器配置 */
axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return Promise.reject(response.data)
    }
    handleAuthError(response.data.errno)
    handleGenralError(response.data.errno, response.data.errmsg)
    return response
  },
  (err) => {
    handleNetworkError(err.response.status)
    Promise.reject(err.response)
  }
)

export const get = <T>(
  url: string,
  params: IAnyObj = {},
  clearFn?: Fn
): Promise<[any, FcResponse<T> | undefined]> => {
  return new Promise((resolve) => {
    axios
      .get(url, { params })
      .then((result) => {
        let res: FcResponse<T>
        if (clearFn != undefined) {
          res = clearFn(result.data) as unknown as FcResponse<T>
        } else {
          res = result.data as FcResponse<T>
        }
        resolve([null, res as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}
export const post = <T>(
  url: string,
  data: IAnyObj,
  params: IAnyObj = {}
): Promise<[any, FcResponse<T> | undefined]> => {
  return new Promise((resolve) => {
    axios
      .post(url, data, { params })
      .then((result) => {
        resolve([null, result.data as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}
