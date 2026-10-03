import { useEffect, useRef, useState } from 'react'
import { useTarotStore } from '../../store/useTarotStore'
import { isAIConfigured } from '../../utils/ai'
import { getAudioEngine } from '../../audio/useAudio'

/** 逐字显示 hook */
function useTypewriter(text: string, enabled: boolean, speed = 18): string {
  const [shown, setShown] = useState(enabled ? '' : text)
  const idx = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setShown(text)
      return
    }
    idx.current = 0
    setShown('')
    const timer = window.setInterval(() => {
      idx.current += 1
      setShown(text.slice(0, idx.current))
      if (idx.current >= text.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, enabled, speed])

  return shown
}

function TypedText({ text, reduceMotion }: { text: string; reduceMotion: boolean }) {
  const shown = useTypewriter(text, !reduceMotion)
  return <p className="reading-text">{shown}</p>
}

export function ReadingPanel() {
  const reading = useTarotStore((s) => s.reading)
  const drawn = useTarotStore((s) => s.drawn)
  const spread = useTarotStore((s) => s.spread)
  const question = useTarotStore((s) => s.question)
  const aiPending = useTarotStore((s) => s.aiPending)
  const requestReading = useTarotStore((s) => s.requestReading)
  const reset = useTarotStore((s) => s.reset)
  const settings = useTarotStore((s) => s.settings)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAudioEngine().playReveal()
  }, [])

  if (!reading || !spread) return null

  const aiReady = isAIConfigured()

  return (
    <div className="overlay overlay-bottom reading-overlay">
      <div className="panel reading-panel">
        <div className="reading-head">
          <h2 className="panel-title">{spread.name} · 解读</h2>
          {question && <p className="reading-question">「{question}」</p>}
        </div>
        <div className="reading-scroll" ref={scrollRef}>
          {reading.perCard.map((c, i) => {
            const d = drawn[i]
            return (
              <div key={i} className="reading-card-block">
                <div className="reading-card-head">
                  <span className="reading-position">{c.position}</span>
                  <span className="reading-cardname">{d?.card.name ?? c.cardName}</span>
                  <span className={`reading-orientation ${c.orientation}`}>
                    {c.orientation === 'upright' ? '正位' : '逆位'}
                  </span>
                </div>
                {c.keywords.length > 0 && (
                  <div className="keyword-chips">
                    {c.keywords.map((k, j) => (
                      <span key={j} className="chip">{k}</span>
                    ))}
                  </div>
                )}
                <TypedText text={c.text} reduceMotion={settings.reduceMotion} />
              </div>
            )
          })}
          <div className="reading-card-block summary-block">
            <h3>✧ 综合</h3>
            <TypedText text={reading.summary} reduceMotion={settings.reduceMotion} />
          </div>
          {reading.action && (
            <div className="reading-card-block">
              <h3>🜂 行动提示</h3>
              <TypedText text={reading.action} reduceMotion={settings.reduceMotion} />
            </div>
          )}
          {reading.reflection && (
            <div className="reading-card-block">
              <h3>☾ 反思问题</h3>
              <TypedText text={reading.reflection} reduceMotion={settings.reduceMotion} />
            </div>
          )}
          <p className="disclaimer">
            {reading.aiGenerated ? 'AI 深度解读 · ' : ''}仅供娱乐与自我探索
          </p>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-ghost"
            disabled={aiPending}
            onClick={() => void requestReading(true)}
          >
            {aiPending ? '星辰汇聚中…' : aiReady ? '✨ AI 深度解读' : '✨ AI 解读（未配置，本地解读）'}
          </button>
          <button className="btn btn-primary" onClick={reset}>
            再占一次
          </button>
        </div>
      </div>
    </div>
  )
}
