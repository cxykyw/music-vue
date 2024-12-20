<template>
  <div class="lyric-display" :class="{ active: visible }">
    <div class="lyric-header">
      <button class="close-btn" @click="$emit('update:visible', false)">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="lyric-content">
      <div class="current-lyric">
        {{ playerStore.currentLyric || '暂无歌词' }}
      </div>
    </div>
    
    <div class="song-info">
      <img 
        :src="playerStore.currentTrack?.cover || 'https://placehold.co/200x200/1a1a1a/ffffff?text=No+Cover'" 
        :alt="playerStore.currentTrack?.title"
        class="cover"
      >
      <div class="info">
        <div class="title">{{ playerStore.currentTrack?.title }}</div>
        <div class="artist">{{ playerStore.currentTrack?.artist }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/player'

defineProps({
  visible: Boolean
})

defineEmits(['update:visible'])

const playerStore = usePlayerStore()
</script>

<style scoped>
.lyric-display {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.lyric-display.active {
  opacity: 1;
  pointer-events: auto;
}

.lyric-header {
  padding: 20px;
  text-align: right;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  font-size: 24px;
}

.lyric-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.current-lyric {
  font-size: 24px;
  text-align: center;
  line-height: 1.5;
  color: var(--text-primary);
}

.song-info {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.cover {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}

.info .title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.info .artist {
  font-size: 14px;
  color: var(--text-secondary);
}
</style> 