import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app-config.validation.js';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get<ConfigKey extends keyof AppConfig>(key: ConfigKey): AppConfig[ConfigKey] {
    return this.configService.get(key) as AppConfig[ConfigKey];
  }
}
