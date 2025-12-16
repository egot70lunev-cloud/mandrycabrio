import type { Metadata } from 'next';
import EnTermsPage from '../../en/terms/page';
import { generatePageMetadata } from '../../metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Условия аренды | MandryCabrio',
  description:
    'Условия аренды автомобилей MandryCabrio на Тенерифе. Ознакомьтесь с нашими правилами по залогам, страховке и дополнительным услугам.',
  path: '/ru/terms',
  locale: 'ru',
});

export default function TermsPage(props: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[render] terms page locale=ru');
  }
  return <EnTermsPage {...props} />;
}


