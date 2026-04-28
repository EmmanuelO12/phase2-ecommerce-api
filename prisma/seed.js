import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  { email: 'admin@example.com', password: 'Password123!', role: 'ADMIN' },
  { email: 'user@example.com', password: 'Password123!', role: 'USER' },
  { email: 'not-owner@example.com', password: 'Password123!', role: 'USER' },
];

async function main() {
  const hashedUsers = await Promise.all(
    users.map(async (u) => ({
      ...u,
      passwordHash: await bcrypt.hash(u.password, 10),
    })),
  );

  for (const user of hashedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role, passwordHash: user.passwordHash },
      create: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
  }

  const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } });
  const regularUser = await prisma.user.findUniqueOrThrow({ where: { email: 'user@example.com' } });

  const laptop = await prisma.product.upsert({
    where: { name: 'Laptop' },
    update: { description: '14-inch ultrabook', priceCents: 120000, stock: 50, isActive: true },
    create: {
      name: 'Laptop',
      description: '14-inch ultrabook',
      priceCents: 120000,
      stock: 50,
      isActive: true,
    },
  });

  const mouse = await prisma.product.upsert({
    where: { name: 'Wireless Mouse' },
    update: { description: 'Ergonomic Bluetooth mouse', priceCents: 3500, stock: 120, isActive: true },
    create: {
      name: 'Wireless Mouse',
      description: 'Ergonomic Bluetooth mouse',
      priceCents: 3500,
      stock: 120,
      isActive: true,
    },
  });

  const subtotalCents = laptop.priceCents + mouse.priceCents * 2;
  const taxCents = Math.round(subtotalCents * 0.08);
  const totalCents = subtotalCents + taxCents;

  const order = await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: 'PLACED',
      subtotalCents,
      taxCents,
      totalCents,
      items: {
        create: [
          {
            productId: laptop.id,
            quantity: 1,
            unitPriceCents: laptop.priceCents,
            lineTotalCents: laptop.priceCents,
          },
          {
            productId: mouse.id,
            quantity: 2,
            unitPriceCents: mouse.priceCents,
            lineTotalCents: mouse.priceCents * 2,
          },
        ],
      },
    },
    include: { items: true },
  });

  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: regularUser.id,
        productId: laptop.id,
      },
    },
    update: { rating: 5, comment: 'Great laptop for school.' },
    create: {
      userId: regularUser.id,
      productId: laptop.id,
      rating: 5,
      comment: 'Great laptop for school.',
    },
  });

  console.log('Seed complete with users, products, order, and review');
  console.log('Admin login: admin@example.com / Password123!');
  console.log('User login: user@example.com / Password123!');
  console.log('Not owner login: not-owner@example.com / Password123!');
  console.log('Sample order ID:', order.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
