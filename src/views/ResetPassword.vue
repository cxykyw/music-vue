<template>
  <div class="reset-container">
    <div class="reset-box">
      <h2>重置密码</h2>
      
      <div v-if="!emailSent">
        <p class="description">请输入您的注册邮箱，我们将向您发送重置密码的链接</p>
        <form @submit.prevent="handleSendEmail">
          <div class="form-group">
            <input 
              type="email"
              v-model="email"
              placeholder="注册邮箱"
              required
            >
          </div>
          <button type="submit" class="reset-btn" :disabled="loading">
            {{ loading ? '发送中...' : '发送重置链接' }}
          </button>
        </form>
      </div>

      <div v-else class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>邮件已发送</h3>
        <p>请检查您的邮箱，按照邮件中的说明重置密码</p>
        <p class="timer" v-if="countdown > 0">{{ countdown }}秒后可重新发送</p>
        <button 
          v-else 
          class="resend-btn"
          @click="handleSendEmail"
          :disabled="loading"
        >
          重新发送
        </button>
      </div>

      <div class="other-options">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from '../hooks/useMessage'
import { sendResetEmail } from '../api/user'

const { showMessage } = useMessage()
const loading = ref(false)
const email = ref('')
const emailSent = ref(false)
const countdown = ref(0)

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendEmail = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    await sendResetEmail(email.value)
    emailSent.value = true
    startCountdown()
    showMessage('重置链接已发送到您的邮箱', 'success')
  } catch (error) {
    showMessage(error.message || '发送失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
}

.reset-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-message i {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 20px;
}

.timer {
  color: var(--text-secondary);
  margin: 15px 0;
}

.resend-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  margin-top: 10px;
}

/* 复用其他通用样式 */
</style> 