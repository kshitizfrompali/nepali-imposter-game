export type WordMode = 'pick-category' | 'random'

export type Language = 'en' | 'np'

export type Screen = 'home' | 'settings' | 'reveal' | 'starter' | 'discussion' | 'result'

export interface Category {
  id: string
  label: { en: string; np: string }
  words: string[]
}

export interface WordBank {
  categories: Category[]
}

export interface GameSettings {
  players: string[]
  imposterCount: number
  wordMode: WordMode
  selectedCategoryId?: string
  showCategoryToImposter: boolean
  showSimilarWordToImposter: boolean
}

export interface GameRound {
  word: string
  categoryId: string
  imposterIndices: number[]
  revealedPlayers: boolean[]
  imposterHintWord: string | null
}

export interface AppState {
  screen: Screen
  language: Language
  settings: GameSettings
  round: GameRound | null
}
