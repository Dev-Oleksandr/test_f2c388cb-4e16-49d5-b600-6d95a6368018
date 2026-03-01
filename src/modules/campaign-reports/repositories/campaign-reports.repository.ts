import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CampaignReport } from '../entities/campaign-report.entity.js';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationQuery } from '../../../common/decorators/pagination.decorator.js';
import { GetAggregatedCampaignReportsDto } from '../schemas/get-aggregated-campaign-reports.schema.js';

@Injectable()
export class CampaignReportsRepository {
  constructor(
    @InjectRepository(CampaignReport)
    private readonly campaignReportRepository: Repository<CampaignReport>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  upsert(data: Array<DeepPartial<CampaignReport>>) {
    return this.campaignReportRepository.upsert(data, {
      conflictPaths: ['eventTime', 'clientId', 'eventName'],
      upsertType: 'on-conflict-do-update',
    });
  }

  async findAndCountAggregatedByCondition(
    condition: GetAggregatedCampaignReportsDto,
    paginationQuery: PaginationQuery,
  ) {
    const [rows, { total }] = await Promise.all([
      this.findAllAggregatedByCondition(condition, paginationQuery),
      this.countAggregatedByCondition(condition),
    ]);
    return { rows, total };
  }

  private countAggregatedByCondition(
    condition: GetAggregatedCampaignReportsDto,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)::int', 'total')
      .from((qb) => {
        return qb
          .select('1')
          .from(CampaignReport, 'cr')
          .where('cr.event_time BETWEEN :fromDate AND :toDate', {
            fromDate: condition.fromDate,
            toDate: condition.toDate,
          })
          .andWhere('cr.event_name = :eventName', {
            eventName: condition.eventName,
          })
          .groupBy('cr.ad_id');
      }, 'grouped')
      .getRawOne();
  }

  private findAllAggregatedByCondition(
    condition: GetAggregatedCampaignReportsDto,
    { take, skip }: PaginationQuery,
  ) {
    return this.campaignReportRepository
      .createQueryBuilder()
      .select('ad_id as "adId", COUNT(*)::int AS count')
      .where('event_time BETWEEN :fromDate AND :toDate', {
        fromDate: condition.fromDate,
        toDate: condition.toDate,
      })
      .andWhere('event_name = :eventName', { eventName: condition.eventName })
      .orderBy('ad_id')
      .groupBy('ad_id')
      .take(take)
      .skip(skip)
      .getRawMany();
  }
}
