import type { Car } from '@/data/cars';

/**
 * Calculate the number of days between two dates (rounded up, minimum 1)
 * @param startISO - Start date in ISO format
 * @param endISO - End date in ISO format
 * @returns Number of days (minimum 1)
 */
export function calcDays(startISO: string, endISO: string): number {
  const start = new Date(startISO);
  const end = new Date(endISO);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays);
}

/**
 * Get the daily rate for a car based on the number of days
 * Special handling for E450: uses d8_14 for 8-14 days
 * @param car - The car object
 * @param days - Number of rental days
 * @returns Daily rate or null if not available
 */
export function getDailyRate(car: Car, days: number): number | null {
  const { pricing } = car;
  
  // Special case for E450: 8-14 days uses d8_14
  const isE450 = car.slug.includes('mercedes-benz-e450-mhev-cabrio-2022');
  
  if (isE450 && days >= 8 && days <= 14 && pricing.d8_14 !== undefined) {
    return pricing.d8_14;
  }
  
  // Standard tiers
  if (days >= 1 && days <= 3 && pricing.d1_3 !== undefined) {
    return pricing.d1_3;
  }
  
  if (days >= 4 && days <= 7 && pricing.d4_7 !== undefined) {
    return pricing.d4_7;
  }
  
  if (days >= 8 && pricing.d8_plus !== undefined) {
    return pricing.d8_plus;
  }
  
  return null;
}

/**
 * Calculate the total price for a car rental
 * @param car - The car object
 * @param startISO - Start date in ISO format
 * @param endISO - End date in ISO format
 * @returns Object with days, dailyRate, total, monthPrice, and onRequestMonth flag
 */
export function calcTotalPrice(
  car: Car,
  startISO: string,
  endISO: string
): {
  days: number;
  dailyRate: number | null;
  total: number | null;
  monthPrice: number | null;
  onRequestMonth: boolean;
} {
  const days = calcDays(startISO, endISO);
  const dailyRate = getDailyRate(car, days);
  
  let total: number | null = null;
  if (dailyRate !== null) {
    total = dailyRate * days;
  }
  
  let monthPrice: number | null = null;
  if (car.pricing.month !== undefined && days >= 28) {
    monthPrice = car.pricing.month;
  }
  
  const onRequestMonth = car.pricing.onRequestMonth === true;
  
  return {
    days,
    dailyRate,
    total,
    monthPrice,
    onRequestMonth,
  };
}

/**
 * Get the minimum daily price from all available pricing tiers
 * Used for sorting and displaying "From €X/day"
 * @param car - The car object
 * @returns Minimum daily price or null if no pricing available
 */
export function getFromDailyPrice(car: Car): number | null {
  const { pricing } = car;
  const prices: number[] = [];
  
  if (pricing.d1_3 !== undefined) prices.push(pricing.d1_3);
  if (pricing.d4_7 !== undefined) prices.push(pricing.d4_7);
  if (pricing.d8_plus !== undefined) prices.push(pricing.d8_plus);
  if (pricing.d8_14 !== undefined) prices.push(pricing.d8_14);
  
  if (prices.length === 0) {
    return null;
  }
  
  return Math.min(...prices);
}

