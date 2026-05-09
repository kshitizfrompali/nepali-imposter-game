import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PlayerRevealScreen from './PlayerRevealScreen'
import { AppContext } from '../../context/AppContext'
import { LanguageContext } from '../../context/LanguageContext'
import { translations } from '../../i18n/translations'
import type { AppState } from '../../types'

const baseState: AppState = {
  screen: 'reveal',
  language: 'en',
  settings: {
    players: ['Alice', 'Bob', 'Charlie'],
    imposterCount: 1,
    wordMode: 'random',
    showCategoryToImposter: false,
    gameMode: 'classic',
  },
  round: {
    word: 'मोमो',
    categoryId: 'khana',
    imposterIndices: [1],
    revealedPlayers: [false, false, false],
  },
}

function renderReveal(state: AppState = baseState, mockFns: Record<string, ReturnType<typeof vi.fn>> = {}) {
  const markPlayerRevealed = (mockFns.markPlayerRevealed ?? vi.fn()) as unknown as (playerIndex: number) => void
  const goTo = (mockFns.goTo ?? vi.fn()) as unknown as (screen: import('../../types').Screen) => void

  return render(
    <LanguageContext.Provider value={{ language: 'en', toggleLanguage: vi.fn(), t: translations.en }}>
      <AppContext.Provider value={{ state, goTo, updateSettings: vi.fn() as unknown as (s: Partial<import('../../types').GameSettings>) => void, startRound: vi.fn() as unknown as () => void, markPlayerRevealed }}>
        <PlayerRevealScreen />
      </AppContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('PlayerRevealScreen', () => {
  it('renders all player name buttons', () => {
    renderReveal()
    expect(screen.getByRole('button', { name: /Alice/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Bob/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Charlie/i })).toBeInTheDocument()
  })

  it('shows word in overlay when crewmate player taps their name', () => {
    renderReveal()
    fireEvent.click(screen.getByRole('button', { name: /Alice/i }))
    expect(screen.getByText('मोमो')).toBeInTheDocument()
  })

  it('shows IMPOSTER text for imposter player', () => {
    renderReveal()
    fireEvent.click(screen.getByRole('button', { name: /Bob/i }))
    expect(screen.getByText(/IMPOSTER|इम्पोस्टर/i)).toBeInTheDocument()
  })

  it('calls markPlayerRevealed on Done click', () => {
    const markPlayerRevealed = vi.fn()
    renderReveal(baseState, { markPlayerRevealed })
    fireEvent.click(screen.getByRole('button', { name: /Alice/i }))
    fireEvent.click(screen.getByRole('button', { name: /done|भयो/i }))
    expect(markPlayerRevealed).toHaveBeenCalledWith(0)
  })

  it('disables button for player who has already seen their role', () => {
    const state: AppState = {
      ...baseState,
      round: { ...baseState.round!, revealedPlayers: [true, false, false] },
    }
    renderReveal(state)
    expect(screen.getByRole('button', { name: /Alice/i })).toBeDisabled()
  })

  it('shows Start Discussion when all players have seen their role', () => {
    const state: AppState = {
      ...baseState,
      round: { ...baseState.round!, revealedPlayers: [true, true, true] },
    }
    renderReveal(state)
    expect(screen.getByRole('button', { name: /start discussion|छलफल/i })).toBeInTheDocument()
  })
})
