import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Library from '../views/Library.vue'
import Upgrade from '../views/Upgrade.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  },
  {
    path: '/upgrade',
    name: 'Upgrade',
    component: Upgrade
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 