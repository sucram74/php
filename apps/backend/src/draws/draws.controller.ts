import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request';
import { DrawsService } from './draws.service';

@UseGuards(JwtAuthGuard)
@Controller('draws')
export class DrawsController {
  constructor(private s: DrawsService) {}
  @Get() list(@Req() r: AuthRequest) { return this.s.list(r.user.tenantId); }
  @Get(':id') get(@Req() r: AuthRequest, @Param('id') id: string) { return this.s.get(r.user.tenantId, id); }
  @Get('by-campaign/:campaignId') byCampaign(@Req() r: AuthRequest, @Param('campaignId') campaignId: string) { return this.s.byCampaign(r.user.tenantId, campaignId); }
  @Post() create(@Req() r: AuthRequest, @Body() body: { campaignId: string; quantity: number }) { return this.s.create(r.user.tenantId, r.user.userId, body); }
}
