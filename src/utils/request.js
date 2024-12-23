import axios from 'axios'
import { useUserStore } from '../stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      // 处理业务错误
      const error = new Error(res.message || '请求失败')
      error.code = res.code
      return Promise.reject(error)
    }
    
    return res
  },
  error => {
    console.error('响应错误:', error)
    const message = error.response?.data?.message || '网络错误'
    return Promise.reject(new Error(message))
  }
)

export default service 