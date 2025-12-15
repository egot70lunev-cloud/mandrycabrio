import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Suchergebnisse - Autovermietung in Teneriffa',
  description: 'Finden Sie Ihr perfektes Mietauto in Teneriffa. Durchsuchen Sie verfügbare Fahrzeuge basierend auf Ihren Suchkriterien.',
  path: '/de/search',
  locale: 'de',
});

export default function SearchPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Suchergebnisse
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

