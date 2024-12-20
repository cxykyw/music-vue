<template>
  <div class="playlists-grid">
    <div v-for="playlist in playlists"
         :key="playlist.id"
         class="playlist-card"
         @click="openPlaylist(playlist)">
      <img :src="playlist.cover" :alt="playlist.name">
      <h3>{{ playlist.name }}</h3>
      <p>{{ playlist.songCount }}首歌曲</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const playlists = ref([
  {
    id: 1,
    name: '我喜欢的音乐',
    songCount: 128,
    cover: 'https://cdn.pixabay.com/photo/2016/11/19/13/57/drum-set-1839383_640.jpg'
  },
  {
    id: 2,
    name: '最近播放',
    songCount: 50,
    cover: 'https://cdn.pixabay.com/photo/2019/05/26/08/54/microphone-4229941_640.jpg'
  }
  // ... 更多播放列表
])

const openPlaylist = (playlist) => {
  console.log('打开播放列表:', playlist.name)
}
</script> 