import { Module } from '@nestjs/common';
import { ProbationApiModule } from '../../core/probation-api/probation-api.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReport } from './entities/campaign-report.entity.js';
import { CampaignReportsController } from './campaign-reports.controller.js';
import { CampaignReportsService } from './campaign-reports.service.js';
import { CampaignReportsRepository } from './repositories/campaign-reports.repository.js';

@Module({
  imports: [ProbationApiModule, TypeOrmModule.forFeature([CampaignReport])],
  controllers: [CampaignReportsController],
  providers: [CampaignReportsService, CampaignReportsRepository],
})
export class CampaignReportsModule {}
