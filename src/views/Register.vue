<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册 KYW Music</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <input 
            type="text"
            v-model="registerForm.username"
            placeholder="用户名"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            type="email"
            v-model="registerForm.email"
            placeholder="邮箱"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            type="password"
            v-model="registerForm.password"
            placeholder="密码"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            type="password"
            v-model="registerForm.confirmPassword"
            placeholder="确认密码"
            required
          >
        </div>

        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="other-options">
        <p>已有账号? <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/user'
import { useMessage } from '../hooks/useMessage'

const router = useRouter()
const { showMessage } = useMessage()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  // 表单验证
  if (registerForm.password !== registerForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  try {
    loading.value = true
    await register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    })
    showMessage('注册成功', 'success')
    router.push('/login')
  } catch (error) {
    showMessage(error.message || '注册失败', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
}

.register-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}

/* 复用 Login.vue 的其他样式 */
</style> 