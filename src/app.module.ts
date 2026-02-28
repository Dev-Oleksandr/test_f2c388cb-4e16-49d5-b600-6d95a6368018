import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/app-config/app-config.module.js';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
