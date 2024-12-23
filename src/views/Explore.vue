<template>
  <div class="explore">
    <div class="explore-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/styles/explore.css';
</style> 