<template>
  <div class="library">
    <!-- 导航标签 -->
    <div class="library-nav">
      <ul>
        <li>
          <router-link to="/library/songs" active-class="active">歌曲</router-link>
        </li>
        <li>
          <router-link to="/library/playlists" active-class="active">歌单</router-link>
        </li>
        <li>
          <router-link to="/library/albums" active-class="active">专辑</router-link>
        </li>
        <li>
          <router-link to="/library/favorites" active-class="active">收藏</router-link>
        </li>
      </ul>
    </div>

    <!-- 内容区域 -->
    <div class="library-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
// 保持空的setup,因为我们现在只需要静态展示
</script>

<style scoped>
@import '../assets/styles/library.css';

/* 媒体库导航样式 */
.library-nav {
  padding: 0 20px;
  margin-bottom: 20px;
}

.library-nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.library-nav li {
  position: relative;
  padding: 15px 0;
}

.library-nav a {
  text-decoration: none;
  color: #909090;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.library-nav li.active {
  position: relative;
}

.library-nav li.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1db954;
}

.library-nav li.active a {
  color: #1db954;
}

.library-nav a:hover {
  color: #1db954;
}
</style> 