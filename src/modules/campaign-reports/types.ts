export const campaignReportJobStatusValues = [
  'pending',
  'processing',
  'completed',
  'failed',
] as const;

export type CampaignReportJobStatus =
  (typeof campaignReportJobStatusValues)[number];
