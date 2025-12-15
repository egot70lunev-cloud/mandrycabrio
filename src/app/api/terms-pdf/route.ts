import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function GET() {
  try {
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    // Collect PDF data
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('MandryCabrio', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').text('Terms & Conditions', { align: 'center' });
    doc.moveDown(1);

    // Booking Confirmation
    doc.fontSize(14).font('Helvetica-Bold').text('Booking Confirmation', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('€100 prepayment required to confirm booking.', { align: 'left' });
    doc.moveDown(1);

    // Payment Methods
    doc.fontSize(14).font('Helvetica-Bold').text('Payment Methods', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('We accept the following payment methods:', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text('• Privat24', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Mono', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• USDT', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Santander', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• BBVA', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Caixa', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text('Apple Pay link available on request.', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('Rental payment + deposit paid on pickup.', { align: 'left' });
    doc.moveDown(1);

    // Deposit Rules
    doc.fontSize(14).font('Helvetica-Bold').text('Deposit Rules', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('• Deposit is refundable only if no damage occurs during the rental period.', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Deposit is non-refundable for cancellation or no-show.', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• No right to replacement vehicle in case of breakdown or damage.', { align: 'left' });
    doc.moveDown(1);

    // Insurance
    doc.fontSize(14).font('Helvetica-Bold').text('Insurance', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('Full insurance included with every rental.', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text('Deductible (excess): €600', { align: 'left' });
    doc.moveDown(1);

    // Fuel Policy
    doc.fontSize(14).font('Helvetica-Bold').text('Fuel Policy', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('Fuel policy: Full-to-full. Vehicle must be returned with the same fuel level as at pickup.', { align: 'left' });
    doc.moveDown(1);

    // Restrictions
    doc.fontSize(14).font('Helvetica-Bold').text('Restrictions', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('• Driver must be 26+ years old', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Driver must have 3+ years of valid driving license', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• No smoking allowed in the vehicle (penalty equals deposit)', { align: 'left' });
    doc.moveDown(1);

    // Required Documents
    doc.fontSize(14).font('Helvetica-Bold').text('Required Documents', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('The following documents are required at pickup:', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text('• Driver license (both sides)', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Proof of address', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Email address', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Phone number', { align: 'left' });
    doc.moveDown(1);

    // Delivery
    doc.fontSize(14).font('Helvetica-Bold').text('Delivery', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('• North Airport (TFN): +€50', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Other addresses: By agreement', { align: 'left' });
    doc.moveDown(1);

    // Extra Services
    doc.fontSize(14).font('Helvetica-Bold').text('Extra Services', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('• Child seat / bassinet / booster: Free', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Second driver — South: €30', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Second driver — North: €80', { align: 'left' });
    doc.fontSize(11).font('Helvetica').text('• Delivery / pickup across the island: By agreement', { align: 'left' });
    doc.moveDown(1);

    // Contact
    doc.fontSize(14).font('Helvetica-Bold').text('Contact', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text('For any questions or special requests, please contact us:', { align: 'left' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica-Bold').text('WhatsApp: +34 692 735 125', { align: 'left' });
    doc.moveDown(1);

    // Footer
    doc.fontSize(9).font('Helvetica').text('MandryCabrio - Premium Car Rental in Tenerife', { align: 'center' });
    doc.fontSize(9).font('Helvetica').text('Document generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), { align: 'center' });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="terms.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

