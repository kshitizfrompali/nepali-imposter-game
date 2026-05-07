import { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function StarterScreen() {
  const { state, goTo } = useApp()
  const { t } = useLanguage()
  const players = state.settings.players

  const [spinning, setSpinning] = useState(false)
  const [displayIdx, setDisplayIdx] = useState<number | null>(null)
  const [settled, setSettled] = useState(false)

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    setSettled(false)

    const winner = Math.floor(Math.random() * players.length)
    const totalTicks = 22 + Math.floor(Math.random() * 8)
    let tick = 0
    let idx = Math.floor(Math.random() * players.length)

    function nextTick() {
      tick++
      idx = (idx + 1) % players.length
      setDisplayIdx(idx)

      if (tick >= totalTicks) {
        setDisplayIdx(winner)
        setSpinning(false)
        setSettled(true)
        return
      }

      const progress = tick / totalTicks
      const delay = 60 + progress * progress * 280
      setTimeout(nextTick, delay)
    }

    setTimeout(nextTick, 60)
  }, [spinning, players])

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-72 h-72 rounded-full blur-3xl transition-all duration-700 ${
            settled ? 'bg-violet-600/20' : 'bg-indigo-900/10'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs text-center">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          {t.whoStarts}
        </p>

        <div
          className={`w-full min-h-[140px] flex items-center justify-center rounded-3xl border transition-all duration-300 ${
            settled
              ? 'bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border-violet-500/40 shadow-2xl shadow-violet-900/40'
              : displayIdx !== null
              ? 'bg-white/5 border-white/10'
              : 'bg-white/[0.03] border-white/5'
          }`}
        >
          {displayIdx !== null ? (
            <p
              className={`text-3xl font-black px-6 text-center leading-tight transition-all duration-150 ${
                settled ? 'text-white' : 'text-white/60'
              }`}
            >
              {players[displayIdx]}
            </p>
          ) : (
            <p className="text-white/20 text-lg">— — —</p>
          )}
        </div>

        {!settled ? (
          <button
            onClick={spin}
            disabled={spinning}
            className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all disabled:opacity-40"
          >
            {spinning ? '...' : t.spin}
          </button>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={spin}
              className="w-full py-4 text-base font-bold rounded-2xl bg-white/5 border border-white/10 text-white/60 active:scale-95 transition-all"
            >
              {t.reSpin}
            </button>
            <button
              onClick={() => goTo('discussion')}
              className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-900/50 active:scale-95 transition-all"
            >
              {t.startDiscussionNow}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
