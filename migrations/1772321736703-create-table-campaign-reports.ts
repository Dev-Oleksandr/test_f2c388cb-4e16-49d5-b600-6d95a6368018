import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCampaignReports1772321736703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE campaign_reports (
            campaign TEXT NOT NULL,
            campaign_id UUID NOT NULL,
            adgroup TEXT NOT NULL,
            adgroup_id UUID NOT NULL,
            ad TEXT NOT NULL,
            ad_id UUID NOT NULL,
            client_id UUID NOT NULL,
            event_name TEXT NOT NULL,
            event_time TIMESTAMP NOT NULL,
            UNIQUE (event_time, client_id, event_name)
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE campaign_reports;`);
  }
}
