import { InjectRepository } from '@nestjs/typeorm';
import { CampaignReport } from '../entities/campaign-report.entity.js';
import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignReportsRepository {
  constructor(
    @InjectRepository(CampaignReport)
    private readonly campaignReportRepository: Repository<CampaignReport>,
  ) {}

  upsert(data: Array<DeepPartial<CampaignReport>>) {
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
