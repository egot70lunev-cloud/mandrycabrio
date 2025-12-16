/**
 * Format a number as EUR currency
 * @param value - The numeric value to format
 * @returns Formatted string (e.g., "€1,450")
 */
export function formatEUR(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}




