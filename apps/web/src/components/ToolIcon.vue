<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg
    class="tool-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'json'">
      <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" />
      <path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />
    </template>
    <template v-else-if="name === 'key'">
      <circle cx="7.5" cy="15.5" r="4" />
      <path d="M10.3 12.7 21 2M15 8l3 3M18 5l3 3" />
    </template>
    <template v-else-if="name === 'regex'">
      <path d="M12 4v16M4.6 7.5l14.8 9M19.4 7.5l-14.8 9" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </template>
    <template v-else-if="name === 'diff'">
      <rect x="3" y="5" width="7" height="14" rx="1.5" />
      <rect x="14" y="5" width="7" height="14" rx="1.5" />
      <path d="M10.5 12h3" />
    </template>
    <template v-else-if="name === 'subtitle'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15h5M14 15h3M7 11h3M12 11h5" />
    </template>
    <template v-else-if="name === 'gif'">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M7 9h10M7 15h10" />
    </template>
    <template v-else-if="name === 'camera'">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </template>
    <template v-else-if="name === 'code'">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </template>
    <template v-else-if="name === 'alert'">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </template>
    <template v-else-if="name === 'branch'">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="9" r="3" />
      <path d="M6 9v6M18 12a9 9 0 0 1-9 9" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </template>
    <template v-else-if="name === 'zap'">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </template>
    <template v-else-if="name === 'unlock'">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </template>
    <template v-else-if="name === 'sparkles'">
      <path d="M12 4l1.7 4.6L18 10.5l-4.3 1.9L12 17l-1.7-4.6L6 10.5l4.3-1.9z" />
      <path d="M19 3v4M17 5h4" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="9" />
    </template>
  </svg>
</template>

<style scoped>
.tool-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
</style>
