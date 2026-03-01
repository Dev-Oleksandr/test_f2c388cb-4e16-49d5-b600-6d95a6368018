import { ProbationApiService } from '../../core/probation-api/probation-api.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { SyncCampaignReportsQueryDto } from './schemas/sync-campaign-reports-query.schema.js';
import {
  CampaignReportParsedCsvRow,
  CampaignReportsRequest,
} from '../../core/probation-api/types.js';
import { CampaignReportsRepository } from './repositories/campaign-reports.repository.js';
import { concatMap, lastValueFrom } from 'rxjs';
import { PROBATION_API_DEFAULT_PAGINATION_TAKE } from '../../core/probation-api/constants.js';
import { GetAggregatedCampaignReportsDto } from './schemas/get-aggregated-campaign-reports.schema.js';

@Injectable()
export class CampaignReportsService {
  private readonly logger = new Logger(CampaignReportsService.name);

  constructor(
    private readonly probationApiService: ProbationApiService,
    private readonly campaignReportsRepository: CampaignReportsRepository,
  ) {}

  async syncCampaignReports(dto: SyncCampaignReportsQueryDto) {
    const request = this.formatDtoToRequest(dto);
    const observableCsvRows =
      this.probationApiService.fetchAllCampaignReports(request);

    await lastValueFrom(
      observableCsvRows.pipe(
        concatMap((rows) =>
          this.campaignReportsRepository.upsert(
            this.mapFetchedFieldToUpsert(rows),
          ),
        ),
      ),
    ).catch((error) => {
      const message = 'An error occurred while fetching campaign reports';
      this.logger.error(message, error.message);
    });
  }

  findAggregatedCampaignReports(query: GetAggregatedCampaignReportsDto) {
    return this.campaignReportsRepository.findAggregatedByCondition(query);
  }

  private formatDtoToRequest(
    dto: SyncCampaignReportsQueryDto,
  ): CampaignReportsRequest {
    return {
      to_date: dto.toDate.toISOString(),
      from_date: dto.fromDate.toISOString(),
      event_name: dto.eventName,
      take: PROBATION_API_DEFAULT_PAGINATION_TAKE,
    };
  }

  private mapFetchedFieldToUpsert(rows: Array<CampaignReportParsedCsvRow>) {
    return rows.map((row) => ({
      campaign: row.campaign,
      campaignId: row.campaign_id,
      adgroup: row.adgroup,
      adgroupId: row.adgroup_id,
      ad: row.ad,
      adId: row.ad_id,
      clientId: row.client_id,
      eventName: row.event_name,
      eventTime: row.event_time,
    }));
  }
}
