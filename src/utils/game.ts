import type { Category, GameSettings, WordBank } from '../types'

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

export function flattenCategoryWords(category: Category): string[] {
  return [...category.clusters.flatMap((c) => c.words), ...(category.others ?? [])]
}

export function pickWordPair(
  settings: GameSettings,
  wordBank: WordBank
): { word: string; wolfWord: string; categoryId: string } {
  const eligibleCategories = wordBank.categories.filter((c) =>
    c.clusters.some((cl) => cl.words.length >= 2)
  )
  if (eligibleCategories.length === 0) {
    throw new Error('No clusters available for Word Wolf mode')
  }

  let category: Category
  if (settings.wordMode === 'pick-category' && settings.selectedCategoryId) {
    const found = eligibleCategories.find((c) => c.id === settings.selectedCategoryId)
    if (!found) {
      throw new Error(
        `Category "${settings.selectedCategoryId}" has no eligible clusters for Word Wolf`
      )
    }
    category = found
  } else {
    category = eligibleCategories[Math.floor(Math.random() * eligibleCategories.length)]
  }

  const eligibleClusters = category.clusters.filter((cl) => cl.words.length >= 2)
  const cluster = eligibleClusters[Math.floor(Math.random() * eligibleClusters.length)]
  const [a, b] = shuffleArray(cluster.words).slice(0, 2)
  return { word: a, wolfWord: b, categoryId: category.id }
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
    const pool = flattenCategoryWords(category)
    const word = pool[Math.floor(Math.random() * pool.length)]
    return { word, categoryId: category.id }
  }

  const category =
    wordBank.categories[Math.floor(Math.random() * wordBank.categories.length)]
  const pool = flattenCategoryWords(category)
  const word = pool[Math.floor(Math.random() * pool.length)]
  return { word, categoryId: category.id }
}
