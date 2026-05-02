import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}
  listPackages() { return this.prisma.creditPackage.findMany({ where: { active: true }, orderBy: { quantity: 'asc' } }); }
  listAllPackages() { return this.prisma.creditPackage.findMany({ orderBy: { quantity: 'asc' } }); }
  async getBalance(tenantId: string) { const credit = await this.prisma.tenantCredit.upsert({ where: { tenantId }, update: {}, create: { tenantId, balance: 0 } }); return credit; }
  history(tenantId: string) { return this.prisma.creditTransaction.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } }); }
  async purchase(tenantId: string, packageId: string) {
    const pack = await this.prisma.creditPackage.findUnique({ where: { id: packageId } });
    if (!pack || !pack.active) throw new BadRequestException('Pacote inválido.');
    return this.prisma.creditTransaction.create({ data: { tenantId, type: 'purchase', quantity: pack.quantity, amount: pack.price, status: 'pending', paymentMethod: 'pix', pixKey: 'CHAVE_PIX_CONFIGURAR_ADMIN', pixQrCode: `PIX|${pack.name}|${pack.price}`, pixCopyPaste: `00020126MVPPIX${pack.id}`, packageName: pack.name } });
  }
  async inform(id: string, tenantId: string) {
    const tx = await this.prisma.creditTransaction.findFirst({ where: { id, tenantId } });
    if (!tx) throw new BadRequestException('Transação não encontrada para este tenant.');
    return this.prisma.creditTransaction.update({ where: { id }, data: { status: 'pending_review' } });
  }
  async markPaid(_adminTenantId: string, id: string) {
    const tx = await this.prisma.creditTransaction.findUnique({ where: { id } });
    if (!tx) throw new BadRequestException('Transação não encontrada.');
    if (tx.status === 'paid') return tx;
    await this.prisma.tenantCredit.upsert({ where: { tenantId: tx.tenantId }, update: { balance: { increment: tx.quantity } }, create: { tenantId: tx.tenantId, balance: tx.quantity } });
    return this.prisma.creditTransaction.update({ where: { id }, data: { status: 'paid' } });
  }
  async markRejected(id: string) {
    const tx = await this.prisma.creditTransaction.findUnique({ where: { id } });
    if (!tx) throw new BadRequestException('Transação não encontrada.');
    return this.prisma.creditTransaction.update({ where: { id }, data: { status: 'rejected' } });
  }
  pendingTransactions() {
    return this.prisma.creditTransaction.findMany({
      where: { status: { in: ['pending', 'pending_review'] } },
      include: { tenant: true },
      orderBy: { createdAt: 'desc' }
    });
  }
  createPackage(data: { name: string; quantity: number; price: number }) {
    return this.prisma.creditPackage.create({ data: { ...data } });
  }
  updatePackage(id: string, data: { name?: string; quantity?: number; price?: number; active?: boolean }) {
    return this.prisma.creditPackage.update({ where: { id }, data });
  }
  async consumeCampaignCredit(tenantId: string) {
    const bal = await this.getBalance(tenantId);
    if (bal.balance <= 0) {
      await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "tenant_benefits"(id text primary key, tenant_id text unique, first_campaign_granted boolean default false, created_at timestamptz default now())`);
      const already: any[] = await this.prisma.$queryRawUnsafe(`SELECT * FROM "tenant_benefits" WHERE tenant_id = $1`, tenantId);
      if (!already.length || !already[0].first_campaign_granted) {
        await this.prisma.$executeRawUnsafe(`INSERT INTO "tenant_benefits"(id,tenant_id,first_campaign_granted) VALUES ($1,$2,true) ON CONFLICT (tenant_id) DO UPDATE SET first_campaign_granted=true`, `b_${Date.now()}_${Math.random()}`, tenantId);
        await this.prisma.creditTransaction.create({ data: { tenantId, type: 'bonus', quantity: 1, amount: 0, status: 'paid', packageName: 'Primeira campanha grátis' } });
        return;
      }
      throw new BadRequestException('Você não possui créditos disponíveis para criar uma campanha.');
    }
    await this.prisma.tenantCredit.update({ where: { tenantId }, data: { balance: { decrement: 1 } } });
    await this.prisma.creditTransaction.create({ data: { tenantId, type: 'consumption', quantity: 1, amount: 0, status: 'paid' } });
  }
}
