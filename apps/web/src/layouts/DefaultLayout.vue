<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t, locale, setLocale } = useI18n()
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="container header-inner">
        <RouterLink to="/" class="logo">
          <span class="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </span>
          <span class="logo-text">Dev<span class="gradient-text">Pilot</span></span>
        </RouterLink>
        <nav class="nav">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <RouterLink to="/tools">{{ t('nav.tools') }}</RouterLink>
          <button
            class="lang-btn"
            :title="locale === 'zh' ? 'Switch to English' : '切换为中文'"
            @click="setLocale(locale === 'zh' ? 'en' : 'zh')"
          >
            {{ locale === 'zh' ? 'EN' : '中文' }}
          </button>
        </nav>
      </div>
    </header>
    <main class="main">
      <div class="container">
        <slot />
      </div>
    </main>
    <footer class="footer">
      <div class="container footer-inner">
        <p class="footer-tagline">{{ t('footer.tagline') }}</p>
        <p class="footer-sub">{{ t('footer.privacy') }} · DevPilot © 2026</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  background: rgba(11, 13, 22, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--gradient);
  color: #fff;
  box-shadow: var(--glow);
}
.logo-mark svg {
  width: 18px;
  height: 18px;
}
.logo-text {
  font-weight: 700;
  font-size: 19px;
  color: var(--text);
  letter-spacing: -0.02em;
}
.nav {
  display: flex;
  align-items: center;
  gap: 26px;
}
.nav a {
  color: var(--text-secondary);
  font-size: 15px;
  transition: color 0.2s;
}
.nav a:hover,
.nav a.router-link-active {
  color: var(--text);
}
.lang-btn {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--card);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}
.lang-btn:hover {
  border-color: var(--accent);
  box-shadow: var(--glow);
}
.main {
  flex: 1;
  padding: 40px 0;
}
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
}
.footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
  text-align: center;
}
.footer-tagline {
  color: var(--text-secondary);
  font-size: 14px;
}
.footer-sub {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.7;
}
</style>
