import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Результати пошуку - Оренда автомобілів на Тенеріфе',
  description: 'Знайдіть ідеальний автомобіль для оренди на Тенеріфе. Перегляньте доступні автомобілі на основі ваших критеріїв пошуку.',
  path: '/uk/search',
  locale: 'uk',
});

export default function SearchPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Результати пошуку
        </h1>
        <Card>
          <p className="text-[var(--text-muted)]">
            Ця сторінка незабаром буде доступна. Будь ласка, використовуйте англійську версію.
          </p>
        </Card>
      </div>
    </Section>
  );
}

