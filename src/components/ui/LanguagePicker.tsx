import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/language-store';
import { useLanguage } from '../../hooks/useLanguage';

export default function LanguagePicker() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find(l => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-sm cursor-pointer"
        aria-label="Select language"
        title={`Language: ${current.name}`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span className="hidden sm:inline max-w-[64px] truncate">{current.name}</span>
        <span className="sm:hidden font-bold text-[10px] text-blue-600">{current.shortCode}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              🇿🇦 Official SA Language
            </p>
          </div>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map(language => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleSelect(language.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                  lang === language.code
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className="text-base leading-none">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {lang === language.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
