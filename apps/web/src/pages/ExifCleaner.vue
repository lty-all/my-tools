<script setup lang="ts">
import { ref } from 'vue'
import { analyzeJpeg, stripJpegMetadata, type ExifField } from '@/utils/exif'
import { useI18n } from '@/i18n'

const { t } = useI18n()

interface Report {
  fileName: string
  originalSize: number
  fields: ExifField[]
  removable: string[]
  previewUrl: string
}

const report = ref<Report | null>(null)
const error = ref('')
const cleanedUrl = ref('')
const cleanedSize = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
let currentBuffer: ArrayBuffer | null = null

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function segmentName(id: string) {
  return id === 'comment' ? t('exif.seg.comment') : id
}

function fieldLabel(id: string) {
  return t(`exif.field.${id}`)
}

function reset() {
  if (report.value) URL.revokeObjectURL(report.value.previewUrl)
  if (cleanedUrl.value) URL.revokeObjectURL(cleanedUrl.value)
  report.value = null
  cleanedUrl.value = ''
  cleanedSize.value = 0
  error.value = ''
  currentBuffer = null
}

async function handleFile(file: File | undefined | null) {
  if (!file) return
  reset()
  currentBuffer = await file.arrayBuffer()
  const analysis = analyzeJpeg(currentBuffer)
  if (!analysis.isJpeg) {
    error.value = t('exif.notJpeg')
    currentBuffer = null
    return
  }
  report.value = {
    fileName: file.name,
    originalSize: file.size,
    fields: analysis.fields,
    removable: analysis.removable,
    previewUrl: URL.createObjectURL(file),
  }
}

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  handleFile(input.files?.[0])
  input.value = ''
}

function onDrop(event: DragEvent) {
  handleFile(event.dataTransfer?.files?.[0])
}

function handleClean() {
  if (!currentBuffer || !report.value) return
  error.value = ''
  const cleaned = stripJpegMetadata(currentBuffer)
  if (!cleaned) {
    error.value = t('exif.parseFail')
    return
  }
  const blob = new Blob([cleaned], { type: 'image/jpeg' })
  if (cleanedUrl.value) URL.revokeObjectURL(cleanedUrl.value)
  cleanedUrl.value = URL.createObjectURL(blob)
  cleanedSize.value = blob.size
}

function handleDownload() {
  if (!cleanedUrl.value || !report.value) return
  const base = report.value.fileName.replace(/\.[^.]+$/, '')
  const a = document.createElement('a')
  a.href = cleanedUrl.value
  a.download = `${base}-cleaned.jpg`
  a.click()
}
</script>

<template>
  <div class="exif-cleaner">
    <h1>{{ t('exif.title') }}</h1>
    <p class="desc">{{ t('exif.desc') }}</p>

    <div class="dropzone" @click="fileInput?.click()" @dragover.prevent @drop.prevent="onDrop">
      <p>{{ t('exif.drop') }}</p>
      <span>{{ t('exif.dropHint') }}</span>
      <input ref="fileInput" type="file" accept="image/jpeg" hidden @change="onPick" />
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="report" class="result">
      <div class="summary">
        <span>{{ report.fileName }}</span>
        <span>{{ formatSize(report.originalSize) }}</span>
        <span v-if="report.removable.length" class="warn">
          {{ t('exif.detected', { segs: report.removable.map(segmentName).join(' / ') }) }}
        </span>
        <span v-else class="ok-text">{{ t('exif.noMeta') }}</span>
      </div>

      <div class="body">
        <div class="panel">
          <h3>{{ t('exif.fieldsTitle') }}</h3>
          <table v-if="report.fields.length">
            <tr v-for="field in report.fields" :key="field.label">
              <th>{{ fieldLabel(field.label) }}</th>
              <td>{{ field.value }}</td>
            </tr>
          </table>
          <p v-else class="empty">{{ t('exif.emptyFields') }}</p>
          <p class="hint">{{ t('exif.hint') }}</p>
        </div>
        <div class="panel">
          <h3>{{ t('exif.preview') }}</h3>
          <img :src="report.previewUrl" class="preview" alt="photo preview" />
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" @click="handleClean">{{ t('exif.clean') }}</button>
        <button v-if="cleanedUrl" class="btn" @click="handleDownload">
          {{
            t('exif.downloadCleaned', {
              size: formatSize(cleanedSize),
              saved: formatSize(Math.max(0, report.originalSize - cleanedSize)),
            })
          }}
        </button>
      </div>
      <div v-if="cleanedUrl" class="ok">{{ t('exif.cleaned') }}</div>
    </div>
  </div>
</template>

<style scoped>
.exif-cleaner {
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
.dropzone {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.dropzone:hover {
  border-color: var(--accent);
}
.dropzone p {
  font-size: 15px;
  margin-bottom: 6px;
}
.dropzone span {
  font-size: 13px;
  color: var(--text-secondary);
}
.error {
  color: var(--danger);
  margin: 16px 0;
  font-size: 14px;
}
.result {
  margin-top: 24px;
}
.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
  color: var(--text-secondary);
}
.warn {
  color: var(--danger);
}
.ok {
  color: #2e9e5b;
  font-size: 14px;
  margin-top: 12px;
}
.body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}
.panel h3 {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th {
  text-align: left;
  width: 90px;
  padding: 6px 8px 6px 0;
  color: var(--text-secondary);
  font-weight: 400;
  white-space: nowrap;
  vertical-align: top;
}
td {
  padding: 6px 0;
  word-break: break-all;
}
.empty {
  font-size: 13px;
  color: var(--text-secondary);
}
.hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
}
.preview {
  max-width: 100%;
  max-height: 320px;
  border-radius: 6px;
  display: block;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
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
.btn:hover {
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
@media (max-width: 768px) {
  .body {
    grid-template-columns: 1fr;
  }
}
</style>
