import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '../api/user'
import { setToken, removeToken } from '../utils/auth'
import { updateUserInfo, resendVerificationEmail } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const isLoggedIn = ref(false)

  // 登录
  async function login(loginForm) {
    try {
      const res = await loginApi(loginForm)
      token.value = res.token
      userInfo.value = res.userInfo
      isLoggedIn.value = true
      setToken(res.token)
      return res
    } catch (error) {
      throw error
    }
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    removeToken()
  }

  // 获取用户信息
  async function getUserInfo() {
    // 待实现
  }

  async function updateProfile(data) {
    try {
      const res = await updateUserInfo(data)
      userInfo.value = { ...userInfo.value, ...res }
      return res
    } catch (error) {
      throw error
    }
  }

  async function sendVerificationEmail() {
    try {
      await resendVerificationEmail()
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    getUserInfo,
    updateProfile,
    sendVerificationEmail
  }
}) 