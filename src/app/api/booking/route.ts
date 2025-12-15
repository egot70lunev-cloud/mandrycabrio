import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cars } from '@/data/cars';
import { isCarAvailable } from '@/lib/availability';
import { calcTotalPrice } from '@/lib/pricing';
import { calcExtras, type ExtrasSummary } from '@/lib/extras';
import { sendClientEmail, sendAdminEmail, type SendEmailResult } from '@/lib/email';
import { buildAdminWhatsAppMessage, buildClientWhatsAppLink, sendWhatsAppAdmin } from '@/lib/whatsapp';
import { createCalendarEvent } from '@/lib/calendar';
import { BookingStatus } from '@prisma/client';
import type { ExtraId } from '@/data/extras';

type BookingRequestBody = {
  carSlug: string;
  startAt: string; // ISO string
  endAt: string; // ISO string
  pickupLocation: string;
  dropoffLocation: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  flightNumber?: string;
  extras?: ExtraId[];
  acceptTerms: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequestBody = await request.json();

    // Validation: Required fields
    if (
      !body.carSlug ||
      !body.startAt ||
      !body.endAt ||
      !body.pickupLocation ||
      !body.dropoffLocation ||
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.acceptTerms
    ) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validation: Terms acceptance
    if (!body.acceptTerms) {
      return NextResponse.json(
        { ok: false, error: 'You must accept the rental terms' },
        { status: 400 }
      );
    }

    // Validation: Dates
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);

    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      return NextResponse.json(
        { ok: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (endAt <= startAt) {
      return NextResponse.json(
        { ok: false, error: 'Return date must be after pickup date' },
        { status: 400 }
      );
    }

    // Check if dates are in the past
    const now = new Date();
    if (startAt < now) {
      return NextResponse.json(
        { ok: false, error: 'Pickup date cannot be in the past' },
        { status: 400 }
      );
    }

    // Find car
    const car = cars.find((c) => c.slug === body.carSlug);
    if (!car) {
      return NextResponse.json(
        { ok: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Anti-overlap check
    const isAvailable = await isCarAvailable(body.carSlug, startAt, endAt);
    if (!isAvailable) {
      return NextResponse.json(
        { ok: false, error: 'Car is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate pricing
    const pricingSummary = calcTotalPrice(car, body.startAt, body.endAt);

    // Validate and sanitize extras (mutual exclusion for second driver options)
    let selectedExtras = body.extras || [];
    const hasSouth = selectedExtras.includes('second_driver_south');
    const hasNorth = selectedExtras.includes('second_driver_north');
    
    // If both second driver options are selected, keep only the last one (or North if both present)
    if (hasSouth && hasNorth) {
      // Remove South, keep North (or could keep the last one in array order)
      selectedExtras = selectedExtras.filter(id => id !== 'second_driver_south');
    }

    // Calculate extras
    const extrasSummary = calcExtras(selectedExtras);
    const totalEstimateFinal = (pricingSummary.total || 0) + extrasSummary.extrasTotal;

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        carSlug: body.carSlug,
        startAt,
        endAt,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        name: body.name,
        email: body.email,
        phone: body.phone,
        whatsapp: body.whatsapp || null,
        flightNumber: body.flightNumber || null,
        extrasJson: JSON.stringify(extrasSummary),
        extrasTotal: extrasSummary.extrasTotal > 0 ? extrasSummary.extrasTotal : null,
        status: BookingStatus.PENDING,
      },
    });

    // Side effects (non-blocking, don't fail booking if these fail)
    let clientEmailResult: SendEmailResult | null = null;
    let adminEmailResult: SendEmailResult | null = null;
    try {
      console.log('[BOOKING] email client ->', booking.email);
      clientEmailResult = await sendClientEmail(booking, car, pricingSummary, extrasSummary);
      console.log('[BOOKING] email client result ->', clientEmailResult);

      console.log('[BOOKING] email admin ->', car ? car.name : '', 'to', process.env.ADMIN_EMAIL);
      adminEmailResult = await sendAdminEmail(booking, car, pricingSummary, extrasSummary);
      console.log('[BOOKING] email admin result ->', adminEmailResult);
    } catch (emailError) {
      console.error('[BOOKING] Email error (non-blocking):', emailError);
    }

    // Build WhatsApp link for client
    const clientWhatsAppLink = buildClientWhatsAppLink({
      bookingId: booking.id,
      carName: car.name,
      fromISO: body.startAt,
      toISO: body.endAt,
    });

    try {
      // Send WhatsApp to admin
      const whatsappParams = {
        bookingId: booking.id,
        carName: car.name,
        fromISO: body.startAt,
        toISO: body.endAt,
        days: pricingSummary.days,
        pickup: body.pickupLocation,
        dropoff: body.dropoffLocation,
        deposit: car.deposit,
        total: pricingSummary.total,
        dailyRate: pricingSummary.dailyRate,
        client: {
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          whatsapp: booking.whatsapp || undefined,
        },
        flightNumber: booking.flightNumber || undefined,
        extrasSummary: extrasSummary.items.length > 0 ? {
          items: extrasSummary.items.map(item => ({ id: item.id, label: item.label, price: item.price })),
          extrasTotal: extrasSummary.extrasTotal,
          hasByAgreement: extrasSummary.hasByAgreement,
        } : undefined,
      };
      const whatsappMessage = buildAdminWhatsAppMessage(whatsappParams);
      await sendWhatsAppAdmin(whatsappMessage);
    } catch (whatsappError) {
      console.error('[BOOKING] WhatsApp error (non-blocking):', whatsappError);
    }

    try {
      // Create Google Calendar event
      await createCalendarEvent({
        bookingId: booking.id,
        carName: car.name,
        fromISO: body.startAt,
        toISO: body.endAt,
        pickup: body.pickupLocation,
        dropoff: body.dropoffLocation,
        clientName: booking.name,
        clientEmail: booking.email,
        clientPhone: booking.phone,
        deposit: car.deposit,
        total: totalEstimateFinal > 0 ? totalEstimateFinal : pricingSummary.total,
        status: booking.status as 'PENDING' | 'CONFIRMED',
        extrasSummary: extrasSummary.items.length > 0 ? {
          items: extrasSummary.items.map(item => ({ id: item.id, label: item.label, price: item.price })),
          extrasTotal: extrasSummary.extrasTotal,
          hasByAgreement: extrasSummary.hasByAgreement,
        } : undefined,
      });
    } catch (calendarError) {
      console.error('[BOOKING] Google Calendar error (non-blocking):', calendarError);
    }

    // Return success response
    const responseBody: Record<string, unknown> = {
      ok: true,
      bookingId: booking.id,
      status: booking.status,
      whatsappLink: clientWhatsAppLink,
      summary: {
        car: car.name,
        dates: {
          start: body.startAt,
          end: body.endAt,
          days: pricingSummary.days,
        },
        pickup: body.pickupLocation,
        dropoff: body.dropoffLocation,
        deposit: car.deposit,
        estimatedTotal: pricingSummary.total,
        extrasTotal: extrasSummary.extrasTotal,
        totalEstimateFinal: totalEstimateFinal > 0 ? totalEstimateFinal : pricingSummary.total,
        extras: extrasSummary.items.length > 0 ? extrasSummary.items : [],
      },
    };

    if (process.env.NODE_ENV !== 'production') {
      responseBody.emailDebug = {
        client: clientEmailResult,
        admin: adminEmailResult,
      };
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('[BOOKING] Error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

