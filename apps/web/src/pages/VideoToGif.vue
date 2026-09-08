<script setup lang="ts">
import { ref } from 'vue'
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const file = ref<File | null>(null)
const videoUrl = ref('')
const duration = ref(0)
const start = ref(0)
const clipDuration = ref(5)
const width = ref(480)
const fps = ref(12)
const converting = ref(false)
const engineLoading = ref(false)
const progress = ref(0)
const error = ref('')
const gifUrl = ref('')
const gifSize = ref(0)

let ffmpeg: FFmpeg | null = null
let runCounter = 0

// ffmpeg core 超过 Cloudflare Pages 25MiB 单文件限制，改为运行时从 CDN 加载
const FFMPEG_CORE_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd'

async function toBlobURL(url: string, type: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`)
  return URL.createObjectURL(new Blob([await res.arrayBuffer()], { type }))
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const picked = input.files?.[0]
  if (!picked) return
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  if (gifUrl.value) URL.revokeObjectURL(gifUrl.value)
  gifUrl.value = ''
  gifSize.value = 0
  error.value = ''
  file.value = picked
  videoUrl.value = URL.createObjectURL(picked)
  start.value = 0
}

function onLoadedMetadata(event: Event) {
  const video = event.target as HTMLVideoElement
  duration.value = video.duration || 0
  clipDuration.value = Math.min(5, Math.max(1, Math.floor(duration.value) || 1))
}

async function getFfmpeg(): Promise<FFmpeg> {
  if (!ffmpeg) {
    engineLoading.value = true
    const { FFmpeg: FFmpegCtor } = await import('@ffmpeg/ffmpeg')
    const instance = new FFmpegCtor()
    instance.on('progress', ({ progress: p }) => {
      if (Number.isFinite(p)) {
        progress.value = Math.min(100, Math.max(0, Math.round(p * 100)))
      }
    })
    await instance.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpeg = instance
    engineLoading.value = false
  }
  return ffmpeg
}

async function handleConvert() {
  if (!file.value || converting.value) return
  error.value = ''
  if (gifUrl.value) {
    URL.revokeObjectURL(gifUrl.value)
    gifUrl.value = ''
    gifSize.value = 0
  }
  converting.value = true
  progress.value = 0
  try {
    const ff = await getFfmpeg()
    runCounter += 1
    const ext = (file.value.name.match(/\.[^.]+$/) || ['.mp4'])[0]
    const inputName = `input-${runCounter}${ext}`
    const outputName = `output-${runCounter}.gif`
    await ff.writeFile(inputName, new Uint8Array(await file.value.arrayBuffer()))
    await ff.exec([
      '-ss',
      String(Math.max(0, Math.min(start.value, Math.max(0, duration.value - 0.1)))),
      '-t',
      String(Math.max(0.1, clipDuration.value)),
      '-i',
      inputName,
      '-vf',
      `fps=${fps.value},scale=${width.value}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`,
      '-loop',
      '0',
      outputName,
    ])
    const data = (await ff.readFile(outputName)) as Uint8Array
    const blob = new Blob([data.buffer as ArrayBuffer], { type: 'image/gif' })
    gifUrl.value = URL.createObjectURL(blob)
    gifSize.value = blob.size
    await ff.deleteFile(inputName).catch(() => undefined)
    await ff.deleteFile(outputName).catch(() => undefined)
  } catch (e) {
    error.value = t('video.fail') + (e instanceof Error ? e.message : String(e))
  } finally {
    converting.value = false
    engineLoading.value = false
  }
}

function handleDownload() {
  if (!gifUrl.value || !file.value) return
  const base = file.value.name.replace(/\.[^.]+$/, '')
  const a = document.createElement('a')
  a.href = gifUrl.value
  a.download = `${base}.gif`
  a.click()
}
</script>

<template>
  <div class="video-to-gif">
    <h1>{{ t('video.title') }}</h1>
    <p class="desc">{{ t('video.desc') }}</p>

    <div class="actions">
      <label class="btn">
        {{ t('video.pick') }}
        <input type="file" accept="video/*" hidden @change="handleFile" />
      </label>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="file" class="workspace">
      <div class="pane">
        <label>{{ t('video.source') }}</label>
        <video :src="videoUrl" controls @loadedmetadata="onLoadedMetadata"></video>
        <div class="options">
          <div class="field">
            <span>{{ t('video.start') }}</span>
            <input
              v-model.number="start"
              type="number"
              min="0"
              :max="Math.max(0, duration - 0.1)"
              step="0.1"
            />
          </div>
          <div class="field">
            <span>{{ t('video.duration') }}</span>
            <input v-model.number="clipDuration" type="number" min="0.1" :max="duration" step="0.5" />
          </div>
          <div class="field">
            <span>{{ t('video.width') }}</span>
            <input v-model.number="width" type="number" min="120" max="1280" step="20" />
          </div>
          <div class="field">
            <span>{{ t('video.fps') }}</span>
            <input v-model.number="fps" type="number" min="5" max="24" step="1" />
          </div>
        </div>
        <button class="btn primary" :disabled="converting" @click="handleConvert">
          {{ converting ? t('video.converting') : t('video.convert') }}
        </button>
      </div>

      <div class="pane">
        <label>{{ t('video.output') }}</label>
        <div v-if="gifUrl" class="gif-box">
          <img :src="gifUrl" alt="GIF preview" />
          <div class="gif-meta">{{ formatSize(gifSize) }}</div>
          <button class="btn" @click="handleDownload">{{ t('video.download') }}</button>
        </div>
        <div v-else-if="converting || engineLoading" class="progress-box">
          <p v-if="engineLoading">{{ t('video.engineLoading') }}</p>
          <p v-else>{{ t('video.convertingPct', { n: progress }) }}</p>
          <div class="bar">
            <div class="bar-fill" :style="{ width: `${engineLoading ? 0 : progress}%` }"></div>
          </div>
        </div>
        <div v-else class="placeholder">{{ t('video.placeholder') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-to-gif {
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
  cursor: pointer;
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
.error {
  color: var(--danger);
  margin-bottom: 12px;
  font-size: 14px;
}
.workspace {
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
video {
  width: 100%;
  max-height: 260px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #000;
}
.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 12px 0;
}
.field {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}
.field input {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.field input:focus {
  border-color: var(--accent);
}
.gif-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.gif-box img {
  max-width: 100%;
  max-height: 260px;
  border: 1px solid var(--border);
  border-radius: 8px;
}
.gif-meta {
  font-size: 13px;
  color: var(--text-secondary);
}
.progress-box {
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.progress-box p {
  font-size: 14px;
  color: var(--text-secondary);
}
.bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-secondary, #eee);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.2s;
}
.placeholder {
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 32px 20px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
