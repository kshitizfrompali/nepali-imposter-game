import { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

const RADIUS = 110
const NODE_PADDING = 44
const SIZE = (RADIUS + NODE_PADDING) * 2
const SPIN_DURATION_MS = 3700

export default function StarterScreen() {
  const { state, goTo } = useApp()
  const { t } = useLanguage()
  const players = state.settings.players
  const imposterIndices = state.round?.imposterIndices ?? []

  const [rotation, setRotation] = useState(0)
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'settled'>('idle')

  const N = players.length

  const spin = useCallback(() => {
    if (phase === 'spinning' || N === 0) return

    let winner = Math.floor(Math.random() * N)
    if (imposterIndices.includes(winner) && Math.random() < 0.7) {
      const nonImposters = players
        .map((_, i) => i)
        .filter((i) => !imposterIndices.includes(i))
      if (nonImposters.length > 0) {
        winner = nonImposters[Math.floor(Math.random() * nonImposters.length)]
      }
    }

    const slot = 360 / N
    const targetAngle = winner * slot

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      setRotation(targetAngle)
      setWinnerIdx(winner)
      setPhase('settled')
      return
    }

    setPhase('spinning')
    setWinnerIdx(null)

    const jitter = (Math.random() - 0.5) * (slot * 0.4)
    const fullSpins = 5
    const final = rotation - (rotation % 360) + fullSpins * 360 + targetAngle + jitter

    setRotation(final)

    setTimeout(() => {
      setWinnerIdx(winner)
      setPhase('settled')
    }, SPIN_DURATION_MS)
  }, [phase, rotation, N, imposterIndices, players])

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-80 h-80 rounded-full blur-3xl transition-all duration-700 ${
            phase === 'settled' ? 'bg-violet-600/30' : 'bg-indigo-900/15'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">
          {t.whoStarts}
        </p>

        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {/* Dashed circle ring */}
          <div
            className="absolute rounded-full border-2 border-dashed border-white/15"
            style={{
              top: NODE_PADDING,
              left: NODE_PADDING,
              right: NODE_PADDING,
              bottom: NODE_PADDING,
            }}
          />

          {/* Player nodes around circle */}
          {players.map((player, i) => {
            const angle = (i / N) * 2 * Math.PI - Math.PI / 2
            const x = SIZE / 2 + RADIUS * Math.cos(angle)
            const y = SIZE / 2 + RADIUS * Math.sin(angle)
            const isWinner = winnerIdx === i && phase === 'settled'
            return (
              <div
                key={i}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
                  isWinner ? 'scale-[1.55] z-20' : 'scale-100 z-10'
                }`}
                style={{ left: x, top: y }}
              >
                <div
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    isWinner
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-2xl shadow-violet-900/70 ring-2 ring-white/40'
                      : 'bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {player}
                </div>
              </div>
            )
          })}

          {/* Bottle — pivots from circle center, points outward */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              width: 22,
              height: RADIUS - 8,
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
              transition:
                phase === 'spinning'
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.16, 0.99)`
                  : 'none',
            }}
          >
            {/* body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[60%] bg-gradient-to-t from-emerald-900 via-emerald-700 to-emerald-600 rounded-md shadow-lg shadow-black/40" />
            {/* shoulder taper */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-emerald-700"
              style={{ bottom: '60%', height: '8%', width: 12 }}
            />
            {/* neck */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-emerald-800"
              style={{ bottom: '68%', height: '24%', width: 7 }}
            />
            {/* cap */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[10px] h-1.5 bg-amber-500 rounded-t-sm" />
            {/* highlight */}
            <div className="absolute bottom-[5%] left-[28%] w-[2px] h-[45%] bg-white/30 rounded-full" />
          </div>

          {/* Center hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-900/60 ring-2 ring-violet-300/30 z-10" />
        </div>

        {/* Action area */}
        {phase === 'idle' && (
          <button
            onClick={spin}
            className="w-full max-w-xs py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all"
          >
            {t.spin}
          </button>
        )}
        {phase === 'spinning' && (
          <button
            disabled
            className="w-full max-w-xs py-5 text-xl font-black rounded-2xl bg-white/5 border border-white/10 text-white/30"
          >
            ...
          </button>
        )}
        {phase === 'settled' && (
          <div className="flex flex-col gap-3 w-full max-w-xs">
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
