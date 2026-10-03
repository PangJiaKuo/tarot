import { useTarotStore, type Quality } from '../../store/useTarotStore'

const QUALITY_LABELS: { value: Quality; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
]

export function SettingsPanel() {
  const settings = useTarotStore((s) => s.settings)
  const toggleSound = useTarotStore((s) => s.toggleSound)
  const setQuality = useTarotStore((s) => s.setQuality)
  const toggleReduceMotion = useTarotStore((s) => s.toggleReduceMotion)
  const back = useTarotStore((s) => s.setPhase)
  const prevPhase = useTarotStore((s) => s.prevPhase)

  const onBack = () => back(prevPhase === 'settings' || prevPhase === 'history' ? 'start' : prevPhase)

  return (
    <div className="overlay overlay-center">
      <div className="panel settings-panel">
        <h2 className="panel-title">设置</h2>

        <div className="setting-row">
          <span className="setting-label">音效</span>
          <button
            className={`switch ${settings.sound ? 'on' : ''}`}
            role="switch"
            aria-checked={settings.sound}
            onClick={toggleSound}
          >
            <span className="switch-knob" />
          </button>
        </div>

        <div className="setting-row">
          <span className="setting-label">画质</span>
          <div className="segmented">
            {QUALITY_LABELS.map((q) => (
              <button
                key={q.value}
                className={`segment ${settings.quality === q.value ? 'active' : ''}`}
                onClick={() => setQuality(q.value)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">减少动态{settings.reduceMotion ? '（系统偏好）' : ''}</span>
          <button
            className={`switch ${settings.reduceMotion ? 'on' : ''}`}
            role="switch"
            aria-checked={settings.reduceMotion}
            onClick={toggleReduceMotion}
          >
            <span className="switch-knob" />
          </button>
        </div>

        <p className="settings-note">减少动态会关闭镜头视差、漂浮与逐字动画，适合晕动或低性能设备。</p>

        <button className="btn btn-ghost" onClick={onBack}>
          ← 返回
        </button>
      </div>
    </div>
  )
}
