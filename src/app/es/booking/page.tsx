'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { cars } from '@/data/cars';
import { calcTotalPrice } from '@/lib/pricing';
import { formatEUR } from '@/lib/format';
import { parseBookingQuery, isCompleteBookingQuery, buildBookingUrl, type BookingQuery } from '@/lib/bookingQuery';
import { calcExtras, type ExtrasSummary } from '@/lib/extras';
import { extras, type ExtraId } from '@/data/extras';
import { Section, Card, Button, Input, Badge } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import type { Car } from '@/data/cars';
// Note: Metadata for client components is handled via layout.tsx or parent server component

const locationLabels: Record<string, string> = {
  'north-airport-tfn': 'Aeropuerto Norte (TFN)',
  'south-airport-tfs': 'Aeropuerto Sur (TFS)',
  'puerto-de-la-cruz': 'Puerto de la Cruz',
  'santa-cruz': 'Santa Cruz',
  'los-cristianos': 'Los Cristianos',
  'other': 'Otro (bajo acuerdo)',
};

type BookingState = 'idle' | 'loading' | 'success' | 'error';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = parseBookingQuery(Object.fromEntries(searchParams.entries()));
  const isComplete = isCompleteBookingQuery(query);

  const [car, setCar] = useState<Car | null>(null);
  const [pricing, setPricing] = useState<ReturnType<typeof calcTotalPrice> | null>(null);
  const [state, setState] = useState<BookingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [showDateForm, setShowDateForm] = useState(false);

  // Date selection form state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');
  const [selectedPickup, setSelectedPickup] = useState(query.pickup || 'north-airport-tfn');
  const [selectedDropoff, setSelectedDropoff] = useState(query.dropoff || 'north-airport-tfn');
  const [dateFormError, setDateFormError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<ExtraId[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTermsPreview, setShowTermsPreview] = useState(false);

  // Initialize default dates if missing
  useEffect(() => {
    if (!pickupDate && !query.fromISO) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPickupDate(tomorrow.toISOString().split('T')[0]);
    }
    if (!returnDate && !query.toISO) {
      const in3Days = new Date();
      in3Days.setDate(in3Days.getDate() + 4);
      setReturnDate(in3Days.toISOString().split('T')[0]);
    }
  }, [pickupDate, returnDate, query.fromISO, query.toISO]);

  // Load car and calculate pricing
  useEffect(() => {
    if (!query.carSlug) {
      return;
    }

    const foundCar = cars.find((c) => c.slug === query.carSlug);
    if (!foundCar) {
      setError('Coche no encontrado');
      return;
    }

    setCar(foundCar);

    if (isComplete && query.fromISO && query.toISO) {
      const pricingData = calcTotalPrice(foundCar, query.fromISO, query.toISO);
      setPricing(pricingData);
    }
  }, [query.carSlug, isComplete, query.fromISO, query.toISO]);

  const handleDateSelection = (e: React.FormEvent) => {
    e.preventDefault();
    setDateFormError(null);
    
    if (!pickupDate || !returnDate) {
      setDateFormError('Por favor, selecciona ambas fechas de recogida y devolución');
      return;
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime}`);

    if (isNaN(pickupDateTime.getTime()) || isNaN(returnDateTime.getTime())) {
      setDateFormError('Formato de fecha inválido');
      return;
    }

    if (returnDateTime <= pickupDateTime) {
      setDateFormError('La fecha y hora de devolución deben ser posteriores a la de recogida');
      return;
    }

    // Build complete query and navigate
    router.push(buildBookingUrl({
      carSlug: query.carSlug!,
      pickup: selectedPickup,
      dropoff: selectedDropoff,
      fromISO: pickupDateTime.toISOString(),
      toISO: returnDateTime.toISOString(),
      source: query.source || null,
    }, '/es/booking'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError(null);

    if (!acceptTerms) {
      setError('Debes aceptar los términos para continuar.');
      setState('error');
      return;
    }

    if (!isComplete || !query.fromISO || !query.toISO || !query.pickup || !query.dropoff) {
      setError('Faltan parámetros de reserva');
      setState('error');
      return;
    }

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carSlug: query.carSlug,
          startAt: query.fromISO,
          endAt: query.toISO,
          pickupLocation: query.pickup,
          dropoffLocation: query.dropoff,
          name,
          email,
          phone,
          whatsapp: whatsapp || undefined,
          flightNumber: flightNumber || undefined,
          extras: selectedExtras,
          acceptTerms: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la reserva');
      }

      setBookingId(data.bookingId);
      setWhatsappLink(data.whatsappLink || null);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      setState('error');
    }
  };

  // STATE A: No car selected
  if (!query.carSlug) {
    return (
      <Section background="primary" padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">No se ha seleccionado ningún coche</h1>
            <p className="text-[var(--text-muted)] mb-6">
              Por favor, selecciona un coche para comenzar tu reserva.
            </p>
          </div>
          <Link href="/es/cars">
            <Button variant="primary" size="lg">
              Ver Coches
            </Button>
          </Link>
        </div>
      </Section>
    );
  }

  // Car not found
  if (!car) {
    return (
      <Section background="primary" padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xl text-[var(--accent)] mb-4">{error || 'Coche no encontrado'}</p>
          <Link href="/es/cars">
            <Button variant="outline">Volver a coches</Button>
          </Link>
        </div>
      </Section>
    );
  }

  // STATE B: Car selected but incomplete parameters OR user clicked "Edit dates"
  if (!isComplete || showDateForm) {
    return (
      <Section background="primary" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Selecciona los Detalles del Alquiler</h1>
          <p className="text-[var(--text-muted)] mb-8">Elige las fechas y ubicaciones de recogida y devolución.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Info Card */}
            <Card>
              <h3 className="text-2xl font-semibold text-[var(--text)] mb-4">{car.name}</h3>
              
              {/* Specs */}
              {car.specs && car.specs.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {car.specs.slice(0, 5).map((spec, idx) => (
                      <Badge key={idx} variant="amber" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Tiers */}
              <div className="space-y-2 text-sm mb-4">
                <div className="font-medium text-[var(--text)] mb-2">Precios:</div>
                {car.pricing.d1_3 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">1-3 días:</span>
                    <span className="font-medium text-[var(--text)]">{formatEUR(car.pricing.d1_3)}/día</span>
                  </div>
                )}
                {car.pricing.d4_7 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">4-7 días:</span>
                    <span className="font-medium text-[var(--text)]">{formatEUR(car.pricing.d4_7)}/día</span>
                  </div>
                )}
                {car.pricing.d8_plus && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">8+ días:</span>
                    <span className="font-medium text-[var(--text)]">{formatEUR(car.pricing.d8_plus)}/día</span>
                  </div>
                )}
                {car.pricing.d8_14 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">8-14 días:</span>
                    <span className="font-medium text-[var(--text)]">{formatEUR(car.pricing.d8_14)}/día</span>
                  </div>
                )}
              </div>

              {/* Deposit */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Depósito:</span>
                  <span className="font-semibold text-[var(--text)]">{formatEUR(car.deposit)}</span>
                </div>
              </div>
            </Card>

            {/* Date Selection Form */}
            <Card>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-6">Selecciona los Detalles del Alquiler</h3>
              <form onSubmit={handleDateSelection} className="space-y-6">
                {dateFormError && (
                  <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--accent)] px-4 py-3 rounded-lg text-sm">
                    {dateFormError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Ubicación de recogida
                    </label>
                    <select
                      value={selectedPickup}
                      onChange={(e) => setSelectedPickup(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                    >
                      {Object.entries(locationLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Ubicación de devolución
                    </label>
                    <select
                      value={selectedDropoff}
                      onChange={(e) => setSelectedDropoff(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                    >
                      {Object.entries(locationLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Fecha de recogida
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Hora de recogida
                    </label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Fecha de devolución
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      Hora de devolución
                    </label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continuar
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>
    );
  }

  // STATE C: Complete parameters - Show booking form
  if (!pricing) {
    return (
      <Section background="primary" padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xl text-[var(--text-muted)]">Cargando...</p>
        </div>
      </Section>
    );
  }

  // Success state
  if (state === 'success' && bookingId && car && query.fromISO && query.toISO) {
    const fromDate = new Date(query.fromISO);
    const toDate = new Date(query.toISO);
    
    // Use WhatsApp link from API response, or fallback to building it client-side
    const finalWhatsappLink = whatsappLink || `https://wa.me/34692735125?text=${encodeURIComponent(
      `Hola MandryCabrio,\n\nHe enviado una solicitud de reserva.\nID de reserva: ${bookingId}\nCoche: ${car.name}\nFechas: ${fromDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} → ${toDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}\n\n¡Gracias!`
    )}`;

    return (
      <Section background="primary" padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">¡Solicitud de Reserva Enviada!</h1>
            <p className="text-lg text-[var(--text-muted)] mb-3">
              Tu solicitud de reserva ha sido recibida con éxito.
            </p>
            <p className="text-sm text-[var(--text-muted)] font-mono bg-[var(--surface-2)] px-4 py-2 rounded-lg inline-block">
              ID de reserva: <strong className="text-[var(--text)]">{bookingId}</strong>
            </p>
          </div>

          <Card className="mb-6 text-left">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Próximos Pasos</h2>
            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <p>• Anticipo de €100 requerido para confirmar la reserva</p>
              <p>• Métodos de pago: Privat24 / Mono / USDT / Santander / BBVA / Caixa</p>
              <p>• Enlace de Apple Pay disponible bajo solicitud</p>
              <p>• Pago del alquiler + depósito en la recogida</p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={finalWhatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Chatear por WhatsApp
              </Button>
            </a>
            {query.source === 'search' ? (
              <Link href="/es/search">
                <Button variant="outline" size="lg">
                  Volver a búsqueda
                </Button>
              </Link>
            ) : (
              <Link href="/es/cars">
                <Button variant="outline" size="lg">
                  Ver coches
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Section>
    );
  }

  // Main booking form
  const fromDate = new Date(query.fromISO!);
  const toDate = new Date(query.toISO!);
  const days = pricing.days;
  
  // Calculate extras summary
  const extrasSummary = calcExtras(selectedExtras);
  const totalWithExtras = (pricing.total || 0) + extrasSummary.extrasTotal;
  
  // Handle mutual exclusion for second driver options
  const handleExtraChange = (extraId: ExtraId, checked: boolean) => {
    if (checked) {
      // If selecting a second driver option, remove the other one
      if (extraId === 'second_driver_south') {
        setSelectedExtras([...selectedExtras.filter(id => id !== 'second_driver_north'), extraId]);
      } else if (extraId === 'second_driver_north') {
        setSelectedExtras([...selectedExtras.filter(id => id !== 'second_driver_south'), extraId]);
      } else {
        setSelectedExtras([...selectedExtras, extraId]);
      }
    } else {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    }
  };

  return (
    <>
      {/* Summary Sticky (Desktop) */}
      <div className="hidden lg:block fixed top-20 right-4 w-80 z-40">
        <Card className="sticky top-24 shadow-lg">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Resumen de Reserva</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-[var(--text-muted)]">Coche:</span>
              <div className="font-medium text-[var(--text)] mt-1">{car.name}</div>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Fechas:</span>
              <div className="font-medium text-[var(--text)] mt-1">
                {fromDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })} - {toDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-[var(--text-muted)] text-xs mt-1">{days} {days === 1 ? 'día' : 'días'}</div>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Recogida:</span>
              <div className="font-medium text-[var(--text)] mt-1">{locationLabels[query.pickup!] || query.pickup}</div>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Devolución:</span>
              <div className="font-medium text-[var(--text)] mt-1">{locationLabels[query.dropoff!] || query.dropoff}</div>
            </div>
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="flex justify-between mb-2">
                <span className="text-[var(--text-muted)]">Depósito:</span>
                <span className="font-medium text-[var(--text)]">{formatEUR(car.deposit)}</span>
              </div>
              {pricing.dailyRate !== null && (
                <div className="flex justify-between mb-2 text-xs text-[var(--text-muted)]">
                  <span>Tarifa diaria:</span>
                  <span>{formatEUR(pricing.dailyRate)}/día</span>
                </div>
              )}
              {pricing.total !== null && (
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-muted)]">Total alquiler:</span>
                  <span className="font-medium text-[var(--text)]">{formatEUR(pricing.total)}</span>
                </div>
              )}
              {extrasSummary.items.length > 0 && (
                <div className="pt-2 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--text-muted)] mb-2">Extras:</div>
                  {extrasSummary.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">{item.label}</span>
                      <span className="text-[var(--text)]">
                        {item.price === null ? (
                          <Badge variant="outline" className="text-xs">Bajo acuerdo</Badge>
                        ) : item.price === 0 ? (
                          'Gratis'
                        ) : (
                          formatEUR(item.price)
                        )}
                      </span>
                    </div>
                  ))}
                  {extrasSummary.extrasTotal > 0 && (
                    <div className="flex justify-between mt-2 pt-2 border-t border-[var(--border)]">
                      <span className="text-[var(--text-muted)] text-sm">Total extras:</span>
                      <span className="font-medium text-[var(--text)] text-sm">{formatEUR(extrasSummary.extrasTotal)}</span>
                    </div>
                  )}
                </div>
              )}
              {pricing.total !== null && (
                <div className="flex justify-between pt-2 border-t-2 border-[var(--accent)] mt-2">
                  <span className="text-[var(--text)] font-semibold">Total (incl. extras):</span>
                  <span className="font-bold text-[var(--text)] text-lg">{formatEUR(totalWithExtras)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Section background="primary" padding="lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Completa Tu Reserva</h1>
              <p className="text-[var(--text-muted)]">Por favor, rellena tus datos para completar tu solicitud de reserva.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDateForm(true)}
              className="hidden lg:block"
            >
              Editar fechas
            </Button>
          </div>

          {/* Mobile Summary */}
          <Card className="mb-8 lg:hidden">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Resumen de Reserva</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[var(--text-muted)]">Coche:</span>
                <div className="font-medium text-[var(--text)] mt-1">{car.name}</div>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Fechas:</span>
                <div className="font-medium text-[var(--text)] mt-1">
                  {fromDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })} - {toDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-[var(--text-muted)] text-xs mt-1">{days} {days === 1 ? 'día' : 'días'}</div>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Recogida:</span>
                <div className="font-medium text-[var(--text)] mt-1">{locationLabels[query.pickup!] || query.pickup}</div>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Devolución:</span>
                <div className="font-medium text-[var(--text)] mt-1">{locationLabels[query.dropoff!] || query.dropoff}</div>
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-muted)]">Depósito:</span>
                  <span className="font-medium text-[var(--text)]">{formatEUR(car.deposit)}</span>
                </div>
                {pricing.dailyRate !== null && (
                  <div className="flex justify-between mb-2 text-xs text-[var(--text-muted)]">
                    <span>Tarifa diaria:</span>
                    <span>{formatEUR(pricing.dailyRate)}/día</span>
                  </div>
                )}
                {pricing.total !== null && (
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--text-muted)]">Total alquiler:</span>
                    <span className="font-medium text-[var(--text)]">{formatEUR(pricing.total)}</span>
                  </div>
                )}
                {extrasSummary.items.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border)]">
                    <div className="text-xs text-[var(--text-muted)] mb-2">Extras:</div>
                    {extrasSummary.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-muted)]">{item.label}</span>
                        <span className="text-[var(--text)]">
                          {item.price === null ? (
                            <Badge variant="outline" className="text-xs">Bajo acuerdo</Badge>
                          ) : item.price === 0 ? (
                            'Gratis'
                          ) : (
                            formatEUR(item.price)
                          )}
                        </span>
                      </div>
                    ))}
                    {extrasSummary.extrasTotal > 0 && (
                      <div className="flex justify-between mt-2 pt-2 border-t border-[var(--border)]">
                        <span className="text-[var(--text-muted)] text-sm">Total extras:</span>
                        <span className="font-medium text-[var(--text)] text-sm">{formatEUR(extrasSummary.extrasTotal)}</span>
                      </div>
                    )}
                  </div>
                )}
                {pricing.total !== null && (
                  <div className="flex justify-between pt-2 border-t-2 border-[var(--accent)] mt-2">
                    <span className="text-[var(--text)] font-semibold">Total (incl. extras):</span>
                    <span className="font-bold text-[var(--text)]">{formatEUR(totalWithExtras)}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDateForm(true)}
              className="w-full mt-4"
            >
              Editar fechas
            </Button>
          </Card>

          {/* Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && state === 'error' && (
                <div className="bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--accent)] px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre completo"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Teléfono"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="WhatsApp (opcional)"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <Input
                label="Número de vuelo (opcional)"
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
              />

              {/* Extra Services */}
              <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Servicios Adicionales</h3>
                <div className="space-y-4">
                  {extras.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    const isSecondDriverSouth = extra.id === 'second_driver_south';
                    const isSecondDriverNorth = extra.id === 'second_driver_north';
                    const isOtherSecondDriverSelected = 
                      (isSecondDriverSouth && selectedExtras.includes('second_driver_north')) ||
                      (isSecondDriverNorth && selectedExtras.includes('second_driver_south'));
                    
                    return (
                      <div key={extra.id} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`extra-${extra.id}`}
                          checked={isSelected}
                          disabled={isOtherSecondDriverSelected && !isSelected}
                          onChange={(e) => handleExtraChange(extra.id, e.target.checked)}
                          className="mt-1 mr-3 w-4 h-4 rounded border transition-all
                          bg-[var(--surface-2)] border-[var(--border)] 
                          text-[var(--accent)] 
                          focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--accent)]
                          checked:bg-[var(--accent)] checked:border-[var(--accent)]
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`extra-${extra.id}`} 
                            className={`text-sm font-medium cursor-pointer ${isOtherSecondDriverSelected && !isSelected ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'}`}
                          >
                            {extra.label}
                            {extra.id === 'child_seat' && <span className="text-[var(--text-muted)] font-normal ml-2">(gratis)</span>}
                            {extra.id === 'island_delivery' && (
                              <span className="text-[var(--text-muted)] font-normal ml-2">(bajo acuerdo)</span>
                            )}
                          </label>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{extra.description}</p>
                          {extra.id === 'island_delivery' && isSelected && (
                            <Badge variant="outline" className="text-xs mt-2">Confirmaremos el precio por WhatsApp</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terms Consent */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 rounded border transition-all
                    bg-[var(--surface-2)] border-[var(--border)] 
                    text-[var(--accent)] 
                    focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--accent)]
                    checked:bg-[var(--accent)] checked:border-[var(--accent)]"
                    required
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-[var(--text)] flex-1">
                    Acepto los términos y condiciones de alquiler{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-[var(--text)] underline hover:text-[var(--accent)] transition-colors font-medium"
                    >
                      (Ver términos)
                    </button>
                  </label>
                </div>

                {/* Terms Preview Accordion */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowTermsPreview(!showTermsPreview)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  >
                    <span>Lo que aceptas (resumen)</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${showTermsPreview ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showTermsPreview && (
                    <div className="mt-3 p-4 bg-[var(--surface-2)] rounded-lg space-y-2 text-sm text-[var(--text-muted)] animate-fade-in">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Anticipo de €100 requerido para confirmar la reserva</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Pago del alquiler + depósito pagado en la recogida</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Depósito reembolsable solo si no hay daños; no reembolsable por no presentarse/cancelación</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Seguro completo incluido (franquicia €600)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Combustible: de lleno a lleno</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Requisitos del conductor: 26+ años, 3+ años de carnet</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>No fumar (penalización igual al depósito)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[var(--text)] mr-2">•</span>
                          <span>Documentos requeridos: carnet de conducir (ambos lados), dirección, email, teléfono</span>
                        </li>
                      </ul>
                      <div className="pt-2 mt-2 border-t border-[var(--border)]">
                        <Link
                          href="/es/terms"
                          className="text-[var(--text)] underline hover:text-[var(--accent)] transition-colors font-medium text-sm"
                        >
                          Lee los Términos y Condiciones completos
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={state === 'loading'}
              >
                {state === 'loading' ? 'Enviando...' : 'Enviar solicitud de reserva'}
              </Button>
            </form>
          </Card>
        </div>
      </Section>

      {/* Terms Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Términos y Condiciones"
        showAgreeButton={true}
        onAgree={() => {
          setAcceptTerms(true);
          setShowTermsModal(false);
        }}
        footerContent={
          <a
            href="/api/terms-pdf"
            download="terms.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text)] bg-[#FFF9C4] hover:bg-[#FFF9C4]/90 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </a>
        }
      >
        <div className="prose prose-sm max-w-none text-[var(--text-muted)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Términos Clave de Alquiler</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Anticipo:</strong> €100 requerido para confirmar la reserva</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Seguro:</strong> Seguro completo incluido, franquicia €600</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Conductor:</strong> 26+ años con 3+ años de carnet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Combustible:</strong> Política de lleno a lleno</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Fumar:</strong> No fumar (penalización igual al depósito)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Entrega:</strong> Aeropuerto Norte +€50, otras direcciones bajo acuerdo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Depósito:</strong> Reembolsable solo si no hay daños; no reembolsable por no presentarse/cancelación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text)] mr-2">•</span>
                  <span><strong>Documentos requeridos:</strong> Carnet de conducir (ambos lados), dirección, email, teléfono</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Servicios Adicionales</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-1">Silla de niño / capazo / elevador</h4>
                  <p>Silla de niño, capazo o elevador gratuito para tu alquiler. Disponible bajo solicitud.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-1">Segundo conductor</h4>
                  <p>Autorización de conductor adicional disponible por una tarifa extra. Elige la opción apropiada según tu zona de recogida/devolución:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Segundo conductor — Sur (€30):</strong> Para Aeropuerto Sur TFS, Los Cristianos y ubicaciones de la zona Sur</li>
                    <li><strong>Segundo conductor — Norte (€80):</strong> Para Aeropuerto Norte TFN, Puerto de la Cruz, Santa Cruz y ubicaciones de la zona Norte</li>
                  </ul>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Nota: Solo se puede seleccionar una opción de segundo conductor por reserva.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-1">Entrega / recogida en la isla</h4>
                  <p>Servicio de entrega y recogida en toda Tenerife disponible bajo acuerdo. El precio se confirmará por WhatsApp según tu ubicación específica y requisitos.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Métodos de Pago</h3>
              <p>
                Aceptamos Privat24, Mono, USDT, Santander, BBVA y Caixa. Enlace de Apple Pay disponible bajo solicitud.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Contacto</h3>
              <p>
                Para cualquier pregunta o solicitud especial, contáctanos por WhatsApp:{' '}
                <a href="https://wa.me/34692735125" className="text-[var(--text)] underline">+34 692 735 125</a>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--navy-deep)] flex items-center justify-center"><p className="text-[var(--text)]">Loading...</p></div>}>
      <BookingPageContent />
    </Suspense>
  );
}

