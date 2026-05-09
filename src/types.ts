export type WordMode = 'pick-category' | 'random'

export type GameMode = 'classic' | 'wordWolf'

export type Language = 'en' | 'np'

export type Screen = 'home' | 'settings' | 'reveal' | 'starter' | 'discussion' | 'result'

export interface Cluster {
  id: string
  words: string[]
}

export interface Category {
  id: string
  label: { en: string; np: string }
  clusters: Cluster[]
  others?: string[]
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
  gameMode: GameMode
}

export interface GameRound {
  word: string
  categoryId: string
  imposterIndices: number[]
  revealedPlayers: boolean[]
  wolfWord?: string
}

export interface AppState {
  screen: Screen
  language: Language
  settings: GameSettings
  round: GameRound | null
}
