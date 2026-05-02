import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private s: CampaignsService) {}
  @Get() list(@Req() req: AuthRequest) { return this.s.list(req.user.tenantId); }
  @Get(':id') get(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.get(req.user.tenantId, id); }
  @Post() create(@Req() req: AuthRequest, @Body() d: CreateCampaignDto) { return this.s.create(req.user.tenantId, d); }
  @Put(':id') update(@Req() req: AuthRequest, @Param('id') id: string, @Body() d: UpdateCampaignDto) { return this.s.update(req.user.tenantId, id, d); }
  @Patch(':id/toggle-active') toggle(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.toggle(req.user.tenantId, id); }
  @Patch(':id/activate') activate(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.activate(req.user.tenantId, id); }
  @Patch(':id/pause') pause(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.pause(req.user.tenantId, id); }
  @Patch(':id/finalize') finalize(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.finalize(req.user.tenantId, id, req.user.userId); }
  @Delete(':id') remove(@Req() req: AuthRequest, @Param('id') id: string) { return this.s.remove(req.user.tenantId, id); }
}
