<template>
  <header class="top-bar">
    <div class="left-section">
      <div class="logo">
        <img 
          src="https://placehold.co/120x40/1db954/ffffff?text=KYW" 
          alt="KYW Music"
        >
      </div>
      <div class="search-container" v-if="showSearch">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            :placeholder="placeholder"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          >
          <i 
            class="fas fa-times" 
            v-show="searchQuery"
            @click="clearSearch"
          ></i>
        </div>
        
        <!-- 搜索建议 -->
        <div 
          class="search-suggestions" 
          v-show="showSuggestions && (suggestions.length > 0 || searchQuery)"
        >
          <!-- 热门搜索 -->
          <div class="suggestion-section" v-if="!searchQuery">
            <div class="section-title">热门搜索</div>
            <div class="hot-searches">
              <div 
                v-for="item in hotSearches" 
                :key="item.id"
                class="hot-search-item"
                @click="handleHotSearch(item)"
              >
                {{ item.keyword }}
              </div>
            </div>
          </div>
          
          <!-- 搜索建议列表 -->
          <div class="suggestion-section" v-else>
            <div 
              v-for="(item, index) in suggestions" 
              :key="index"
              class="suggestion-item"
              @click="handleSelectSuggestion(item)"
            >
              <i class="fas fa-search"></i>
              <span>{{ item.keyword }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航标签移到右侧搜索框和用户信息之间 -->
    <div class="nav-tabs" v-if="showTabs">
      <router-link 
        v-for="tab in currentTabs" 
        :key="tab.path"
        :to="tab.path"
        class="nav-tab"
        active-class="active"
      >
        {{ tab.name }}
      </router-link>
    </div>

    <div class="right-section">
      <template v-if="userStore.isLoggedIn">
        <div class="user-menu">
          <div 
            class="user-info" 
            @click="toggleUserMenu"
          >
            <div class="avatar">
              <img 
                :src="userStore.userInfo?.avatar || defaultAvatar" 
                alt="用户头像"
              >
            </div>
            <span class="username">
              {{ userStore.userInfo?.username || 'User' }}
            </span>
            <i 
              class="fas fa-chevron-down"
              :class="{ 'rotate': showUserMenu }"
            ></i>
          </div>

          <div 
            v-show="showUserMenu" 
            class="dropdown-menu"
          >
            <router-link to="/profile" class="menu-item">
              <i class="fas fa-user"></i>
              <span>个人信息</span>
            </router-link>
            <div class="menu-item" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="auth-buttons">
          <router-link to="/login" class="btn-text">登录</router-link>
          <router-link to="/register" class="btn-primary">注册</router-link>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMessage } from '../hooks/useMessage'
import { getSearchSuggestions, getHotSearch } from '../api/music'
import { debounce } from '../utils/tools'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { showMessage } = useMessage()
const searchQuery = ref('')
const showUserMenu = ref(false)
const showSuggestions = ref(false)
const suggestions = ref([])
const hotSearches = ref([])
const isLoading = ref(false)

// 调试用户状态
console.log('User logged in:', userStore.isLoggedIn)
console.log('User info:', userStore.userInfo)

const toggleUserMenu = (event) => {
  event.stopPropagation() // 阻止事件冒泡
  console.log('Toggling menu')
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  console.log('Closing menu')
  showUserMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  showMessage('已退出登录', 'success')
  router.push('/login')
  closeUserMenu()
}

// 添加点击外部关闭菜单的处理
onMounted(() => {
  document.addEventListener('click', (event) => {
    const menu = document.querySelector('.user-menu')
    if (menu && !menu.contains(event.target)) {
      showUserMenu.value = false
    }
  })
})

// 使用更小尺寸的头像，因为顶部栏显示的头像较小
const defaultAvatar = 'https://placehold.co/32x32/1a1a1a/ffffff?text=U'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索音乐、艺人或专辑'
  }
})

const currentRoute = computed(() => route.path)

const showSearch = computed(() => {
  return ['/', '/explore', '/library'].includes(route.path)
})  

// 导航标签配置
const tabsConfig = {
  '/explore': [
    { name: '新发现', path: '/explore' },
    { name: '排行榜', path: '/explore/charts' },
    { name: '流派', path: '/explore/genres' }
  ],
  '/library': [
    { name: '歌单', path: '/library/playlists' },
    { name: '专辑', path: '/library/albums' },
    { name: '收藏', path: '/library/favorites' }
  ]
}

const showTabs = computed(() => {
  return Object.keys(tabsConfig).some(path => route.path.startsWith(path))
})

const currentTabs = computed(() => {
  const path = Object.keys(tabsConfig).find(p => route.path.startsWith(p))
  return path ? tabsConfig[path] : []
})

// 获取热门搜索
const fetchHotSearches = async () => {
  try {
    const res = await getHotSearch()
    hotSearches.value = res.data
  } catch (error) {
    console.error('获取热门搜索失败:', error)
  }
}

// 防抖处理的搜索建议请求
const fetchSuggestions = debounce(async (query) => {
  if (!query) {
    suggestions.value = []
    return
  }
  
  try {
    isLoading.value = true
    const res = await getSearchSuggestions(query)
    suggestions.value = res.data
  } catch (error) {
    console.error('获取搜索建议失败:', error)
  } finally {
    isLoading.value = false
  }
}, 300)

// 监听搜索输入
watch(searchQuery, (newQuery) => {
  fetchSuggestions(newQuery)
})

const handleSearch = () => {
  if (!searchQuery.value) return
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  })
  showSuggestions.value = false
}

const handleSelectSuggestion = (item) => {
  searchQuery.value = item.keyword
  handleSearch()
}

const handleHotSearch = (item) => {
  searchQuery.value = item.keyword
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
}

const handleBlur = () => {
  // 延迟关闭，以便可以点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 组件挂载时获取热门搜索
onMounted(() => {
  fetchHotSearches()
})
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

.search-container {
  position: relative;
  width: 300px;
}

.search-bar {
  position: relative;
  width: 100%;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s;
}

.search-bar:hover,
.search-bar:focus-within {
  background: rgba(255, 255, 255, 0.15);
}

.search-bar input {
  width: 100%;
  height: 100%;
  padding: 0 40px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
}

.search-bar input:focus {
  outline: none;
}

.search-bar i.fa-search {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-bar i.fa-times {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.search-bar i.fa-times:hover {
  opacity: 1;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  z-index: 1000;
}

.suggestion-section {
  padding: 8px 0;
}

.section-title {
  padding: 0 16px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.hot-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px;
}

.hot-search-item {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hot-search-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.suggestion-item i {
  color: var(--text-secondary);
  font-size: 14px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  position: relative;
  z-index: 1000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  color: var(--text-primary);
  font-size: 14px;
}

.fa-chevron-down {
  color: var(--text-secondary);
  transition: transform 0.2s;
}

.fa-chevron-down.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
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

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-text,
.btn-primary {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-text {
  color: var(--text-primary);
}

.btn-text:hover {
  color: var(--primary-color);
}

.btn-primary {
  background: var(--primary-color);
  color: #000;
}

.btn-primary:hover {
  transform: scale(1.05);
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-tab {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-tab:hover {
  color: var(--text-primary);
}

.nav-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}
</style> 