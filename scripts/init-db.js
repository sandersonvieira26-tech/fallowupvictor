const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Client" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "isNew" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Appointment" (
      "id" TEXT NOT NULL,
      "clientId" TEXT NOT NULL,
      "date" TIMESTAMP(3) NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'scheduled',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Appointment_clientId_fkey'
      ) THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey"
          FOREIGN KEY ("clientId") REFERENCES "Client"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE;
      END IF;
    END $$
  `)

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Client_phone_key" ON "Client"("phone")
  `)

  console.log('Database initialized successfully.')
}

main()
  .catch((e) => { console.error('Init error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
