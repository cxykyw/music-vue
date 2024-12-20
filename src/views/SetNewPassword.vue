<template>
  <div class="reset-container">
    <div class="reset-box">
      <h2>设置新密码</h2>
      
      <form @submit.prevent="handleSetPassword">
        <div class="form-group">
          <input 
            type="password"
            v-model="passwordForm.password"
            placeholder="新密码"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            type="password"
            v-model="passwordForm.confirmPassword"
            placeholder="确认新密码"
            required
          >
        </div>

        <button type="submit" class="reset-btn" :disabled="loading">
          {{ loading ? '提交中...' : '确认修改' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from '../hooks/useMessage'
import { resetPassword, verifyResetToken } from '../api/user'

const route = useRoute()
const router = useRouter()
const { showMessage } = useMessage()
const loading = ref(false)

const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

// 验证重置token
onMounted(async () => {
  const token = route.query.token
  if (!token) {
    showMessage('无效的重置链接', 'error')
    router.push('/login')
    return
  }

  try {
    await verifyResetToken(token)
  } catch (error) {
    showMessage('重置链接已过期或无效', 'error')
    router.push('/login')
  }
})

const handleSetPassword = async () => {
  if (passwordForm.password !== passwordForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  try {
    loading.value = true
    await resetPassword({
      token: route.query.token,
      password: passwordForm.password
    })
    showMessage('密码修改成功', 'success')
    router.push('/login')
  } catch (error) {
    showMessage(error.message || '密码修改失败', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 复用重置密码页面的样式 */
</style> 