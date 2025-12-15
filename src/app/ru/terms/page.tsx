import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Условия аренды | MandryCabrio',
  description: 'Условия аренды автомобилей MandryCabrio на Тенерифе. Ознакомьтесь с нашими правилами по залогам, страховке и дополнительным услугам.',
  path: '/ru/terms',
  locale: 'ru',
});

export default function TermsPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-8">
          Условия аренды
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

