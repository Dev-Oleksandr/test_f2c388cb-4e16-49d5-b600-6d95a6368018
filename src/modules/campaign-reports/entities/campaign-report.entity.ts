import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { CampaignReportEventName } from '../../../common/types/campaign-report-event-name.type.js';

@Entity('campaign_reports')
@Index('IDX_campaign_reports_event_time_event_name_ad_id', [
  'eventTime',
  'eventName',
  'adId',
])
export class CampaignReport {
  @Column()
  campaign!: string;

  @Column({ name: 'campaign_id', type: 'uuid' })
  campaignId!: string;

  @Column()
  adgroup!: string;

  @Column({ name: 'adgroup_id', type: 'uuid' })
  adgroupId!: string;

  @Column()
  ad!: string;

  @Column({ name: 'ad_id', type: 'uuid' })
  adId!: string;

  @PrimaryColumn({ name: 'client_id', type: 'uuid' })
  clientId!: string;

  @PrimaryColumn({ name: 'event_name' })
  eventName!: CampaignReportEventName;

  @PrimaryColumn({ name: 'event_time', type: 'timestamp' })
  eventTime!: Date;
}
