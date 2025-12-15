'use client';

import { useState, useMemo } from 'react';
import { cars, type Car, type CarCategory } from '@/data/cars';
import { getFromDailyPrice } from '@/lib/pricing';
import { formatEUR } from '@/lib/format';
import { Card, Badge, Button, Section } from '@/components/ui';
import { CarImage } from '@/components/CarImage';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations';

type SortOption = 'recommended' | 'price-low' | 'price-high' | 'deposit-low';

const categories: (CarCategory | 'all')[] = ['all', 'cabrio', 'suv', 'economy', 'ev', 'motorcycle'];

const categoryLabels: Record<CarCategory | 'all', string> = {
  all: 'All',
  cabrio: 'Cabrio',
  suv: 'SUV',
  economy: 'Economy',
  ev: 'EV',
  motorcycle: 'Motorcycle',
  luxury: 'Luxury',
};

export default function CarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = cars.filter((car) => car.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'recommended') {
      // Keep original order
      return sorted;
    }

    if (sortBy === 'price-low') {
      return sorted.sort((a, b) => {
        const priceA = getFromDailyPrice(a) ?? Infinity;
        const priceB = getFromDailyPrice(b) ?? Infinity;
        return priceA - priceB;
      });
    }

    if (sortBy === 'price-high') {
      return sorted.sort((a, b) => {
        const priceA = getFromDailyPrice(a) ?? -Infinity;
        const priceB = getFromDailyPrice(b) ?? -Infinity;
        return priceB - priceA;
      });
    }

    if (sortBy === 'deposit-low') {
      return sorted.sort((a, b) => a.deposit - b.deposit);
    }

    return sorted;
  }, [selectedCategory, sortBy]);

  return (
    <>
      {/* Header Section */}
      <Section background="primary" padding="lg" className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Car Rental in Tenerife
          </h1>
          <p className="text-xl text-[var(--text-muted)] mb-8">
            Choose your car and send a booking request in minutes.
          </p>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      selectedCategory === category
                        ? 'bg-[var(--accent)] text-[var(--navy-950)]'
                        : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]'
                    }
                  `}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-[var(--text-muted)]">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price (low to high)</option>
                <option value="price-high">Price (high to low)</option>
                <option value="deposit-low">Deposit (low to high)</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Cars Grid */}
      <Section background="primary" padding="lg">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedCars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#6B6B6B]">No cars found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCars.map((car, index) => {
                const fromPrice = getFromDailyPrice(car);
                const displaySpecs = car.specs.slice(0, 5);

                return (
                  <ScrollReveal key={car.id} delay={index * 50}>
                    <Card className="flex flex-col h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Car Image */}
                    <div className="w-full h-48 rounded-lg mb-4 overflow-hidden relative bg-[var(--surface-2)]">
                      <CarImage
                        car={car}
                        locale="en"
                        imageIndex={1}
                        priority={index < 3}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <Badge variant="amber">{categoryLabels[car.category]}</Badge>
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
                        {fromPrice !== null ? (
                          <div className="text-lg font-semibold text-[var(--text)]">
                            From {formatEUR(fromPrice)}/day
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-[var(--text-muted)]">
                            Price on request
                          </div>
                        )}
                        <div className="text-sm text-[var(--text-muted)]">
                          Deposit: {formatEUR(car.deposit)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/en/cars/${car.slug}`} className="flex-1">
                          <Button variant="outline" size="md" className="w-full">
                            View details
                          </Button>
                        </Link>
                        <Link href={`/en/booking?car=${car.slug}`} className="flex-1">
                          <Button variant="primary" size="md" className="w-full">
                            Book
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

