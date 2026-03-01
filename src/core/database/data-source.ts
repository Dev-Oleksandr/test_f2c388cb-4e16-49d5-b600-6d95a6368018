import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CampaignReport } from '../../modules/campaign-reports/entities/campaign-report.entity.js';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  entities: [CampaignReport],
  migrations: ['./migrations/*{.ts,.js}'],
});
