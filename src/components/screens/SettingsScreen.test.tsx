import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsScreen from './SettingsScreen'
import { AppContext } from '../../context/AppContext'
import { LanguageContext } from '../../context/LanguageContext'
import { translations } from '../../i18n/translations'
import type { AppState, GameSettings } from '../../types'

const defaultSettings: GameSettings = {
  players: [],
  imposterCount: 1,
  wordMode: 'random',
  showCategoryToImposter: false,
  gameMode: 'classic',
}

const defaultState: AppState = {
  screen: 'settings',
  language: 'en',
  settings: defaultSettings,
  round: null,
}

function renderSettings(
  overrideState: Partial<AppState> = {},
  mockFns: Record<string, ReturnType<typeof vi.fn>> = {}
) {
  const goTo = (mockFns.goTo ?? vi.fn()) as unknown as (screen: import('../../types').Screen) => void
  const updateSettings = (mockFns.updateSettings ?? vi.fn()) as unknown as (settings: Partial<GameSettings>) => void
  const startRound = (mockFns.startRound ?? vi.fn()) as unknown as () => void

  return render(
    <LanguageContext.Provider
      value={{
        language: 'en',
        toggleLanguage: vi.fn(),
        t: translations.en,
      }}
    >
      <AppContext.Provider
        value={{
          state: { ...defaultState, ...overrideState },
          goTo,
          updateSettings,
          startRound,
          markPlayerRevealed: vi.fn() as unknown as (playerIndex: number) => void,
        }}
      >
        <SettingsScreen />
      </AppContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('SettingsScreen', () => {
  it('renders add player input', () => {
    renderSettings()
    expect(screen.getByPlaceholderText(/enter player name/i)).toBeInTheDocument()
  })

  it('Start Game button is disabled with fewer than 2 players', () => {
    renderSettings({ settings: { ...defaultSettings, players: ['Alice'] } })
    const btn = screen.getByRole('button', { name: /start game/i })
    expect(btn).toBeDisabled()
  })

  it('Start Game button is enabled with 2 or more players', () => {
    renderSettings({
      settings: { ...defaultSettings, players: ['Alice', 'Bob'] },
    })
    const btn = screen.getByRole('button', { name: /start game/i })
    expect(btn).not.toBeDisabled()
  })

  it('calls updateSettings when adding a player', () => {
    const updateSettings = vi.fn()
    renderSettings({}, { updateSettings })
    fireEvent.change(screen.getByPlaceholderText(/enter player name/i), {
      target: { value: 'Alice' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^(add|थप्नुहोस्)$/i }))
    expect(updateSettings).toHaveBeenCalledWith({ players: ['Alice'] })
  })

  it('shows category dropdown when pick-category mode selected', () => {
    renderSettings({
      settings: { ...defaultSettings, wordMode: 'pick-category', players: ['a', 'b'] },
    })
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('does not show category dropdown in random mode', () => {
    renderSettings({
      settings: { ...defaultSettings, wordMode: 'random', players: ['a', 'b'] },
    })
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })
})
