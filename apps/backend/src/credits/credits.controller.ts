import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request';
import { CreditsService } from './credits.service';

@UseGuards(JwtAuthGuard)
@Controller('credits')
export class CreditsController {
  constructor(private s: CreditsService) {}
  @Get('packages') packages() { return this.s.listPackages(); }
  @Get('balance') balance(@Req() r: AuthRequest) { return this.s.getBalance(r.user.tenantId); }
  @Get('transactions') history(@Req() r: AuthRequest) { return this.s.history(r.user.tenantId); }
  @Post('purchase') purchase(@Req() r: AuthRequest, @Body() b: { packageId: string }) { return this.s.purchase(r.user.tenantId, b.packageId); }
  @Patch('transactions/:id/mark-paid') markPaid(@Req() r: AuthRequest, @Param('id') id: string) { return this.s.markPaid(r.user.tenantId, id); }
  @Patch('transactions/:id/reject') reject(@Param('id') id: string) { return this.s.markRejected(id); }
  @Patch('transactions/:id/inform') inform(@Req() r: AuthRequest, @Param('id') id: string) { return this.s.inform(id, r.user.tenantId); }
  @Get('admin/pending-transactions') pending() { return this.s.pendingTransactions(); }
  @Get('admin/packages') adminPackages() { return this.s.listAllPackages(); }
  @Post('admin/packages') createPackage(@Body() b: { name: string; quantity: number; price: number }) { return this.s.createPackage(b); }
  @Patch('admin/packages/:id') updatePackage(@Param('id') id: string, @Body() b: { name?: string; quantity?: number; price?: number; active?: boolean }) { return this.s.updatePackage(id, b); }
}
