import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export default function HomeScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()
  const { canInstall, isIOS, install } = useInstallPrompt()
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  async function handleInstall() {
    if (canInstall) {
      await install()
    } else if (isIOS) {
      setShowIOSGuide(true)
    }
  }

  const showInstallButton = canInstall || isIOS

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-violet-700/25 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs">
        <div className="text-center flex flex-col items-center gap-5">
          <div className="w-44 h-44 rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-900/50">
            <img
              src={`${import.meta.env.BASE_URL}logo.webp`}
              alt="Nepali imposter mascot"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              {t.appTitle}
            </h2>
            <p className="text-red-400/80 text-base font-bold tracking-wide mt-3">
              धोकेबाज हौ तिमी?
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => goTo('settings')}
            className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all"
          >
            {t.startGame}
          </button>

          {showInstallButton && (
            <button
              onClick={handleInstall}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white text-xs font-semibold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v12" />
                <path d="m6 12 6 6 6-6" />
                <path d="M5 21h14" />
              </svg>
              <span>{t.installApp}</span>
            </button>
          )}
        </div>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            role="dialog"
            aria-label={t.iosInstallTitle}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-br from-[#1a1530] to-[#0f0d1f] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/60 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{t.iosInstallTitle}</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/10 text-white/60 hover:text-white text-lg flex items-center justify-center active:scale-95 transition-all"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-white/70 leading-relaxed">{t.iosInstallIntro}</p>

            <ol className="space-y-3">
              {[t.iosInstallStep1, t.iosInstallStep2, t.iosInstallStep3].map((step, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/85 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black active:scale-95 transition-all"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
