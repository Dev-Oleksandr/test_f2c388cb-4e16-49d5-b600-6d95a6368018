import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CampaignReportEventName } from '../types.js';

@Entity('campaign_reports')
@Unique(['eventTime', 'clientId', 'eventName'])
export class CampaignReport {
  @Column()
  campaign: string;

  @Column({ name: 'campaign_id', type: 'uuid' })
  campaignId: string;

  @Column()
  adgroup: string;

  @Column({ name: 'adgroup_id', type: 'uuid' })
  adgroupId: string;

  @Column()
  ad: string;

  @Column({ name: 'ad_id', type: 'uuid' })
  adId: string;

  @Column({ name: 'client_id', type: 'uuid', primary: true })
  clientId: string;

  @Column({ name: 'event_name', primary: true })
  eventName: CampaignReportEventName;

  @Column({ name: 'event_time', type: 'timestamp', primary: true })
  eventTime: Date;
}
