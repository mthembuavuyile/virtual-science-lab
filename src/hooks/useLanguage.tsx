import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  SupportedLanguage, 
  UITranslations, 
  getTranslations, 
  getSavedLanguage, 
  saveLanguage,
  t as rawT
} from '../lib/language-store';

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (code: SupportedLanguage) => void;
  tr: UITranslations;
  t: (key: keyof UITranslations, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(getSavedLanguage);

  const setLang = useCallback((code: SupportedLanguage) => {
    setLangState(code);
    saveLanguage(code);
  }, []);

  const tr = getTranslations(lang);

  const tFn = useCallback(
    (key: keyof UITranslations, vars?: Record<string, string | number>) => rawT(lang, key, vars),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr, t: tFn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
