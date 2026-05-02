import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma.service';
import { CreditsService } from '../credits/credits.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService, private credits: CreditsService) {}
  list(tenantId: string) { return this.prisma.campaign.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } }); }
  async get(tenantId: string, id: string) { const c = await this.prisma.campaign.findFirst({ where: { tenantId, id } }); if (!c) throw new NotFoundException('Campanha não encontrada'); return c; }

  private validateDates(startDate: string, endDate: string) {
    const start = new Date(startDate); const end = new Date(endDate); const now = new Date();
    if (end < start) throw new BadRequestException('Data final não pode ser menor que data inicial.');
    if (end < now) throw new BadRequestException('Data final não pode ser menor que data atual.');
  }

  async create(tenantId: string, d: CreateCampaignDto) { this.validateDates(d.startDate, d.endDate); await this.credits.consumeCampaignCredit(tenantId); return this.prisma.campaign.create({ data: { tenantId, ...d, startDate: new Date(d.startDate), endDate: new Date(d.endDate) } }); }
  async update(tenantId: string, id: string, d: UpdateCampaignDto) {
    await this.get(tenantId, id);
    const startDate = d.startDate ?? new Date().toISOString(); const endDate = d.endDate ?? new Date().toISOString();
    this.validateDates(startDate, endDate);
    return this.prisma.campaign.update({ where: { id }, data: { ...d, startDate: d.startDate ? new Date(d.startDate) : undefined, endDate: d.endDate ? new Date(d.endDate) : undefined } });
  }
  async toggle(tenantId: string, id: string) { const c = await this.get(tenantId, id); return this.prisma.campaign.update({ where: { id }, data: { active: !c.active } }); }
  async activate(tenantId: string, id: string) { await this.get(tenantId, id); return this.prisma.campaign.update({ where: { id }, data: { active: true } }); }
  async pause(tenantId: string, id: string) { await this.get(tenantId, id); return this.prisma.campaign.update({ where: { id }, data: { active: false } }); }
  async finalize(tenantId: string, id: string, userId: string) {
    const campaign = await this.get(tenantId, id);
    const available = await this.prisma.coupon.findMany({ where: { tenantId, campaignId: id, active: true } });
    if (available.length < 1) throw new BadRequestException('Não há cupons suficientes para finalizar e sortear.');
    const seed = `${tenantId}-${id}-${Date.now()}-${randomUUID()}`;
    const seedHash = createHash('sha256').update(seed).digest('hex');
    const chosen = available[Math.floor(Math.random() * available.length)];
    const draw = await this.prisma.draw.create({ data: { tenantId, campaignId: id, quantity: 1, drawnAt: new Date(), seed, seedHash, createdByUserId: userId } });
    await this.prisma.drawWinner.create({ data: { drawId: draw.id, couponId: chosen.id, consumerId: chosen.consumerId, position: 1 } });
    await this.prisma.campaign.update({ where: { id }, data: { active: false, endDate: new Date() } });
    return this.prisma.draw.findUnique({ where: { id: draw.id }, include: { winners: { include: { consumer: true, coupon: true } }, campaign: true } });
  }
  async remove(tenantId: string, id: string) {
    await this.get(tenantId, id);
    const [purchases, coupons] = await Promise.all([
      this.prisma.purchase.count({ where: { tenantId, campaignId: id } }),
      this.prisma.coupon.count({ where: { tenantId, campaignId: id } }),
    ]);
    if (purchases > 0 || coupons > 0) throw new BadRequestException('Esta campanha não pode ser excluída porque já possui compras ou cupons vinculados.');
    return this.prisma.campaign.delete({ where: { id } });
  }
}
