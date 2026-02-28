import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './app-config.validation.js';
import { AppConfigService } from './app-config.service.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
