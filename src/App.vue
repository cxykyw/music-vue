<template>
  <div class="container">
    <Sidebar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'KYW-免费音乐'
})
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
@import './assets/styles/styles.css';
</style> 