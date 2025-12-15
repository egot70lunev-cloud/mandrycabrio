import { type CarCategory } from '@/data/cars';
import { calcTotalPrice } from '@/lib/pricing';
import { formatEUR } from '@/lib/format';
import { getAvailableCars } from '@/lib/searchCars';
import { Section, Card, Badge, Button } from '@/components/ui';
import { CarImage } from '@/components/CarImage';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Car } from '@/data/cars';

import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Resultados de Búsqueda - Alquiler de Coches en Tenerife',
  description: 'Encuentra tu coche de alquiler perfecto en Tenerife. Explora vehículos disponibles según tus criterios de búsqueda.',
  path: '/es/search',
  locale: 'es',
});

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'Aeropuerto Norte (TFN)',
  'south-airport-tfs': 'Aeropuerto Sur (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  'other': 'Otro (bajo acuerdo)',
};

const categoryLabels: Record<CarCategory | 'any', string> = {
  any: 'Cualquiera',
  cabrio: 'Cabrio',
  suv: 'SUV',
  economy: 'Económico',
  ev: 'Eléctrico',
  motorcycle: 'Motocicleta',
  luxury: 'Lujo',
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
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('es-ES', {
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
      searchError = error instanceof Error ? error.message : 'Parámetros de búsqueda inválidos';
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
      <Section background="primary" padding="lg" className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
            Resultados de búsqueda
          </h1>

          {/* Search Summary */}
          {isValidDates && fromDate && toDate && (
            <div className="bg-[var(--surface)] rounded-lg p-6 mb-6 border border-[var(--border)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-muted)]">Recogida:</span>
                  <div className="font-medium text-[var(--text)] mt-1">
                    {locationLabels[pickup] || pickup}
                  </div>
                  <div className="text-[var(--text-muted)] text-xs mt-1">
                    {formatDateTime(fromDate)}
                  </div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Devolución:</span>
                  <div className="font-medium text-[var(--text)] mt-1">
                    {locationLabels[dropoff] || dropoff}
                  </div>
                  <div className="text-[var(--text-muted)] text-xs mt-1">
                    {formatDateTime(toDate)}
                  </div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Duración:</span>
                  <div className="font-medium text-[var(--text)] mt-1">
                    {days} {days === 1 ? 'día' : 'días'}
                  </div>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Categoría:</span>
                  <div className="font-medium text-[var(--text)] mt-1">
                    {categoryLabels[category]}
                  </div>
                </div>
              </div>
              
              {/* Edit Search Button */}
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <Link href="/es">
                  <Button variant="outline" size="md">
                    Modificar búsqueda
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
              <Link href="/es">
                <Button variant="primary" size="md">
                  Volver a búsqueda
                </Button>
              </Link>
            </div>
          )}

          {/* Invalid Dates Message */}
          {!isValidDates && !searchError && (
            <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg p-6 mb-6">
              <p className="text-[var(--accent)] mb-4">
                Fechas inválidas. Por favor, verifica tus parámetros de búsqueda.
              </p>
              <Link href="/es">
                <Button variant="primary" size="md">
                  Volver a búsqueda
                </Button>
              </Link>
            </div>
          )}

          {/* Debug Info (dev only) */}
          {process.env.NODE_ENV !== 'production' && isValidDates && (
            <div className="text-xs text-[#9B9B9B] mb-4 text-center">
              Encontrados {availableCars.length} coches disponibles ({unavailableSlugs.length} no disponibles)
            </div>
          )}
        </div>
      </Section>

      {/* Results */}
      <Section background="primary" padding="lg">
        <div className="max-w-7xl mx-auto">
          {carsWithPricing.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[var(--text-muted)] mb-4">
                {isValidDates 
                  ? 'No hay coches disponibles para estas fechas.' 
                  : 'No hay coches que coincidan con tus filtros.'}
              </p>
              <Link href="/es">
                <Button variant="outline">Modificar búsqueda</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsWithPricing.map(({ car, pricing }) => {
                const displaySpecs = car.specs.slice(0, 5);

                return (
                  <Card key={car.id} className="flex flex-col h-full">
                    {/* Car Image */}
                    <div className="w-full h-48 rounded-lg mb-4 overflow-hidden relative bg-[#F5F5F5]">
                      <CarImage
                        car={car}
                        locale="es"
                        imageIndex={1}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
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
                      <h3 className="text-xl font-semibold text-[var(--text)] mb-3 line-clamp-2">
                        {car.name}
                      </h3>

                      {/* Specs */}
                      <ul className="space-y-1 mb-4 flex-1">
                        {displaySpecs.map((spec, index) => (
                          <li key={index} className="text-sm text-[var(--text-muted)]">
                            • {spec}
                          </li>
                        ))}
                      </ul>

                      {/* Pricing & Deposit */}
                      <div className="border-t border-[var(--border)] pt-4 mb-4 space-y-2">
                        {pricing && pricing.total !== null ? (
                          <>
                            <div className="text-lg font-semibold text-[var(--text)]">
                              Total estimado: {formatEUR(pricing.total)}
                            </div>
                            {pricing.dailyRate !== null && (
                              <div className="text-sm text-[var(--text-muted)]">
                                ({formatEUR(pricing.dailyRate)}/día, {pricing.days} {pricing.days === 1 ? 'día' : 'días'})
                              </div>
                            )}
                            {pricing.monthPrice !== null && pricing.days >= 28 && (
                              <div className="text-sm font-medium text-[var(--text)] mt-2">
                                Mensual: {formatEUR(pricing.monthPrice)}
                              </div>
                            )}
                            {pricing.onRequestMonth && (
                              <div className="text-sm font-medium text-[var(--text-muted)] mt-2 italic">
                                Precio mensual bajo consulta
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-lg font-semibold text-[var(--text-muted)]">
                            Precio bajo consulta
                          </div>
                        )}
                        <div className="text-sm text-[var(--text-muted)]">
                          Depósito: {formatEUR(car.deposit)}
                        </div>
                      </div>

                      {/* Book Button */}
                      {isValidDates && fromISO && toISO && (
                        <Link
                          href={`/es/booking?car=${car.slug}&from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&source=search`}
                          className="block"
                        >
                          <Button variant="primary" size="md" className="w-full">
                            Reservar
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

