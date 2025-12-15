import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Автопарк | Оренда кабріолетів, позашляховиків та преміальних автомобілів на Тенерифі',
  description: 'Відкрийте для себе наш преміальний автопарк кабріолетів, позашляховиків, компактних, електромобілів та розкішних автомобілів на Тенерифі. Знайдіть ідеальний автомобіль для оренди сьогодні.',
  path: '/uk/cars',
  locale: 'uk',
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



