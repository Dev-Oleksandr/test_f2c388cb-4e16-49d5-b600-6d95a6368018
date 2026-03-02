import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  SyncCampaignReportsDto,
  SyncCampaignReportsQuerySchema,
} from './schemas/sync-campaign-reports-query.schema.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CampaignReportsService } from './campaign-reports.service.js';
import {
  GetAggregatedCampaignReportsDto,
  GetAggregatedCampaignReportsSchema,
} from './schemas/get-aggregated-campaign-reports.schema.js';
import {
  Pagination,
  PaginationQuery,
} from '../../common/decorators/pagination.decorator.js';
import {
  CampaignReportJobStatusSchema,
  GetCampaignReportJobStatus,
} from './schemas/get-campaign-report-job-status.schema.js';

@Controller('campaign-reports')
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  syncCampaignReports(
    @Body(new ZodValidationPipe(SyncCampaignReportsQuerySchema))
    dto: SyncCampaignReportsDto,
  ) {
    return this.campaignReportsService.syncCampaignReports(dto);
  }

  @Get()
  getAggregatedCampaignReports(
    @Query(new ZodValidationPipe(GetAggregatedCampaignReportsSchema))
    query: GetAggregatedCampaignReportsDto,
    @Pagination() pagination: PaginationQuery,
  ) {
    return this.campaignReportsService.findAggregatedCampaignReports(
      query,
      pagination,
    );
  }

  @Get('sync-status/:jobId')
  getSyncJob(
    @Param(new ZodValidationPipe(CampaignReportJobStatusSchema))
    { jobId }: GetCampaignReportJobStatus,
  ) {
    return this.campaignReportsService.getCampaignReportSyncJob(jobId);
  }
}
