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

  async findAggregatedByCondition(condition: {
    fromDate: Date;
    toDate: Date;
    eventName: string;
    take: number;
  }) {
    return this.campaignReportRepository
      .createQueryBuilder()
      .select('ad_id, COUNT(*) AS count')
      .where('event_time BETWEEN :fromDate AND :toDate', {
        fromDate: condition.fromDate,
        toDate: condition.toDate,
      })
      .andWhere('event_name = :eventName', { eventName: condition.eventName })
      .groupBy('ad_id')
      .limit(condition.take)
      .execute();
  }
}
