import { PrismaClient, ListingStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DESTINATIONS = [
  {
    name: 'Lonavala',
    slug: 'lonavala',
    district: 'Pune',
    region: 'Western Ghats',
    description: 'A popular hill station close to Mumbai and Pune, famous for monsoon treks and scenic viewpoints.',
    heroImageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    latitude: 18.7548,
    longitude: 73.4062,
    bestSeason: 'Monsoon (Jun–Sep)',
    difficultyTags: ['Easy', 'Family Friendly'],
  },
  {
    name: 'Bhandardara',
    slug: 'bhandardara',
    district: 'Ahmednagar',
    region: 'Western Ghats',
    description: 'Known for its lakes, waterfalls, and camping. Home to Arthur Lake and Randha Falls.',
    heroImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    latitude: 19.5403,
    longitude: 73.7543,
    bestSeason: 'Winter (Oct–Feb)',
    difficultyTags: ['Moderate', 'Camping'],
  },
  {
    name: 'Kaas Plateau',
    slug: 'kaas-plateau',
    district: 'Satara',
    region: 'Western Ghats',
    description: "Maharashtra's Valley of Flowers — a UNESCO World Heritage Site with seasonal wildflowers.",
    heroImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    latitude: 17.7175,
    longitude: 73.8847,
    bestSeason: 'Monsoon (Aug–Sep)',
    difficultyTags: ['Easy', 'Nature Walk'],
  },
  {
    name: 'Harihar Fort',
    slug: 'harihar-fort',
    district: 'Nashik',
    region: 'Western Ghats',
    description: 'Famous for its iconic rock-cut steps and thrilling vertical climb near Trimbakeshwar.',
    heroImageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    latitude: 19.9053,
    longitude: 73.4451,
    bestSeason: 'Winter (Nov–Feb)',
    difficultyTags: ['Difficult', 'Trekking'],
  },
  {
    name: 'Tarkarli',
    slug: 'tarkarli',
    district: 'Sindhudurg',
    region: 'Konkan Coast',
    description: 'Pristine beaches, scuba diving, and water sports on the Konkan coast.',
    heroImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    latitude: 16.0244,
    longitude: 73.461,
    bestSeason: 'Winter (Oct–Mar)',
    difficultyTags: ['Easy', 'Water Sports'],
  },
  {
    name: 'Matheran',
    slug: 'matheran',
    district: 'Raigad',
    region: 'Western Ghats',
    description: "Asia's only automobile-free hill station with toy train and panoramic views.",
    heroImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    latitude: 18.9869,
    longitude: 73.2653,
    bestSeason: 'Monsoon (Jun–Sep)',
    difficultyTags: ['Easy', 'Family Friendly'],
  },
  {
    name: 'Rajmachi',
    slug: 'rajmachi',
    district: 'Pune',
    region: 'Western Ghats',
    description: 'Historic twin forts with an amazing trek route through lush Sahyadri forests.',
    heroImageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    latitude: 18.8278,
    longitude: 73.3895,
    bestSeason: 'Monsoon (Jun–Sep)',
    difficultyTags: ['Moderate', 'Trekking'],
  },
  {
    name: 'Igatpuri',
    slug: 'igatpuri',
    district: 'Nashik',
    region: 'Western Ghats',
    description: 'Surrounded by the highest peaks in Sahyadri — a trekker and monsoon paradise.',
    heroImageUrl: 'https://images.unsplash.com/photo-1439068794076-944eafa2a0f0?w=800&q=80',
    latitude: 19.695,
    longitude: 73.5592,
    bestSeason: 'Monsoon (Jun–Sep)',
    difficultyTags: ['Moderate', 'Trekking'],
  },
  {
    name: 'Karjat',
    slug: 'karjat',
    district: 'Raigad',
    region: 'Western Ghats',
    description: "A trekker's paradise and monsoon getaway with forts, waterfalls, and camping.",
    heroImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    latitude: 18.9104,
    longitude: 73.3237,
    bestSeason: 'Monsoon (Jun–Sep)',
    difficultyTags: ['Moderate', 'Camping'],
  },
  {
    name: 'Malshej Ghat',
    slug: 'malshej-ghat',
    district: 'Pune',
    region: 'Western Ghats',
    description: 'Mountain pass known for numerous waterfalls and flamingo sightings in monsoon.',
    heroImageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    latitude: 19.34,
    longitude: 73.745,
    bestSeason: 'Monsoon (Jul–Sep)',
    difficultyTags: ['Easy', 'Scenic Drive'],
  },
];

const LISTING_IMAGES = [
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80',
  'https://images.unsplash.com/photo-1504280390367-361c6d9d38f4?w=800&q=80',
  'https://images.unsplash.com/photo-1478131143088-4e6c210e2e58?w=800&q=80',
  'https://images.unsplash.com/photo-1533872194216-94e0bbb1bee9?w=800&q=80',
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.operatorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding admin and sample user...');
  const hashedPassword = await bcrypt.hash('123456', 12);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@maharashtra-adventures.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Harini',
      email: 'sharini822@gmail.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });

  console.log('Seeding Categories...');
  const categoriesData = [
    { name: 'Trekking', slug: 'trekking', description: 'Explore scenic trails and rugged terrains.' },
    { name: 'Camping', slug: 'camping', description: 'Stay under the stars with campfires and tents.' },
    { name: 'Water Sports', slug: 'water-sports', description: 'River rafting, scuba diving, and more.' },
    { name: 'Wildlife Safari', slug: 'wildlife-safari', description: 'Encounter nature and wildlife closely.' },
    { name: 'Cycling', slug: 'cycling', description: 'Bike across beautiful landscapes and hills.' },
    { name: 'Paragliding', slug: 'paragliding', description: 'Fly high above the mountains.' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    categories.push(await prisma.category.create({ data: cat }));
  }

  console.log('Seeding Destinations...');
  const destinations = [];
  for (const dest of DESTINATIONS) {
    destinations.push(await prisma.destination.create({ data: dest }));
  }

  console.log('Seeding Operators...');
  const operators = [];
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Operator ${i}`,
        email: `operator${i}@example.com`,
        password: hashedPassword,
        role: Role.OPERATOR,
        operatorProfile: {
          create: {
            businessName: `Adventure Co ${i}`,
            description: 'Top rated adventure operator in Maharashtra.',
            isVerified: true,
            rating: 4.5 + i * 0.1,
            phone: `+91987654321${i}`,
            logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80',
          },
        },
      },
      include: { operatorProfile: true },
    });
    operators.push(user.operatorProfile!);
  }

  console.log('Seeding Coupons...');
  await prisma.coupon.create({
    data: {
      code: 'MAHA10',
      discountPercent: 10,
      validFrom: new Date(),
      validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      maxUses: 100,
    },
  });

  console.log('Seeding Listings...');
  for (let i = 1; i <= 15; i++) {
    const category = categories[i % categories.length];
    const destination = destinations[i % destinations.length];
    const operator = operators[i % operators.length];
    const basePrice = 1000 + Math.floor(Math.random() * 4000);

    await prisma.listing.create({
      data: {
        title: `${category.name} in ${destination.name}`,
        slug: `${category.slug}-in-${destination.slug}-${i}`,
        operatorId: operator.id,
        categoryId: category.id,
        destinationId: destination.id,
        shortDescription: `Experience the best ${category.name} in ${destination.name}.`,
        fullDescription: `Join us for an unforgettable ${category.name.toLowerCase()} experience at ${destination.name}. Our expert guides ensure safety and fun for all skill levels.`,
        pricePerPerson: basePrice,
        discountPrice: Math.round(basePrice * 0.9),
        durationDays: category.name === 'Camping' ? 2 : 1,
        durationHours: category.name === 'Water Sports' ? 4 : null,
        groupSizeMin: 1,
        groupSizeMax: 20,
        difficultyLevel: 'MODERATE',
        inclusions: ['Guide', 'Safety Gear', 'Meals'],
        exclusions: ['Transport', 'Personal Expenses'],
        thingsToCarry: ['Water Bottle', 'Comfortable Shoes', 'Sunscreen'],
        images: [LISTING_IMAGES[i % LISTING_IMAGES.length]],
        status: ListingStatus.PUBLISHED,
        avgRating: 4 + Math.random(),
        itineraryDays: {
          create: [
            {
              dayNumber: 1,
              title: 'Arrival and Setup',
              description: 'Arrive at the base camp and get ready for the adventure.',
              activities: ['Briefing', 'Trekking/Activity'],
            },
          ],
        },
        availabilitySlots: {
          create: [
            {
              date: new Date(new Date().setDate(new Date().getDate() + 7)),
              capacity: 20,
            },
            {
              date: new Date(new Date().setDate(new Date().getDate() + 14)),
              capacity: 20,
            },
            {
              date: new Date(new Date().setDate(new Date().getDate() + 21)),
              capacity: 20,
            },
          ],
        },
      },
    });
  }

  console.log('Seeding completed successfully!');
  console.log('Test accounts: admin@maharashtra-adventures.com / 123456');
  console.log('              sharini822@gmail.com / 123456');
  console.log('              operator1@example.com / 123456');
}

main()
  .catch((e) => {
    console.error('Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
