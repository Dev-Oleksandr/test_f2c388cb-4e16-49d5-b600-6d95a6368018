import { z } from 'zod';
import { campaignReportEventValues } from '../../../common/types/campaign-report-event-name.type.js';
import { DateRangeSchema } from '../../../common/schemas/date-range.schema.js';

export const SyncCampaignReportsQuerySchema = DateRangeSchema.extend({
  eventName: z.enum(campaignReportEventValues),
});

export type SyncCampaignReportsDto = z.infer<
  typeof SyncCampaignReportsQuerySchema
>;
