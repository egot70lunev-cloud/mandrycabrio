import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 4);
  in3Days.setHours(10, 0, 0, 0);

  const in5Days = new Date();
  in5Days.setDate(in5Days.getDate() + 6);
  in5Days.setHours(10, 0, 0, 0);

  // Booking 1: Block a specific car for tomorrow to +3 days
  const booking1 = await prisma.booking.upsert({
    where: { id: 'seed-booking-1' },
    update: {},
    create: {
      id: 'seed-booking-1',
      carSlug: 'jeep-wrangler-sahara-4xe-2022-sky-top',
      startAt: tomorrow,
      endAt: in3Days,
      pickupLocation: 'north-airport-tfn',
      dropoffLocation: 'north-airport-tfn',
      name: 'Test User 1',
      email: 'test1@example.com',
      phone: '+1234567890',
      whatsapp: '+1234567890',
      status: BookingStatus.CONFIRMED,
    },
  });

  console.log('✅ Created booking 1:', booking1.id);

  // Booking 2: Block another car for +5 days to +7 days
  const booking2 = await prisma.booking.upsert({
    where: { id: 'seed-booking-2' },
    update: {},
    create: {
      id: 'seed-booking-2',
      carSlug: 'audi-a5-cabrio-2022',
      startAt: in5Days,
      endAt: new Date(in5Days.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
      pickupLocation: 'south-airport-tfs',
      dropoffLocation: 'south-airport-tfs',
      name: 'Test User 2',
      email: 'test2@example.com',
      phone: '+1234567891',
      status: BookingStatus.PENDING,
    },
  });

  console.log('✅ Created booking 2:', booking2.id);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




