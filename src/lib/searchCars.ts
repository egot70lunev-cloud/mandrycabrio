import { cars, type Car, type CarCategory } from '@/data/cars';
import { prisma } from './db';

export type SearchInput = {
  from: string;
  to: string;
  cat: string; // 'any' | CarCategory | ''
};

export async function getAvailableCars(
  input: SearchInput
): Promise<{ cars: Car[]; unavailableSlugs: string[] }> {
  // Parse dates
  const reqStart = new Date(input.from);
  const reqEnd = new Date(input.to);

  if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) {
    throw new Error('Invalid date format');
  }

  if (reqEnd <= reqStart) {
    throw new Error('Return date must be after pickup date');
  }

  // Normalize category filter
  const category = input.cat === 'any' || !input.cat ? null : (input.cat as CarCategory);

  // Filter by category first
  let filteredCars = cars;
  if (category) {
    filteredCars = cars.filter((car) => car.category === category);
  }

  // If no cars match category, return empty
  if (filteredCars.length === 0) {
    return { cars: [], unavailableSlugs: [] };
  }

  // Batch check availability from database
  const carSlugs = filteredCars.map((car) => car.slug);

  // Query all overlapping bookings in one go
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      status: {
        not: 'CANCELLED',
      },
      startAt: {
        lt: reqEnd,
      },
      endAt: {
        gt: reqStart,
      },
      carSlug: {
        in: carSlugs,
      },
    },
    select: {
      carSlug: true,
    },
  });

  // Build set of unavailable car slugs
  const unavailableSlugs = new Set(overlappingBookings.map((b) => b.carSlug));

  // Filter out unavailable cars
  const availableCars = filteredCars.filter((car) => !unavailableSlugs.has(car.slug));

  return {
    cars: availableCars,
    unavailableSlugs: Array.from(unavailableSlugs),
  };
}

