<template>
  <div class="albums-grid">
    <div v-for="album in albums"
         :key="album.id"
         class="album-card"
         @click="openAlbum(album)">
      <img :src="album.cover" :alt="album.name">
      <h3>{{ album.name }}</h3>
      <p>{{ album.artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const albums = ref([
  {
    id: 1,
    name: '专辑1',
    artist: '艺术家1',
    cover: 'https://cdn.pixabay.com/photo/2016/11/19/09/57/cd-1838329_640.jpg'
  },
  {
    id: 2,
    name: '专辑2',
    artist: '艺术家2',
    cover: 'https://cdn.pixabay.com/photo/2018/03/04/23/32/vinyl-3199610_640.jpg'
  },
  // ... 更多专辑
])

const openAlbum = (album) => {
  console.log('打开专辑:', album.name)
}
</script> 