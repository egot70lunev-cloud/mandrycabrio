'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getCarImageAlt, getCarImageSrc, type Locale } from '@/lib/imageAlt';
import type { Car } from '@/data/cars';

type CarImageProps = {
  car: Car;
  locale?: Locale;
  imageIndex?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function CarImage({
  car,
  locale = 'en',
  imageIndex = 1,
  priority = false,
  className = '',
  sizes,
  fill,
  width,
  height,
}: CarImageProps) {
  const [imageError, setImageError] = useState(false);
  const src = getCarImageSrc(car.slug, imageIndex);
  const alt = getCarImageAlt(car.name, car.category, locale);

  // Default sizes for responsive images
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  // Fallback placeholder if image fails to load
  if (imageError) {
    return (
      <div className={`${fill ? 'absolute inset-0' : ''} bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] flex items-center justify-center ${className}`} style={fill ? {} : { width: width || 800, height: height || 600 }}>
        <div className="text-[var(--text-muted)] text-sm text-center px-4">
          {car.name}
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={defaultSizes}
        quality={85}
        style={{ objectFit: 'cover' }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      sizes={defaultSizes}
      quality={85}
      onError={() => setImageError(true)}
    />
  );
}
