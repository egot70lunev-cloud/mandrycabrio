import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/uk`,
    languages: {
      'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/en`,
      'es': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/es`,
      'de': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/de`,
      'ru': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/ru`,
      'uk': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mandrycabrio.com'}/uk`,
    },
  },
};

export default function UkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteShell locale="uk">
      {children}
    </SiteShell>
  );
}

