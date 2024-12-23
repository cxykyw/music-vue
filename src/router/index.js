import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Library from '../views/Library.vue'
import Upgrade from '../views/Upgrade.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { useUserStore } from '../stores/user'
import BaseLayout from '../layouts/BaseLayout.vue'

const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'explore',
        component: () => import('../views/Explore.vue'),
        children: [
          {
            path: '',
            component: () => import('../views/explore/NewReleases.vue')
          },
          {
            path: 'charts',
            component: () => import('../views/explore/Charts.vue')
          },
          {
            path: 'genres',
            component: () => import('../views/explore/Genres.vue')
          }
        ]
      },
      {
        path: 'library',
        component: () => import('../views/Library.vue'),
        children: [
          {
            path: '',
            redirect: '/library/songs'
          },
          {
            path: 'songs',
            component: () => import('../views/library/Songs.vue')
          },
          {
            path: 'playlists',
            component: () => import('../views/library/Playlists.vue')
          },
          {
            path: 'albums',
            component: () => import('../views/library/Albums.vue')
          },
          {
            path: 'favorites',
            component: () => import('../views/library/Favorites.vue')
          }
        ]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/set-password',
    name: 'SetNewPassword',
    component: () => import('../views/SetNewPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('../views/VerifyEmail.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router 