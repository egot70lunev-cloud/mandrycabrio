import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Flota | Alquiler de Cabrios, SUV y Coches Premium en Tenerife',
  description: 'Explora nuestra flota premium de cabrios, SUV, económicos, eléctricos y vehículos de lujo en Tenerife. Encuentra tu coche de alquiler perfecto hoy.',
  path: '/es/cars',
  locale: 'es',
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



