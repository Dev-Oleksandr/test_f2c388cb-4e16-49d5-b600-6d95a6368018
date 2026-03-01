import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/app-config/app-config.module.js';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { DatabaseModule } from './core/database/database.module.js';
import { CampaignReportsModule } from './modules/campaign-reports/campaign-reports.module.js';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe.js';

@Module({
  imports: [AppConfigModule, DatabaseModule, CampaignReportsModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
