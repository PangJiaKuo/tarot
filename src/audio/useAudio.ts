import { useEffect } from 'react'
import { useTarotStore } from '../store/useTarotStore'

/**
 * Web Audio 合成音效引擎（无外部音频文件）。
 * - 环境音：双低频振荡器 + 低通滤波 + 缓慢 LFO
 * - 洗牌：白噪声短促包络
 * - 翻牌：正弦 + 三角波钟声
 * - 抽牌：上升滑音
 */
class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null = null
  private noiseBuffer: AudioBuffer | null = null
  enabled = true

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.9
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  setEnabled(on: boolean): void {
    this.enabled = on
    if (!on) this.stopAmbient()
  }

  private noise(): AudioBuffer {
    const ctx = this.ensure()
    if (!ctx) throw new Error('no ctx')
    if (!this.noiseBuffer) {
      const len = ctx.sampleRate * 1.2
      this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = this.noiseBuffer.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    }
    return this.noiseBuffer
  }

  startAmbient(): void {
    const ctx = this.ensure()
    if (!ctx || !this.enabled || this.ambientNodes) return
    const gain = ctx.createGain()
    gain.gain.value = 0
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 240
    filter.Q.value = 0.6

    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 82.5

    // 缓慢呼吸 LFO
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.018
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.master!)

    osc1.start()
    osc2.start()
    lfo.start()
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5)
    this.ambientNodes = { osc1, osc2, gain, lfo }
  }

  stopAmbient(): void {
    const nodes = this.ambientNodes
    const ctx = this.ctx
    if (!nodes || !ctx) return
    nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    const { osc1, osc2, gain, lfo } = nodes
    window.setTimeout(() => {
      try {
        osc1.stop()
        osc2.stop()
        lfo.stop()
        gain.disconnect()
      } catch {
        /* ignore */
      }
    }, 600)
    this.ambientNodes = null
  }

  playShuffle(): void {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const src = ctx.createBufferSource()
    src.buffer = this.noise()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(900, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.9)
    filter.Q.value = 1.1
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    // 洗牌 = 连续短促沙沙包络
    let t = ctx.currentTime
    for (let i = 0; i < 10; i++) {
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.045)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
      t += 0.1
    }
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.master!)
    src.start()
    src.stop(ctx.currentTime + 1.1)
  }

  playFlip(): void {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const t0 = ctx.currentTime
    const mk = (type: OscillatorType, freq: number, vol: number) => {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t0)
      const g = ctx.createGain()
      g.gain.setValueAtTime(vol, t0)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.3)
      osc.connect(g)
      g.connect(this.master!)
      osc.start(t0)
      osc.stop(t0 + 1.35)
    }
    mk('sine', 880, 0.14)
    mk('triangle', 1318.5, 0.07)
    mk('sine', 1760, 0.04)
  }

  playDraw(): void {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, t0)
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.55)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.1)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6)
    osc.connect(g)
    g.connect(this.master!)
    osc.start(t0)
    osc.stop(t0 + 0.65)
  }

  playReveal(): void {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const t0 = ctx.currentTime
    const freqs = [523.25, 659.25, 783.99, 1046.5]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      const start = t0 + i * 0.12
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.07, start + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9)
      osc.connect(g)
      g.connect(this.master!)
      osc.start(start)
      osc.stop(start + 1)
    })
  }
}

const engine = new AudioEngine()

export function getAudioEngine(): AudioEngine {
  return engine
}

export function useAudioSync(): void {
  const sound = useTarotStore((s) => s.settings.sound)
  useEffect(() => {
    engine.setEnabled(sound)
    if (sound) engine.startAmbient()
    else engine.stopAmbient()
  }, [sound])
}
