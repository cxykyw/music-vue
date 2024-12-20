<template>
  <header class="top-bar">
    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input 
        type="text" 
        :placeholder="placeholder"
        v-model="searchQuery"
        @input="handleSearch"
      >
    </div>
    
    <!-- 根据 showActions prop 来控制按钮显示 -->
    <div class="top-actions" v-if="showActions">
      <button class="top-action-btn">
        <i class="fas fa-user"></i>
      </button>
      <button class="top-action-btn">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button class="top-action-btn">
        <i class="fas fa-cog"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索音乐、艺人或专辑'
  },
  showActions: {
    type: Boolean,
    default: false  // 默认不显示
  }
})

const searchQuery = ref('')

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}
</script>

<style scoped>
/* 使用原有的styles.css中的top-bar相关样式 */
</style> 