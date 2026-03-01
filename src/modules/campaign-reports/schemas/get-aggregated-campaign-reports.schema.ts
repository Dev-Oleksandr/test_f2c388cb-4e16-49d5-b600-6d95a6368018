import { z } from 'zod';
import { campaignReportEventValues } from '../types.js';

export const GetAggregatedCampaignReportsSchema = z.object({
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
  eventName: z.enum(campaignReportEventValues),
  take: z.coerce.number().nonnegative().min(1).max(1000),
});

export type GetAggregatedCampaignReportsDto = z.infer<
  typeof GetAggregatedCampaignReportsSchema
>;
