import { Section, Card, Button } from "@/components/ui";
import { SearchWidget } from "@/components/SearchWidget";
import { HeroImage } from "@/components/HeroImage";
import { PaymentMethodsBlock } from "@/components/PaymentMethodsBlock";
import Link from "next/link";
import { generatePageMetadata } from "../metadata";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { ScrollReveal } from "@/components/animations";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Autovermietung auf Teneriffa | MandryCabrio",
  description: "Premium Autovermietung auf Teneriffa. Entdecken Sie unsere Sammlung von Cabrios, SUVs und Luxusfahrzeugen. Buchen Sie Ihre perfekte Fahrt mit Stil und Komfort.",
  path: "/de",
  locale: 'de',
});

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mandrycabrio.com";
  const localBusinessSchema = buildLocalBusinessSchema(siteUrl);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {/* Hero Section with Search */}
      <Section background="surface" padding="lg" className="relative overflow-hidden hero-gradient">
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center">
          {/* Hero Background Image */}
          <HeroImage priority />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Hero Text */}
                <ScrollReveal delay={0}>
                  <div className="text-[var(--text)]">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      Premium Autovermietung auf Teneriffa
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-8 leading-relaxed">
                      Erleben Sie Luxus-Autovermietung mit unserer Premium-Sammlung von Cabrios, SUVs und Luxusfahrzeugen.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/de/cars">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
                          Autos durchsuchen
                        </Button>
                      </Link>
                      <Link href="/de/terms">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                          Mehr erfahren
                        </Button>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Right: Search Widget */}
                <ScrollReveal delay={100}>
                  <Card className="bg-[var(--surface)] border-[var(--border)] p-6 md:p-8 shadow-2xl">
                    <SearchWidget />
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Payment Methods Section */}
      <Section background="primary" padding="md">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={0}>
            <PaymentMethodsBlock variant="default" />
          </ScrollReveal>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="primary" padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <Card className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--navy-950)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Vollkaskoversicherung</h3>
                <p className="text-[var(--text-muted)]">Umfassende Abdeckung in jeder Miete enthalten</p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--navy-950)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">24/7 Support</h3>
                <p className="text-[var(--text-muted)]">Verfügbar über WhatsApp für jede Unterstützung</p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--navy-950)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Premium Flotte</h3>
                <p className="text-[var(--text-muted)]">Sorgfältig ausgewählte Luxus- und Premiumfahrzeuge</p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </Section>
    </>
  );
}
