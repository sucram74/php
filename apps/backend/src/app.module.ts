import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConsumersModule } from './consumers/consumers.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, ConsumersModule, CampaignsModule, PurchasesModule, CouponsModule]
})
export class AppModule {}
