import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function DiscussionScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 text-center">
      <div className="text-6xl">💬</div>
      <p className="text-xl font-semibold text-white leading-relaxed max-w-sm">
        {t.discussNow}
      </p>
      <button
        onClick={() => goTo('result')}
        className="px-10 py-5 text-xl font-bold rounded-2xl bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg"
      >
        {t.revealImposters}
      </button>
    </div>
  )
}
