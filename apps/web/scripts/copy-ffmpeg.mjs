import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', 'node_modules', '@ffmpeg', 'core', 'dist', 'umd')
const target = join(here, '..', 'public', 'ffmpeg')

mkdirSync(target, { recursive: true })
copyFileSync(join(src, 'ffmpeg-core.js'), join(target, 'ffmpeg-core.js'))
copyFileSync(join(src, 'ffmpeg-core.wasm'), join(target, 'ffmpeg-core.wasm'))
console.log('ffmpeg core files copied to public/ffmpeg')
