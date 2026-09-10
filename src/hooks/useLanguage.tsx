import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  SupportedLanguage, 
  LanguageOption,
  UITranslations, 
  SUPPORTED_LANGUAGES,
  getTranslations, 
  getSavedLanguage, 
  saveLanguage,
  t as rawT
} from '../lib/language-store';

interface LanguageContextValue {
  /** Active language code e.g. 'en' | 'zu' | 'xh' | 'af' | 'tn' | 'nso' */
  lang: SupportedLanguage;
  /** Full LanguageOption object for the active language */
  currentLang: LanguageOption;
  /** Change the active language and persist to localStorage */
  setLang: (code: SupportedLanguage) => void;
  /** Flat translation object for the active language */
  tr: UITranslations;
  /** Shorthand translate function — t('key', { var: value }) */
  t: (key: keyof UITranslations, vars?: Record<string, string | number>) => string;
  /** The AI-prompt language name string, e.g. 'English', 'Zulu', 'Afrikaans' */
  aiLangName: string;
  /** All supported languages — single source of truth for any language picker */
  allLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(getSavedLanguage);

  const setLang = useCallback((code: SupportedLanguage) => {
    setLangState(code);
    saveLanguage(code);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === lang) ?? SUPPORTED_LANGUAGES[0];
  const tr = getTranslations(lang);
  const aiLangName = currentLang.aiLangName;

  const tFn = useCallback(
    (key: keyof UITranslations, vars?: Record<string, string | number>) => rawT(lang, key, vars),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{
      lang,
      currentLang,
      setLang,
      tr,
      t: tFn,
      aiLangName,
      allLanguages: SUPPORTED_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
