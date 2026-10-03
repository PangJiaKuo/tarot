import { SPREADS } from '../../data/tarot'
import { useTarotStore } from '../../store/useTarotStore'

export function SpreadSelector() {
  const chooseSpread = useTarotStore((s) => s.chooseSpread)
  const back = useTarotStore((s) => s.setPhase)

  return (
    <div className="overlay overlay-center">
      <div className="panel spread-panel">
        <h2 className="panel-title">选择牌阵</h2>
        <div className="spread-list">
          {SPREADS.map((s) => (
            <button key={s.id} className="spread-card" onClick={() => chooseSpread(s.id)}>
              <div className="spread-cards-row">
                {s.positions.map((_, i) => (
                  <span key={i} className="mini-card">🂠</span>
                ))}
              </div>
              <div className="spread-name">{s.name}</div>
              <div className="spread-desc">{s.desc}</div>
              <div className="spread-count">{s.positions.length} 张牌</div>
            </button>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => back('start')}>
          ← 返回
        </button>
      </div>
    </div>
  )
}
