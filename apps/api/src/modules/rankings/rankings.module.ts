import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { RankingsService } from './rankings.service';

@Module({
  imports: [AuditModule],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}
