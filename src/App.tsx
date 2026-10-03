import { TarotScene } from './components/Scene/TarotScene'
import { HUD } from './components/UI/HUD'
import { LoadingScreen } from './components/UI/LoadingScreen'
import { StartScreen } from './components/UI/StartScreen'
import { SpreadSelector } from './components/UI/SpreadSelector'
import { QuestionInput } from './components/UI/QuestionInput'
import { ReadingPanel } from './components/UI/ReadingPanel'
import { HistoryPanel } from './components/UI/HistoryPanel'
import { SettingsPanel } from './components/UI/SettingsPanel'
import { useTarotStore } from './store/useTarotStore'
import { useAudioSync } from './audio/useAudio'

export default function App() {
  const phase = useTarotStore((s) => s.phase)
  const enterTemple = useTarotStore((s) => s.enterTemple)
  const setPhase = useTarotStore((s) => s.setPhase)
  const historyCount = useTarotStore((s) => s.history.length)

  useAudioSync()

  return (
    <div id="app-root">
      <TarotScene />
      <HUD />
      {phase === 'loading' && <LoadingScreen onEnter={enterTemple} />}
      {phase === 'start' && (
        <StartScreen
          onBegin={() => setPhase('select')}
          onHistory={() => setPhase('history')}
          onSettings={() => setPhase('settings')}
          historyCount={historyCount}
        />
      )}
      {phase === 'select' && <SpreadSelector />}
      {phase === 'question' && <QuestionInput />}
      {phase === 'reading' && <ReadingPanel />}
      {phase === 'history' && <HistoryPanel />}
      {phase === 'settings' && <SettingsPanel />}
    </div>
  )
}
