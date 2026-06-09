import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

import { PrismaClient } from '@/generated/client/client';

import {
  GLOBAL_TEST_USER,
  OTHER_TEST_USER,
  TEST_PRODUCT_IMAGE,
  TEST_PRODUCTS,
} from './helpers';

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

  const hashedPassword = await bcrypt.hash(GLOBAL_TEST_USER.password, 10);

  const testUser = await prisma.user.upsert({
    where: { email: GLOBAL_TEST_USER.email },
    update: { password: hashedPassword },
    create: {
      username: GLOBAL_TEST_USER.username,
      email: GLOBAL_TEST_USER.email,
      password: hashedPassword,
    },
  });

  const otherHashedPassword = await bcrypt.hash(OTHER_TEST_USER.password, 10);

  const otherUser = await prisma.user.upsert({
    where: { email: OTHER_TEST_USER.email },
    update: { password: otherHashedPassword },
    create: {
      username: OTHER_TEST_USER.username,
      email: OTHER_TEST_USER.email,
      password: otherHashedPassword,
    },
  });

  const roadCategory = await prisma.category.findUnique({ where: { slug: 'carretera' } });
  const mtbCategory = await prisma.category.findUnique({
    where: { slug: 'montana-mtb' },
  });

  if (roadCategory) {
    await prisma.product.upsert({
      where: { id: TEST_PRODUCTS.CANYON_AEROROAD.id },
      update: {},
      create: {
        ...TEST_PRODUCTS.CANYON_AEROROAD,
        imageUrl: TEST_PRODUCT_IMAGE,
        categoryId: roadCategory.id,
        userId: testUser.id,
        status: 'ACTIVE',
      },
    });
  }

  if (mtbCategory) {
    await prisma.product.upsert({
      where: { id: TEST_PRODUCTS.MMR_RAKISH.id },
      update: {},
      create: {
        ...TEST_PRODUCTS.MMR_RAKISH,
        imageUrl: TEST_PRODUCT_IMAGE,
        categoryId: mtbCategory.id,
        userId: otherUser.id,
        status: 'ACTIVE',
      },
    });
  }

  await prisma.product.upsert({
    where: { id: TEST_PRODUCTS.CANNONDALE_CAAD.id },
    update: {},
    create: {
      ...TEST_PRODUCTS.CANNONDALE_CAAD,
      imageUrl: TEST_PRODUCT_IMAGE,
      categoryId: roadCategory!.id,
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
