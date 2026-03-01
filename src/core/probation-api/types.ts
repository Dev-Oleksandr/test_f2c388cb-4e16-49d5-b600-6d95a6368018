import { CampaignReportEventName } from '../../common/types/campaign-report-event-name.type.js';

type CampaignReportsPagination = {
  next: string;
};

type CampaignReportsData = {
  csv: string;
  pagination?: CampaignReportsPagination;
};

export type CampaignReportsResponse = {
  timestamp: number;
  data: CampaignReportsData;
};

export type CampaignReportsRequest = {
  event_name: CampaignReportEventName;
  from_date: string;
  to_date: string;
  take: number;
};

export type CampaignReportParsedCsvRow = {
  ad: string;
  ad_id: string;
  adgroup: string;
  adgroup_id: string;
  campaign: string;
  campaign_id: string;
  client_id: string;
  event_name: CampaignReportEventName;
  event_time: Date;
};
