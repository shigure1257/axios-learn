import type { AxiosPromise } from 'axios'
import { createAxios } from './server'

const request = createAxios()

/**
 * 登录方法
 * @param userName {string}
 * @param userPwd {string}
 * @param code {string}
 * @returns {Promise}
 */
export const login = (userName: string, userPwd: string, code: string): AxiosPromise => {
  const params = {
    userName,
    userPwd,
    code
  }
  return request.post('/api/login', params)
}
/**
 * 注册方法
 * @param data
 * @returns
 */
export const register = (data: any): AxiosPromise => {
  return request.post('/api/register', data)
}
/**
 * 登出方法
 * @returns {Promise}
 */
export const logOut = () => {
  return request.post('/api/logout')
}
