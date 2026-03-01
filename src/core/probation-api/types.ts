import { CampaignReportEventName } from '../../modules/campaign-reports/types.js';

type CampaignReportsPagination = {
  next: string
}

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

export type CampaignReportCsvRow = {
  [key: string]: string;
};
