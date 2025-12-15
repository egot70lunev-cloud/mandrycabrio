'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { t, getLocaleFromPathname } from '@/lib/i18n';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--navy-950)] text-[var(--text)] border-t border-[var(--border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${currentLocale}`} className="inline-block mb-4">
              <Image
                src="/logo/logo.png"
                alt={`${t('common.siteName', currentLocale)} - Premium Car Rental in Tenerife`}
                width={160}
                height={44}
                className="h-11 w-auto brightness-0 invert"
                sizes="160px"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="text-[var(--text-muted)] text-sm">
              {t('common.tagline', currentLocale)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text)]">
              {currentLocale === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/cars`}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
                >
                  {t('nav.cars', currentLocale)}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/terms`}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
                >
                  {currentLocale === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
                >
                  {t('nav.contact', currentLocale)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text)]">
              {currentLocale === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm">
              <li>Email: info@mandrycabrio.com</li>
              <li>Phone: +34 692 735 125</li>
              <li>
                <a
                  href="https://wa.me/34692735125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] transition-colors duration-200"
                >
                  {t('nav.whatsapp', currentLocale)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--text-muted)] text-sm">
              © {currentYear} {t('common.siteName', currentLocale)}. {currentLocale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href={`/${currentLocale}/terms`}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
              >
                {currentLocale === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
              </Link>
              <Link
                href={`/${currentLocale}/terms`}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 text-sm"
              >
                {currentLocale === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

