import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: { name: 'Demo Store', slug: 'demo-store', status: 'active' }
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
      active: true
    }
  });


  await prisma.user.upsert({
    where: { email: 'store@demo.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Loja Demo',
      email: 'store@demo.com',
      password: 'store123',
      role: 'store',
      active: true
    }
  });

  const creditPackages = [
    { name: 'Pacote Inicial', quantity: 5, price: 49.9 },
    { name: 'Pacote Crescimento', quantity: 15, price: 129.9 },
    { name: 'Pacote Escala', quantity: 40, price: 299.9 },
  ];

  for (const pkg of creditPackages) {
    const existing = await prisma.creditPackage.findFirst({ where: { name: pkg.name } });
    if (existing) {
      await prisma.creditPackage.update({
        where: { id: existing.id },
        data: { quantity: pkg.quantity, price: pkg.price, active: true },
      });
      continue;
    }

    await prisma.creditPackage.create({ data: pkg });
  }
}

main().finally(() => prisma.$disconnect());
