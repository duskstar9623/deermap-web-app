import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/shared/Icon';
import useI18n from '@/hooks/useI18n';
import { LANGUAGES } from '@/constants/const';
import type { Language } from '@/types/common';

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  const current = LANGUAGES[currentLanguage];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Switch currentLanguage"
        aria-expanded={open}
      >
        <Icon name="globe" size={16} />
        <span>{current.shortLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          {(Object.keys(LANGUAGES) as Language[]).map(code => (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLanguage === code ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'
              }`}
            >
              {LANGUAGES[code].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
