import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { hashPassword } from '@/infrastructure/security/bcrypt-password-hasher';
import { PrismaClient } from '@/generated/client/client';

import { bikeImages, categories, productsData, users } from './data';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('🌱 Seeding...');

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoriesDb = await Promise.all(
    categories.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: {
          name,
          slug: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        },
      })
    )
  );
  console.log(`-- Created [ ${categoriesDb.length} ] categories --`);

  const categoryMap = new Map(categoriesDb.map(cat => [cat.name, cat.id]));

  // Crear usuarios

  const usersDb = await Promise.all(
    users.map(async u =>
      prisma.user.create({
        data: {
          username: u.username,
          email: u.email,
          password: await hashPassword('123'),
        },
      })
    )
  );

  console.log(`-- Created [ ${usersDb.length} ] demo users --`);

  for (const user of usersDb) {
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];

      if (!product) continue;

      const categoryId = categoryMap.get(product.category);

      if (!categoryId) throw new Error(`Category not found: ${product.category}`);

      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          location: product.location,
          imageUrl: `${bikeImages[i % bikeImages.length]}?w=400&h=300&fit=crop`,
          userId: user.id,
          categoryId: categoryId,
        },
      });
    }
  }

  console.log(`-- Created [ ${productsData.length} ] sample products --`);
  console.log('✅ Seed completado');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
