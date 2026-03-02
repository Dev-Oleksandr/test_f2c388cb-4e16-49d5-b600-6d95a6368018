import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignReportJobStatus } from '../types.js';
import { Nullable } from '../../../common/types/nullable.js';

@Entity('campaign_report_jobs')
export class CampaignReportJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  status!: CampaignReportJobStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: Nullable<string>;
}
