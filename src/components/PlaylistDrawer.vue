<template>
  <div 
    class="playlist-drawer"
    :class="{ active: visible }"
  >
    <div class="drawer-header">
      <h3>播放列表 ({{ playlist.length }})</h3>
      <div class="header-actions">
        <button class="action-btn" @click="handleClear">
          <i class="fas fa-trash-alt"></i>
          清空
        </button>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div class="playlist-content">
      <div 
        v-for="(track, index) in playlist" 
        :key="track.id"
        class="track-item"
        :class="{ active: index === currentIndex }"
        @click="() => handlePlay(track, index)"
      >
        <div class="track-info">
          <div class="track-title">{{ track.title }}</div>
          <div class="track-artist">{{ track.artist }}</div>
        </div>
        <div class="track-actions">
          <button 
            class="like-btn"
            :class="{ active: track.isLiked }"
            @click.stop="handleLike(track)"
          >
            <i :class="track.isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
          <button 
            class="remove-btn"
            @click.stop="handleRemove(index)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import { useMessage } from '../hooks/useMessage'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

const playerStore = usePlayerStore()
const { showMessage } = useMessage()

const playlist = computed(() => playerStore.playlist)
const currentIndex = computed(() => playerStore.currentIndex)

const close = () => {
  emit('update:visible', false)
}

const handlePlay = (track, index) => {
  playerStore.play(track, index)
}

const handleRemove = (index) => {
  playerStore.removeFromPlaylist(index)
}

const handleClear = () => {
  playerStore.clearPlaylist()
  showMessage('播放列表已清空', 'success')
}

const handleLike = async (track) => {
  try {
    await playerStore.toggleLike(track)
    showMessage(track.isLiked ? '已添加到我喜欢的音乐' : '已取消喜欢', 'success')
  } catch (error) {
    showMessage('操作失败', 'error')
  }
}
</script>

<style scoped>
.playlist-drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: var(--bg-secondary);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.playlist-drawer.active {
  right: 0;
}

.drawer-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn,
.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.playlist-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.track-item:hover,
.track-item.active {
  background: rgba(255, 255, 255, 0.1);
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 12px;
  color: var(--text-secondary);
}

.track-actions {
  display: flex;
  gap: 8px;
}

.like-btn,
.remove-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
}

.like-btn.active {
  color: #ff4081;
}
</style> 