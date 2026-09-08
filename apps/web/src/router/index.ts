import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/pages/Tools.vue'),
    },
    {
      path: '/tools/json-formatter',
      name: 'json-formatter',
      component: () => import('@/pages/JsonFormatter.vue'),
    },
    {
      path: '/tools/subtitle-resync',
      name: 'subtitle-resync',
      component: () => import('@/pages/SubtitleResync.vue'),
    },
    {
      path: '/tools/video-to-gif',
      name: 'video-to-gif',
      component: () => import('@/pages/VideoToGif.vue'),
    },
    {
      path: '/tools/exif-cleaner',
      name: 'exif-cleaner',
      component: () => import('@/pages/ExifCleaner.vue'),
    },
  ],
})

export default router
