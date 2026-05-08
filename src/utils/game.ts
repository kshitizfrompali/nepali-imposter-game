import type { GameSettings, WordBank } from '../types'

export function pickImposterHint(
  wordBank: WordBank,
  categoryId: string,
  actualWord: string
): string | null {
  const category = wordBank.categories.find((c) => c.id === categoryId)
  if (!category) return null
  const candidates = category.words.filter((w) => w !== actualWord)
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function assignRoles(playerCount: number, imposterCount: number): number[] {
  const indices = Array.from({ length: playerCount }, (_, i) => i)
  return shuffleArray(indices).slice(0, imposterCount)
}

export function pickWord(
  settings: GameSettings,
  wordBank: WordBank
): { word: string; categoryId: string } {
  if (settings.wordMode === 'pick-category') {
    if (!settings.selectedCategoryId) {
      throw new Error('selectedCategoryId is required for pick-category mode')
    }
    const category = wordBank.categories.find(
      (c) => c.id === settings.selectedCategoryId
    )
    if (!category) {
      throw new Error(`Category "${settings.selectedCategoryId}" not found`)
    }
    const word = category.words[Math.floor(Math.random() * category.words.length)]
    return { word, categoryId: category.id }
  }

  const category =
    wordBank.categories[Math.floor(Math.random() * wordBank.categories.length)]
  const word = category.words[Math.floor(Math.random() * category.words.length)]
  return { word, categoryId: category.id }
}
