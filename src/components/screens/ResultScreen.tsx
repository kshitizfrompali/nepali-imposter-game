import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import wordBankData from '../../data/words.json'
import type { WordBank } from '../../types'

const wordBank = wordBankData as WordBank

export default function ResultScreen() {
  const { state, goTo } = useApp()
  const { t } = useLanguage()
  const { settings, round } = state

  if (!round) return null

  const category = wordBank.categories.find((c) => c.id === round.categoryId)
  const imposterNames = round.imposterIndices.map((idx) => settings.players[idx])

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 text-center">
      <div className="text-6xl">🎭</div>

      <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">
            {t.impostersWere}
          </p>
          <p className="text-2xl font-black text-red-400">
            {imposterNames.join(', ')}
          </p>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">
            {t.theWordWas}
          </p>
          <p className="text-3xl font-black text-white">{round.word}</p>
          <p className="text-sm text-gray-500 mt-1">
            {category?.label.en} / {category?.label.np}
          </p>
        </div>
      </div>

      <button
        onClick={() => goTo('settings')}
        className="px-10 py-4 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg"
      >
        {t.playAgain}
      </button>
    </div>
  )
}
