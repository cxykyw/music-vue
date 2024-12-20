<template>
  <main class="main-content">
    <TopBar :showActions="false" />
    
    <nav class="explore-tabs">
      <ul>
        <li v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id">
          <a href="#">{{ tab.name }}</a>
        </li>
      </ul>
    </nav>

    <section class="new-releases">
      <div class="section-header">
        <h2>新专辑与单曲</h2>
        <div class="carousel-controls">
          <button class="prev-btn" @click="scrollCarousel('left')">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="next-btn" @click="scrollCarousel('right')">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="albums-carousel" ref="carousel">
        <div v-for="album in newAlbums" 
             :key="album.id"
             class="album-card"
             @click="playAlbum(album)">
          <img :src="album.cover" :alt="album.name" @error="handleImageError" loading="lazy">
          <h3>{{ album.name }}</h3>
          <p>{{ album.artist }}</p>
        </div>
      </div>
    </section>

    <section class="moods">
      <h2>按心情浏览</h2>
      <div class="mood-grid">
        <button v-for="mood in moods"
                :key="mood.id"
                class="mood-btn"
                :data-mood="mood.id"
                @click="selectMood(mood)">
          <i :class="mood.icon"></i>
          {{ mood.name }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('new')
const tabs = ref([
  { id: 'new', name: '新发现' },
  { id: 'charts', name: '排行榜' },
  { id: 'genres', name: '流派' }
])

const defaultCover = '/src/assets/images/default-album-cover.jpg'

const newAlbums = ref([
  {
    id: 1,
    name: '新专辑1',
    artist: '艺术家1',
    cover: 'https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_640.jpg'
  },
  {
    id: 2,
    name: '新专辑2',
    artist: '艺术家2',
    cover: 'https://cdn.pixabay.com/photo/2018/06/30/09/29/music-3507317_640.jpg'
  },
  {
    id: 3,
    name: '新专辑3',
    artist: '艺术家3',
    cover: 'https://cdn.pixabay.com/photo/2015/01/20/13/13/ipad-605439_640.jpg'
  },
  {
    id: 4,
    name: '新专辑4',
    artist: '艺术家4',
    cover: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/dark-1850120_640.jpg'
  },
  {
    id: 5,
    name: '新专辑5',
    artist: '艺术家5',
    cover: 'https://cdn.pixabay.com/photo/2019/07/14/16/29/pen-4337524_640.jpg'
  }
])

const moods = ref([
  { id: 'happy', name: '快乐', icon: 'fas fa-smile' },
  { id: 'chill', name: '放松', icon: 'fas fa-coffee' },
  { id: 'focus', name: '专注', icon: 'fas fa-brain' },
  // 更多心情...
])

const carousel = ref(null)

const scrollCarousel = (direction) => {
  const scrollAmount = 220 // 卡片宽度 + 间距
  if (carousel.value) {
    carousel.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

const playAlbum = (album) => {
  console.log('播放专辑:', album.name)
}

const selectMood = (mood) => {
  console.log('选择心情:', mood.name)
}

const handleImageError = (e) => {
  e.target.src = defaultCover
}
</script>

<style scoped>
@import '../assets/styles/explore.css';
</style> 