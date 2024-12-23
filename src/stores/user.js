import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const isLoggedIn = ref(!!token.value)

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      const { token: newToken, user } = response.data
      
      // 保存token和用户信息
      token.value = newToken
      userInfo.value = user
      isLoggedIn.value = true
      
      // 持久化存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
      
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const logout = () => {
    // 清除用户信息
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout
  }
}) 