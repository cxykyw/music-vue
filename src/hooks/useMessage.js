import { createVNode, render } from 'vue'
import Message from '../components/Message.vue'

const messageInstance = createVNode(Message)
const container = document.createElement('div')
document.body.appendChild(container)
render(messageInstance, container)

export function useMessage() {
  const showMessage = (content, type = 'info') => {
    messageInstance.component.exposed.show(content, type)
  }

  return {
    showMessage
  }
} 