import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:8101',
  timeout: 10000,
  withCredentials: true,
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('请求错误', error)
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    if (res.code === 0) {
      return res
    } else {
      message.error(res.message || '请求失败')

      if (res.code === 40100) {
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('响应错误', error)
    let errorMessage = '网络错误，请稍后重试'

    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      errorMessage = '无法连接到服务器，请确保后端服务已启动（http://localhost:8101）'
    } else if (error.response) {
      errorMessage = error.response.data?.message || '请求失败'
    } else if (error.message) {
      errorMessage = error.message
    }

    message.error(errorMessage)
    return Promise.reject(error)
  },
)

export default request