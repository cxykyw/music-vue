<template>
  <main class="main-content">
    <!-- 顶部栏 -->
    <header class="top-bar">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索音乐、艺人或专辑">
      </div>
      <div class="user-profile">
        <span>玉伟：欢迎你</span>
        <div class="profile-pic default-avatar">
          YW
        </div>
      </div>
    </header>

    <!-- Banner 区域 -->
    <section class="hero-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h1>发现音乐的无限可能</h1>
          <p>数百万歌曲，播放列表和播客。立即开始您的音乐之旅。</p>
          <div class="banner-buttons">
            <button class="primary-btn">开始免费试用</button>
            <button class="secondary-btn">查看会员计划</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐歌曲区域 -->
    <section class="recommended-songs">
      <h2>为您推荐</h2>
      <div class="song-list">
        <div class="song-card">
          <img src="https://cdn.pixabay.com/photo/2018/06/30/09/29/music-3507317_640.jpg" alt="歌曲1">
          <h3>歌曲标题1</h3>
          <p>艺术家名称</p>
        </div>
        <div class="song-card">
          <img src="https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_640.jpg" alt="歌曲2">
          <h3>歌曲标题2</h3>
          <p>艺术家名称</p>
        </div>
        <div class="song-card">
          <img src="https://cdn.pixabay.com/photo/2015/01/20/13/13/ipad-605439_640.jpg" alt="歌曲3">
          <h3>歌曲标题3</h3>
          <p>艺术家名称</p>
        </div>
      </div>
    </section>

    <!-- 播放列表区域 -->
    <section class="playlists">
      <h2>热门播放列表</h2>
      <div class="playlist-grid">
        <div class="playlist-card">
          <img src="https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_640.jpg" alt="播放列表1">
          <h3>播放列表1</h3>
          <p>描述文本</p>
        </div>
        <div class="playlist-card">
          <img src="https://cdn.pixabay.com/photo/2019/07/14/16/29/pen-4337524_640.jpg" alt="播放列表2">
          <h3>播放列表2</h3>
          <p>描述文本</p>
        </div>
        <div class="playlist-card">
          <img src="https://cdn.pixabay.com/photo/2016/11/22/19/15/dark-1850120_640.jpg" alt="播放列表3">
          <h3>播放列表3</h3>
          <p>描述文本</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
// 保持空的setup,因为我们现在只需要静态展示
</script>

<style scoped>
/* 默认头像样式 */
.default-avatar {
  background: linear-gradient(45deg, #1db954, #1ed760);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* 按钮样式 */
.primary-btn {
  background-color: #1db954; /* 绿色背景 */
  color: white; /* 白色文字 */
  border: none; /* 无边框 */
  padding: 10px 20px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标指针 */
  transition: background-color 0.3s; /* 背景色过渡 */
}

.primary-btn:hover {
  background-color: #1ed760; /* 悬停时变亮 */
}

.secondary-btn {
  background-color: transparent; /* 透明背景 */
  color: #1db954; /* 绿色文字 */
  border: 2px solid #1db954; /* 绿色边框 */
  padding: 10px 20px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标指针 */
  transition: background-color 0.3s, color 0.3s; /* 背景色和文字色过渡 */
}

.secondary-btn:hover {
  background-color: #1db954; /* 悬停时背景变为绿色 */
  color: white; /* 悬停时文字变为白色 */
}

/* 修改播放列表网格布局样式 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px); /* 改用固定宽度 */
  gap: 15px; /* 减小间距 */
  padding: 20px;
  justify-content: start; /* 左对齐 */
}

.playlist-card {
  width: 200px;
  margin: 0; /* 移除margin，使用grid的gap来控制间距 */
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.playlist-card:hover {
  transform: scale(1.05);
}

.playlist-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
</style> 