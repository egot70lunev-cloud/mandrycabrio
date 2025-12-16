'use client';

import { usePathname } from 'next/navigation';
import { Badge } from './ui';
import { t, getLocaleFromPathname } from '@/lib/i18n';

type PaymentMethodsBlockProps = {
  variant?: 'default' | 'compact';
  showTitle?: boolean;
};

export function PaymentMethodsBlock({ variant = 'default', showTitle = true }: PaymentMethodsBlockProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'pt-4 border-t border-[var(--border)]' : ''}>
      {showTitle && (
        <h3 className={`${isCompact ? 'text-base' : 'text-2xl md:text-3xl'} font-semibold text-[var(--text)] mb-2 ${isCompact ? '' : 'text-center'}`}>
          {t('payment.title', locale)}
        </h3>
      )}
      {!isCompact && (
        <p className="text-sm md:text-base text-[var(--text-muted)] max-w-2xl mx-auto text-center mb-6">
          {t('payment.description', locale)}
        </p>
      )}
      {isCompact && (
        <p className="text-xs text-[var(--text-muted)] mb-3">
          {t('payment.descriptionCompact', locale)}
        </p>
      )}
      
      <div className={`flex flex-wrap items-center ${isCompact ? 'gap-2' : 'gap-3 md:gap-4 justify-center'}`}>
        {/* Cash */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{t('payment.methods.cash', locale)}</span>
          {!isCompact && <span className="text-xs text-[var(--text-muted)]">{t('payment.methods.cashOnPickup', locale)}</span>}
        </Badge>

        {/* Bank Transfer */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{t('payment.methods.bankTransfer', locale)}</span>
          {!isCompact && <span className="text-xs text-[var(--text-muted)]">{t('payment.methods.bankTransferBanks', locale)}</span>}
        </Badge>

        {/* USDT */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{t('payment.methods.usdt', locale)}</span>
          {!isCompact && <span className="text-xs text-[var(--text-muted)]">{t('payment.methods.usdtCrypto', locale)}</span>}
        </Badge>

        {/* Privat24 / Monobank */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>{t('payment.methods.privat24Monobank', locale)}</span>
          {!isCompact && <span className="text-xs text-[var(--text-muted)]">{t('payment.methods.privat24MonobankUah', locale)}</span>}
        </Badge>

        {/* Apple Pay */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{t('payment.methods.applePay', locale)}</span>
          {!isCompact && <span className="text-xs text-[var(--text-muted)]">{t('payment.methods.applePayOnRequest', locale)}</span>}
        </Badge>
      </div>
    </div>
  );
}
