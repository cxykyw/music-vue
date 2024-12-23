import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getSongDetail } from '../api/music'

export const usePlayerStore = defineStore('player', () => {
  // 播放状态
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const isMuted = ref(false)
  
  // 播放列表
  const playlist = ref([])
  const currentIndex = ref(-1)
  const currentTrack = computed(() => playlist.value[currentIndex.value] || null)
  
  // 播放模式：0-顺序播放 1-单曲循环 2-随机播放
  const playMode = ref(0)
  
  // 音频实例
  let audio = null
  
  // 状态
  const lyric = ref('')
  const currentLyric = ref('')
  const isLoading = ref(false)
  
  // 初始化音频实例
  const initAudio = () => {
    if (audio) return
    
    // 创建音频元素
    audio = new Audio()
    audio.id = 'music-player'
    
    // 添加到 body 中
    if (typeof document !== 'undefined') {
      document.body.appendChild(audio)
    }
    
    // 监听事件
    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime
    })
    
    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration
    })
    
    audio.addEventListener('ended', () => {
      playNext()
    })
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
    })
    
    audio.addEventListener('canplay', () => {
      console.log('Audio can play')
    })
    
    // 音量变化监听
    watch(volume, (newVolume) => {
      if (!audio) return
      audio.volume = newVolume
    })
    
    watch(isMuted, (newMuted) => {
      if (!audio) return
      audio.muted = newMuted
    })
  }
  
  // 播放控制方法
  const play = async (track, index) => {
    try {
      if (!audio) initAudio()
      
      if (track) {
        // 播放新歌曲
        currentIndex.value = index
        audio.src = track.url
        console.log('Loading audio source:', track.url)
        await audio.load()
      }
      
      console.log('Starting playback...')
      await audio.play()
      isPlaying.value = true
    } catch (error) {
      console.error('Play error:', error)
      throw error
    }
  }
  
  const pause = () => {
    if (!audio) return
    audio.pause()
    isPlaying.value = false
  }
  
  const togglePlay = () => {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }
  
  const seek = (time) => {
    if (!audio) return
    audio.currentTime = time
  }
  
  const playNext = () => {
    if (playlist.value.length === 0) return
    
    let nextIndex
    if (playMode.value === 2) {
      // 随机播放
      nextIndex = Math.floor(Math.random() * playlist.value.length)
    } else {
      // 顺序播放
      nextIndex = (currentIndex.value + 1) % playlist.value.length
    }
    
    play(playlist.value[nextIndex], nextIndex)
  }
  
  const playPrev = () => {
    if (playlist.value.length === 0) return
    
    let prevIndex
    if (playMode.value === 2) {
      // 随机播放
      prevIndex = Math.floor(Math.random() * playlist.value.length)
    } else {
      // 顺序播放
      prevIndex = currentIndex.value - 1
      if (prevIndex < 0) prevIndex = playlist.value.length - 1
    }
    
    play(playlist.value[prevIndex], prevIndex)
  }
  
  // 播放列表操作
  const addToPlaylist = (tracks, autoPlay = false) => {
    const startIndex = playlist.value.length
    playlist.value.push(...tracks)
    
    if (autoPlay && tracks.length > 0) {
      play(tracks[0], startIndex)
    }
  }
  
  const clearPlaylist = () => {
    playlist.value = []
    currentIndex.value = -1
    pause()
  }
  
  const removeFromPlaylist = (index) => {
    playlist.value.splice(index, 1)
    if (index === currentIndex.value) {
      if (playlist.value.length > 0) {
        play(playlist.value[0], 0)
      } else {
        currentIndex.value = -1
        pause()
      }
    } else if (index < currentIndex.value) {
      currentIndex.value--
    }
  }
  
  const toggleLike = async (track) => {
    // TODO: 实现喜欢/取消喜欢的API调用
    track.isLiked = !track.isLiked
  }
  
  // 解析歌词
  const parseLyric = (lrc) => {
    const lyrics = lrc.split('\n')
    const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    
    const lrcList = lyrics
      .map(line => {
        const matches = timeExp.exec(line)
        if (!matches) return null
        
        const time = parseInt(matches[1]) * 60 + parseInt(matches[2]) + parseInt(matches[3]) / 1000
        const text = line.replace(timeExp, '').trim()
        
        return { time, text }
      })
      .filter(item => item !== null)
      .sort((a, b) => a.time - b.time)
    
    // 监听播放进度更新当前歌词
    watch(currentTime, (time) => {
      const index = lrcList.findIndex(item => item.time > time)
      if (index > 0) {
        currentLyric.value = lrcList[index - 1].text
      }
    })
  }
  
  // 播放歌曲
  const playSong = async (songId) => {
    try {
      isLoading.value = true
      
      // 获取歌曲详情
      const res = await getSongDetail(songId)
      if (res.code !== 200) {
        throw new Error(res.message || '获取歌曲信息失败')
      }

      // 更新当前播放信息
      const track = {
        ...res.data,
        // 使用完整的 URL 路径
        url: res.data.url.startsWith('http') 
          ? res.data.url 
          : `${import.meta.env.VITE_API_BASE_URL}${res.data.url}`,
        cover: res.data.cover.startsWith('http') 
          ? res.data.cover 
          : `${import.meta.env.VITE_API_BASE_URL}${res.data.cover}`
      }

      console.log('Playing track:', track) // 添加调试日志

      // 添加到播放列表并播放
      addToPlaylist([track], true)
      
      // 更新歌词
      if (track.lyric) {
        lyric.value = track.lyric
        parseLyric(lyric.value)
      }
      
    } catch (error) {
      console.error('播放歌曲失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    // 状态
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playlist,
    currentTrack,
    playMode,
    lyric,
    currentLyric,
    isLoading,
    
    // 方法
    play,
    pause,
    togglePlay,
    seek,
    playNext,
    playPrev,
    addToPlaylist,
    clearPlaylist,
    removeFromPlaylist,
    toggleLike,
    playSong
  }
}) 