import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import wordBankData from '../../data/words.json'
import type { WordBank } from '../../types'

const wordBank = wordBankData as WordBank

export default function ResultScreen() {
  const { state, goTo } = useApp()
  const { t, language } = useLanguage()
  const { settings, round } = state

  if (!round) return null

  const category = wordBank.categories.find((c) => c.id === round.categoryId)
  const imposterNames = round.imposterIndices.map((idx) => settings.players[idx])

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 bg-red-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-xs">
        <div className="w-40 h-40 rounded-3xl overflow-hidden border border-red-500/40 shadow-2xl shadow-red-900/60">
          <img
            src={`${import.meta.env.BASE_URL}result.webp`}
            alt="Imposter caught"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-5 border-b border-white/5">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
              {t.impostersWere}
            </p>
            <p className="text-3xl font-black text-red-400 leading-tight">
              {imposterNames.join(', ')}
            </p>
          </div>
          <div className="px-5 py-5">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
              {t.theWordWas}
            </p>
            <p className="text-4xl font-black text-white">{round.word}</p>
            <p className="text-sm text-white/55 mt-1.5">
              {category?.label[language]}
            </p>
          </div>
        </div>

        <button
          onClick={() => goTo('settings')}
          className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all"
        >
          {t.playAgain}
        </button>
      </div>
    </div>
  )
}
