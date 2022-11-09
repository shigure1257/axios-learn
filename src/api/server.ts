/**
 * 第二种axios封装方式
 * 实例
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { handleAuth, handleAuthError, handleGenralError, handleNetworkError } from './tools'
import { ElLoading } from 'element-plus'

type CancelFn = (msg: string) => void
const pendingMap: Map<string, CancelFn> = new Map()
interface RequestConfig extends AxiosRequestConfig {
  repeatRequestCancel?: Boolean
  loading?: Boolean
}

let requestNum = 0,
  loadingInstance: any

//取消已发送的请求
/**
 *
 * @param config 请求配置
 * @returns 生成的请求键
 */
export const getPendingKey = (config: RequestConfig): string => {
  const { url, method, params } = config
  let { data } = config
  if (typeof data === 'string') data = JSON.parse(data)
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param config
 */
export const addPending = (config: RequestConfig): void => {
  const pendingKey: string = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel: CancelFn) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}
/**
 * 删除重复的请求
 * @param config AxiosRequestConfig
 */
export const removePending = (config: RequestConfig): void => {
  const pendingKey: string = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancel: CancelFn = pendingMap.get(pendingKey) as CancelFn
    cancel(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

const closeLoading = (config: RequestConfig): void => {
  if (config?.loading && requestNum > 0) {
    requestNum--
  }
  if (requestNum == 0) {
    loadingInstance.close()
    loadingInstance = null
  }
}

/**
 * 第二种封装方式
 * @param config
 * @returns
 */
interface RequestConfig extends AxiosRequestConfig {
  repeatRequestCancel?: Boolean
  loading?: Boolean
}

export const createAxios = (config?: RequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 3000,
    withCredentials: true,
    ...config
  })
  instance.interceptors.request.use(
    (config: any) => {
      //do something
      config = handleAuth(config)
      removePending(config)
      addPending(config)
      if (config.loading) {
        requestNum++
        if (requestNum === 1) {
          loadingInstance = ElLoading.service({
            text: '正在努力加载中....',
            background: 'rgba(0, 0, 0, 0)'
          })
        }
      }
      return config
    },
    (err) => {
      return Promise.reject(err)
    }
  )

  instance.interceptors.response.use(
    (response) => {
      removePending(response.config)
      if (config?.loading) {
        closeLoading(response.config)
      }
      if (response.status !== 200) {
        return Promise.reject(response.data)
      }
      handleAuthError(response.data.errno)
      handleGenralError(response.data.errno, response.data.errmsg)
      return response
    },
    (err) => {
      handleNetworkError(err.response.status)
      closeLoading(err.config)
      Promise.reject(err.response)
    }
  )
  return instance
}
