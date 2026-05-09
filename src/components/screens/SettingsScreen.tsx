import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import wordBankData from '../../data/words.json'
import type { WordBank, WordMode } from '../../types'

const wordBank = wordBankData as WordBank

export default function SettingsScreen() {
  const { state, goTo, updateSettings, startRound } = useApp()
  const { t, language } = useLanguage()
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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goTo('home')}
            aria-label="Back to home"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95 flex-shrink-0 text-lg"
          >
            ←
          </button>
          <h2 className="text-2xl font-black text-white">{t.settings}</h2>
        </div>

        {/* Players */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {t.addPlayers}
          </p>
          <div className="flex gap-2">
            <input
              aria-label={t.playerNamePlaceholder}
              className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              placeholder={t.playerNamePlaceholder}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={20}
            />
            <button
              onClick={addPlayer}
              disabled={!nameInput.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 disabled:opacity-30 text-white font-bold text-sm active:scale-95 transition-all"
            >
              {t.addPlayer}
            </button>
          </div>
          {settings.players.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {settings.players.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 rounded-full border border-violet-500/30"
                >
                  <span className="text-sm text-white font-medium">{player}</span>
                  <button
                    onClick={() => removePlayer(idx)}
                    className="relative w-6 h-6 -my-1 -mr-1 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors text-lg leading-none rounded-full before:content-[''] before:absolute before:-inset-3"
                    aria-label={`${t.removePlayer} ${player}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Imposter count */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
            {t.imposterCount}
          </p>
          <div className="flex items-center justify-between" role="group" aria-label={t.imposterCount}>
            <button
              onClick={() =>
                updateSettings({ imposterCount: Math.max(1, settings.imposterCount - 1) })
              }
              aria-label="Decrease imposter count"
              disabled={settings.imposterCount <= 1}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-2xl font-bold flex items-center justify-center active:scale-95 transition-all"
            >
              −
            </button>
            <span className="text-4xl font-black text-white tabular-nums" aria-live="polite">
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
              aria-label="Increase imposter count"
              disabled={settings.imposterCount >= Math.max(1, settings.players.length - 1)}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-2xl font-bold flex items-center justify-center active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Word mode */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {t.wordMode}
          </p>
          <div className="flex flex-col gap-2">
            {(['random', 'pick-category'] as WordMode[]).map((mode) => {
              const active = settings.wordMode === mode
              return (
                <button
                  key={mode}
                  onClick={() => updateSettings({ wordMode: mode })}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all active:scale-95 ${
                    active
                      ? 'bg-gradient-to-r from-violet-600/40 to-indigo-600/40 border border-violet-500/50 text-white'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {mode === 'random' ? t.randomCategory : t.pickCategory}
                </button>
              )
            })}
          </div>

          {settings.wordMode === 'pick-category' && (
            <select
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              value={settings.selectedCategoryId ?? ''}
              onChange={(e) => updateSettings({ selectedCategoryId: e.target.value })}
            >
              <option value="" disabled className="bg-gray-900">
                {t.selectCategory}
              </option>
              {wordBank.categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-900">
                  {cat.label[language]}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Imposter hint toggle */}
        <div className="bg-white/5 rounded-2xl px-4 border border-white/10">
          <button
            type="button"
            role="switch"
            aria-checked={settings.showCategoryToImposter}
            aria-label={t.showCategoryToImposter}
            onClick={() => updateSettings({ showCategoryToImposter: !settings.showCategoryToImposter })}
            className="w-full min-h-[52px] flex items-center justify-between gap-4 py-3 active:scale-[0.99] transition-transform text-left"
          >
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest leading-snug">
              {t.showCategoryToImposter}
            </span>
            <span
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                settings.showCategoryToImposter ? 'bg-violet-600' : 'bg-white/15'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  settings.showCategoryToImposter ? 'left-6' : 'left-1'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="px-4 pb-6 pt-3 flex-shrink-0 border-t border-white/5">
        {!canStart && (
          <p className="text-amber-400 text-xs font-semibold mb-3 text-center">
            {t.minPlayersError}
          </p>
        )}
        <button
          onClick={startRound}
          disabled={!canStart}
          className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 disabled:opacity-30 text-white shadow-2xl shadow-violet-900/50 active:scale-95 transition-all"
        >
          {t.startGameButton}
        </button>
      </div>
    </div>
  )
}
