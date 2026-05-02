import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DrawsService {
  constructor(private prisma: PrismaService) {}
  list(tenantId: string) { return this.prisma.draw.findMany({ where: { tenantId }, include: { campaign: true, winners: { include: { coupon: true, consumer: true }, orderBy: { position: 'asc' } } }, orderBy: { drawnAt: 'desc' } }); }
  async get(tenantId: string, id: string) { const d = await this.prisma.draw.findFirst({ where: { tenantId, id }, include: { campaign: true, winners: { include: { coupon: true, consumer: true }, orderBy: { position: 'asc' } } } }); if (!d) throw new NotFoundException('Sorteio não encontrado.'); return d; }
  byCampaign(tenantId: string, campaignId: string) { return this.prisma.draw.findMany({ where: { tenantId, campaignId }, include: { winners: { include: { coupon: true, consumer: true } } }, orderBy: { drawnAt: 'desc' } }); }
  async create(tenantId: string, userId: string, body: { campaignId: string; quantity: number }) {
    if (!body.campaignId) throw new BadRequestException('Campanha é obrigatória.');
    const quantity = Number(body.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) throw new BadRequestException('Quantidade mínima é 1.');
    const campaign = await this.prisma.campaign.findFirst({ where: { id: body.campaignId, tenantId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada.');
    const available = await this.prisma.coupon.findMany({ where: { tenantId, campaignId: campaign.id, active: true }, include: { consumer: true } });
    if (quantity > available.length) throw new BadRequestException('Quantidade maior que cupons ativos disponíveis.');
    const seed = `${tenantId}-${campaign.id}-${Date.now()}-${randomUUID()}`;
    const seedHash = createHash('sha256').update(seed).digest('hex');
    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, quantity);
    const draw = await this.prisma.draw.create({ data: { tenantId, campaignId: campaign.id, drawnAt: new Date(), quantity, seed, seedHash, createdByUserId: userId } });
    for (let i = 0; i < shuffled.length; i += 1) await this.prisma.drawWinner.create({ data: { drawId: draw.id, couponId: shuffled[i].id, consumerId: shuffled[i].consumerId, position: i + 1 } });
    return this.get(tenantId, draw.id);
  }
}
