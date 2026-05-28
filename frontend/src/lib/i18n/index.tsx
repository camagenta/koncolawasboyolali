'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import id from './id.json'
import en from './en.json'

type Lang = 'id' | 'en'

const translations: Record<Lang, Record<string, string>> = { id, en }

function getNestedValue(obj: Record<string, string>, key: string): string {
  return obj[key] || key
}

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('id')

  const t = useCallback((key: string) => getNestedValue(translations[lang], key), [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useTranslation must be used within I18nProvider')
  return context
}
