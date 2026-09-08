<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

function handleFormat() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) {
    error.value = t('json.empty')
    return
  }
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch {
    error.value = t('json.invalid')
  }
}

function handleMinify() {
  error.value = ''
  if (!input.value.trim()) return
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch {
    error.value = t('json.invalid')
  }
}

async function handleCopy() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="json-formatter">
    <h1>{{ t('json.title') }}</h1>
    <p class="desc">{{ t('json.desc') }}</p>

    <div class="actions">
      <button class="btn primary" @click="handleFormat">{{ t('json.format') }}</button>
      <button class="btn" @click="handleMinify">{{ t('json.minify') }}</button>
      <button class="btn" :disabled="!output" @click="handleCopy">
        {{ copied ? t('common.copied') : t('common.copy') }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div class="panes">
      <div class="pane">
        <label>{{ t('json.input') }}</label>
        <textarea
          v-model="input"
          placeholder='{"name":"devpilot","version":"1.0"}'
          spellcheck="false"
        ></textarea>
      </div>
      <div class="pane">
        <label>{{ t('json.output') }}</label>
        <textarea v-model="output" readonly spellcheck="false"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-formatter {
  max-width: 900px;
  margin: 0 auto;
}
h1 {
  font-size: 28px;
  margin-bottom: 8px;
}
.desc {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.btn {
  padding: 8px 20px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  font-size: 14px;
  transition: all 0.2s;
}
.btn:hover:not(:disabled) {
  border-color: var(--accent);
}
.btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn.primary:hover {
  background: var(--accent-hover);
}
.btn:disabled {
  opacity: 0.5;
}
.error {
  color: var(--danger);
  margin-bottom: 12px;
  font-size: 14px;
}
.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.pane {
  display: flex;
  flex-direction: column;
}
.pane label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
textarea {
  height: 400px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
textarea:focus {
  border-color: var(--accent);
}
@media (max-width: 768px) {
  .panes {
    grid-template-columns: 1fr;
  }
}
</style>
