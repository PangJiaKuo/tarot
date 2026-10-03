import { create } from 'zustand'
import { SPREADS, TAROT_DECK, type Orientation, type SpreadDef, type TarotCard } from '../data/tarot'
import { shuffle } from '../utils/random'
import { generateLocalReading, type ReadingResult } from '../utils/readings'
import { requestAIReading } from '../utils/ai'

export type Phase =
  | 'loading'
  | 'start'
  | 'select'
  | 'question'
  | 'shuffle'
  | 'draw'
  | 'reveal'
  | 'reading'
  | 'history'
  | 'settings'

export interface DrawnCard {
  card: TarotCard
  orientation: Orientation
  revealed: boolean
  positionLabel: string
}

export interface HistoryCard {
  name: string
  orientation: Orientation
  positionLabel: string
}

export interface HistoryEntry {
  id: string
  time: number
  question: string
  spreadName: string
  cards: HistoryCard[]
  summary: string
}

export type Quality = 'low' | 'medium' | 'high'

export interface Settings {
  sound: boolean
  quality: Quality
  reduceMotion: boolean
}

const HISTORY_KEY = 'mystic-tarot-history'
const SETTINGS_KEY = 'mystic-tarot-settings'
const MAX_HISTORY = 50

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryEntry[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : []
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)))
  } catch {
    /* 存储不可用时静默忽略 */
  }
}

function defaultReduceMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<Settings>
      return {
        sound: s.sound ?? true,
        quality: s.quality ?? 'medium',
        reduceMotion: s.reduceMotion ?? defaultReduceMotion(),
      }
    }
  } catch {
    /* ignore */
  }
  return { sound: true, quality: 'medium', reduceMotion: defaultReduceMotion() }
}

function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

export function detectLowPower(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4
}

interface TarotState {
  phase: Phase
  prevPhase: Phase
  spread: SpreadDef | null
  question: string
  deck: TarotCard[]
  deckOrientations: Orientation[]
  drawn: DrawnCard[]
  shuffled: boolean
  reading: ReadingResult | null
  aiPending: boolean
  history: HistoryEntry[]
  settings: Settings

  setPhase: (p: Phase) => void
  enterTemple: () => void
  chooseSpread: (id: string) => void
  setQuestion: (q: string) => void
  shuffleDeck: () => void
  endShuffle: () => void
  drawCards: () => void
  revealCard: (index: number) => void
  requestReading: (useAI: boolean) => Promise<void>
  reset: () => void
  toggleSound: () => void
  setQuality: (q: Quality) => void
  toggleReduceMotion: () => void
  deleteHistory: (id: string) => void
  clearHistory: () => void
}

function pushHistory(entry: HistoryEntry, prev: HistoryEntry[]): HistoryEntry[] {
  const next = [entry, ...prev].slice(0, MAX_HISTORY)
  saveHistory(next)
  return next
}

export const useTarotStore = create<TarotState>((set, get) => ({
  phase: 'loading',
  prevPhase: 'loading',
  spread: null,
  question: '',
  deck: [],
  deckOrientations: [],
  drawn: [],
  shuffled: false,
  reading: null,
  aiPending: false,
  history: loadHistory(),
  settings: loadSettings(),

  setPhase: (p) => set((s) => ({ phase: p, prevPhase: s.phase })),

  enterTemple: () => set({ phase: 'start' }),

  chooseSpread: (id) => {
    const spread = SPREADS.find((s) => s.id === id) ?? SPREADS[0]
    set({ spread, phase: 'question' })
  },

  setQuestion: (q) => set({ question: q }),

  shuffleDeck: () => {
    const oriented = shuffle(TAROT_DECK).map((card) => ({
      card,
      orientation: (Math.random() < 0.5 ? 'reversed' : 'upright') as Orientation,
    }))
    set({
      deck: oriented.map((o) => o.card),
      deckOrientations: oriented.map((o) => o.orientation),
      drawn: [],
      reading: null,
      shuffled: true,
      phase: 'shuffle',
    })
  },

  endShuffle: () => {
    if (get().phase === 'shuffle') set({ phase: 'draw' })
  },

  drawCards: () => {
    const { spread, deck, deckOrientations } = get()
    if (!spread || deck.length < spread.positions.length) return
    const drawn: DrawnCard[] = spread.positions.map((p, i) => ({
      card: deck[i],
      orientation: deckOrientations[i],
      revealed: false,
      positionLabel: p.label,
    }))
    set({ drawn, phase: 'reveal' })
  },

  revealCard: (index) => {
    const { drawn } = get()
    if (!drawn[index] || drawn[index].revealed) return
    const next = drawn.map((d, i) => (i === index ? { ...d, revealed: true } : d))
    const allRevealed = next.every((d) => d.revealed)
    set({ drawn: next, phase: allRevealed ? 'reading' : 'reveal' })
    if (allRevealed) {
      const { spread, question, settings } = get()
      if (spread) {
        const reading = generateLocalReading({
          spread,
          question,
          cards: next.map((d) => ({ card: d.card, orientation: d.orientation })),
        })
        set({ reading })
        const entry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          time: Date.now(),
          question,
          spreadName: spread.name,
          cards: next.map((d) => ({ name: d.card.name, orientation: d.orientation, positionLabel: d.positionLabel })),
          summary: reading.summary,
        }
        set((s) => ({ history: pushHistory(entry, s.history) }))
        // 未开启减少动态时播放解读音效由 UI 层处理
        void settings
      }
    }
  },

  requestReading: async (useAI) => {
    const { spread, question, drawn } = get()
    if (!spread || drawn.length === 0) return
    if (!useAI) return
    set({ aiPending: true })
    const result = await requestAIReading({
      spread,
      question,
      cards: drawn.map((d) => ({ card: d.card, orientation: d.orientation })),
    })
    set({ reading: result, aiPending: false })
  },

  reset: () => set({ phase: 'select', drawn: [], reading: null, question: '', shuffled: false }),

  toggleSound: () =>
    set((s) => {
      const settings = { ...s.settings, sound: !s.settings.sound }
      saveSettings(settings)
      return { settings }
    }),

  setQuality: (q) =>
    set((s) => {
      const settings = { ...s.settings, quality: q }
      saveSettings(settings)
      return { settings }
    }),

  toggleReduceMotion: () =>
    set((s) => {
      const settings = { ...s.settings, reduceMotion: !s.settings.reduceMotion }
      saveSettings(settings)
      return { settings }
    }),

  deleteHistory: (id) =>
    set((s) => {
      const history = s.history.filter((h) => h.id !== id)
      saveHistory(history)
      return { history }
    }),

  clearHistory: () =>
    set(() => {
      saveHistory([])
      return { history: [] }
    }),
}))
