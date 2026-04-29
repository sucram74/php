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
}

main().finally(() => prisma.$disconnect());
