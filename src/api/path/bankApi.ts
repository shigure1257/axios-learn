import { get } from '../axios'
import type { FcResponse } from '../../interface/Api'

export type ApiResponse<T> = Promise<[any, FcResponse<T> | undefined]>

export function getBankInfo<T>(id: string): ApiResponse<T> {
  return get<T>('/bank/info', { id })
}
export function getBankList<T>(): ApiResponse<T> {
  return get<T>('/bank/list')
}
