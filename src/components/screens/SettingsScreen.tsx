import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import wordBankData from '../../data/words.json'
import type { WordBank, WordMode } from '../../types'

const wordBank = wordBankData as WordBank

export default function SettingsScreen() {
  const { state, goTo, updateSettings, startRound } = useApp()
  const { t } = useLanguage()
  const { settings } = state
  const [nameInput, setNameInput] = useState('')

  function addPlayer() {
    const name = nameInput.trim()
    if (!name || settings.players.includes(name)) return
    updateSettings({ players: [...settings.players, name] })
    setNameInput('')
  }

  function removePlayer(idx: number) {
    const next = settings.players.filter((_, i) => i !== idx)
    const maxImposters = Math.max(1, next.length - 1)
    updateSettings({
      players: next,
      imposterCount: Math.min(settings.imposterCount, maxImposters),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') addPlayer()
  }

  const canStart = settings.players.length >= 2

  return (
    <div className="flex flex-col gap-6 p-4 max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold text-white">{t.settings}</h2>

      <section>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.addPlayers}
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
            placeholder={t.playerNamePlaceholder}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
          />
          <button
            onClick={addPlayer}
            disabled={!nameInput.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium transition-colors"
          >
            {t.addPlayer}
          </button>
        </div>
        {settings.players.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {settings.players.map((player, idx) => (
              <li
                key={idx}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-full text-sm text-white"
              >
                {player}
                <button
                  onClick={() => removePlayer(idx)}
                  className="ml-1 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label={t.removePlayer}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.imposterCount}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              updateSettings({ imposterCount: Math.max(1, settings.imposterCount - 1) })
            }
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
          >
            −
          </button>
          <span className="text-2xl font-bold text-white w-8 text-center">
            {settings.imposterCount}
          </span>
          <button
            onClick={() =>
              updateSettings({
                imposterCount: Math.min(
                  Math.max(1, settings.players.length - 1),
                  settings.imposterCount + 1
                ),
              })
            }
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
          >
            +
          </button>
        </div>
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.wordMode}
        </label>
        <div className="flex flex-col gap-2">
          {(['random', 'pick-category'] as WordMode[]).map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="wordMode"
                value={mode}
                checked={settings.wordMode === mode}
                onChange={() => updateSettings({ wordMode: mode })}
                className="accent-indigo-500"
              />
              <span className="text-white text-sm">
                {mode === 'random' ? t.randomCategory : t.pickCategory}
              </span>
            </label>
          ))}
        </div>

        {settings.wordMode === 'pick-category' && (
          <select
            className="mt-3 w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
            value={settings.selectedCategoryId ?? ''}
            onChange={(e) => updateSettings({ selectedCategoryId: e.target.value })}
          >
            <option value="" disabled>
              {t.selectCategory}
            </option>
            {wordBank.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label.en} / {cat.label.np}
              </option>
            ))}
          </select>
        )}
      </section>

      {!canStart && (
        <p className="text-yellow-400 text-sm">{t.minPlayersError}</p>
      )}
      <button
        onClick={startRound}
        disabled={!canStart}
        className="w-full py-4 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
      >
        {t.startGameButton}
      </button>

      <button
        onClick={() => goTo('home')}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors text-center"
      >
        ← Back
      </button>
    </div>
  )
}
