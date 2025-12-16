import type { Metadata } from 'next';
import EnSearchPage from '../../en/search/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Результаты поиска - Аренда автомобилей на Тенерифе',
  description:
    'Найдите идеальный автомобиль для аренды на Тенерифе. Просмотрите доступные автомобили на основе ваших критериев поиска.',
  path: '/ru/search',
  locale: 'ru',
});

export default function SearchPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] search page locale=ru');
  }
  return <EnSearchPage {...props} />;
}


