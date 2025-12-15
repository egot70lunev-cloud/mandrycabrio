import { prisma } from './db';

/**
 * Check if two date ranges overlap
 * Overlap occurs if: existingStart < reqEnd && existingEnd > reqStart
 * @param existingStart - Start date of existing booking
 * @param existingEnd - End date of existing booking
 * @param reqStart - Start date of requested booking
 * @param reqEnd - End date of requested booking
 * @returns true if ranges overlap
 */
export function hasOverlap(
  existingStart: Date,
  existingEnd: Date,
  reqStart: Date,
  reqEnd: Date
): boolean {
  return existingStart < reqEnd && existingEnd > reqStart;
}

/**
 * Check if a car is available for the requested period
 * @param carSlug - Slug of the car to check
 * @param reqStart - Requested start date/time
 * @param reqEnd - Requested end date/time
 * @returns true if car is available (no overlapping bookings with status PENDING or CONFIRMED)
 */
export async function isCarAvailable(
  carSlug: string,
  reqStart: Date,
  reqEnd: Date
): Promise<boolean> {
  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      carSlug,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      startAt: {
        lt: reqEnd,
      },
      endAt: {
        gt: reqStart,
      },
    },
  });

  return !overlappingBooking;
}

/**
 * Get unavailable car slugs for a given period (batch check)
 * @param carSlugs - Array of car slugs to check
 * @param reqStart - Requested start date/time
 * @param reqEnd - Requested end date/time
 * @returns Set of unavailable car slugs
 */
export async function getUnavailableCarSlugs(
  carSlugs: string[],
  reqStart: Date,
  reqEnd: Date
): Promise<Set<string>> {
  if (carSlugs.length === 0) {
    return new Set();
  }

  const overlappingBookings = await prisma.booking.findMany({
    where: {
      carSlug: {
        in: carSlugs,
      },
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      startAt: {
        lt: reqEnd,
      },
      endAt: {
        gt: reqStart,
      },
    },
    select: {
      carSlug: true,
    },
  });

  return new Set(overlappingBookings.map((b) => b.carSlug));
}

