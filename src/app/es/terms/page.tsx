import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Términos y Condiciones | MandryCabrio',
  description: 'Términos y condiciones de alquiler de MandryCabrio en Tenerife. Lee nuestras políticas sobre depósitos, seguros y servicios adicionales.',
  path: '/es/terms',
  locale: 'es',
});

export default function TermsPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-8">Términos y Condiciones</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Términos Clave de Alquiler</h2>
            <ul className="space-y-3 text-[#6B6B6B]">
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Anticipo:</strong> €100 requerido para confirmar la reserva</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Seguro:</strong> Seguro completo incluido, franquicia €600</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Conductor:</strong> 26+ años con 3+ años de carnet</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Combustible:</strong> Política de lleno a lleno</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Fumar:</strong> No fumar (penalización igual al depósito)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Entrega:</strong> Aeropuerto Norte +€50, otras direcciones bajo acuerdo</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Servicios Adicionales</h2>
            <div className="space-y-4 text-[#6B6B6B]">
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Silla de niño / capazo / elevador</h3>
                <p>Silla de niño, capazo o elevador gratuito para tu alquiler. Disponible bajo solicitud.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Segundo conductor</h3>
                <p>Autorización de conductor adicional disponible por una tarifa extra. Elige la opción apropiada según tu zona de recogida/devolución:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Segundo conductor — Sur (€30):</strong> Para Aeropuerto Sur TFS, Los Cristianos y ubicaciones de la zona Sur</li>
                  <li><strong>Segundo conductor — Norte (€80):</strong> Para Aeropuerto Norte TFN, Puerto de la Cruz, Santa Cruz y ubicaciones de la zona Norte</li>
                </ul>
                <p className="mt-2 text-sm text-[#6B6B6B]">Nota: Solo se puede seleccionar una opción de segundo conductor por reserva.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Entrega / recogida en la isla</h3>
                <p>Servicio de entrega y recogida en toda Tenerife disponible bajo acuerdo. El precio se confirmará por WhatsApp según tu ubicación específica y requisitos.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Métodos de Pago</h2>
            <p className="text-[#6B6B6B]">
              Aceptamos Privat24, Mono, USDT, Santander, BBVA y Caixa. Enlace de Apple Pay disponible bajo solicitud.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Contacto</h2>
            <p className="text-[#6B6B6B]">
              Para cualquier pregunta o solicitud especial, contáctanos por WhatsApp: <a href="https://wa.me/34692735125" className="text-[#2B2B2B] underline">+34 692 735 125</a>
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}



