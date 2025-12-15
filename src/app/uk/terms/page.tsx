import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Умови оренди | MandryCabrio',
  description: 'Умови оренди автомобілів MandryCabrio на Тенеріфе. Ознайомтеся з нашими правилами щодо застав, страхування та додаткових послуг.',
  path: '/uk/terms',
  locale: 'uk',
});

export default function TermsPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-8">
          Умови оренди
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

