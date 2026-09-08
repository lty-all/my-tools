export interface Cue {
  start: number
  end: number
  text: string
}

export type SubtitleFormat = 'srt' | 'vtt'

export interface ParseResult {
  format: SubtitleFormat
  cues: Cue[]
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0')
}

function msToParts(ms: number) {
  const clamped = Math.max(0, Math.round(ms))
  return {
    h: Math.floor(clamped / 3600000),
    m: Math.floor((clamped % 3600000) / 60000),
    s: Math.floor((clamped % 60000) / 1000),
    milli: clamped % 1000,
  }
}

export function formatSrtTime(ms: number) {
  const { h, m, s, milli } = msToParts(ms)
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(milli, 3)}`
}

export function formatVttTime(ms: number) {
  const { h, m, s, milli } = msToParts(ms)
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(milli, 3)}`
}

function parseTimestamp(raw: string): number | null {
  const str = raw.trim()
  let match = str.match(/^(\d{1,2}):(\d{2}):(\d{2})[.,](\d{1,3})$/)
  if (match) {
    return (
      Number(match[1]) * 3600000 +
      Number(match[2]) * 60000 +
      Number(match[3]) * 1000 +
      Number(match[4].padEnd(3, '0'))
    )
  }
  match = str.match(/^(\d{1,2}):(\d{2})[.,](\d{1,3})$/)
  if (match) {
    return Number(match[1]) * 60000 + Number(match[2]) * 1000 + Number(match[3].padEnd(3, '0'))
  }
  return null
}

export function parseSubtitle(content: string): ParseResult {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim()
  const isVtt = /^WEBVTT/i.test(normalized)
  const cues: Cue[] = []
  const blocks = normalized.split(/\n{2,}/)
  for (const block of blocks) {
    const lines = block.split('\n').filter((line) => line.trim() !== '')
    const timeLineIdx = lines.findIndex((line) => line.includes('-->'))
    if (timeLineIdx === -1) continue
    const [rawStart, rawEnd = ''] = lines[timeLineIdx].split('-->')
    const start = parseTimestamp(rawStart)
    const end = parseTimestamp(rawEnd.trim().split(/\s+/)[0])
    if (start === null || end === null) continue
    cues.push({
      start,
      end,
      text: lines.slice(timeLineIdx + 1).join('\n'),
    })
  }
  return { format: isVtt ? 'vtt' : 'srt', cues }
}

export function shiftCues(cues: Cue[], offsetMs: number): Cue[] {
  return cues.map((cue) => ({
    start: Math.max(0, cue.start + offsetMs),
    end: Math.max(0, cue.end + offsetMs),
    text: cue.text,
  }))
}

export function toSrt(cues: Cue[]): string {
  return (
    cues
      .map(
        (cue, i) =>
          `${i + 1}\n${formatSrtTime(cue.start)} --> ${formatSrtTime(cue.end)}\n${cue.text}`,
      )
      .join('\n\n') + '\n'
  )
}

export function toVtt(cues: Cue[]): string {
  return (
    'WEBVTT\n\n' +
    cues
      .map((cue) => `${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}\n${cue.text}`)
      .join('\n\n') +
    '\n'
  )
}
