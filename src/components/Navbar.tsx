'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui';
import { t, getLocaleFromPathname } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (ticking.current) return;
      
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Always show header at top of page
        if (currentScrollY < 20) {
          setIsVisible(true);
          setIsScrolled(false);
        } else {
          setIsScrolled(true);
          
          // Hide on scroll down, show on scroll up
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          }
        }
        
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/34692735125', '_blank');
  };

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 250ms ease-in-out',
        willChange: 'transform',
        background: 'radial-gradient(circle at top center, var(--navy-soft) 0%, var(--navy) 35%, var(--navy-deep) 70%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Large Centered Logo */}
        <div className="flex justify-center py-3 md:py-4">
          <Link
            href="/en"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <div className="h-[100px] md:h-[160px] w-auto">
              <Image
                src="/logo/logo.png"
                alt={`${t('common.siteName', currentLocale)} - Premium Car Rental in Tenerife`}
                width={700}
                height={200}
                priority
                className="h-[100px] md:h-[160px] w-auto"
                sizes="(max-width: 768px) 70vw, 420px"
                style={{ objectFit: 'contain', background: 'transparent' }}
              />
            </div>
          </Link>
        </div>

        {/* Row 2: Navigation Bar */}
        <div className="border-t border-[var(--border)]/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 md:py-3 gap-2 md:gap-0">
            {/* Left/Center: Navigation Links */}
            <div className="flex items-center justify-center md:justify-start space-x-1 md:space-x-6">
              <Link
                href={`/${currentLocale}/cars`}
                className="text-[var(--text)] font-medium text-sm md:text-base px-3 py-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
              >
                {t('nav.cars', currentLocale)}
              </Link>
              <span className="text-[var(--border)] hidden md:inline">|</span>
              <Link
                href={`/${currentLocale}/terms`}
                className="text-[var(--text)] font-medium text-sm md:text-base px-3 py-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
              >
                {t('nav.terms', currentLocale)}
              </Link>
              <span className="text-[var(--border)] hidden md:inline">|</span>
              <Link
                href={`/${currentLocale}/contact`}
                className="text-[var(--text)] font-medium text-sm md:text-base px-3 py-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
              >
                {t('nav.contact', currentLocale)}
              </Link>
            </div>

            {/* Right: WhatsApp + Language Switcher */}
            <div className="flex items-center justify-center md:justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleWhatsAppClick}
                className="text-sm md:text-base"
              >
                {t('nav.whatsapp', currentLocale)}
              </Button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

