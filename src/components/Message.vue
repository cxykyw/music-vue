<template>
  <Transition name="message">
    <div 
      v-if="visible"
      class="message"
      :class="type"
    >
      {{ content }}
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const content = ref('')
const type = ref('info')

const show = (message, messageType = 'info') => {
  content.value = message
  type.value = messageType
  visible.value = true
  
  setTimeout(() => {
    visible.value = false
  }, 3000)
}

defineExpose({
  show
})
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 9999;
  color: #fff;
  font-size: 14px;
}

.success {
  background-color: #67c23a;
}

.error {
  background-color: #f56c6c;
}

.info {
  background-color: #909399;
}

.warning {
  background-color: #e6a23c;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 