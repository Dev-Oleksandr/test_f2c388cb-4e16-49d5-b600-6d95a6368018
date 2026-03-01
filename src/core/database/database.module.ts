import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database-config.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => ({
        ...getDatabaseConfig(),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
