import { Section, Card, Button } from "@/components/ui";
import { SearchWidget } from "@/components/SearchWidget";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsSchema } from "@/components/ReviewsSchema";
import { HeroImage } from "@/components/HeroImage";
import { PaymentMethodsBlock } from "@/components/PaymentMethodsBlock";
import Link from "next/link";
import { generatePageMetadata } from "../metadata";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { ScrollReveal } from "@/components/animations";
import type { Metadata } from "next";
import { t } from '@/lib/i18n';

export const metadata: Metadata = generatePageMetadata({
  title: "Alquiler de Coches en Tenerife | MandryCabrio",
  description: "Alquiler de coches premium en Tenerife. Descubre nuestra colección de cabrios, SUV y vehículos de lujo. Reserva tu coche perfecto con estilo y comodidad.",
  path: "/es",
  locale: 'es',
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
                      Alquiler de Coches Premium en Tenerife
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-8 leading-relaxed">
                      Disfruta del alquiler de coches de lujo con nuestra colección premium de cabrios, SUV y vehículos de lujo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/es/cars">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
                          Ver Coches
                        </Button>
                      </Link>
                      <Link href="/es/terms">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                          Saber Más
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
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Seguro Completo</h3>
                <p className="text-[var(--text-muted)]">Cobertura completa incluida en cada alquiler</p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--navy-950)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Soporte 24/7</h3>
                <p className="text-[var(--text-muted)]">Disponible por WhatsApp para cualquier asistencia</p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--navy-950)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Flota Premium</h3>
                <p className="text-[var(--text-muted)]">Vehículos de lujo y premium cuidadosamente seleccionados</p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Customer Reviews Section */}
      <Section background="surface" padding="lg">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={0}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">Reseñas de Clientes</h2>
              <p className="text-xl text-[var(--text-muted)]">Descubre lo que dicen nuestros clientes sobre su experiencia</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollReveal delay={100}>
              <ReviewsList lang="es" />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <ReviewForm />
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Reviews Schema */}
      <ReviewsSchema lang="es" />
    </>
  );
}

