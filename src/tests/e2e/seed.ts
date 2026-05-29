import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

import { PrismaClient } from '@/generated/client/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('--- START SEEDING ---');
  const categories = [
    { name: 'Carretera', slug: 'carretera' },
    { name: 'Montaña (MTB)', slug: 'montana-mtb' },
    { name: 'Aero', slug: 'aero' },
    { name: 'Eléctrica', slug: 'electrica' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const testUserEmail = 'global.testuser@example.com';
  const testUserPassword = 'Password1,.-';
  const hashedPassword = await bcrypt.hash(testUserPassword, 10);

  const testUser = await prisma.user.upsert({
    where: { email: testUserEmail },
    update: { password: hashedPassword },
    create: {
      username: 'globaltestuser',
      email: testUserEmail,
      password: hashedPassword,
    },
  });

  const otherUserEmail = 'other.testuser@example.com';
  const otherUserPassword = 'Password2,.-';
  const otherHashedPassword = await bcrypt.hash(otherUserPassword, 10);

  const otherUser = await prisma.user.upsert({
    where: { email: otherUserEmail },
    update: { password: otherHashedPassword },
    create: {
      username: 'othertestuser',
      email: otherUserEmail,
      password: otherHashedPassword,
    },
  });

  const carretera = await prisma.category.findUnique({ where: { slug: 'carretera' } });
  const mtb = await prisma.category.findUnique({ where: { slug: 'montana-mtb' } });

  const testProductImage = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400';

  if (carretera) {
    await prisma.product.upsert({
      where: { id: 'e2e-test-product-1' },
      update: {},
      create: {
        id: 'e2e-test-product-1',
        title: 'Trek Domane SL5',
        description: 'Great road bike in excellent condition. Lightweight carbon frame.',
        price: 2500,
        imageUrl: testProductImage,
        location: 'Madrid, Spain',
        categoryId: carretera.id,
        userId: testUser.id,
        status: 'ACTIVE',
      },
    });
  }

  if (mtb) {
    await prisma.product.upsert({
      where: { id: 'e2e-test-product-2' },
      update: {},
      create: {
        id: 'e2e-test-product-2',
        title: 'Specialized Rockhopper',
        description: 'Perfect MTB for trails. Recently serviced.',
        price: 1200,
        imageUrl: testProductImage,
        location: 'Barcelona, Spain',
        categoryId: mtb.id,
        userId: otherUser.id,
        status: 'ACTIVE',
      },
    });
  }

  await prisma.product.upsert({
    where: { id: 'e2e-test-product-3' },
    update: {},
    create: {
      id: 'e2e-test-product-3',
      title: 'Cannondale Synapse',
      description: 'Endurance road bike, comfortable for long rides.',
      price: 3200,
      imageUrl: testProductImage,
      location: 'Valencia, Spain',
      categoryId: carretera!.id,
      userId: testUser.id,
      status: 'ACTIVE',
    },
  });

  console.log('--- END SEEDING ---');
}

seed()
  .catch(e => {
    console.error('Test Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
