import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function HomeScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-violet-700/25 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xs">
        <div className="text-center flex flex-col items-center gap-5">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center shadow-2xl shadow-violet-900/50">
            <span className="text-6xl">🎭</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              {t.appTitle}
            </h2>
            <p className="text-white/55 text-xs font-semibold tracking-[0.2em] uppercase mt-2">
              Spyfall · Nepali Edition
            </p>
          </div>
        </div>

        <button
          onClick={() => goTo('settings')}
          className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all"
        >
          {t.startGame}
        </button>
      </div>
    </div>
  )
}
