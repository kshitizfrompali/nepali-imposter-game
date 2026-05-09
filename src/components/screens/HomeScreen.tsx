import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'

export default function HomeScreen() {
  const { goTo } = useApp()
  const { t } = useLanguage()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-violet-700/25 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => setShowInfo(true)}
        aria-label={t.howToPlay}
        className="absolute top-3 right-3 z-20 min-h-[44px] px-4 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold tracking-wide border border-white/10 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <span aria-hidden="true">ⓘ</span>
        <span>{t.howToPlay}</span>
      </button>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xs">
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

        <button
          onClick={() => goTo('settings')}
          className="w-full py-5 text-xl font-black rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/60 active:scale-95 transition-all"
        >
          {t.startGame}
        </button>
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInfo(false)}
        >
          <div
            role="dialog"
            aria-label={t.gameModes}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-br from-[#1a1530] to-[#0f0d1f] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/60 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{t.gameModes}</h3>
              <button
                onClick={() => setShowInfo(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/10 text-white/60 hover:text-white text-lg flex items-center justify-center active:scale-95 transition-all"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-violet-500/20 rounded-2xl p-4">
                <p className="text-xs font-black text-violet-300 uppercase tracking-widest mb-2">
                  {t.classicMode}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {t.classicDescription}
                </p>
              </div>

              <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4">
                <p className="text-xs font-black text-amber-300 uppercase tracking-widest mb-2">
                  {t.wordWolfMode}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {t.wordWolfDescription}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
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
