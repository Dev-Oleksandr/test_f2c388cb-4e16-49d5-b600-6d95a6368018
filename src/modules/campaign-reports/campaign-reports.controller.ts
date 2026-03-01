import {
  Controller,
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

@Controller('campaign-reports')
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  syncCampaignReports(
    @Query(new ZodValidationPipe(SyncCampaignReportsQuerySchema))
    dto: SyncCampaignReportsQueryDto,
  ) {
    this.campaignReportsService.syncCampaignReports(dto);
    return { message: 'ok' };
  }
}
