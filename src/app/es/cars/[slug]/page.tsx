import { notFound } from 'next/navigation';
import { cars } from '@/data/cars';
import { formatEUR } from '@/lib/format';
import { getFromDailyPrice } from '@/lib/pricing';
import { Section, Badge, Button, Card } from '@/components/ui';
import { CarImage } from '@/components/CarImage';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { generatePageMetadata } from '../../../metadata';
import { buildRentalCarSchema } from '@/lib/schema';
import { prisma } from '@/lib/db';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);

  if (!car) {
    return {
      title: 'Coche No Encontrado',
    };
  }

  const fromPrice = getFromDailyPrice(car);
  const description = `Alquila ${car.name} en Tenerife. ${car.specs.join(', ')}. ${fromPrice ? `Desde ${formatEUR(fromPrice)}/día.` : 'Contacta con nosotros para el precio.'}`;

  return generatePageMetadata({
    title: `${car.name} | Alquiler de Coches en Tenerife`,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    path: `/es/cars/${slug}`,
    locale: 'es',
  });
}

const categoryLabels: Record<string, string> = {
  cabrio: 'Cabrio',
  suv: 'SUV',
  economy: 'Económico',
  ev: 'Eléctrico',
  motorcycle: 'Motocicleta',
  luxury: 'Lujo',
};

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);

  if (!car) {
    notFound();
  }

  const fromPrice = getFromDailyPrice(car);
  
  // Build Product schema
  const brand = car.name.split(' ')[0]; // Extract brand from car name
  const carDescription = `${car.name} - ${car.specs.join(', ')}. Disponible para alquiler en Tenerife.`;
  const priceRange = fromPrice ? `Desde ${formatEUR(fromPrice)}/día` : undefined;
  
  // Fetch reviews for schema
  const reviews = await prisma.review.findMany({
    where: {
      isApproved: true,
      language: 'es',
      carSlug: slug,
    },
    take: 10,
  });

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  const rentalCarSchema = buildRentalCarSchema(
    car.name,
    brand,
    carDescription,
    priceRange,
    fromPrice || undefined
  );

  // Add reviews to product schema if available
  if (reviews.length > 0) {
    (rentalCarSchema as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(averageRating * 10) / 10,
      bestRating: 5,
      worstRating: 1,
      reviewCount: reviews.length,
    };
    (rentalCarSchema as any).review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name,
      },
      reviewBody: review.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: review.createdAt.toISOString(),
    }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rentalCarSchema) }}
      />
      {/* Hero Section */}
      <Section background="primary" padding="lg" className="border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Badge variant="amber">{categoryLabels[car.category] || car.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
            {car.name}
          </h1>
          {car.color && (
            <p className="text-lg text-[#6B6B6B] mb-6">
              Color: <span className="font-medium">{car.color}</span>
            </p>
          )}
        </div>
      </Section>

      {/* Main Content */}
      <Section background="surface" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image & Specs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Car Image */}
              <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden relative bg-[#F5F5F5]">
                <CarImage
                  car={car}
                  locale="es"
                  imageIndex={1}
                  priority
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Specifications */}
              <Card>
                <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Especificaciones</h2>
                <ul className="space-y-2">
                  {car.specs.map((spec, index) => (
                    <li key={index} className="text-[#6B6B6B] flex items-start">
                      <span className="text-[#2B2B2B] mr-2">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right Column - Pricing & Booking */}
            <div className="space-y-6">
              {/* Extra Services Card */}
              <Card>
                <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Servicios Adicionales Disponibles</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFF9C4] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#2B2B2B]">Silla de niño / capazo / elevador</div>
                      <div className="text-sm text-[#6B6B6B]">Gratis</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFF9C4] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#2B2B2B]">Segundo conductor — Sur</div>
                      <div className="text-sm text-[#6B6B6B]">€30</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFF9C4] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#2B2B2B]">Segundo conductor — Norte</div>
                      <div className="text-sm text-[#6B6B6B]">€80</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFF9C4] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[#2B2B2B]">Entrega / recogida en la isla</div>
                      <div className="text-sm text-[#6B6B6B]">Bajo acuerdo</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pricing Card */}
              <Card>
                <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Precios</h2>
                
                <div className="space-y-4">
                  {/* Daily Rates */}
                  {car.pricing.d1_3 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">1-3 días</span>
                      <span className="font-semibold text-[#2B2B2B]">
                        {formatEUR(car.pricing.d1_3)}/día
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d4_7 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">4-7 días</span>
                      <span className="font-semibold text-[#2B2B2B]">
                        {formatEUR(car.pricing.d4_7)}/día
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d8_14 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">8-14 días</span>
                      <span className="font-semibold text-[#2B2B2B]">
                        {formatEUR(car.pricing.d8_14)}/día
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d8_plus && (
                    <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">8+ días</span>
                      <span className="font-semibold text-[#2B2B2B]">
                        {formatEUR(car.pricing.d8_plus)}/día
                      </span>
                    </div>
                  )}
                  
                  {/* Monthly Rate */}
                  {car.pricing.month && (
                    <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">Mensual (28+ días)</span>
                      <span className="font-semibold text-[#2B2B2B]">
                        {formatEUR(car.pricing.month)}/mes
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.onRequestMonth && (
                    <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5]">
                      <span className="text-[#6B6B6B]">Mensual (28+ días)</span>
                      <span className="font-semibold text-[#2B2B2B] italic">
                        Bajo consulta
                      </span>
                    </div>
                  )}
                </div>

                {/* Deposit */}
                <div className="mt-6 pt-6 border-t-2 border-[#E5E5E5]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B6B6B]">Depósito</span>
                    <span className="text-xl font-semibold text-[#2B2B2B]">
                      {formatEUR(car.deposit)}
                    </span>
                  </div>
                </div>

                {/* CTA Sticky on Desktop */}
                <div className="mt-6 lg:sticky lg:top-24">
                  <Link href={`/es/booking?car=${car.slug}`} className="block">
                    <Button variant="primary" size="lg" className="w-full group shadow-lg hover:shadow-xl transition-all duration-300">
                      Reservar este coche
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Key Rental Terms */}
              <Card>
                <h2 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                  Términos Clave de Alquiler
                </h2>
                <ul className="space-y-3 text-sm text-[#6B6B6B]">
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>Anticipo de €100 para confirmar la reserva</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>Seguro completo incluido, franquicia €600</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>Conductor 26+ con 3+ años de carnet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>Combustible de lleno a lleno</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>No fumar (penalización igual al depósito)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>
                      Entrega: Aeropuerto Norte +€50, otras direcciones bajo acuerdo
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

