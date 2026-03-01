import { Module } from '@nestjs/common';
import { ProbationApiModule } from '../../core/probation-api/probation-api.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReport } from './entities/campaign-report.entity.js';

@Module({
  imports: [ProbationApiModule, TypeOrmModule.forFeature([CampaignReport])],
  controllers: [],
})
export class CampaignReportsModule {}
