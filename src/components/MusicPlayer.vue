<template>
  <div class="music-player">
    <!-- 当前播放歌曲信息 -->
    <div class="now-playing">
      <img 
        :src="currentTrack?.cover || defaultCover" 
        :alt="currentTrack?.title"
        class="track-cover"
      >
      <div class="track-info">
        <div class="track-title">{{ currentTrack?.title || '未播放' }}</div>
        <div class="track-artist">{{ currentTrack?.artist || '-' }}</div>
      </div>
      <button class="like-btn">
        <i class="far fa-heart"></i>
      </button>
    </div>

    <!-- 播放控制 -->
    <div class="player-controls">
      <div class="control-buttons">
        <button 
          class="control-btn"
          @click="handleModeChange"
          :title="['顺序播放', '单曲循环', '随机播放'][playerStore.playMode]"
        >
          <i :class="modeIcon"></i>
        </button>
        <button class="control-btn" @click="handlePrev">
          <i class="fas fa-step-backward"></i>
        </button>
        <button class="play-btn" @click="togglePlay">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button class="control-btn" @click="handleNext">
          <i class="fas fa-step-forward"></i>
        </button>
        <button class="control-btn" @click="playerStore.togglePlaylist">
          <i class="fas fa-list"></i>
        </button>
        <button class="control-btn" @click="showLyric = true">
          <i class="fas fa-align-left"></i>
        </button>
      </div>

      <div class="progress-bar">
        <span class="time current">{{ formatTime(currentTime) }}</span>
        <div 
          class="progress"
          @click="seek"
          @mousedown="startDragging"
          @mousemove="drag"
          @mouseup="stopDragging"
          @mouseleave="stopDragging"
        >
          <div 
            class="progress-current"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <span class="time duration">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- 音量控制 -->
    <div class="volume-controls">
      <button class="volume-btn" @click="toggleMute">
        <i :class="volumeIcon"></i>
      </button>
      <div class="volume-slider">
        <div 
          class="volume-progress"
          @click="adjustVolume"
          @mousedown="startVolumeDragging"
          @mousemove="dragVolume"
          @mouseup="stopVolumeDragging"
          @mouseleave="stopVolumeDragging"
        >
          <div 
            class="volume-current"
            :style="{ width: `${volume * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <PlaylistDrawer v-model:visible="showPlaylist" />
  <LyricDisplay v-model:visible="showLyric" />
</template>

<script setup>
import { ref, computed } from 'vue'
const defaultCover = 'https://placehold.co/200x200/1a1a1a/ffffff?text=No+Cover'
import PlaylistDrawer from './PlaylistDrawer.vue'
import LyricDisplay from './LyricDisplay.vue'

// 替换原有的状态管理
import { usePlayerStore } from '../stores/player'
const playerStore = usePlayerStore()

// 使用 storeToRefs 保持响应性
import { storeToRefs } from 'pinia'
const {
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  currentTrack
} = storeToRefs(playerStore)

// 计算属性
const progress = computed(() => {
  return (currentTime.value / duration.value) * 100 || 0
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'fas fa-volume-mute'
  if (volume.value < 0.5) return 'fas fa-volume-down'
  return 'fas fa-volume-up'
})

// 方法
const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 更新方法调用
const togglePlay = () => playerStore.togglePlay()
const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const seek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  playerStore.seek(percent * duration.value)
}

const adjustVolume = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const newVolume = (event.clientX - rect.left) / rect.width
  volume.value = Math.max(0, Math.min(1, newVolume))
}

// 拖动相关方法
const startDragging = () => isDragging.value = true
const stopDragging = () => isDragging.value = false
const drag = (event) => {
  if (isDragging.value) seek(event)
}

const startVolumeDragging = () => isVolumeDragging.value = true
const stopVolumeDragging = () => isVolumeDragging.value = false
const dragVolume = (event) => {
  if (isVolumeDragging.value) adjustVolume(event)
}

// 拖动状态
const isDragging = ref(false)
const isVolumeDragging = ref(false)

// 更新播放控制按钮的事件处理
const handlePrev = () => playerStore.playPrev()
const handleNext = () => playerStore.playNext()
const handleModeChange = () => {
  playerStore.playMode = (playerStore.playMode + 1) % 3
}

// 获取播放模式图标
const modeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 1: return 'fas fa-repeat-1'
    case 2: return 'fas fa-random'
    default: return 'fas fa-repeat'
  }
})

// 添加播放列表显示状态
const showPlaylist = ref(false)

// 添加切换播放列表显示的方法
const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value
}

// 添加歌词显示状态
const showLyric = ref(false)
</script>

<style scoped>
.music-player {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 300px;
}

.track-cover {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
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

.like-btn {
  padding: 8px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
}

.player-controls {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn,
.play-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 40px;
}

.progress {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-current {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
}

.volume-controls {
  width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
}

.volume-slider {
  flex: 1;
  max-width: 100px;
}

.volume-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.volume-current {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
}
</style> 