import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
      <h1 className="text-lg font-bold text-white">{t.appTitle}</h1>
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
      >
        {language === 'en' ? 'नेपाली' : 'English'}
      </button>
    </header>
  )
}
