<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录到 KYW Music</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            type="text"
            v-model="loginForm.username"
            placeholder="用户名/邮箱"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            required
          >
        </div>

        <div class="form-options">
          <label>
            <input type="checkbox" v-model="loginForm.remember">
            记住我
          </label>
          <router-link to="/reset-password" class="forgot-password">
            忘记密码?
          </router-link>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="other-options">
        <p>还没有账号? <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMessage } from '../hooks/useMessage'
import { saveRememberInfo, getRememberInfo, clearRememberInfo } from '../utils/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const { showMessage } = useMessage()

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 页面加载时检查是否有记住的登录信息
onMounted(() => {
  const rememberedInfo = getRememberInfo()
  if (rememberedInfo) {
    loginForm.username = rememberedInfo.username
    loginForm.password = rememberedInfo.password
    loginForm.remember = true
  }
})

const handleLogin = async () => {
  try {
    loading.value = true
    await userStore.login(loginForm)
    
    // 处理记住密码
    if (loginForm.remember) {
      saveRememberInfo(loginForm.username, loginForm.password)
    } else {
      clearRememberInfo()
    }
    
    showMessage('登录成功', 'success')
    router.push('/')
  } catch (error) {
    showMessage(error.message || '登录失败', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
}

.login-box {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-btn {
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

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.other-options {
  text-align: center;
  margin-top: 20px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}
</style> 