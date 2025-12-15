import { type CarCategory } from '@/data/cars';
import { calcTotalPrice } from '@/lib/pricing';
import { formatEUR } from '@/lib/format';
import { getAvailableCars } from '@/lib/searchCars';
import { Section, Card, Badge, Button } from '@/components/ui';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Car } from '@/data/cars';

import { generatePageMetadata } from '../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search Results - Car Rental in Tenerife',
  description: 'Find your perfect car rental in Tenerife. Browse available vehicles based on your search criteria.',
  path: '/search',
});

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'North Airport (TFN)',
  'south-airport-tfs': 'South Airport (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  'other': 'Other (by agreement)',
};

const categoryLabels: Record<CarCategory | 'any', string> = {
  any: 'Any',
  cabrio: 'Cabrio',
  suv: 'SUV',
  economy: 'Economy',
  ev: 'EV',
  motorcycle: 'Motorcycle',
  luxury: 'Luxury',
};

type SearchParams = {
  pickup?: string;
  dropoff?: string;
  from?: string;
  to?: string;
  cat?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  
  const pickup = params.pickup || 'north-airport-tfn';
  const dropoff = params.dropoff || 'north-airport-tfn';
  const fromISO = params.from;
  const toISO = params.to;
  const category = (params.cat as CarCategory | 'any') || 'any';

  // Validate dates and fetch available cars
  let fromDate: Date | null = null;
  let toDate: Date | null = null;
  let isValidDates = false;
  let days = 0;
  let availableCars: Car[] = [];
  let unavailableSlugs: string[] = [];
  let searchError: string | null = null;

  if (fromISO && toISO) {
    try {
      const result = await getAvailableCars({
        from: fromISO,
        to: toISO,
        cat: category,
      });
      
      availableCars = result.cars;
      unavailableSlugs = result.unavailableSlugs;
      
      fromDate = new Date(fromISO);
      toDate = new Date(toISO);
      isValidDates = true;
      days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    } catch (error) {
      searchError = error instanceof Error ? error.message : 'Invalid search parameters';
      console.error('Error fetching available cars:', error);
    }
  }

  // Calculate prices for each available car
  const carsWithPricing = availableCars.map((car) => {
    if (!isValidDates || !fromISO || !toISO) {
      return { car, pricing: null };
    }

    const pricing = calcTotalPrice(car, fromISO, toISO);
    return { car, pricing };
  });

  return (
    <>
      {/* Header */}
      <Section background="primary" padding="lg" className="border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-6">
            Search results
          </h1>

          {/* Search Summary */}
          {isValidDates && fromDate && toDate && (
            <div className="bg-white rounded-lg p-6 mb-6 border border-[#E5E5E5]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[#6B6B6B]">Pickup:</span>
                  <div className="font-medium text-[#2B2B2B] mt-1">
                    {locationLabels[pickup] || pickup}
                  </div>
                  <div className="text-[#6B6B6B] text-xs mt-1">
                    {formatDateTime(fromDate)}
                  </div>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">Dropoff:</span>
                  <div className="font-medium text-[#2B2B2B] mt-1">
                    {locationLabels[dropoff] || dropoff}
                  </div>
                  <div className="text-[#6B6B6B] text-xs mt-1">
                    {formatDateTime(toDate)}
                  </div>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">Duration:</span>
                  <div className="font-medium text-[#2B2B2B] mt-1">
                    {days} {days === 1 ? 'day' : 'days'}
                  </div>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">Category:</span>
                  <div className="font-medium text-[#2B2B2B] mt-1">
                    {categoryLabels[category]}
                  </div>
                </div>
              </div>
              
              {/* Edit Search Button */}
              <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                <Link href="/">
                  <Button variant="outline" size="md">
                    Edit search
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {searchError && (
            <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg p-6 mb-6">
              <p className="text-[var(--accent)] mb-4">
                {searchError}
              </p>
              <Link href="/">
                <Button variant="primary" size="md">
                  Back to search
                </Button>
              </Link>
            </div>
          )}

          {/* Invalid Dates Message */}
          {!isValidDates && !searchError && (
            <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg p-6 mb-6">
              <p className="text-[var(--accent)] mb-4">
                Invalid dates. Please check your search parameters.
              </p>
              <Link href="/">
                <Button variant="primary" size="md">
                  Back to search
                </Button>
              </Link>
            </div>
          )}

          {/* Debug Info (dev only) */}
          {process.env.NODE_ENV !== 'production' && isValidDates && (
            <div className="text-xs text-[#9B9B9B] mb-4 text-center">
              Found {availableCars.length} available cars ({unavailableSlugs.length} unavailable)
            </div>
          )}
        </div>
      </Section>

      {/* Results */}
      <Section background="primary" padding="lg">
        <div className="max-w-7xl mx-auto">
          {carsWithPricing.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#6B6B6B] mb-4">
                {isValidDates 
                  ? 'No cars available for these dates.' 
                  : 'No cars match your filters.'}
              </p>
              <Link href="/">
                <Button variant="outline">Modify search</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsWithPricing.map(({ car, pricing }) => {
                const displaySpecs = car.specs.slice(0, 5);

                return (
                  <Card key={car.id} className="flex flex-col h-full">
                    {/* Image Placeholder */}
                    <div
                      className="w-full h-48 bg-[#F5F5F5] rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                      role="img"
                      aria-label={`${car.name} - Image placeholder`}
                    >
                      <div className="text-[#9B9B9B] text-sm">Image placeholder</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <Badge variant="amber">
                          {categoryLabels[car.category]}
                        </Badge>
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3 line-clamp-2">
                        {car.name}
                      </h3>

                      {/* Specs */}
                      <ul className="space-y-1 mb-4 flex-1">
                        {displaySpecs.map((spec, index) => (
                          <li key={index} className="text-sm text-[#6B6B6B]">
                            • {spec}
                          </li>
                        ))}
                      </ul>

                      {/* Pricing & Deposit */}
                      <div className="border-t border-[#E5E5E5] pt-4 mb-4 space-y-2">
                        {pricing && pricing.total !== null ? (
                          <>
                            <div className="text-lg font-semibold text-[#2B2B2B]">
                              Estimated total: {formatEUR(pricing.total)}
                            </div>
                            {pricing.dailyRate !== null && (
                              <div className="text-sm text-[#6B6B6B]">
                                ({formatEUR(pricing.dailyRate)}/day, {pricing.days} {pricing.days === 1 ? 'day' : 'days'})
                              </div>
                            )}
                            {pricing.monthPrice !== null && pricing.days >= 28 && (
                              <div className="text-sm font-medium text-[#2B2B2B] mt-2">
                                Monthly: {formatEUR(pricing.monthPrice)}
                              </div>
                            )}
                            {pricing.onRequestMonth && (
                              <div className="text-sm font-medium text-[#6B6B6B] mt-2 italic">
                                Monthly price on request
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-lg font-semibold text-[#6B6B6B]">
                            Price on request
                          </div>
                        )}
                        <div className="text-sm text-[#6B6B6B]">
                          Deposit: {formatEUR(car.deposit)}
                        </div>
                      </div>

                      {/* Book Button */}
                      {isValidDates && fromISO && toISO && (
                        <Link
                          href={`/booking?car=${car.slug}&from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&source=search`}
                          className="block"
                        >
                          <Button variant="primary" size="md" className="w-full">
                            Book
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

