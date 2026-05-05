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
  const progressPct = (seenCount / settings.players.length) * 100

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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col gap-5">
        {/* Header + progress */}
        <div>
          <h2 className="text-xl font-black text-white mb-3">{t.tapToReveal}</h2>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-1.5 font-medium">
            {t.progressLabel(seenCount, settings.players.length)}
          </p>
        </div>

        {/* Player grid */}
        <div className="grid grid-cols-2 gap-3">
          {settings.players.map((player, idx) => {
            const seen = round.revealedPlayers[idx]
            return (
              <button
                key={idx}
                onClick={() => handlePlayerTap(idx)}
                disabled={seen}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl min-h-[96px] p-4 transition-all active:scale-95 ${
                  seen
                    ? 'bg-white/5 border border-white/5'
                    : 'bg-gradient-to-br from-violet-600/70 to-indigo-600/70 text-white border border-violet-500/40 shadow-lg shadow-violet-900/40'
                }`}
              >
                {seen && <span className="text-xl text-white/30">✓</span>}
                <span className={`text-base font-black leading-tight text-center break-all ${seen ? 'text-white/25 line-through' : 'text-white'}`}>
                  {player}
                </span>
              </button>
            )
          })}
        </div>

        {allSeen && (
          <button
            onClick={() => goTo('discussion')}
            className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-900/50 active:scale-95 transition-all"
          >
            {t.startDiscussion}
          </button>
        )}
      </div>

      {/* Full-screen role overlay */}
      {activePlayer !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-8 bg-gradient-to-br from-[#0a0008] to-[#08080f]">
          {isImposter ? (
            <>
              <div className="w-32 h-32 rounded-3xl bg-red-900/30 border border-red-700/30 flex items-center justify-center shadow-2xl shadow-red-900/50">
                <span className="text-7xl">🕵️</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                  {settings.players[activePlayer]}
                </p>
                <p className="text-5xl font-black text-red-500 tracking-wider leading-none">
                  {t.youAreImposter}
                </p>
              </div>
              <p className="text-white/40 text-center text-sm max-w-[260px] leading-relaxed">
                You do not know the word. Blend in and deceive!
              </p>
            </>
          ) : (
            <>
              <div className="w-32 h-32 rounded-3xl bg-violet-900/30 border border-violet-500/30 flex items-center justify-center shadow-2xl shadow-violet-900/50">
                <span className="text-7xl">🔑</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  {settings.players[activePlayer]}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
                  {t.category}: {category?.label.en} / {category?.label.np}
                </p>
                <p className="text-5xl font-black text-white leading-tight">{round.word}</p>
              </div>
              <p className="text-white/40 text-center text-sm max-w-[260px] leading-relaxed">
                Remember the word. Find the imposter!
              </p>
            </>
          )}
          <button
            onClick={handleDone}
            className="mt-2 px-12 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xl font-black active:scale-95 transition-all shadow-2xl shadow-violet-900/60"
          >
            {t.done}
          </button>
        </div>
      )}
    </div>
  )
}
