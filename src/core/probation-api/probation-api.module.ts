import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from '../app-config/app-config.service.js';
import { ProbationApiService } from './probation-api.service.js';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        baseURL: configService.get('PROBATION_API_BASE_URL'),
      }),
    }),
  ],
  providers: [ProbationApiService],
  exports: [ProbationApiService],
})
export class ProbationApiModule {}
