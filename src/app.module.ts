import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/app-config/app-config.module.js';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
