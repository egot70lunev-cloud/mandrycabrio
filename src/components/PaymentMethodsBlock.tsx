import { Badge } from './ui';

type PaymentMethodsBlockProps = {
  variant?: 'default' | 'compact';
  showTitle?: boolean;
};

export function PaymentMethodsBlock({ variant = 'default', showTitle = true }: PaymentMethodsBlockProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'pt-4 border-t border-[#E5E5E5]' : ''}>
      {showTitle && (
        <h3 className={`${isCompact ? 'text-base' : 'text-2xl md:text-3xl'} font-semibold text-[#2B2B2B] mb-2 ${isCompact ? '' : 'text-center'}`}>
          Payment Methods Accepted
        </h3>
      )}
      {!isCompact && (
        <p className="text-sm md:text-base text-[#6B6B6B] max-w-2xl mx-auto text-center mb-6">
          To confirm a booking, a €100 prepayment is required. The remaining rental fee and deposit are paid on pickup.
        </p>
      )}
      {isCompact && (
        <p className="text-xs text-[#6B6B6B] mb-3">
          To confirm your booking, a €100 prepayment is required. The remaining rental fee and deposit are paid on pickup.
        </p>
      )}
      
      <div className={`flex flex-wrap items-center ${isCompact ? 'gap-2' : 'gap-3 md:gap-4 justify-center'}`}>
        {/* Cash */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Cash</span>
          {!isCompact && <span className="text-xs text-[#9B9B9B]">(on pickup)</span>}
        </Badge>

        {/* Bank Transfer */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Bank Transfer</span>
          {!isCompact && <span className="text-xs text-[#9B9B9B]">(Santander / BBVA / Caixa)</span>}
        </Badge>

        {/* USDT */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>USDT</span>
          {!isCompact && <span className="text-xs text-[#9B9B9B]">(crypto)</span>}
        </Badge>

        {/* Privat24 / Monobank */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Privat24 / Monobank</span>
          {!isCompact && <span className="text-xs text-[#9B9B9B]">(UAH)</span>}
        </Badge>

        {/* Apple Pay */}
        <Badge variant="outline" className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} flex items-center gap-1.5`}>
          <svg className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Apple Pay</span>
          {!isCompact && <span className="text-xs text-[#9B9B9B]">(on request)</span>}
        </Badge>
      </div>
    </div>
  );
}



