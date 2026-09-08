import { computed, reactive } from 'vue'
import zh from './zh'
import en from './en'

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'dp-locale'

const dictionaries: Record<Locale, Record<string, string>> = { zh, en }

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const state = reactive<{ locale: Locale }>({ locale: detectLocale() })

document.documentElement.lang = state.locale

export function setLocale(locale: Locale) {
  state.locale = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

export function useI18n() {
  function t(key: string, params?: Record<string, string | number>): string {
    let text = dictionaries[state.locale][key] ?? dictionaries.zh[key] ?? key
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{${name}}`, String(value))
      }
    }
    return text
  }
  return { locale: computed(() => state.locale), t, setLocale }
}
