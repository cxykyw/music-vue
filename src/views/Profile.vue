<template>
  <div class="profile-container">
    <header class="profile-header">
      <h2>个人信息</h2>
      <button class="save-btn" @click="handleSave" :disabled="loading">
        {{ loading ? '保存中...' : '保存修改' }}
      </button>
    </header>

    <div class="profile-content">
      <!-- 头像部分 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar || defaultAvatar" alt="用户头像">
          <div class="avatar-overlay" @click="triggerUpload">
            <i class="fas fa-camera"></i>
            <span>更换头像</span>
          </div>
        </div>
        <input 
          type="file" 
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleAvatarChange"
        >
      </div>

      <!-- 基本信息表单 -->
      <div class="info-section">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text"
            v-model="userInfo.username"
            placeholder="设置用户名"
          >
        </div>

        <div class="form-group">
          <label>昵称</label>
          <input 
            type="text"
            v-model="userInfo.nickname"
            placeholder="设置昵称"
          >
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <div class="email-group">
            <input 
              type="email"
              v-model="userInfo.email"
              placeholder="设置邮箱"
              :disabled="!canChangeEmail"
            >
            <span class="email-status" :class="{ verified: userInfo.emailVerified }">
              {{ userInfo.emailVerified ? '已验证' : '未验证' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>个人简介</label>
          <textarea 
            v-model="userInfo.bio"
            placeholder="介绍一下自己..."
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- 账号安全 -->
      <div class="security-section">
        <h3>账号安全</h3>
        <div class="security-options">
          <div class="security-item" @click="showChangePassword = true">
            <div class="item-info">
              <i class="fas fa-lock"></i>
              <div class="item-text">
                <h4>修改密码</h4>
                <p>定期更换密码可以保护账号安全</p>
              </div>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>

          <div class="security-item" @click="showDevices = true">
            <div class="item-info">
              <i class="fas fa-mobile-alt"></i>
              <div class="item-text">
                <h4>登录设备</h4>
                <p>查看并管理已登录的设备</p>
              </div>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>

          <div class="security-item danger" @click="showDeleteAccount = true">
            <div class="item-info">
              <i class="fas fa-trash-alt"></i>
              <div class="item-text">
                <h4>注销账号</h4>
                <p>永久删除您的账号和所有数据</p>
              </div>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div class="modal" v-if="showChangePassword">
      <div class="modal-content">
        <h3>修改密码</h3>
        <form @submit.prevent="handleChangePassword">
          <div class="form-group">
            <input 
              type="password"
              v-model="passwordForm.oldPassword"
              placeholder="当前密码"
              required
            >
          </div>
          <div class="form-group">
            <input 
              type="password"
              v-model="passwordForm.newPassword"
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
          <div class="modal-actions">
            <button 
              type="button" 
              class="cancel-btn"
              @click="showChangePassword = false"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="confirm-btn"
              :disabled="changingPassword"
            >
              {{ changingPassword ? '修改中...' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 添加设备管理弹窗 -->
    <div class="modal" v-if="showDevices">
      <div class="modal-content">
        <div class="modal-header">
          <h3>登录设备管理</h3>
          <button class="close-btn" @click="showDevices = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="devices-list">
          <div 
            v-for="device in devices" 
            :key="device.id" 
            class="device-item"
          >
            <div class="device-info">
              <i :class="getDeviceIcon(device.type)"></i>
              <div class="device-details">
                <h4>{{ device.name }}</h4>
                <p>{{ device.lastLoginTime }}</p>
                <span 
                  class="device-status"
                  :class="{ active: device.isCurrentDevice }"
                >
                  {{ device.isCurrentDevice ? '当前设备' : '其他设备' }}
                </span>
              </div>
            </div>
            <button 
              v-if="!device.isCurrentDevice"
              class="logout-btn"
              @click="handleLogoutDevice(device.id)"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加账号注销确认弹窗 -->
    <div class="modal" v-if="showDeleteAccount">
      <div class="modal-content">
        <h3>注销账号确认</h3>
        <p class="warning-text">
          注销账号后，您的所有数据将被永久删除且无法恢复。
          请确认是否继续？
        </p>
        
        <div class="confirm-section">
          <div class="form-group">
            <input 
              type="password"
              v-model="deleteAccountPassword"
              placeholder="请输入密码确认"
              required
            >
          </div>
          <label class="confirm-checkbox">
            <input 
              type="checkbox"
              v-model="deleteConfirmed"
            >
            我已了解账号注销的风险
          </label>
        </div>
        
        <div class="modal-actions">
          <button 
            class="cancel-btn"
            @click="showDeleteAccount = false"
          >
            取消
          </button>
          <button 
            class="delete-btn"
            :disabled="!deleteConfirmed || !deleteAccountPassword"
            @click="handleDeleteAccount"
          >
            确认注销
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from '../hooks/useMessage'
import { useUserStore } from '../stores/user'
import { updateUserInfo, changePassword, uploadAvatar, getDevices, logoutDevice, deleteAccount } from '../api/user'

const userStore = useUserStore()
const { showMessage } = useMessage()
const loading = ref(false)
const fileInput = ref(null)
const showChangePassword = ref(false)
const changingPassword = ref(false)
const canChangeEmail = ref(true)
const showDevices = ref(false)
const showDeleteAccount = ref(false)
const deleteAccountPassword = ref('')
const deleteConfirmed = ref(false)
const devices = ref([])

const userInfo = reactive({
  username: '',
  nickname: '',
  email: '',
  emailVerified: false,
  bio: '',
  avatar: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 使用更大尺寸的头像，因为个人资料页面显示的头像较大
const defaultAvatar = 'https://placehold.co/200x200/1a1a1a/ffffff?text=Avatar'

onMounted(async () => {
  // 获取用户信息
  const info = await userStore.getUserInfo()
  Object.assign(userInfo, info)
  await loadDevices()
})

const triggerUpload = () => {
  fileInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await uploadAvatar(formData)
    userInfo.avatar = res.url
    showMessage('头像上传成功', 'success')
  } catch (error) {
    showMessage(error.message || '头像上传失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  try {
    loading.value = true
    await updateUserInfo(userInfo)
    showMessage('保存成功', 'success')
  } catch (error) {
    showMessage(error.message || '保存失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  try {
    changingPassword.value = true
    await changePassword(passwordForm)
    showMessage('密码修改成功', 'success')
    showChangePassword.value = false
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    showMessage(error.message || '密码修改失败', 'error')
  } finally {
    changingPassword.value = false
  }
}

const handleVerifyEmail = async () => {
  try {
    await userStore.sendVerificationEmail()
    showMessage('验证邮件已发送，请查收', 'success')
  } catch (error) {
    showMessage(error.message || '发送失败', 'error')
  }
}

const loadDevices = async () => {
  try {
    const res = await getDevices()
    devices.value = res
  } catch (error) {
    showMessage(error.message || '获取设备列表失败', 'error')
  }
}

const getDeviceIcon = (type) => {
  const icons = {
    desktop: 'fas fa-desktop',
    mobile: 'fas fa-mobile-alt',
    tablet: 'fas fa-tablet-alt',
    other: 'fas fa-question-circle'
  }
  return icons[type] || icons.other
}

const handleLogoutDevice = async (deviceId) => {
  try {
    await logoutDevice(deviceId)
    await loadDevices()
    showMessage('设备已退出登录', 'success')
  } catch (error) {
    showMessage(error.message || '操作失败', 'error')
  }
}

const handleDeleteAccount = async () => {
  try {
    await deleteAccount(deleteAccountPassword.value)
    showMessage('账号已注销', 'success')
    userStore.logout()
    router.push('/login')
  } catch (error) {
    showMessage(error.message || '注销失败', 'error')
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.profile-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.save-btn {
  padding: 10px 24px;
  background: var(--primary-color);
  color: #000;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.save-btn:hover {
  transform: scale(1.05);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.profile-content {
  display: grid;
  gap: 40px;
}

/* 头像部分 */
.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.avatar-overlay:hover {
  opacity: 1;
}

.avatar-overlay i {
  font-size: 24px;
  margin-bottom: 8px;
}

/* 表单部分 */
.info-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

input, textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.email-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.email-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.email-status.verified {
  background: rgba(29, 185, 84, 0.2);
  color: var(--primary-color);
}

/* 安全设置部分 */
.security-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.security-section h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}

.security-options {
  display: grid;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.security-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.security-item.danger {
  color: #ff4d4f;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-info i {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.item-text h4 {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
}

.item-text p {
  color: var(--text-secondary);
  font-size: 12px;
}

.security-item i.fa-chevron-right {
  color: var(--text-secondary);
  font-size: 14px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .profile-container {
    padding: 20px;
  }
}

.danger {
  color: #f56c6c;
}

.danger i {
  color: #f56c6c;
}

.devices-list {
  max-height: 400px;
  overflow-y: auto;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
}

.device-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.device-info i {
  font-size: 24px;
  color: var(--text-secondary);
}

.device-details h4 {
  margin: 0;
  font-size: 16px;
}

.device-details p {
  margin: 5px 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.device-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--bg-lighter);
}

.device-status.active {
  background: var(--primary-color);
  color: white;
}

.logout-btn {
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
}

.warning-text {
  color: #f56c6c;
  margin: 20px 0;
  line-height: 1.5;
}

.confirm-section {
  margin: 20px 0;
}

.confirm-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.delete-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
}
</style> 