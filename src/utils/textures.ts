import * as THREE from 'three'
import type { TarotCard } from '../data/tarot'

export const RUNES = [
  'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ',
  'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ',
  'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ',
]

const CARD_W = 512
const CARD_H = 854

const cache = new Map<string, THREE.CanvasTexture>()

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  return [canvas, ctx]
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

function cached(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  const hit = cache.get(key)
  if (hit) return hit
  const tex = factory()
  cache.set(key, tex)
  return tex
}

/** 星光 sprite：柔和径向光点 */
export function getStarTexture(): THREE.CanvasTexture {
  return cached('star', () => {
    const [canvas, ctx] = makeCanvas(64, 64)
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(230,220,255,0.9)')
    g.addColorStop(0.6, 'rgba(160,140,255,0.28)')
    g.addColorStop(1, 'rgba(120,100,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return toTexture(canvas)
  })
}

/** 通用柔光 */
export function getGlowTexture(color = '#ffd27a'): THREE.CanvasTexture {
  return cached(`glow:${color}`, () => {
    const [canvas, ctx] = makeCanvas(128, 128)
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, color)
    g.addColorStop(0.4, color + '88')
    g.addColorStop(1, color + '00')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return toTexture(canvas)
  })
}

/** 星云纹理：多层径向渐变 blob */
export function getNebulaTexture(key: string, colors: string[]): THREE.CanvasTexture {
  return cached(`nebula:${key}`, () => {
    const [canvas, ctx] = makeCanvas(512, 512)
    ctx.clearRect(0, 0, 512, 512)
    for (let i = 0; i < 7; i++) {
      const x = 256 + (Math.random() - 0.5) * 260
      const y = 256 + (Math.random() - 0.5) * 260
      const r = 90 + Math.random() * 150
      const color = colors[i % colors.length]
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, color)
      g.addColorStop(1, color + '00')
      ctx.globalAlpha = 0.35
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 512, 512)
    }
    ctx.globalAlpha = 1
    return toTexture(canvas)
  })
}

/** 符文字符 sprite */
export function getRuneTexture(char: string, color = '#e9d8a6'): THREE.CanvasTexture {
  return cached(`rune:${char}:${color}`, () => {
    const [canvas, ctx] = makeCanvas(128, 128)
    ctx.font = '86px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = color
    ctx.shadowBlur = 24
    ctx.fillStyle = color
    ctx.fillText(char, 64, 70)
    ctx.shadowBlur = 0
    ctx.fillText(char, 64, 70)
    return toTexture(canvas)
  })
}

/** 牌背：星盘 + 符文边框 */
export function getCardBackTexture(): THREE.CanvasTexture {
  return cached('card-back', () => {
    const [canvas, ctx] = makeCanvas(CARD_W, CARD_H)
    const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
    bg.addColorStop(0, '#150a33')
    bg.addColorStop(0.5, '#0d0620')
    bg.addColorStop(1, '#1c0d3f')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, CARD_W, CARD_H)

    // 金色描边
    ctx.strokeStyle = 'rgba(255, 213, 128, 0.9)'
    ctx.lineWidth = 8
    ctx.strokeRect(18, 18, CARD_W - 36, CARD_H - 36)
    ctx.strokeStyle = 'rgba(255, 213, 128, 0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(34, 34, CARD_W - 68, CARD_H - 68)

    // 边框符文
    ctx.font = '30px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(233, 216, 166, 0.75)'
    const runes = RUNES
    let r = 0
    for (let x = 70; x <= CARD_W - 70; x += 62) {
      ctx.fillText(runes[r++ % runes.length], x, 52)
      ctx.fillText(runes[r++ % runes.length], x, CARD_H - 52)
    }
    for (let y = 120; y <= CARD_H - 120; y += 72) {
      ctx.fillText(runes[r++ % runes.length], 52, y)
      ctx.fillText(runes[r++ % runes.length], CARD_W - 52, y)
    }

    // 中央星盘
    const cx = CARD_W / 2
    const cy = CARD_H / 2
    ctx.strokeStyle = 'rgba(255, 213, 128, 0.85)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cx, cy, 140, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, 104, 0, Math.PI * 2)
    ctx.stroke()
    ctx.lineWidth = 2
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * 104, cy + Math.sin(a) * 104)
      ctx.lineTo(cx + Math.cos(a) * 140, cy + Math.sin(a) * 140)
      ctx.stroke()
    }
    // 内接星形
    ctx.beginPath()
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2
      const radius = i % 2 === 0 ? 96 : 44
      const x = cx + Math.cos(a) * radius
      const y = cy + Math.sin(a) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 中心眼
    const eye = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30)
    eye.addColorStop(0, '#ffe9b8')
    eye.addColorStop(1, 'rgba(255,222,150,0)')
    ctx.fillStyle = eye
    ctx.beginPath()
    ctx.arc(cx, cy, 30, 0, Math.PI * 2)
    ctx.fill()

    // 散布星点
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * CARD_W
      const y = Math.random() * CARD_H
      const s = Math.random() * 1.6 + 0.4
      ctx.globalAlpha = 0.25 + Math.random() * 0.55
      ctx.fillRect(x, y, s, s)
    }
    ctx.globalAlpha = 1
    return toTexture(canvas)
  })
}

/** 牌面：符号 + 名称 + 序号 + 关键词 */
export function getCardFrontTexture(card: TarotCard, orientation: 'upright' | 'reversed'): THREE.CanvasTexture {
  return cached(`card-front:${card.id}:${orientation}`, () => {
    const [canvas, ctx] = makeCanvas(CARD_W, CARD_H)
    const bg = ctx.createRadialGradient(CARD_W / 2, CARD_H / 3, 40, CARD_W / 2, CARD_H / 2, CARD_H * 0.75)
    bg.addColorStop(0, '#221248')
    bg.addColorStop(0.55, '#120a2b')
    bg.addColorStop(1, '#080418')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, CARD_W, CARD_H)

    // 牌面色晕
    const tint = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2, 20, CARD_W / 2, CARD_H / 2, 300)
    tint.addColorStop(0, card.color + '55')
    tint.addColorStop(1, card.color + '00')
    ctx.fillStyle = tint
    ctx.fillRect(0, 0, CARD_W, CARD_H)

    ctx.strokeStyle = 'rgba(255, 213, 128, 0.9)'
    ctx.lineWidth = 7
    ctx.strokeRect(16, 16, CARD_W - 32, CARD_H - 32)
    ctx.strokeStyle = card.color
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, CARD_W - 60, CARD_H - 60)
    ctx.globalAlpha = 1

    // 中央符号
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = card.color
    ctx.shadowBlur = 46
    ctx.font = '190px serif'
    ctx.fillStyle = '#fff7e0'
    ctx.fillText(card.symbol, CARD_W / 2, CARD_H / 2 - 30)
    ctx.shadowBlur = 0
    ctx.font = '190px serif'
    ctx.fillText(card.symbol, CARD_W / 2, CARD_H / 2 - 30)

    // 名称
    ctx.font = 'bold 52px "Noto Serif SC", serif'
    ctx.fillStyle = '#ffe9b8'
    ctx.fillText(card.name, CARD_W / 2, 118)
    ctx.font = '26px serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText(card.nameEn.toUpperCase(), CARD_W / 2, 162)

    // 正逆位徽标
    ctx.font = 'bold 30px "Noto Serif SC", serif'
    ctx.fillStyle = orientation === 'upright' ? '#8affc1' : '#ff9ad5'
    ctx.fillText(orientation === 'upright' ? '正 位' : '逆 位', CARD_W / 2, CARD_H - 200)

    // 关键词
    ctx.font = '26px "Noto Serif SC", serif'
    ctx.fillStyle = 'rgba(255,233,184,0.85)'
    ctx.fillText(card.keywords.slice(0, 3).join(' · '), CARD_W / 2, CARD_H - 148)

    // 序号
    ctx.font = 'bold 44px serif'
    ctx.fillStyle = card.color
    ctx.fillText(card.roman, CARD_W / 2, CARD_H - 80)

    // 星点
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * CARD_W
      const y = Math.random() * CARD_H
      ctx.globalAlpha = 0.15 + Math.random() * 0.4
      ctx.fillRect(x, y, 1.4, 1.4)
    }
    ctx.globalAlpha = 1
    return toTexture(canvas)
  })
}

export function disposeTextureCache(): void {
  for (const tex of cache.values()) tex.dispose()
  cache.clear()
}
