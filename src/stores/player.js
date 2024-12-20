import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getSongUrl, getSongDetail, getLyric } from '../api/music'

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
  
  // 添加状态
  const lyric = ref('')
  const currentLyric = ref('')
  const loading = ref(false)
  
  // 初始化音频实例
  const initAudio = () => {
    if (audio) return
    
    audio = new Audio()
    
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
    if (!audio) initAudio()
    
    if (track) {
      // 播放新歌曲
      currentIndex.value = index
      audio.src = track.url
      await audio.load()
    }
    
    await audio.play()
    isPlaying.value = true
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
  
  // 添加方法
  const loadSong = async (songId) => {
    try {
      loading.value = true
      
      // 并行请求歌曲信息
      const [urlRes, detailRes, lyricRes] = await Promise.all([
        getSongUrl(songId),
        getSongDetail(songId),
        getLyric(songId)
      ])
      
      // 更新歌曲信息
      const song = {
        id: songId,
        url: urlRes.url,
        title: detailRes.name,
        artist: detailRes.ar.map(a => a.name).join('/'),
        cover: detailRes.al.picUrl,
        duration: detailRes.dt / 1000
      }
      
      // 更新歌词
      lyric.value = lyricRes.lrc.lyric
      parseLyric(lyric.value)
      
      return song
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
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
      const song = await loadSong(songId)
      addToPlaylist([song], true)
    } catch (error) {
      throw error
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
    loading,
    
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