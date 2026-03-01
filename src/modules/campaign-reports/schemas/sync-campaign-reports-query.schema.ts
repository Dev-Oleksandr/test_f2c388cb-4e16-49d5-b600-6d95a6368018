import { z } from 'zod';
import { campaignReportEventValues } from '../types.js';

export const SyncCampaignReportsQuerySchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    eventName: z.enum(campaignReportEventValues),
  })
  .refine(({ fromDate, toDate }) => fromDate < toDate, {
    message: 'fromDate must be less than toDate',
  });

export type SyncCampaignReportsQueryDto = z.infer<
  typeof SyncCampaignReportsQuerySchema
>;
