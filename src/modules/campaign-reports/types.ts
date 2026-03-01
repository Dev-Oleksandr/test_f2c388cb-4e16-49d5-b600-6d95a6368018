export const campaignReportEventValues = ['purchase', 'install'] as const;

export type CampaignReportEventName =
  (typeof campaignReportEventValues)[number];
