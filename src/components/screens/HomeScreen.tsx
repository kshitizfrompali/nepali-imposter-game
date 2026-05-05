import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function HomeScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎭</div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.appTitle}</h2>
        <p className="text-gray-400 text-sm">Spyfall · Nepali Edition</p>
      </div>
      <button
        onClick={() => goTo('settings')}
        className="px-8 py-4 text-xl font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg"
      >
        {t.startGame}
      </button>
    </div>
  )
}
