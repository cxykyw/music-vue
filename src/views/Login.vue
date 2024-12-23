<template>
  <div class="auth-page">
    <div class="auth-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username"
            v-model="loginForm.username"
            required
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password"
            v-model="loginForm.password"
            required
          >
        </div>
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="auth-links">
        <router-link to="/register">没有账号？立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMessage } from '../hooks/useMessage'

const router = useRouter()
const userStore = useUserStore()
const { showMessage } = useMessage()

const loginForm = ref({
  username: '',
  password: ''
})
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    await userStore.login(loginForm.value)
    showMessage('登录成功', 'success')
    router.push('/')  // 登录成功后跳转到首页
  } catch (error) {
    showMessage(error.message || '登录失败', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
}

.auth-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}
</style> 