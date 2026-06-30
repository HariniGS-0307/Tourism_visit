const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const destCount = await prisma.destination.count();
    console.log('Destinations count:', destCount);
    const catCount = await prisma.category.count();
    console.log('Categories count:', catCount);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
