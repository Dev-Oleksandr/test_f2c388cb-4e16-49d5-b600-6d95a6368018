import { ProbationApiService } from '../../core/probation-api/probation-api.service.js';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SyncCampaignReportsDto } from './schemas/sync-campaign-reports-query.schema.js';
import {
  CampaignReportParsedCsvRow,
  CampaignReportsRequest,
} from '../../core/probation-api/types.js';
import { CampaignReportsRepository } from './repositories/campaign-reports.repository.js';
import { concatMap, lastValueFrom, merge, Observable, share, take } from 'rxjs';
import { GetAggregatedCampaignReportsDto } from './schemas/get-aggregated-campaign-reports.schema.js';
import { DataListResponse } from '../../common/dto/data-list-response.dto.js';
import { PaginationQuery } from '../../common/decorators/pagination.decorator.js';
import { CampaignReportJobRepository } from './repositories/campaign-report-jobs.repository.js';
import { AppException } from '../../common/exceptions/app.exception.js';
import { AppConfigService } from '../../core/app-config/app-config.service.js';

@Injectable()
export class CampaignReportsService {
  private readonly logger = new Logger(CampaignReportsService.name);

  constructor(
    private readonly probationApiService: ProbationApiService,
    private readonly campaignReportsRepository: CampaignReportsRepository,
    private readonly campaignReportJobRepository: CampaignReportJobRepository,
    private readonly appConfigService: AppConfigService,
  ) {}

  async syncCampaignReports(dto: SyncCampaignReportsDto) {
    const request = this.formatDtoToRequest(dto);

    const job = await this.campaignReportJobRepository.create({
      status: 'pending',
    });

    const fetchedCsvRows = this.probationApiService
      .fetchAllCampaignReports(request)
      .pipe(share());

    this.executeSyncJob(job.id, fetchedCsvRows);

    return job;
  }

  async findAggregatedCampaignReports(
    query: GetAggregatedCampaignReportsDto,
    pagination: PaginationQuery,
  ) {
    const { rows, total } =
      await this.campaignReportsRepository.findAndCountAggregatedByCondition(
        query,
        pagination,
      );

    return new DataListResponse(rows, pagination, total);
  }

  async getCampaignReportSyncJob(jobId: string) {
    const job = await this.campaignReportJobRepository.getByCondition({
      id: jobId,
    });

    if (!job) {
      throw new AppException({
        message: 'Job not found in the system',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return job;
  }

  private executeSyncJob(
    jobId: string,
    csvRows: Observable<CampaignReportParsedCsvRow[]>,
  ): void {
    const setProcessing = this.createProcessingStatusStream(jobId, csvRows);
    const processData = this.createDataProcessingStream(csvRows);
    lastValueFrom(merge(setProcessing, processData))
      .then(() => this.completeJob(jobId))
      .catch((error) => this.failJob(jobId, error));
  }

  private createProcessingStatusStream(
    jobId: string,
    csvRows: Observable<CampaignReportParsedCsvRow[]>,
  ) {
    return csvRows.pipe(
      take(1),
      concatMap(() =>
        this.campaignReportJobRepository.update(jobId, {
          status: 'processing',
        }),
      ),
    );
  }

  private createDataProcessingStream(
    csvRows: Observable<CampaignReportParsedCsvRow[]>,
  ) {
    return csvRows.pipe(
      concatMap((rows) =>
        this.campaignReportsRepository.upsert(
          this.mapFetchedFieldToUpsert(rows),
        ),
      ),
    );
  }

  private completeJob(jobId: string): Promise<any> {
    return this.campaignReportJobRepository.update(jobId, {
      status: 'completed',
    });
  }

  private failJob(jobId: string, error: Error): Promise<any> {
    this.logger.error(`Error in sync job ${jobId}`, error.stack);
    return this.campaignReportJobRepository.update(jobId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }

  private formatDtoToRequest(
    dto: SyncCampaignReportsDto,
  ): CampaignReportsRequest {
    return {
      to_date: dto.toDate.toISOString(),
      from_date: dto.fromDate.toISOString(),
      event_name: dto.eventName,
      take: this.appConfigService.get('PROBATION_API_DEFAULT_PAGINATION_TAKE'),
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
