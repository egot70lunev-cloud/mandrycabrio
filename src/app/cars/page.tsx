'use client';

import { useState, useMemo } from 'react';
import { cars, type Car, type CarCategory } from '@/data/cars';
import { getFromDailyPrice } from '@/lib/pricing';
import { formatEUR } from '@/lib/format';
import { Card, Badge, Button, Section } from '@/components/ui';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations';
// Metadata is handled by src/app/cars/layout.tsx

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
      <Section background="primary" padding="lg" className="border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-4">
            Car Rental in Tenerife
          </h1>
          <p className="text-xl text-[#6B6B6B] mb-8">
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
                        ? 'bg-[#2B2B2B] text-white'
                        : 'bg-white text-[#2B2B2B] border border-[#E5E5E5] hover:border-[#2B2B2B]'
                    }
                  `}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-[#6B6B6B]">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border border-[#E5E5E5] bg-white text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]/20 transition-all duration-200"
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
                    {/* Image Placeholder with Hover Effect */}
                    <div 
                      className="w-full h-48 bg-gradient-to-br from-[#F5F5F5] to-[#E5E5E5] rounded-lg mb-4 flex items-center justify-center overflow-hidden relative"
                      role="img"
                      aria-label={`${car.name} - Image placeholder`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="text-[#9B9B9B] text-sm group-hover:scale-110 transition-transform duration-300">Image placeholder</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <Badge variant="amber">{categoryLabels[car.category]}</Badge>
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
                        {fromPrice !== null ? (
                          <div className="text-lg font-semibold text-[#2B2B2B]">
                            From {formatEUR(fromPrice)}/day
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-[#6B6B6B]">
                            Price on request
                          </div>
                        )}
                        <div className="text-sm text-[#6B6B6B]">
                          Deposit: {formatEUR(car.deposit)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/cars/${car.slug}`} className="flex-1">
                          <Button variant="outline" size="md" className="w-full">
                            View details
                          </Button>
                        </Link>
                        <Link href={`/booking?car=${car.slug}`} className="flex-1">
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

