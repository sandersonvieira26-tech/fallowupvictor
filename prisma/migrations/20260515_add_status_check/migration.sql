-- Add CHECK constraint for valid status values
ALTER TABLE "Appointment" ADD CONSTRAINT "status_check"
    CHECK (status IN ('scheduled', 'attended', 'no-show'));
