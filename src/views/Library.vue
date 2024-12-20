<template>
  <main class="main-content">
    <!-- 顶部栏 -->
    <header class="top-bar">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索音乐、艺人或专辑">
      </div>
    </header>

    <!-- 媒体库导航 -->
    <nav class="library-nav">
      <ul>
        <li class="active"><a href="#playlists">播放列表</a></li>
        <li><a href="#albums">专辑</a></li>
        <li><a href="#songs">歌曲</a></li>
        <li><a href="#artists">音乐人</a></li>
        <li><a href="#podcasts">播客</a></li>
      </ul>
    </nav>

    <!-- 媒体内容网格 -->
    <section class="media-grid">
      <div class="media-card folder">
        <i class="fas fa-bookmark"></i>
        <h3>稍后听</h3>
        <p>20 首歌曲</p>
      </div>
      <div class="media-card folder">
        <i class="fas fa-heart"></i>
        <h3>我喜欢的音乐</h3>
        <p>128 首歌曲</p>
      </div>
      <div class="media-card folder">
        <i class="fas fa-clock"></i>
        <h3>最近播放</h3>
        <p>50 首歌曲</p>
      </div>
      <div class="media-card folder">
        <i class="fas fa-star"></i>
        <h3>个人精选集</h3>
        <p>35 首歌曲</p>
      </div>
    </section>
  </main>
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