import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cars } from '@/data/cars';
import { isCarAvailable } from '@/lib/availability';
import { calcTotalPrice } from '@/lib/pricing';
import { calcExtras, type ExtrasSummary } from '@/lib/extras';
import { sendClientEmail, sendAdminEmail, type SendEmailResult } from '@/lib/email';
import { buildAdminWhatsAppMessage, buildClientWhatsAppLink, sendWhatsAppAdmin } from '@/lib/whatsapp';
import { createBookingEvent } from '@/lib/googleCalendar';
import { formatEUR } from '@/lib/format';
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

    // Create booking in database (with error handling)
    let booking;
    try {
      booking = await prisma.booking.create({
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
    } catch (dbError) {
      console.error('[BOOKING] Database error:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Failed to create booking in database' },
        { status: 500 }
      );
    }

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

    // Create Google Calendar event (non-blocking for booking flow)
    let calendarResult: { ok: boolean; eventId?: string; htmlLink?: string; error?: string } | null = null;
    try {
      // Log calendar creation start
      console.log('CALENDAR_CREATE_START', { calendarId: process.env.GOOGLE_CALENDAR_ID || process.env.CALENDAR_ID });

      // Build location labels
      const locationLabels: Record<string, string> = {
        'north-airport-tfn': 'North Airport (TFN)',
        'south-airport-tfs': 'South Airport (TFS)',
        'puerto-de-la-cruz': 'Puerto de la Cruz',
        'santa-cruz': 'Santa Cruz',
        'los-cristianos': 'Los Cristianos',
        'other': 'Other (by agreement)',
      };

      const pickupLabel = locationLabels[body.pickupLocation] || body.pickupLocation;
      const dropoffLabel = locationLabels[body.dropoffLocation] || body.dropoffLocation;

      // Create calendar event with specified format
      calendarResult = await createBookingEvent({
        bookingId: booking.id,
        carName: car.name,
        customerName: booking.name,
        customerPhone: booking.phone,
        pickupLocation: pickupLabel,
        dropoffLocation: dropoffLabel,
        deposit: car.deposit,
        total: totalEstimateFinal > 0 ? totalEstimateFinal : pricingSummary.total,
        notes: booking.flightNumber ? `Flight: ${booking.flightNumber}` : undefined,
        startISO: body.startAt,
        endISO: body.endAt,
      });

      // Update booking with calendar event info if successful
      if (calendarResult.ok && (calendarResult.eventId || calendarResult.htmlLink)) {
        // Log success
        console.log('CALENDAR_CREATE_OK', { eventId: calendarResult.eventId, htmlLink: calendarResult.htmlLink });
        
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            calendarEventId: calendarResult.eventId,
            calendarEventLink: calendarResult.htmlLink,
          },
        });
      } else if (!calendarResult.ok) {
        console.error('[BOOKING] Calendar event creation failed:', calendarResult.error);
      }
    } catch (calendarError) {
      // Non-blocking: log error but don't fail the booking
      console.error('CALENDAR_CREATE_FAIL', calendarError);
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
      calendar: calendarResult?.ok ? {
        eventId: calendarResult.eventId,
        htmlLink: calendarResult.htmlLink,
      } : undefined,
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

