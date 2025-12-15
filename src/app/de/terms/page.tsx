import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Allgemeine Geschäftsbedingungen | MandryCabrio',
  description: 'Mietbedingungen für MandryCabrio Autovermietung in Teneriffa. Lesen Sie unsere Richtlinien zu Kautionen, Versicherungen und Zusatzleistungen.',
  path: '/de/terms',
  locale: 'de',
});

export default function TermsPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>
        <Card>
          <p className="text-[var(--text-muted)]">
            Diese Seite wird bald verfügbar sein. Bitte verwenden Sie die englische Version.
          </p>
        </Card>
      </div>
    </Section>
  );
}

