import { useTarotStore } from '../../store/useTarotStore'

const PHASE_LABELS: Record<string, string> = {
  loading: '苏醒中',
  start: '圣殿',
  select: '选择牌阵',
  question: '默想问题',
  shuffle: '洗牌中',
  draw: '准备抽牌',
  reveal: '揭示牌面',
  reading: '解读',
  history: '历史',
  settings: '设置',
}

export function HUD() {
  const phase = useTarotStore((s) => s.phase)
  const spread = useTarotStore((s) => s.spread)
  const question = useTarotStore((s) => s.question)
  const drawn = useTarotStore((s) => s.drawn)
  const revealedCount = drawn.filter((d) => d.revealed).length
  const drawCards = useTarotStore((s) => s.drawCards)
  const reset = useTarotStore((s) => s.reset)
  const setPhase = useTarotStore((s) => s.setPhase)

  if (phase === 'loading' || phase === 'start' || phase === 'select' || phase === 'question') {
    return null
  }

  return (
    <>
      <header className="hud-top">
        <span className="hud-phase">{PHASE_LABELS[phase] ?? phase}</span>
        {spread && <span className="hud-spread">{spread.name}</span>}
        {question && <span className="hud-question">「{question}」</span>}
      </header>

      <footer className="hud-bottom">
        {phase === 'shuffle' && <span className="hud-hint">星辰正在洗牌……</span>}
        {phase === 'draw' && (
          <button className="btn btn-primary btn-glow" onClick={drawCards}>
            ✦ 抽牌
          </button>
        )}
        {phase === 'reveal' && (
          <span className="hud-hint">
            点击卡牌翻转（{revealedCount}/{drawn.length}）
          </span>
        )}
        {phase === 'reading' && <span className="hud-hint">解读已就绪</span>}
        <div className="hud-actions">
          {phase === 'reveal' && drawn.length > 0 && revealedCount < drawn.length && (
            <button className="btn btn-ghost btn-small" onClick={() => drawn.forEach((_, i) => setTimeout(() => useTarotStore.getState().revealCard(i), i * 350))}>
              全部翻开
            </button>
          )}
          <button className="btn btn-ghost btn-small" onClick={() => setPhase('history')}>
            历史
          </button>
          <button className="btn btn-ghost btn-small" onClick={() => setPhase('settings')}>
            设置
          </button>
          <button className="btn btn-ghost btn-small" onClick={reset}>
            重置
          </button>
        </div>
      </footer>
    </>
  )
}
