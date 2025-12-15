import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Результаты поиска - Аренда автомобилей на Тенерифе',
  description: 'Найдите идеальный автомобиль для аренды на Тенерифе. Просмотрите доступные автомобили на основе ваших критериев поиска.',
  path: '/ru/search',
  locale: 'ru',
});

export default function SearchPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Результаты поиска
        </h1>
        <Card>
          <p className="text-[var(--text-muted)]">
            Эта страница скоро будет доступна. Пожалуйста, используйте английскую версию.
          </p>
        </Card>
      </div>
    </Section>
  );
}

