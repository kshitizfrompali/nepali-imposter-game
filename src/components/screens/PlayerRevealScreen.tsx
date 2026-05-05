import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import wordBankData from '../../data/words.json'
import type { WordBank } from '../../types'

const wordBank = wordBankData as WordBank

export default function PlayerRevealScreen() {
  const { state, goTo, markPlayerRevealed } = useApp()
  const { t } = useLanguage()
  const { settings, round } = state
  const [activePlayer, setActivePlayer] = useState<number | null>(null)

  if (!round) return null

  const category = wordBank.categories.find((c) => c.id === round.categoryId)
  const seenCount = round.revealedPlayers.filter(Boolean).length
  const allSeen = seenCount === settings.players.length
  const isImposter = activePlayer !== null && round.imposterIndices.includes(activePlayer)

  function handlePlayerTap(idx: number) {
    if (round!.revealedPlayers[idx]) return
    setActivePlayer(idx)
  }

  function handleDone() {
    if (activePlayer === null) return
    markPlayerRevealed(activePlayer)
    setActivePlayer(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-md mx-auto w-full">
      <h2 className="text-xl font-bold text-white">{t.tapToReveal}</h2>

      <p className="text-sm text-gray-400">
        {t.progressLabel(seenCount, settings.players.length)}
      </p>

      <div className="flex flex-wrap gap-3">
        {settings.players.map((player, idx) => {
          const seen = round.revealedPlayers[idx]
          return (
            <button
              key={idx}
              onClick={() => handlePlayerTap(idx)}
              disabled={seen}
              className={`px-5 py-3 rounded-xl font-medium text-base transition-all ${
                seen
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed line-through'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {player} {seen ? '✓' : ''}
            </button>
          )
        })}
      </div>

      {allSeen && (
        <button
          onClick={() => goTo('discussion')}
          className="w-full py-4 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-500 text-white transition-colors mt-4"
        >
          {t.startDiscussion}
        </button>
      )}

      {activePlayer !== null && (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center gap-6 px-6">
          {isImposter ? (
            <>
              <div className="text-6xl">🕵️</div>
              <p className="text-4xl font-black text-red-500">{t.youAreImposter}</p>
              <p className="text-gray-400 text-center text-sm">
                {settings.players[activePlayer]}, you do not know the word. Blend in!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl">👁️</div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                {t.category}: {category?.label.en} / {category?.label.np}
              </p>
              <p className="text-5xl font-black text-white">{round.word}</p>
              <p className="text-gray-400 text-center text-sm">
                {settings.players[activePlayer]}, remember the word!
              </p>
            </>
          )}
          <button
            onClick={handleDone}
            className="mt-6 px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold transition-colors"
          >
            {t.done}
          </button>
        </div>
      )}
    </div>
  )
}
