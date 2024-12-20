<template>
  <header class="top-bar">
    <div class="left-section">
      <div class="logo">
        <img 
          src="https://placehold.co/120x40/1db954/ffffff?text=KYW" 
          alt="KYW Music"
        >
      </div>
      <div class="search-bar" v-if="showSearch">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          :placeholder="placeholder"
          v-model="searchQuery"
          @input="handleSearch"
        >
      </div>
      
    </div>

    <div class="right-section">
      <template v-if="userStore.isLoggedIn">
        <div class="user-menu">
          <div class="user-avatar" @click="showUserMenu = !showUserMenu">
            <img :src="userStore.userInfo?.avatar || defaultAvatar" alt="用户头像">
            <span>{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          
          <div class="dropdown-menu" v-show="showUserMenu" v-click-outside="closeUserMenu">
            <router-link to="/profile" class="menu-item">
              <i class="fas fa-user"></i>
              个人信息
            </router-link>
            <div class="menu-item" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
              退出登录
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="auth-buttons">
          <router-link to="/login" class="btn btn-text">
            登录
          </router-link>
          <router-link to="/register" class="btn btn-primary">
            注册
          </router-link>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMessage } from '../hooks/useMessage'
const defaultAvatar = 'https://placehold.co/200x200/1a1a1a/ffffff?text=User'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索音乐、艺人或专辑'
  }
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { showMessage } = useMessage()
const searchQuery = ref('')
const showUserMenu = ref(false)

const currentRoute = computed(() => route.path)

const showSearch = computed(() => {
  return ['/', '/explore'].includes(route.path)
})  

const handleSearch = () => {
  // 搜索逻辑
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    showMessage('退出成功', 'success')
    router.push('/login')
  } catch (error) {
    showMessage('退出失败', 'error')
  }
}
</script>

<style scoped>
.top-bar {
  height: 64px;
  padding: 0 24px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo img {
  height: 40px;
  width: auto;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-bar input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  border: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-size: 14px;
}

.search-bar input::placeholder {
  color: var(--text-secondary);
}

.search-bar input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-text {
  color: var(--text-primary);
  background: transparent;
}

.btn-text:hover {
  color: var(--primary-color);
}

.btn-primary {
  color: #000;
  background: var(--primary-color);
}

.btn-primary:hover {
  transform: scale(1.05);
}

.user-menu {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar span {
  color: var(--text-primary);
  font-size: 14px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item i {
  width: 16px;
  color: var(--text-secondary);
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-left: 24px;
}

.nav-tab {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-tab:hover {
  color: var(--text-primary);
}

.nav-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.nav-tabs + .search-bar {
  width: 240px;
}
</style> 