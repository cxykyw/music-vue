<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 收起按钮 -->
    <button class="collapse-btn" @click="toggleCollapse">
      <div class="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- Logo -->
    <div class="logo">
      <img src="../assets/images/youtube-music-icon.svg" alt="YouTube Music">
    </div>

    <!-- 导航菜单 -->
    <nav class="main-nav">
      <ul>
        <li v-for="item in navItems" 
            :key="item.path"
            :class="{ active: currentRoute === item.path }"
            :data-title="item.name">
          <router-link :to="item.path">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 播放列表操作 -->
    <div class="playlist-actions">
      <button class="action-btn new-playlist" @click="createPlaylist">
        <i class="fas fa-plus"></i>
        <span>新建播放列表</span>
      </button>
      <button class="listen-later" @click="goToListenLater">
        <div class="text-content">
          <span class="title">稍后再听</span>
          <span class="subtitle">自动播放列表</span>
        </div>
        <i class="fas fa-play play-icon"></i>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = computed(() => route.path)
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const navItems = [
  { name: '首页', path: '/', icon: 'fas fa-home' },
  { name: '探索', path: '/explore', icon: 'fas fa-compass' },
  { name: '媒体库', path: '/library', icon: 'fas fa-book' },
  { name: '升级', path: '/upgrade', icon: 'fas fa-crown' }
]

const createPlaylist = () => {
  console.log('创建新播放列表')
}

const goToListenLater = () => {
  console.log('前往稍后再听列表')
}
</script>

<style scoped>
/* 使用原有的styles.css中的sidebar相关样式 */
</style> 