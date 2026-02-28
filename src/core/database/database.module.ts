import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../app-config/app-config.service.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        username: config.get('DATABASE_USER'),
        database: config.get('DATABASE_NAME'),
        password: config.get('DATABASE_PASSWORD'),
        port: config.get('DATABASE_PORT'),
      }),
    }),
  ],
})
export class DatabaseModule {}
