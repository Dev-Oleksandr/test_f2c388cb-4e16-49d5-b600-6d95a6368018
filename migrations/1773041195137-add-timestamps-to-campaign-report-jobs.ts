import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToCampaignReportJobs1773041195137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE campaign_report_jobs
            ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE campaign_report_jobs
        DROP COLUMN created_at,
        DROP COLUMN updated_at;
    `);
  }
}
