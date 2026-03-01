import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  SyncCampaignReportsQueryDto,
  SyncCampaignReportsQuerySchema,
} from './schemas/sync-campaign-reports-query.schema.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CampaignReportsService } from './campaign-reports.service.js';
import {
  GetAggregatedCampaignReportsDto,
  GetAggregatedCampaignReportsSchema,
} from './schemas/get-aggregated-campaign-reports.schema.js';

@Controller('campaign-reports')
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  syncCampaignReports(
    @Query(new ZodValidationPipe(SyncCampaignReportsQuerySchema))
    query: SyncCampaignReportsQueryDto,
  ) {
    this.campaignReportsService.syncCampaignReports(query);
    return { message: 'ok' };
  }

  @Get()
  getAggregatedCampaignReports(
    @Query(new ZodValidationPipe(GetAggregatedCampaignReportsSchema))
    query: GetAggregatedCampaignReportsDto,
  ) {
    return this.campaignReportsService.findAggregatedCampaignReports(query);
  }
}
