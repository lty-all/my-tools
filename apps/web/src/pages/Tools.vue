<script setup lang="ts">
import { computed } from 'vue'
import { tools, type ToolCategory, type ToolMeta } from '@/data/tools'
import { useI18n } from '@/i18n'
import ToolIcon from '@/components/ToolIcon.vue'

const { t, locale } = useI18n()

const sections = computed(() =>
  (
    [
      { key: 'dev', icon: 'json' },
      { key: 'local-privacy', icon: 'shield' },
      { key: 'ai', icon: 'sparkles' },
    ] as { key: ToolCategory; icon: string }[]
  ).map((meta) => ({
    ...meta,
    title: t(`tools.section.${meta.key === 'local-privacy' ? 'local' : meta.key}`),
    desc: t(`tools.section.${meta.key === 'local-privacy' ? 'localDesc' : `${meta.key}Desc`}`),
    items: tools.filter((tool) => tool.category === meta.key),
  })),
)

function name(tool: ToolMeta) {
  return tool.name[locale.value]
}

function desc(tool: ToolMeta) {
  return tool.desc[locale.value]
}
</script>

<template>
  <div class="tools-page">
    <header class="page-head">
      <h1>{{ t('tools.title') }}</h1>
      <p class="subtitle">{{ t('tools.subtitle') }}</p>
    </header>

    <section v-for="section in sections" :key="section.key" class="category">
      <div class="cat-head">
        <span class="cat-icon">
          <ToolIcon :name="section.icon" />
        </span>
        <div>
          <h2>{{ section.title }}</h2>
          <p>{{ section.desc }}</p>
        </div>
      </div>
      <div class="grid">
        <component
          :is="tool.live ? 'RouterLink' : 'div'"
          v-for="tool in section.items"
          :key="tool.slug"
          :to="tool.live ? `/tools/${tool.slug}` : undefined"
          class="card"
          :class="{ dead: !tool.live }"
        >
          <span class="icon">
            <ToolIcon :name="tool.icon" />
          </span>
          <div class="info">
            <div class="name-row">
              <span class="name">{{ name(tool) }}</span>
              <span v-if="tool.category === 'local-privacy'" class="badge local-badge">
                {{ t('tools.badge.local') }}
              </span>
              <span v-else-if="tool.category === 'ai'" class="badge ai-badge">
                {{ t('tools.badge.ai') }}
              </span>
            </div>
            <p class="desc">{{ desc(tool) }}</p>
          </div>
          <span v-if="!tool.live" class="soon">{{ t('tools.badge.soon') }}</span>
        </component>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tools-page {
  padding: 16px 0 24px;
}
.page-head {
  text-align: center;
  margin-bottom: 44px;
}
h1 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 10px;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}
.category {
  margin-bottom: 44px;
}
.cat-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(124, 108, 255, 0.14);
  color: var(--accent);
}
.cat-head h2 {
  font-size: 19px;
  margin-bottom: 2px;
}
.cat-head p {
  font-size: 13px;
  color: var(--text-secondary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--card);
  backdrop-filter: blur(12px);
  color: var(--text);
  transition: all 0.25s;
}
a.card:hover {
  border-color: var(--accent);
  box-shadow: var(--glow);
  transform: translateY(-3px);
  color: var(--text);
}
.card.dead {
  opacity: 0.55;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: rgba(124, 108, 255, 0.12);
  color: var(--accent);
  flex-shrink: 0;
}
.dead .icon {
  color: var(--text-secondary);
}
.info {
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.name {
  font-weight: 600;
  font-size: 15px;
}
.desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.badge {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.local-badge {
  background: transparent;
  color: var(--accent-2);
  border: 1px solid var(--accent-2);
}
.ai-badge {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
}
.soon {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
