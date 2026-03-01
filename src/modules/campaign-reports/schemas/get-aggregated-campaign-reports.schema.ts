import { z } from 'zod';
import { campaignReportEventValues } from '../../../common/types/campaign-report-event-name.type.js';

export const GetAggregatedCampaignReportsSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    eventName: z.enum(campaignReportEventValues),
  })
  .refine(({ fromDate, toDate }) => fromDate < toDate, {
    message: 'fromDate must be less than toDate',
  });

export type GetAggregatedCampaignReportsDto = z.infer<
  typeof GetAggregatedCampaignReportsSchema
>;
