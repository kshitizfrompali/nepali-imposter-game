import { describe, it, expect } from 'vitest'
import { shuffleArray, assignRoles, pickWord } from './game'
import type { GameSettings, WordBank } from '../types'

const mockWordBank: WordBank = {
  categories: [
    {
      id: 'food',
      label: { en: 'Food', np: 'खाना' },
      words: ['मोमो', 'दाल', 'भात', 'चिया', 'रोटी'],
    },
    {
      id: 'places',
      label: { en: 'Places', np: 'ठाउँ' },
      words: ['काठमाडौं', 'पोखरा', 'चितवन'],
    },
  ],
}

describe('shuffleArray', () => {
  it('returns array with same elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3]
    const original = [...input]
    shuffleArray(input)
    expect(input).toEqual(original)
  })

  it('returns a new array reference', () => {
    const input = [1, 2, 3]
    const result = shuffleArray(input)
    expect(result).not.toBe(input)
  })
})

describe('assignRoles', () => {
  it('returns correct number of imposter indices', () => {
    const result = assignRoles(6, 2)
    expect(result).toHaveLength(2)
  })

  it('all imposter indices are valid player indices', () => {
    const playerCount = 5
    const result = assignRoles(playerCount, 2)
    result.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(playerCount)
    })
  })

  it('imposter indices are unique', () => {
    const result = assignRoles(8, 3)
    const unique = new Set(result)
    expect(unique.size).toBe(3)
  })

  it('works with 1 imposter', () => {
    const result = assignRoles(4, 1)
    expect(result).toHaveLength(1)
  })
})

describe('pickWord', () => {
  it('returns a word from the selected category when mode is pick-category', () => {
    const settings: GameSettings = {
      players: ['a', 'b'],
      imposterCount: 1,
      wordMode: 'pick-category',
      selectedCategoryId: 'food',
      showCategoryToImposter: false,
    }
    const result = pickWord(settings, mockWordBank)
    expect(mockWordBank.categories[0].words).toContain(result.word)
    expect(result.categoryId).toBe('food')
  })

  it('returns a word from any category when mode is random', () => {
    const settings: GameSettings = {
      players: ['a', 'b'],
      imposterCount: 1,
      wordMode: 'random',
      showCategoryToImposter: false,
    }
    const result = pickWord(settings, mockWordBank)
    const allWords = mockWordBank.categories.flatMap((c) => c.words)
    expect(allWords).toContain(result.word)
    expect(['food', 'places']).toContain(result.categoryId)
  })

  it('throws if pick-category mode has no selectedCategoryId', () => {
    const settings: GameSettings = {
      players: ['a', 'b'],
      imposterCount: 1,
      wordMode: 'pick-category',
      showCategoryToImposter: false,
    }
    expect(() => pickWord(settings, mockWordBank)).toThrow()
  })

  it('throws if selectedCategoryId does not exist in word bank', () => {
    const settings: GameSettings = {
      players: ['a', 'b'],
      imposterCount: 1,
      wordMode: 'pick-category',
      selectedCategoryId: 'nonexistent',
      showCategoryToImposter: false,
    }
    expect(() => pickWord(settings, mockWordBank)).toThrow()
  })
})
