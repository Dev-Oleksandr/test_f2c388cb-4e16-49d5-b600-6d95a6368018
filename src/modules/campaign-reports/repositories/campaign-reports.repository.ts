import { InjectRepository } from '@nestjs/typeorm';
import { CampaignReport } from '../entities/campaign-report.entity.js';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CampaignReportCsvRow } from '../../../core/probation-api/types.js';

@Injectable()
export class CampaignReportsRepository {
  constructor(
    @InjectRepository(CampaignReport)
    private readonly campaignReportRepository: Repository<CampaignReport>,
  ) {}

  upsert(data: Array<CampaignReportCsvRow>) {
    return this.campaignReportRepository.upsert(data, {
      conflictPaths: ['eventTime', 'clientId', 'eventName'],
      upsertType: 'on-conflict-do-update',
    });
  }
}
