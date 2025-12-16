import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Flotte | Mietwagen für Cabrios, SUVs und Premium-Autos auf Teneriffa',
  description: 'Entdecken Sie unsere Premium-Flotte von Cabrios, SUVs, Kompaktwagen, Elektrofahrzeugen und Luxusfahrzeugen auf Teneriffa. Finden Sie heute Ihr perfektes Mietfahrzeug.',
  path: '/de/cars',
  locale: 'de',
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




