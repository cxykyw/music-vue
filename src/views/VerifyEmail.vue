<template>
  <div class="verify-container">
    <div class="verify-box">
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>正在验证...</p>
      </div>
      
      <div v-else-if="verified" class="success">
        <i class="fas fa-check-circle"></i>
        <h3>邮箱验证成功</h3>
        <p>您的邮箱已经验证成功，现在可以使用所有功能了</p>
        <router-link to="/" class="primary-btn">
          返回首页
        </router-link>
      </div>
      
      <div v-else class="error">
        <i class="fas fa-times-circle"></i>
        <h3>验证失败</h3>
        <p>{{ errorMessage }}</p>
        <button 
          @click="handleResend" 
          class="resend-btn"
          :disabled="resending"
        >
          重新发送验证邮件
        </button>
        <router-link to="/" class="back-link">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from '../hooks/useMessage'
import { verifyEmail, resendVerificationEmail } from '../api/user'

const route = useRoute()
const { showMessage } = useMessage()
const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')
const resending = ref(false)

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    loading.value = false
    errorMessage.value = '无效的验证链接'
    return
  }

  try {
    await verifyEmail(token)
    verified.value = true
  } catch (error) {
    errorMessage.value = error.message || '验证失败，请重试'
  } finally {
    loading.value = false
  }
})

const handleResend = async () => {
  if (resending.value) return
  
  try {
    resending.value = true
    await resendVerificationEmail()
    showMessage('验证邮件已重新发送', 'success')
  } catch (error) {
    showMessage(error.message || '发送失败，请稍后重试', 'error')
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
}

.verify-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.loading,
.success,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

i {
  font-size: 48px;
}

.loading i {
  color: var(--primary-color);
}

.success i {
  color: #67c23a;
}

.error i {
  color: #f56c6c;
}

.primary-btn,
.resend-btn {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.back-link {
  display: block;
  margin-top: 15px;
  color: var(--text-secondary);
  text-decoration: none;
}
</style> 