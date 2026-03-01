import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CampaignReport } from '../../modules/campaign-reports/entities/campaign-report.entity.js';
import { join } from 'path';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  entities: [CampaignReport],
  migrations: [join(process.cwd(), 'migrations', '*{.ts,.js}')],
});
