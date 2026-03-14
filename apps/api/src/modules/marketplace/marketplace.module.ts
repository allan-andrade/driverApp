import { Module } from '@nestjs/common';
import { MetricsModule } from '../metrics/metrics.module';
import { RankingsModule } from '../rankings/rankings.module';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [MetricsModule, RankingsModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
