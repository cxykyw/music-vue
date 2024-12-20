<template>
  <div class="app-layout">
    <!-- 侧边栏导航 -->
    <nav class="sidebar">
      <div class="logo">
        <img 
          src="https://placehold.co/200x50/1a1a1a/ffffff?text=KYW+Music" 
          alt="KYW Music"
        >
      </div>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-item" active-class="active">
          <i class="fas fa-home"></i>
          <span>首页</span>
        </router-link>
        
        <router-link to="/explore" class="nav-item" active-class="active">
          <i class="fas fa-compass"></i>
          <span>发现</span>
        </router-link>
        
        <router-link to="/library" class="nav-item" active-class="active">
          <i class="fas fa-music"></i>
          <span>音乐库</span>
        </router-link>
      </div>
      
      <div class="playlist-section">
        <h3>创建的歌单</h3>
        <div class="playlist-list">
          <div 
            v-for="playlist in userPlaylists" 
            :key="playlist.id"
            class="playlist-item"
            @click="navigateToPlaylist(playlist.id)"
          >
            {{ playlist.name }}
          </div>
          
          <div class="create-playlist" @click="handleCreatePlaylist">
            <i class="fas fa-plus"></i>
            创建歌单
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 顶部栏 -->
      <TopBar />
      
      <!-- 路由视图 -->
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 播放器组件 -->
    <div class="player-bar">
      <MusicPlayer />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMessage } from '../hooks/useMessage'
import TopBar from '../components/TopBar.vue'
import MusicPlayer from '../components/MusicPlayer.vue'

const router = useRouter()
const userStore = useUserStore()
const { showMessage } = useMessage()

// 模拟用户歌单数据
const userPlaylists = ref([
  { id: 1, name: '我喜欢的音乐' },
  { id: 2, name: '最近播放' }
])

const navigateToPlaylist = (id) => {
  router.push(`/playlist/${id}`)
}

const handleCreatePlaylist = () => {
  // TODO: 实现创建歌单功能
  showMessage('创建歌单功能开发中...', 'info')
}
</script>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
}

.sidebar {
  background: var(--bg-secondary);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  grid-row: 1 / -1;
}

.logo {
  padding: 10px 0;
}

.logo img {
  height: 40px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.active {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.playlist-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-section h3 {
  color: var(--text-secondary);
  font-size: 14px;
  padding: 0 12px;
}

.playlist-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.playlist-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.playlist-item:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.create-playlist {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.create-playlist:hover {
  color: var(--text-primary);
}

.main-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.player-bar {
  grid-column: 1 / -1;
  height: 90px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 