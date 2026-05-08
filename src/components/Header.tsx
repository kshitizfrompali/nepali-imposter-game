import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="flex justify-end px-4 pt-4 pb-1 flex-shrink-0">
      <button
        onClick={toggleLanguage}
        aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
        className="min-h-[44px] min-w-[44px] px-4 text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10 active:scale-95"
      >
        {language === 'en' ? 'नेपाली' : 'EN'}
      </button>
    </header>
  )
}
