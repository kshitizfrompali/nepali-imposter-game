import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { AppState, GameSettings, Screen } from '../types'
import { assignRoles, pickWord } from '../utils/game'
import wordBankData from '../data/words.json'
import type { WordBank } from '../types'

const wordBank = wordBankData as WordBank

const defaultSettings: GameSettings = {
  players: [],
  imposterCount: 1,
  wordMode: 'random',
}

const initialState: AppState = {
  screen: 'home',
  language: 'en',
  settings: defaultSettings,
  round: null,
}

interface AppContextValue {
  state: AppState
  goTo: (screen: Screen) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  startRound: () => void
  markPlayerRevealed: (playerIndex: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export { AppContext }

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const goTo = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, screen }))
  }, [])

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }))
  }, [])

  const startRound = useCallback(() => {
    setState((prev) => {
      const { settings } = prev
      const { word, categoryId } = pickWord(settings, wordBank)
      const imposterIndices = assignRoles(settings.players.length, settings.imposterCount)
      const round = {
        word,
        categoryId,
        imposterIndices,
        revealedPlayers: new Array(settings.players.length).fill(false) as boolean[],
      }
      return { ...prev, screen: 'reveal', round }
    })
  }, [])

  const markPlayerRevealed = useCallback((playerIndex: number) => {
    setState((prev) => {
      if (!prev.round) return prev
      const revealedPlayers = [...prev.round.revealedPlayers]
      revealedPlayers[playerIndex] = true
      return {
        ...prev,
        round: { ...prev.round, revealedPlayers },
      }
    })
  }, [])

  return (
    <AppContext.Provider
      value={{ state, goTo, updateSettings, startRound, markPlayerRevealed }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
