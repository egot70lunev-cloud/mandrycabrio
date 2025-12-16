import type { Metadata } from 'next';
import EnSearchPage from '../../en/search/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Результати пошуку - Оренда автомобілів на Тенеріфе',
  description:
    'Знайдіть ідеальний автомобіль для оренди на Тенеріфе. Перегляньте доступні автомобілі на основі ваших критеріїв пошуку.',
  path: '/uk/search',
  locale: 'uk',
});

export default function SearchPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] search page locale=uk');
  }
  return <EnSearchPage {...props} />;
}


