import { Section, Card } from '@/components/ui';
import { generatePageMetadata } from '../../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms & Conditions | MandryCabrio',
  description: 'Rental terms and conditions for MandryCabrio car rental in Tenerife. Read our policies on deposits, insurance, and extra services.',
  path: '/en/terms',
  locale: 'en',
});

export default function TermsPage() {
  return (
    <Section background="primary" padding="lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2B2B2B] mb-8">Terms & Conditions</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Key Rental Terms</h2>
            <ul className="space-y-3 text-[#6B6B6B]">
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Prepayment:</strong> €100 required to confirm booking</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Insurance:</strong> Full insurance included, excess €600</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Driver:</strong> 26+ years old with 3+ years license</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Fuel:</strong> Full-to-full policy</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Smoking:</strong> No smoking (penalty equals deposit)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#2B2B2B] mr-2">•</span>
                <span><strong>Delivery:</strong> North airport +€50, other addresses by agreement</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Extra Services</h2>
            <div className="space-y-4 text-[#6B6B6B]">
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Child seat / bassinet / booster</h3>
                <p>Free child seat, bassinet, or booster seat for your rental. Available upon request.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Second driver</h3>
                <p>Additional driver authorization available for an extra fee. Choose the appropriate option based on your pickup/dropoff zone:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Second driver — South (€30):</strong> For South Airport TFS, Los Cristianos, and South zone locations</li>
                  <li><strong>Second driver — North (€80):</strong> For North Airport TFN, Puerto de la Cruz, Santa Cruz, and North zone locations</li>
                </ul>
                <p className="mt-2 text-sm text-[#6B6B6B]">Note: Only one second driver option can be selected per booking.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#2B2B2B] mb-2">Delivery / pickup across the island</h3>
                <p>Delivery and pickup service across Tenerife available by agreement. Price will be confirmed via WhatsApp based on your specific location and requirements.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Payment Methods</h2>
            <p className="text-[#6B6B6B]">
              We accept Privat24, Mono, USDT, Santander, BBVA, and Caixa. Apple Pay link available on request.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-4">Contact</h2>
            <p className="text-[#6B6B6B]">
              For any questions or special requests, please contact us on WhatsApp: <a href="https://wa.me/34692735125" className="text-[#2B2B2B] underline">+34 692 735 125</a>
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

