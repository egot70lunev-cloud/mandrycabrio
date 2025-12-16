'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, Button } from './ui';
import type { CarCategory } from '@/data/cars';
import { t, getLocaleFromPathname, type Locale } from '@/lib/i18n';

function getLocations(locale: Locale): Array<{ value: string; label: string }> {
  return [
    { value: 'north-airport-tfn', label: t('locations.northAirportTfn', locale) },
    { value: 'south-airport-tfs', label: t('locations.southAirportTfs', locale) },
    { value: 'puerto-de-la-cruz', label: t('locations.puertoDeLaCruz', locale) },
    { value: 'santa-cruz', label: t('locations.santaCruz', locale) },
    { value: 'los-cristianos', label: t('locations.losCristianos', locale) },
    { value: 'other', label: t('locations.other', locale) },
  ];
}

function getCategories(locale: Locale): Array<{ value: CarCategory | 'any'; label: string }> {
  return [
    { value: 'any', label: t('form.any', locale) },
    { value: 'cabrio', label: t('cars.category.cabrio', locale) },
    { value: 'suv', label: t('cars.category.suv', locale) },
    { value: 'economy', label: t('cars.category.economy', locale) },
    { value: 'ev', label: t('cars.category.ev', locale) },
    { value: 'motorcycle', label: t('cars.category.motorcycle', locale) },
  ];
}

function getDefaultDateTime(daysOffset: number): { date: string; time: string } {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(10, 0, 0, 0);
  
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = '10:00';
  
  return { date: dateStr, time: timeStr };
}

function SearchWidgetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Detect locale from pathname
  const locale = getLocaleFromPathname(pathname);
  
  // Initialize from URL params or defaults
  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('pickup') || 'north-airport-tfn'
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    searchParams.get('dropoff') || 'north-airport-tfn'
  );
  
  const defaultPickup = getDefaultDateTime(1);
  const defaultReturn = getDefaultDateTime(4);
  
  const [pickupDate, setPickupDate] = useState(
    searchParams.get('from') 
      ? new Date(searchParams.get('from')!).toISOString().split('T')[0]
      : defaultPickup.date
  );
  const [pickupTime, setPickupTime] = useState(
    searchParams.get('from')
      ? new Date(searchParams.get('from')!).toTimeString().slice(0, 5)
      : defaultPickup.time
  );
  const [returnDate, setReturnDate] = useState(
    searchParams.get('to')
      ? new Date(searchParams.get('to')!).toISOString().split('T')[0]
      : defaultReturn.date
  );
  const [returnTime, setReturnTime] = useState(
    searchParams.get('to')
      ? new Date(searchParams.get('to')!).toTimeString().slice(0, 5)
      : defaultReturn.time
  );
  
  const [category, setCategory] = useState<CarCategory | 'any'>(
    (searchParams.get('cat') as CarCategory | 'any') || 'any'
  );
  
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Build datetime strings
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime}`);

    // Validation
    if (returnDateTime <= pickupDateTime) {
      setError(t('form.returnAfterPickup', locale));
      return;
    }

    // Build query params
    const params = new URLSearchParams();
    params.set('pickup', pickupLocation);
    params.set('dropoff', dropoffLocation);
    params.set('from', pickupDateTime.toISOString());
    params.set('to', returnDateTime.toISOString());
    params.set('cat', category);

    // Navigate to search page with correct locale
    router.push(`/${locale}/search?${params.toString()}`);
  };

  const locations = getLocations(locale);
  const categories = getCategories(locale);

  return (
    <div className="bg-transparent">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">
        {t('search.title', locale)}
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <Select
            label={t('form.pickupLocation', locale)}
            options={locations}
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />

          {/* Dropoff Location */}
          <Select
            label={t('form.dropoffLocation', locale)}
            options={locations}
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          />

          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              {t('form.pickupDate', locale)}
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
              required
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              {t('form.pickupTime', locale)}
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
              required
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              {t('form.returnDate', locale)}
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
              required
            />
          </div>

          {/* Return Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              {t('form.returnTime', locale)}
            </label>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
              required
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <Select
              label={t('form.category', locale)}
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value as CarCategory | 'any')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full"
        >
          {t('form.search', locale)}
        </Button>
      </form>
    </div>
  );
}

export function SearchWidget() {
  return (
    <Suspense fallback={
      <div className="bg-[var(--surface)] rounded-xl p-6 md:p-8 border border-[var(--border)]">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">
          {t('search.title', 'en')}
        </h2>
        <div className="text-[var(--text-muted)]">{t('form.loading', 'en')}</div>
      </div>
    }>
      <SearchWidgetContent />
    </Suspense>
  );
}

