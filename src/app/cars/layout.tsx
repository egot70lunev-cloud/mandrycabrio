import { generatePageMetadata } from '../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Fleet | Cabrio, SUV & Premium Car Rental in Tenerife',
  description: 'Browse our premium fleet of cabrio, SUV, economy, EV, and luxury vehicles in Tenerife. Find your perfect rental car today.',
  path: '/cars',
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
