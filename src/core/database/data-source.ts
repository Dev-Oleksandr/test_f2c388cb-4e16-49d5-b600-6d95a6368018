import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { getDatabaseConfig } from './database-config.js';
dotenv.config();

export default new DataSource({
  ...getDatabaseConfig(),
  migrations: [join(process.cwd(), 'migrations', '*{.ts,.js}')],
});
