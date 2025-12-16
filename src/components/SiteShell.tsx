/**
 * SiteShell - Shared layout wrapper for all locales
 * Applies the Mandry theme (navy background + gold accents + header gradient)
 * consistently across all language routes
 */

import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { Locale } from '@/lib/i18n/locales';

interface SiteShellProps {
  children: React.ReactNode;
  locale?: Locale;
}

export function SiteShell({ children, locale = 'en' }: SiteShellProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--navy-deep)]">
        {children}
      </main>
      <Footer />
    </>
  );
}


