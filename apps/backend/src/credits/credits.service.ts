import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}
  listPackages() { return this.prisma.creditPackage.findMany({ where: { active: true }, orderBy: { quantity: 'asc' } }); }
  async getBalance(tenantId: string) { const credit = await this.prisma.tenantCredit.upsert({ where: { tenantId }, update: {}, create: { tenantId, balance: 0 } }); return credit; }
  history(tenantId: string) { return this.prisma.creditTransaction.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } }); }
  async purchase(tenantId: string, packageId: string) {
    const pack = await this.prisma.creditPackage.findUnique({ where: { id: packageId } });
    if (!pack || !pack.active) throw new BadRequestException('Pacote inválido.');
    return this.prisma.creditTransaction.create({ data: { tenantId, type: 'purchase', quantity: pack.quantity, amount: pack.price, status: 'pending', paymentMethod: 'pix', pixKey: 'CHAVE_PIX_CONFIGURAR_ADMIN', pixQrCode: `PIX|${pack.name}|${pack.price}`, pixCopyPaste: `00020126MVPPIX${pack.id}`, packageName: pack.name } });
  }
  async inform(id: string, tenantId: string) { return this.prisma.creditTransaction.update({ where: { id, tenantId }, data: { status: 'pending_review' as any } }); }
  async markPaid(_adminTenantId: string, id: string) {
    const tx = await this.prisma.creditTransaction.findUnique({ where: { id } });
    if (!tx) throw new BadRequestException('Transação não encontrada.');
    if (tx.status === 'paid') return tx;
    await this.prisma.tenantCredit.upsert({ where: { tenantId: tx.tenantId }, update: { balance: { increment: tx.quantity } }, create: { tenantId: tx.tenantId, balance: tx.quantity } });
    return this.prisma.creditTransaction.update({ where: { id }, data: { status: 'paid' } });
  }
  async consumeCampaignCredit(tenantId: string) {
    const bal = await this.getBalance(tenantId);
    if (bal.balance <= 0) throw new BadRequestException('Você não possui créditos disponíveis para criar uma campanha.');
    await this.prisma.tenantCredit.update({ where: { tenantId }, data: { balance: { decrement: 1 } } });
    await this.prisma.creditTransaction.create({ data: { tenantId, type: 'consumption', quantity: 1, amount: 0, status: 'paid' } });
  }
}
