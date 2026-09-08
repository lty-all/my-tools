<script setup lang="ts">
import { computed } from 'vue'
import { tools } from '@/data/tools'
import { useI18n } from '@/i18n'
import ToolIcon from '@/components/ToolIcon.vue'

const { t, locale } = useI18n()

const sections = computed(() => [
  {
    key: 'dev',
    icon: 'json',
    title: t('home.cat.dev.title'),
    desc: t('home.cat.dev.desc'),
    items: tools.filter((tool) => tool.category === 'dev'),
  },
  {
    key: 'local-privacy',
    icon: 'shield',
    title: t('home.cat.local.title'),
    desc: t('home.cat.local.desc'),
    items: tools.filter((tool) => tool.category === 'local-privacy'),
  },
  {
    key: 'ai',
    icon: 'sparkles',
    title: t('home.cat.ai.title'),
    desc: t('home.cat.ai.desc'),
    items: tools.filter((tool) => tool.category === 'ai'),
  },
])

const liveCount = tools.filter((tool) => tool.live).length
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-badge">
        <ToolIcon name="sparkles" class="badge-icon" />
        <span>{{ t('home.badge') }}</span>
      </div>
      <h1 class="gradient-text">{{ t('home.title') }}</h1>
      <p class="hero-sub">{{ t('home.subtitle') }}</p>
      <div class="cta-row">
        <RouterLink to="/tools" class="cta">{{ t('home.cta') }}</RouterLink>
        <RouterLink to="/tools" class="cta ghost">{{ t('home.cta2') }}</RouterLink>
      </div>
      <div class="stats">
        <div class="stat">
          <b>{{ liveCount }}</b>
          <span>{{ t('home.stats.tools') }}</span>
        </div>
        <div class="stat">
          <b>100%</b>
          <span>{{ t('home.stats.local') }}</span>
        </div>
        <div class="stat">
          <b>0</b>
          <span>{{ t('home.stats.upload') }}</span>
        </div>
        <div class="stat">
          <b>{{ t('home.stats.costValue') }}</b>
          <span>{{ t('home.stats.cost') }}</span>
        </div>
      </div>
    </section>

    <section class="categories">
      <div v-for="section in sections" :key="section.key" class="cat-card">
        <div class="cat-head">
          <span class="cat-icon">
            <ToolIcon :name="section.icon" />
          </span>
          <div>
            <h2>{{ section.title }}</h2>
            <p>{{ section.desc }}</p>
          </div>
        </div>
        <ul class="cat-list">
          <li v-for="tool in section.items" :key="tool.slug">
            <component
              :is="tool.live ? 'RouterLink' : 'span'"
              :to="tool.live ? `/tools/${tool.slug}` : undefined"
              class="tool-chip"
              :class="{ dead: !tool.live }"
            >
              <ToolIcon :name="tool.icon" class="chip-icon" />
              <span class="chip-name">{{ tool.name[locale] }}</span>
              <span v-if="!tool.live" class="chip-soon">{{ t('tools.badge.soon') }}</span>
            </component>
          </li>
        </ul>
      </div>
    </section>

    <section class="why">
      <h2>{{ t('home.why.title') }}</h2>
      <div class="why-grid">
        <div class="why-item">
          <ToolIcon name="shield" class="why-icon" />
          <h3>{{ t('home.why.1t') }}</h3>
          <p>{{ t('home.why.1d') }}</p>
        </div>
        <div class="why-item">
          <ToolIcon name="zap" class="why-icon" />
          <h3>{{ t('home.why.2t') }}</h3>
          <p>{{ t('home.why.2d') }}</p>
        </div>
        <div class="why-item">
          <ToolIcon name="unlock" class="why-icon" />
          <h3>{{ t('home.why.3t') }}</h3>
          <p>{{ t('home.why.3d') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 88px 0 64px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--card);
  backdrop-filter: blur(10px);
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.badge-icon {
  width: 15px;
  height: 15px;
  color: var(--accent-2);
}
.hero h1 {
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}
.hero-sub {
  max-width: 620px;
  margin: 0 auto 34px;
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-secondary);
}
.cta-row {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.cta {
  padding: 13px 34px;
  border-radius: 10px;
  background: var(--gradient);
  background-size: 150% auto;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  box-shadow: var(--glow);
  transition: all 0.25s;
}
.cta:hover {
  background-position: right center;
  color: #fff;
  transform: translateY(-2px);
}
.cta.ghost {
  background: var(--card);
  border: 1px solid var(--border-strong);
  box-shadow: none;
}
.cta.ghost:hover {
  border-color: var(--accent);
  box-shadow: var(--glow);
}
.stats {
  display: flex;
  justify-content: center;
  gap: 56px;
  flex-wrap: wrap;
  margin-top: 56px;
}
.stat b {
  display: block;
  font-size: 30px;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat span {
  font-size: 13px;
  color: var(--text-secondary);
}
.categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 24px 0 12px;
}
.cat-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
  backdrop-filter: blur(12px);
  padding: 22px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.cat-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--glow);
}
.cat-head {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 18px;
}
.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(124, 108, 255, 0.14);
  color: var(--accent);
}
.cat-head h2 {
  font-size: 17px;
  margin-bottom: 2px;
}
.cat-head p {
  font-size: 13px;
  color: var(--text-secondary);
}
.cat-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tool-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text);
  font-size: 14px;
  transition: background 0.2s;
}
a.tool-chip:hover {
  background: var(--card-hover);
  color: var(--text);
}
.tool-chip.dead {
  color: var(--text-secondary);
  opacity: 0.65;
}
.chip-icon {
  width: 17px;
  height: 17px;
  color: var(--accent);
}
.dead .chip-icon {
  color: var(--text-secondary);
}
.chip-name {
  flex: 1;
}
.chip-soon {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
}
.why {
  padding: 56px 0 32px;
  text-align: center;
}
.why h2 {
  font-size: 26px;
  margin-bottom: 32px;
}
.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.why-item {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
  padding: 26px 22px;
  transition: border-color 0.25s, transform 0.25s;
}
.why-item:hover {
  border-color: var(--border-strong);
  transform: translateY(-3px);
}
.why-icon {
  width: 26px;
  height: 26px;
  color: var(--accent-2);
  margin-bottom: 12px;
}
.why-item h3 {
  font-size: 16px;
  margin-bottom: 8px;
}
.why-item p {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .hero {
    padding: 56px 0 44px;
  }
  .stats {
    gap: 32px;
  }
  .categories,
  .why-grid {
    grid-template-columns: 1fr;
  }
}
</style>
