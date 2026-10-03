import { useEffect, useState } from 'react'

export function LoadingScreen({ onEnter }: { onEnter: () => void }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="overlay overlay-center">
      <div className="panel loading-panel">
        <div className="loading-glyph">✦</div>
        <h1 className="mystic-title">Mystic Tarot</h1>
        <p className="mystic-subtitle">神 秘 塔 罗</p>
        <p className="loading-hint">星星正在就位……</p>
        <button
          className="btn btn-primary"
          disabled={!ready}
          onClick={onEnter}
        >
          进入圣殿
        </button>
        <p className="disclaimer">仅供娱乐与自我探索 · 不构成任何医疗 / 投资 / 法律建议</p>
      </div>
    </div>
  )
}
