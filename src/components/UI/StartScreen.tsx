interface StartScreenProps {
  onBegin: () => void
  onHistory: () => void
  onSettings: () => void
  historyCount: number
}

export function StartScreen({ onBegin, onHistory, onSettings, historyCount }: StartScreenProps) {
  return (
    <div className="overlay overlay-center">
      <div className="panel start-panel">
        <div className="start-glyph">☽ ✧ ☾</div>
        <h2 className="panel-title">欢迎来到圣殿</h2>
        <p className="start-text">
          静下心来，在心中默想你的问题。
          <br />
          塔罗不会告诉你命运，它只是举起一面镜子。
        </p>
        <div className="btn-col">
          <button className="btn btn-primary" onClick={onBegin}>
            开始占卜
          </button>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={onHistory}>
              历史记录{historyCount > 0 ? ` (${historyCount})` : ''}
            </button>
            <button className="btn btn-ghost" onClick={onSettings}>
              设置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
