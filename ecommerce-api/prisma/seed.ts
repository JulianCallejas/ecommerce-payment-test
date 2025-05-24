import { Prisma, PrismaClient } from '@prisma/client';
import { seedingProducts } from '../src/application/common/seeding-products';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    console.info('Database cleared');

    const createMany = seedingProducts.map(async (product) => {
      await prisma.product.create({
        data: product as Prisma.ProductCreateInput
      });
    });

    await Promise.all(createMany);
    console.info('3 Products created');
  } catch (error) {
    console.error(error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
