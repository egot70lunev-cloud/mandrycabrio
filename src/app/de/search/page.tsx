import type { Metadata } from 'next';
import EnSearchPage from '../../en/search/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Suchergebnisse - Autovermietung in Teneriffa',
  description:
    'Finden Sie Ihr perfektes Mietauto in Teneriffa. Durchsuchen Sie verfügbare Fahrzeuge basierend auf Ihren Suchkriterien.',
  path: '/de/search',
  locale: 'de',
});

export default function SearchPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] search page locale=de');
  }
  return <EnSearchPage {...props} />;
}


