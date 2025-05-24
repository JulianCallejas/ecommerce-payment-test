import { Prisma, PrismaClient } from '@prisma/client';
import { seedingProducts } from '../src/application/common/seeding-products';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.product.deleteMany();
    console.info('Database cleared');

    const createManyPosts = seedingProducts.map(async (product) => {
      await prisma.product.create({
        data: product as Prisma.ProductCreateInput
      });
    });

    await Promise.all(createManyPosts);
    console.info('3 Products created');
  } catch (error) {}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
