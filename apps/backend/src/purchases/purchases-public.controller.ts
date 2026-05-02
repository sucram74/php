import { Controller, Get, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('public/consumer-coupons')
export class PurchasesPublicController {
  constructor(private s: PurchasesService) {}
  @Get()
  get(@Query('token') token: string) { return this.s.consumerCoupons(token); }
}
