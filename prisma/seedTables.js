// prisma/seedTables.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const eventId = "M'J Forever25";
  for (let i = 1; i <= 12; i++) {
    await prisma.table.create({
      data: {
        eventId,
        number: i,
        capacity: 8
      }
    });
  }
  console.log('seeded tables');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
