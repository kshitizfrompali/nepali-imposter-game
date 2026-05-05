import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations } from '../i18n/translations'
import type { Language } from '../types'

interface LanguageContextValue {
  language: Language
  toggleLanguage: () => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export { LanguageContext }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'en' ? 'np' : 'en'))
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
