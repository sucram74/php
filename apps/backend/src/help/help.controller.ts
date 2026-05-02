import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request';
import { HelpService } from './help.service';

@UseGuards(JwtAuthGuard)
@Controller('help-chat')
export class HelpController {
  constructor(private s: HelpService) {}
  @Post('ask') ask(@Req() r: AuthRequest, @Body() b: { message: string; sessionId?: string }) { return this.s.ask(r.user.tenantId, r.user.userId, b.message, b.sessionId); }
  @Post('rate') rate(@Req() r: AuthRequest, @Body() b: { stars: number; sessionId?: string }) { return this.s.rate(r.user.tenantId, r.user.userId, b.stars, b.sessionId); }
}
