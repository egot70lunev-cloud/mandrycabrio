import type { Metadata } from 'next';
import EnTermsPage from '../../en/terms/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Allgemeine Geschäftsbedingungen | MandryCabrio',
  description:
    'Mietbedingungen für MandryCabrio Autovermietung in Teneriffa. Lesen Sie unsere Richtlinien zu Kautionen, Versicherungen und Zusatzleistungen.',
  path: '/de/terms',
  locale: 'de',
});

export default function TermsPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] terms page locale=de');
  }
  return <EnTermsPage {...props} />;
}


