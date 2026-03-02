import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesEntityCampaignReportJobs1772463500464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE campaign_report_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        status TEXT NOT NULL,
        error_message TEXT
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE campaign_report_jobs;
    `);
  }
}
