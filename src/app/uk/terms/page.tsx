import type { Metadata } from 'next';
import EnTermsPage from '../../en/terms/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Умови оренди | MandryCabrio',
  description:
    'Умови оренди автомобілів MandryCabrio на Тенеріфе. Ознайомтеся з нашими правилами щодо застав, страхування та додаткових послуг.',
  path: '/uk/terms',
  locale: 'uk',
});

export default function TermsPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] terms page locale=uk');
  }
  return <EnTermsPage {...props} />;
}


