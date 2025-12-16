-- Add calendar event columns to bookings
ALTER TABLE "Booking" ADD COLUMN "calendarEventId" TEXT;
ALTER TABLE "Booking" ADD COLUMN "calendarEventLink" TEXT;
