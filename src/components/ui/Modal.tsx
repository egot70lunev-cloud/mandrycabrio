'use client';

import { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onAgree?: () => void;
  showAgreeButton?: boolean;
  footerContent?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, onAgree, showAgreeButton = false, footerContent }: ModalProps) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[var(--surface)] rounded-none md:rounded-xl shadow-2xl max-w-4xl w-full h-full md:h-auto md:max-h-[90vh] flex flex-col animate-fade-in-up border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--border)]">
          <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-[var(--text)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 -mr-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 text-[var(--text)]">
          {children}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 md:p-6 border-t border-[var(--border)]">
          {footerContent && (
            <div className="flex items-center">
              {footerContent}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 ml-auto">
            {showAgreeButton && onAgree && (
              <Button variant="primary" onClick={onAgree} className="w-full sm:w-auto">
                I agree
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

