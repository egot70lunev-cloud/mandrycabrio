'use client';

import Image from 'next/image';
import { useState } from 'react';

type HeroImageProps = {
  priority?: boolean;
  className?: string;
};

export function HeroImage({ priority = true, className = '' }: HeroImageProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback to gradient if image fails to load - matches header gradient
  if (imageError) {
    return (
      <div className={`absolute inset-0 ${className}`} style={{
        background: 'radial-gradient(circle at top center, var(--navy-soft) 0%, var(--navy) 35%, var(--navy-deep) 70%)'
      }} />
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Background Image */}
      <Image
        src="/hero/hero.jpg"
        alt="Premium car rental in Tenerife - MandryCabrio"
        fill
        priority={priority}
        quality={85}
        className="object-cover"
        sizes="100vw"
        onError={() => setImageError(true)}
      />
      {/* Overlay for better text readability - matches header gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-soft)]/80 via-[var(--navy)]/70 to-[var(--navy-deep)]/90" />
    </div>
  );
}
