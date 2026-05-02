import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CreditsModule } from '../credits/credits.module';

@Module({ imports: [CreditsModule], controllers: [CampaignsController], providers: [CampaignsService] })
export class CampaignsModule {}
