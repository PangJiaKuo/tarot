import { useTarotStore } from '../../store/useTarotStore'

function formatTime(t: number): string {
  const d = new Date(t)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function HistoryPanel() {
  const history = useTarotStore((s) => s.history)
  const deleteHistory = useTarotStore((s) => s.deleteHistory)
  const clearHistory = useTarotStore((s) => s.clearHistory)
  const back = useTarotStore((s) => s.setPhase)
  const prevPhase = useTarotStore((s) => s.prevPhase)

  const onBack = () => back(prevPhase === 'history' || prevPhase === 'settings' ? 'start' : prevPhase)

  return (
    <div className="overlay overlay-center">
      <div className="panel history-panel">
        <div className="history-head">
          <h2 className="panel-title">占卜历史</h2>
          {history.length > 0 && (
            <button className="btn btn-ghost btn-small" onClick={clearHistory}>
              清空
            </button>
          )}
        </div>
        <div className="history-scroll">
          {history.length === 0 && <p className="history-empty">还没有占卜记录，命运的页面正等着被书写。</p>}
          {history.map((h) => (
            <div key={h.id} className="history-item">
              <div className="history-meta">
                <span className="history-time">{formatTime(h.time)}</span>
                <span className="history-spread">{h.spreadName}</span>
              </div>
              {h.question && <div className="history-question">「{h.question}」</div>}
              <div className="history-cards">
                {h.cards.map((c, i) => (
                  <span key={i} className="history-card">
                    {c.positionLabel} · {c.name}
                    <em className={c.orientation}>{c.orientation === 'upright' ? '正' : '逆'}</em>
                  </span>
                ))}
              </div>
              <p className="history-summary">{h.summary}</p>
              <button className="btn btn-ghost btn-small history-delete" onClick={() => deleteHistory(h.id)}>
                删除
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={onBack}>
          ← 返回
        </button>
      </div>
    </div>
  )
}
