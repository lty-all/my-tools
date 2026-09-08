<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/i18n'
import {
  parseSubtitle,
  shiftCues,
  toSrt,
  toVtt,
  type SubtitleFormat,
} from '@/utils/subtitle'

const { t } = useI18n()
const content = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)
const offsetSec = ref(0)
const offsetMs = ref(0)
const targetFormat = ref<'auto' | SubtitleFormat>('auto')
const sourceFormat = ref<SubtitleFormat | null>(null)
const cueCount = ref(0)
const fileName = ref('')

const totalOffsetMs = computed(() => offsetSec.value * 1000 + offsetMs.value)

function nudge(ms: number) {
  const total = totalOffsetMs.value + ms
  offsetSec.value = Math.trunc(total / 1000)
  offsetMs.value = total % 1000
}

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fileName.value = file.name
  file
    .text()
    .then((text) => {
      content.value = text
      error.value = ''
    })
    .catch(() => {
      error.value = t('subtitle.errEmpty')
    })
}

function handleProcess() {
  error.value = ''
  output.value = ''
  sourceFormat.value = null
  cueCount.value = 0
  if (!content.value.trim()) {
    error.value = t('subtitle.errEmpty')
    return
  }
  const parsed = parseSubtitle(content.value)
  if (parsed.cues.length === 0) {
    error.value = t('subtitle.errParse')
    return
  }
  const shifted = shiftCues(parsed.cues, totalOffsetMs.value)
  const format = targetFormat.value === 'auto' ? parsed.format : targetFormat.value
  output.value = format === 'srt' ? toSrt(shifted) : toVtt(shifted)
  sourceFormat.value = parsed.format
  cueCount.value = parsed.cues.length
}

async function handleCopy() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function handleDownload() {
  if (!output.value) return
  const format = targetFormat.value === 'auto' ? sourceFormat.value : targetFormat.value
  const base = fileName.value ? fileName.value.replace(/\.[^.]+$/, '') : 'subtitle'
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}-resync.${format ?? 'srt'}`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="subtitle-resync">
    <h1>{{ t('subtitle.title') }}</h1>
    <p class="desc">{{ t('subtitle.desc') }}</p>

    <div class="actions">
      <label class="btn">
        {{ t('subtitle.import') }}
        <input type="file" accept=".srt,.vtt,.txt" hidden @change="handleFile" />
      </label>
      <div class="offset-group">
        <button class="btn sm" @click="nudge(-1000)">-1s</button>
        <button class="btn sm" @click="nudge(-500)">-0.5s</button>
        <button class="btn sm" @click="nudge(500)">+0.5s</button>
        <button class="btn sm" @click="nudge(1000)">+1s</button>
      </div>
      <div class="field">
        <span>{{ t('subtitle.offset') }}</span>
        <input v-model.number="offsetSec" type="number" step="0.1" />
        <span>{{ t('subtitle.sec') }}</span>
        <input v-model.number="offsetMs" type="number" step="100" />
        <span>{{ t('subtitle.ms') }}</span>
      </div>
      <select v-model="targetFormat" class="btn">
        <option value="auto">{{ t('subtitle.keep') }}</option>
        <option value="srt">{{ t('subtitle.toSrt') }}</option>
        <option value="vtt">{{ t('subtitle.toVtt') }}</option>
      </select>
      <button class="btn primary" @click="handleProcess">{{ t('subtitle.process') }}</button>
      <button class="btn" :disabled="!output" @click="handleCopy">
        {{ copied ? t('common.copied') : t('common.copy') }}
      </button>
      <button class="btn" :disabled="!output" @click="handleDownload">
        {{ t('common.download') }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="cueCount" class="status">
      {{
        t('subtitle.status', {
          fmt: sourceFormat === 'vtt' ? 'VTT' : 'SRT',
          n: cueCount,
          ms: totalOffsetMs > 0 ? `+${totalOffsetMs}` : totalOffsetMs,
        })
      }}
    </div>

    <div class="panes">
      <div class="pane">
        <label>{{ t('subtitle.inputLabel') }}</label>
        <textarea
          v-model="content"
          placeholder="1&#10;00:00:01,000 --> 00:00:04,000&#10;Hello, world!"
          spellcheck="false"
        ></textarea>
      </div>
      <div class="pane">
        <label>{{ t('subtitle.outputLabel') }}</label>
        <textarea v-model="output" readonly spellcheck="false"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtitle-resync {
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
  flex-wrap: wrap;
  align-items: center;
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
  cursor: pointer;
}
.btn.sm {
  padding: 6px 12px;
  font-size: 13px;
}
.btn:hover:not(:disabled) {
  border-color: var(--accent);
}
.btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn.primary:hover:not(:disabled) {
  background: var(--accent-hover);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.offset-group {
  display: flex;
  gap: 6px;
}
.field {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}
.field input {
  width: 72px;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.field input:focus {
  border-color: var(--accent);
}
.error {
  color: var(--danger);
  margin-bottom: 12px;
  font-size: 14px;
}
.status {
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-size: 13px;
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
