export type BookingQuery = {
  carSlug: string | null;
  pickup: string | null;
  dropoff: string | null;
  fromISO: string | null;
  toISO: string | null;
  source?: "cars" | "search" | null;
};

/**
 * Safely parse booking query parameters from URL search params
 * Never throws, returns null for missing values
 */
export function parseBookingQuery(
  searchParams: Record<string, string | string[] | undefined>
): BookingQuery {
  const getString = (key: string): string | null => {
    const value = searchParams[key];
    if (!value) return null;
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
  };

  return {
    carSlug: getString("car"),
    pickup: getString("pickup"),
    dropoff: getString("dropoff"),
    fromISO: getString("from"),
    toISO: getString("to"),
    source: (getString("source") as "cars" | "search" | null) || null,
  };
}

/**
 * Check if all required booking parameters are present
 */
export function isCompleteBookingQuery(q: BookingQuery): boolean {
  return !!(
    q.carSlug &&
    q.pickup &&
    q.dropoff &&
    q.fromISO &&
    q.toISO &&
    q.fromISO &&
    q.toISO
  );
}

/**
 * Build a booking URL with all parameters
 * All fields must be non-null (use isCompleteBookingQuery first)
 */
export function buildBookingUrl(q: {
  carSlug: string;
  pickup: string;
  dropoff: string;
  fromISO: string;
  toISO: string;
  source?: string | null;
}, basePath: string = '/booking'): string {
  const params = new URLSearchParams();
  params.set("car", q.carSlug);
  params.set("pickup", q.pickup);
  params.set("dropoff", q.dropoff);
  params.set("from", q.fromISO);
  params.set("to", q.toISO);
  if (q.source) {
    params.set("source", q.source);
  }
  return `${basePath}?${params.toString()}`;
}

