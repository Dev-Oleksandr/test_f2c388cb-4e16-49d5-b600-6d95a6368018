import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
