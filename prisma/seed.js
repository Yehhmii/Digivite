// prisma/seed.js (CommonJS — uses built-in crypto instead of nanoid)
const { PrismaClient } = require('@prisma/client');
const { randomBytes } = require('crypto');

const prisma = new PrismaClient();

function shortId(size = 8) {
  // random hex string, length = size (hex chars)
  return randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size);
}

function generateGuestSlug(eventSlug) {
  const id = shortId(8);
  return eventSlug ? `${eventSlug}-${id}` : id;
}

function generateQrToken() {
  return `q_${shortId(20)}`;
}

async function main() {
  const eventSlug = 'royal-wedding';
  let event = await prisma.event.findUnique({ where: { slug: eventSlug } });

  if (!event) {
    event = await prisma.event.create({
      data: {
        slug: eventSlug,
        title: "John & Jane's Royal Wedding",
        date: new Date('2026-01-10T16:00:00Z'),
        venue: 'Royal Banquet Hall',
      },
    });
    console.log('Created event:', event.slug);
  } else {
    console.log('Event already exists:', event.slug);
  }

  const guestSlug = generateGuestSlug(event.slug);
  const guest = await prisma.guest.create({
    data: {
      eventId: event.id,
      fullName: 'John Demo',
      email: 'john@demo.com',
      phone: '+23400000000',
      qrCodeToken: generateQrToken(),
      slug: guestSlug,
      status: 'ACCEPTED',
      numberOfGuests: 1,
    },
  });

  console.log('Seeded guest slug:', guest.slug);
  console.log('Guest id:', guest.id);
  console.log('You can now open: http://localhost:3000/guest/' + guest.slug);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
