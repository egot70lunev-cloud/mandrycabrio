'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getLocaleFromPathname } from '@/lib/i18n';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/locales';
import { getLocalizedPathOrHome } from '@/lib/i18n/paths';

const languages = locales.map((code) => ({
  code,
  flag: localeFlags[code],
  name: localeNames[code],
}));

function LanguageSwitcherContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = getLocaleFromPathname(pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close mobile dropdown when pathname changes (navigation occurred)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);
  
  // Build query string if search params exist
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : '';

  const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <>
      {/* Desktop: Inline display */}
      <div className="hidden md:flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = lang.code === currentLocale;
          const targetPath = getLocalizedPathOrHome(pathname, lang.code) + querySuffix;
          
          return (
            <Link
              key={lang.code}
              href={targetPath}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-[var(--accent)] text-[var(--navy-950)] shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-hover)]'
                }
              `}
              aria-label={`Switch to ${lang.name}`}
              title={lang.name}
            >
              <span className="mr-1">{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="px-2 py-1 rounded text-xs font-medium bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--border)] flex items-center gap-1 transition-all duration-200 hover:bg-[var(--surface-hover)]"
          aria-label="Select language"
          aria-expanded={isMobileOpen}
        >
          <span>{currentLang.flag}</span>
          <span>{currentLocale.toUpperCase()}</span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isMobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 bg-[var(--surface)] rounded-lg shadow-lg border border-[var(--border)] py-2 min-w-[140px] z-[60]">
              {languages.map((lang) => {
                const isActive = lang.code === currentLocale;
                const targetPath = getLocalizedPathOrHome(pathname, lang.code) + querySuffix;
                
                return (
                  <Link
                    key={lang.code}
                    href={targetPath}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      block px-4 py-2 text-sm transition-colors duration-200
                      ${isActive 
                        ? 'bg-[var(--surface-hover)] text-[var(--accent)] font-medium' 
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]'
                      }
                    `}
                    aria-label={`Switch to ${lang.name}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                    {isActive && (
                      <span className="ml-2 text-[var(--accent)]">✓</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function LanguageSwitcher() {
  return (
    <Suspense fallback={
      <div className="hidden md:flex items-center gap-1">
        <div className="px-2 py-1 rounded text-xs font-medium bg-[var(--surface-2)] text-[var(--text-muted)]">EN</div>
      </div>
    }>
      <LanguageSwitcherContent />
    </Suspense>
  );
}

