<template>
  <div class="home">
    <TopBar />
    <!-- 欢迎横幅 -->
    <section class="welcome-banner">
      <div class="banner-content">
        <h1>发现音乐的无限可能</h1>
        <p>数百万歌曲，播放列表和播客。立即开始您的音乐之旅。</p>
        <button class="start-btn" @click="handleStart">
          开始免费试用
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="banner-image">
        <img 
          src="https://placehold.co/600x400/1db954/ffffff?text=Music+Banner" 
          alt="Music Banner"
        >
      </div>
    </section>

    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-header">
        <h2>推荐歌单</h2>
        <router-link to="/playlists" class="more-link">
          更多
          <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
      <div class="playlist-grid">
        <div 
          v-for="playlist in recommendPlaylists" 
          :key="playlist.id"
          class="playlist-card"
          @click="navigateToPlaylist(playlist.id)"
        >
          <div class="card-cover">
            <img :src="playlist.cover" :alt="playlist.name">
            <div class="play-overlay">
              <button class="play-btn">
                <i class="fas fa-play"></i>
              </button>
            </div>
          </div>
          <div class="card-info">
            <h3>{{ playlist.name }}</h3>
            <p>{{ playlist.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 新歌速递 -->
    <section class="section">
      <div class="section-header">
        <h2>新歌速递</h2>
        <router-link to="/new" class="more-link">
          更多
          <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
      <div class="song-list">
        <div 
          v-for="song in newSongs" 
          :key="song.id"
          class="song-item"
          @click="playSong(song.id)"
        >
          <img :src="song.cover" :alt="song.title" class="song-cover">
          <div class="song-info">
            <div class="song-title">{{ song.title }}</div>
            <div class="song-artist">{{ song.artist }}</div>
          </div>
          <div class="song-duration">{{ formatDuration(song.duration) }}</div>
          <button class="play-btn">
            <i class="fas fa-play"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- 热门歌手 -->
    <section class="section">
      <div class="section-header">
        <h2>热门歌手</h2>
        <router-link to="/artists" class="more-link">
          更多
          <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
      <div class="artist-grid">
        <div 
          v-for="artist in hotArtists" 
          :key="artist.id"
          class="artist-card"
          @click="navigateToArtist(artist.id)"
        >
          <img :src="artist.avatar" :alt="artist.name" class="artist-avatar">
          <h3>{{ artist.name }}</h3>
          <p>{{ artist.fans }}粉丝</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/player'
import { useMessage } from '../hooks/useMessage'


const router = useRouter()
const playerStore = usePlayerStore()
const { showMessage } = useMessage()

// 模拟数据
const recommendPlaylists = ref([
  {
    id: 1,
    name: '今日热门',
    description: '根据您的音乐品味推荐',
    cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Hot+Today'
  },
  {
    id: 2,
    name: '轻音乐',
    description: '让心灵沉淀的优质音乐',
    cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Peaceful'
  },
  // ... 更多歌单
])

const newSongs = ref([
  {
    id: 1,
    title: '新歌标题',
    artist: '歌手名称',
    cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=New',
    duration: 180
  },
  // ... 更多新歌
])

const hotArtists = ref([
  {
    id: 1,
    name: '艺术家名称',
    avatar: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Artist',
    fans: '100万'
  },
  // ... 更多艺术家
])

// 方法
const handleStart = () => {
  if (!userStore.isLoggedIn) {
    router.push('/register')
  } else {
    showMessage('您已登录', 'info')
  }
}

const navigateToPlaylist = (id) => {
  router.push(`/playlist/${id}`)
}

const navigateToArtist = (id) => {
  router.push(`/artist/${id}`)
}

const playSong = async (id) => {
  try {
    await playerStore.playSong(id)
  } catch (error) {
    showMessage('播放失败', 'error')
  }
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 40px;
  background: linear-gradient(45deg, var(--bg-secondary), #1a1a1a);
  border-radius: 16px;
  margin-bottom: 40px;
}

.banner-content {
  color: var(--text-primary);
}

.banner-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.banner-content p {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.start-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  background: var(--primary-color);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
}

.banner-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.more-link {
  color: var(--text-secondary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.more-link:hover {
  color: var(--primary-color);
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.playlist-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.playlist-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.card-cover:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color);
  border: none;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.card-info {
  padding: 12px 0;
}

.card-info h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.card-info p {
  font-size: 14px;
  color: var(--text-secondary);
}

.song-list {
  display: grid;
  gap: 8px;
}

.song-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}

.song-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.song-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.song-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.song-artist {
  font-size: 14px;
  color: var(--text-secondary);
}

.song-duration {
  color: var(--text-secondary);
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.artist-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.artist-card:hover {
  transform: translateY(-4px);
}

.artist-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
}

.artist-card h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.artist-card p {
  font-size: 14px;
  color: var(--text-secondary);
}
</style> 