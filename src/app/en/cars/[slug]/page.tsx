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
      title: 'Car Not Found',
    };
  }

  const fromPrice = getFromDailyPrice(car);
  const description = `Rent ${car.name} in Tenerife. ${car.specs.join(', ')}. ${fromPrice ? `From ${formatEUR(fromPrice)}/day.` : 'Contact us for pricing.'}`;

  return generatePageMetadata({
    title: `${car.name} | Car Rental in Tenerife`,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    path: `/en/cars/${slug}`,
    locale: 'en',
  });
}

const categoryLabels: Record<string, string> = {
  cabrio: 'Cabrio',
  suv: 'SUV',
  economy: 'Economy',
  ev: 'EV',
  motorcycle: 'Motorcycle',
  luxury: 'Luxury',
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
  const carDescription = `${car.name} - ${car.specs.join(', ')}. Available for rent in Tenerife.`;
  const priceRange = fromPrice ? `From ${formatEUR(fromPrice)}/day` : undefined;
  const rentalCarSchema = buildRentalCarSchema(
    car.name,
    brand,
    carDescription,
    priceRange,
    fromPrice || undefined
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rentalCarSchema) }}
      />
      {/* Hero Section */}
      <Section background="primary" padding="lg" className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Badge variant="amber">{categoryLabels[car.category] || car.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            {car.name}
          </h1>
          {car.color && (
            <p className="text-lg text-[var(--text-muted)] mb-6">
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
              <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden relative bg-[var(--surface-2)]">
                <CarImage
                  car={car}
                  locale="en"
                  imageIndex={1}
                  priority
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Specifications */}
              <Card>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Specifications</h2>
                <ul className="space-y-2">
                  {car.specs.map((spec, index) => (
                    <li key={index} className="text-[var(--text-muted)] flex items-start">
                      <span className="text-[var(--accent)] mr-2">•</span>
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
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Extra Services Available</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[var(--text)]">Child seat / bassinet / booster</div>
                      <div className="text-sm text-[var(--text-muted)]">Free</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[var(--text)]">Second driver — South</div>
                      <div className="text-sm text-[var(--text-muted)]">€30</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[var(--text)]">Second driver — North</div>
                      <div className="text-sm text-[var(--text-muted)]">€80</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-[var(--text)]">Delivery / pickup across the island</div>
                      <div className="text-sm text-[var(--text-muted)]">By agreement</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pricing Card */}
              <Card>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-6">Pricing</h2>
                
                <div className="space-y-4">
                  {/* Daily Rates */}
                  {car.pricing.d1_3 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">1-3 days</span>
                      <span className="font-semibold text-[var(--text)]">
                        {formatEUR(car.pricing.d1_3)}/day
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d4_7 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">4-7 days</span>
                      <span className="font-semibold text-[var(--text)]">
                        {formatEUR(car.pricing.d4_7)}/day
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d8_14 && (
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">8-14 days</span>
                      <span className="font-semibold text-[var(--text)]">
                        {formatEUR(car.pricing.d8_14)}/day
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.d8_plus && (
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">8+ days</span>
                      <span className="font-semibold text-[var(--text)]">
                        {formatEUR(car.pricing.d8_plus)}/day
                      </span>
                    </div>
                  )}
                  
                  {/* Monthly Rate */}
                  {car.pricing.month && (
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">Monthly (28+ days)</span>
                      <span className="font-semibold text-[var(--text)]">
                        {formatEUR(car.pricing.month)}/month
                      </span>
                    </div>
                  )}
                  
                  {car.pricing.onRequestMonth && (
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">Monthly (28+ days)</span>
                      <span className="font-semibold text-[var(--text)] italic">
                        On request
                      </span>
                    </div>
                  )}
                </div>

                {/* Deposit */}
                <div className="mt-6 pt-6 border-t-2 border-[var(--border)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)]">Deposit</span>
                    <span className="text-xl font-semibold text-[var(--text)]">
                      {formatEUR(car.deposit)}
                    </span>
                  </div>
                </div>

                {/* CTA Sticky on Desktop */}
                <div className="mt-6 lg:sticky lg:top-24">
                  <Link href={`/en/booking?car=${car.slug}`} className="block">
                    <Button variant="primary" size="lg" className="w-full group shadow-lg hover:shadow-xl transition-all duration-300">
                      Book this car
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Key Rental Terms */}
              <Card>
                <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                  Key Rental Terms
                </h2>
                <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Prepayment €100 to confirm booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Full insurance included, excess €600</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--accent)] mr-2">•</span>
                    <span>Driver 26+ with 3+ years license</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>Fuel full-to-full</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>No smoking (penalty equals deposit)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2B2B2B] mr-2">•</span>
                    <span>
                      Delivery: North airport +€50, other addresses by agreement
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section background="primary" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-8">Reviews for this car</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReviewsList lang="en" carSlug={slug} />
            <ReviewForm carSlug={slug} />
          </div>
        </div>
      </Section>

    </>
  );
}

