export interface ExifField {
  label: string
  value: string
}

export interface ExifAnalysis {
  isJpeg: boolean
  fields: ExifField[]
  removable: string[]
}

const SOS = 0xda
const EOI = 0xd9
const APP1 = 0xe1
const APP13 = 0xed
const COM = 0xfe

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

const TAG_LABELS: Record<number, string> = {
  0x010f: 'make',
  0x0110: 'model',
  0x0131: 'software',
  0x0132: 'modified',
  0x013b: 'artist',
  0x8298: 'copyright',
  0x9003: 'taken',
  0x9004: 'digitized',
}

function segmentPrefix(view: DataView, pos: number, max = 32): string {
  let s = ''
  const start = pos + 4
  const end = Math.min(start + max, view.byteLength)
  for (let i = start; i < end; i++) {
    const b = view.getUint8(i)
    if (b === 0) break
    s += String.fromCharCode(b)
  }
  return s
}

function rationalToDeg(parts: number[]): number {
  const [d = 0, m = 0, s = 0] = parts
  return d + m / 60 + s / 3600
}

function readValue(
  view: DataView,
  tiffStart: number,
  entry: number,
  type: number,
  count: number,
  little: boolean,
): unknown {
  const size = TYPE_SIZE[type]
  if (!size) return null
  const total = size * count
  let pos: number
  if (total <= 4) {
    pos = entry + 8
  } else {
    pos = tiffStart + view.getUint32(entry + 8, little)
  }
  if (pos < 0 || pos + total > view.byteLength) return null
  if (type === 2) {
    let s = ''
    for (let i = 0; i < count; i++) {
      const c = view.getUint8(pos + i)
      if (c === 0) break
      s += String.fromCharCode(c)
    }
    return s
  }
  if (type === 5) {
    const values: number[] = []
    for (let i = 0; i < count; i++) {
      const n = view.getUint32(pos + i * 8, little)
      const d = view.getUint32(pos + i * 8 + 4, little)
      values.push(d === 0 ? 0 : n / d)
    }
    return values
  }
  if (type === 3) {
    const values: number[] = []
    for (let i = 0; i < count; i++) values.push(view.getUint16(pos + i * 2, little))
    return count === 1 ? values[0] : values
  }
  if (type === 4) {
    const values: number[] = []
    for (let i = 0; i < count; i++) values.push(view.getUint32(pos + i * 4, little))
    return count === 1 ? values[0] : values
  }
  return null
}

function parseTiff(view: DataView, tiffStart: number): ExifField[] {
  const fields: ExifField[] = []
  const bom = view.getUint16(tiffStart)
  let little: boolean
  if (bom === 0x4949) little = true
  else if (bom === 0x4d4d) little = false
  else return fields
  if (view.getUint16(tiffStart + 2, little) !== 0x2a) return fields

  const gps: { lat: number | null; lon: number | null; latRef: string; lonRef: string } = {
    lat: null,
    lon: null,
    latRef: '',
    lonRef: '',
  }

  const readIfd = (ifdOffset: number, isGps: boolean, depth: number) => {
    if (depth > 3 || ifdOffset < 0 || ifdOffset + 2 > view.byteLength) return
    const count = view.getUint16(ifdOffset, little)
    for (let i = 0; i < count; i++) {
      const entry = ifdOffset + 2 + i * 12
      if (entry + 12 > view.byteLength) return
      const tag = view.getUint16(entry, little)
      const type = view.getUint16(entry + 2, little)
      const num = view.getUint32(entry + 4, little)
      if (!isGps && depth < 2) {
        if (tag === 0x8769) {
          readIfd(tiffStart + view.getUint32(entry + 8, little), false, depth + 1)
          continue
        }
        if (tag === 0x8825) {
          readIfd(tiffStart + view.getUint32(entry + 8, little), true, depth + 1)
          continue
        }
      }
      const value = readValue(view, tiffStart, entry, type, num, little)
      if (value === null) continue
      if (isGps) {
        if (tag === 0x0001) gps.latRef = String(value).trim()
        else if (tag === 0x0003) gps.lonRef = String(value).trim()
        else if (tag === 0x0002 && Array.isArray(value) && value.length === 3) {
          gps.lat = rationalToDeg(value as number[])
        } else if (tag === 0x0004 && Array.isArray(value) && value.length === 3) {
          gps.lon = rationalToDeg(value as number[])
        }
      } else if (typeof value === 'string') {
        const label = TAG_LABELS[tag]
        if (label && value.trim()) fields.push({ label, value: value.trim() })
      }
    }
  }

  readIfd(tiffStart + view.getUint32(tiffStart + 4, little), false, 0)

  if (gps.lat !== null && gps.lon !== null) {
    const lat = gps.latRef === 'S' ? -gps.lat : gps.lat
    const lon = gps.lonRef === 'W' ? -gps.lon : gps.lon
    fields.push({ label: 'gps', value: `${lat.toFixed(6)}, ${lon.toFixed(6)}` })
  }
  return fields
}

export function analyzeJpeg(buffer: ArrayBuffer): ExifAnalysis {
  const view = new DataView(buffer)
  const result: ExifAnalysis = { isJpeg: false, fields: [], removable: [] }
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return result
  result.isJpeg = true
  const seen = new Set<string>()
  let pos = 2
  while (pos + 4 <= view.byteLength) {
    if (view.getUint8(pos) !== 0xff) {
      pos++
      continue
    }
    const marker = view.getUint8(pos + 1)
    if (marker === 0xff) {
      pos++
      continue
    }
    if (marker === SOS || marker === EOI) break
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      pos += 2
      continue
    }
    const length = view.getUint16(pos + 2)
    const end = pos + 2 + length
    if (end > view.byteLength) break
    if (marker === APP1) {
      const prefix = segmentPrefix(view, pos)
      if (prefix === 'Exif') {
        seen.add('EXIF')
        if (pos + 10 <= view.byteLength) {
          result.fields.push(...parseTiff(view, pos + 10))
        }
      } else if (prefix.startsWith('http://ns.adobe.com/xap/1.0/')) {
        seen.add('XMP')
      }
    } else if (marker === APP13) {
      seen.add('IPTC')
    } else if (marker === COM) {
      seen.add('comment')
    }
    pos = end
  }
  result.removable = [...seen]
  return result
}

export function stripJpegMetadata(buffer: ArrayBuffer): ArrayBuffer | null {
  const view = new DataView(buffer)
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null
  const bytes = new Uint8Array(buffer)
  const parts: Uint8Array[] = [bytes.subarray(0, 2)]
  let pos = 2
  while (pos + 4 <= view.byteLength) {
    if (view.getUint8(pos) !== 0xff) {
      pos++
      continue
    }
    const marker = view.getUint8(pos + 1)
    if (marker === 0xff) {
      pos++
      continue
    }
    if (marker === SOS) {
      parts.push(bytes.subarray(pos))
      pos = view.byteLength
      break
    }
    if (marker === EOI) {
      parts.push(bytes.subarray(pos, pos + 2))
      pos += 2
      continue
    }
    if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(bytes.subarray(pos, pos + 2))
      pos += 2
      continue
    }
    const length = view.getUint16(pos + 2)
    const end = pos + 2 + length
    if (end > view.byteLength) return null
    const prefix = marker === APP1 ? segmentPrefix(view, pos) : ''
    const shouldStrip =
      marker === COM ||
      marker === APP13 ||
      (marker === APP1 && (prefix === 'Exif' || prefix.startsWith('http://ns.adobe.com/xap/1.0/')))
    if (!shouldStrip) {
      parts.push(bytes.subarray(pos, end))
    }
    pos = end
  }
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    result.set(part, offset)
    offset += part.length
  }
  return result.buffer
}
