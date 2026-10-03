import { useState } from 'react'
import { useTarotStore } from '../../store/useTarotStore'

export function QuestionInput() {
  const spread = useTarotStore((s) => s.spread)
  const shuffleDeck = useTarotStore((s) => s.shuffleDeck)
  const setQuestion = useTarotStore((s) => s.setQuestion)
  const back = useTarotStore((s) => s.setPhase)
  const [text, setText] = useState('')

  const handleShuffle = () => {
    setQuestion(text.trim())
    shuffleDeck()
  }

  return (
    <div className="overlay overlay-center">
      <div className="panel question-panel">
        <h2 className="panel-title">{spread?.name ?? '牌阵'}</h2>
        <p className="question-hint">在心中默想你的问题（可选，留空则使用通用指引）</p>
        <textarea
          className="question-input"
          value={text}
          maxLength={120}
          rows={3}
          placeholder="例如：这段关系接下来会怎样发展？"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => back('select')}>
            ← 换牌阵
          </button>
          <button className="btn btn-primary" onClick={handleShuffle}>
            🔮 洗牌
          </button>
        </div>
      </div>
    </div>
  )
}
