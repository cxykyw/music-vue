<template>
  <div class="songs-list">
    <div v-for="song in songs"
         :key="song.id"
         class="song-item"
         @click="playSong(song)">
      <img :src="song.cover" :alt="song.name">
      <div class="song-info">
        <h4>{{ song.name }}</h4>
        <p>{{ song.artist }}</p>
      </div>
      <div class="song-duration">{{ song.duration }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const songs = ref([
  {
    id: 1,
    name: '歌曲1',
    artist: '艺术家1',
    duration: '3:45',
    cover: '/src/assets/images/song1.jpg'
  },
  // 更多歌曲...
])

const playSong = (song) => {
  console.log('播放歌曲:', song.name)
}
</script> 