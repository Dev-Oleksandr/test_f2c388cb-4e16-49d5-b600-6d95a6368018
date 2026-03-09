import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppConfigModule } from './core/app-config/app-config.module.js';
import { AppGlobalExceptionFilter } from './common/filters/app-global-exception.filter.js';
import { DatabaseModule } from './core/database/database.module.js';
import { CampaignReportsModule } from './modules/campaign-reports/campaign-reports.module.js';
import { ApiKeyGuard } from './common/guards/api-key.guard.js';

@Module({
  imports: [AppConfigModule, DatabaseModule, CampaignReportsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppGlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
