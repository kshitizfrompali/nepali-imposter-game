import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="flex justify-end px-4 pt-4 pb-1 flex-shrink-0">
      <button
        type="button"
        role="switch"
        aria-checked={language === 'np'}
        aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
        onClick={toggleLanguage}
        className="relative h-9 w-[88px] rounded-full bg-white/10 border border-white/10 active:scale-95 transition-all overflow-hidden"
      >
        <span
          className={`absolute top-1 bottom-1 w-[42px] rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-900/40 transition-all duration-300 ${
            language === 'np' ? 'left-[44px]' : 'left-1'
          }`}
        />
        <div className="relative z-10 grid grid-cols-2 h-full items-center text-xs font-bold pointer-events-none">
          <span className={language === 'en' ? 'text-white' : 'text-white/50'}>EN</span>
          <span className={language === 'np' ? 'text-white' : 'text-white/50'}>नेप</span>
        </div>
      </button>
    </header>
  )
}
