import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Автопарк | Аренда кабриолетов, внедорожников и премиальных автомобилей на Тенерифе',
  description: 'Откройте для себя наш премиальный автопарк кабриолетов, внедорожников, компактных, электромобилей и роскошных автомобилей на Тенерифе. Найдите идеальный автомобиль для аренды сегодня.',
  path: '/ru/cars',
  locale: 'ru',
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




