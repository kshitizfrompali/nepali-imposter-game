import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function DiscussionScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs text-center">
        <div className="w-28 h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
          <span className="text-6xl">💬</span>
        </div>
        <p className="text-2xl font-bold text-white leading-snug">
          {t.discussNow}
        </p>
        <button
          onClick={() => goTo('result')}
          className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-2xl shadow-red-900/60 active:scale-95 transition-all"
        >
          {t.revealImposters}
        </button>
      </div>
    </div>
  )
}
