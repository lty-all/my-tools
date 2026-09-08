import type { Locale } from '@/i18n'

export type ToolCategory = 'dev' | 'local-privacy' | 'ai'

export interface ToolMeta {
  slug: string
  name: Record<Locale, string>
  desc: Record<Locale, string>
  icon: string
  category: ToolCategory
  live: boolean
}

export const tools: ToolMeta[] = [
  {
    slug: 'json-formatter',
    name: { zh: 'JSON Formatter', en: 'JSON Formatter' },
    desc: { zh: '格式化、压缩与校验 JSON', en: 'Format, minify & validate JSON' },
    icon: 'json',
    category: 'dev',
    live: true,
  },
  {
    slug: 'jwt-decoder',
    name: { zh: 'JWT Decoder', en: 'JWT Decoder' },
    desc: { zh: '解码 JWT 令牌的头部与载荷', en: 'Decode JWT headers & payloads' },
    icon: 'key',
    category: 'dev',
    live: false,
  },
  {
    slug: 'regex-tester',
    name: { zh: 'Regex Tester', en: 'Regex Tester' },
    desc: { zh: '实时测试正则表达式', en: 'Test regex patterns in real time' },
    icon: 'regex',
    category: 'dev',
    live: false,
  },
  {
    slug: 'timestamp-converter',
    name: { zh: 'Timestamp Converter', en: 'Timestamp Converter' },
    desc: { zh: 'Unix 时间戳与日期互转', en: 'Convert Unix timestamps' },
    icon: 'clock',
    category: 'dev',
    live: false,
  },
  {
    slug: 'diff-checker',
    name: { zh: 'Diff Checker', en: 'Diff Checker' },
    desc: { zh: '逐行对比两段文本', en: 'Compare text line by line' },
    icon: 'diff',
    category: 'dev',
    live: false,
  },
  {
    slug: 'subtitle-resync',
    name: { zh: 'Subtitle Resync', en: 'Subtitle Resync' },
    desc: { zh: '字幕时间轴偏移与 SRT/VTT 互转', en: 'Shift subtitle timing & convert SRT/VTT' },
    icon: 'subtitle',
    category: 'local-privacy',
    live: true,
  },
  {
    slug: 'video-to-gif',
    name: { zh: 'Video to GIF', en: 'Video to GIF' },
    desc: { zh: '视频本地转 GIF（ffmpeg.wasm）', en: 'Convert video to GIF locally' },
    icon: 'gif',
    category: 'local-privacy',
    live: true,
  },
  {
    slug: 'exif-cleaner',
    name: { zh: 'EXIF Cleaner', en: 'EXIF Cleaner' },
    desc: { zh: '查看并去除照片 EXIF/GPS 元数据', en: 'Inspect & strip photo EXIF/GPS' },
    icon: 'camera',
    category: 'local-privacy',
    live: true,
  },
  {
    slug: 'ai-code-explain',
    name: { zh: 'AI Code Explain', en: 'AI Code Explain' },
    desc: { zh: '粘贴代码，AI 帮你读懂', en: 'Paste code, let AI explain it' },
    icon: 'code',
    category: 'ai',
    live: false,
  },
  {
    slug: 'ai-error-fix',
    name: { zh: 'AI Error Fix', en: 'AI Error Fix' },
    desc: { zh: '粘贴报错，AI 给出修复思路', en: 'Paste errors, get AI fixes' },
    icon: 'alert',
    category: 'ai',
    live: false,
  },
  {
    slug: 'ai-commit-generator',
    name: { zh: 'AI Commit Generator', en: 'AI Commit Generator' },
    desc: { zh: '根据变更生成规范 Commit', en: 'Generate conventional commits' },
    icon: 'branch',
    category: 'ai',
    live: false,
  },
]
