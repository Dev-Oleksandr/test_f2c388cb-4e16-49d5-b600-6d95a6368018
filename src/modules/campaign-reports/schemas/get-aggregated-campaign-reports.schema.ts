import { z } from 'zod';
import { campaignReportEventValues } from '../../../common/types/campaign-report-event-name.type.js';
import { DateRangeSchema } from '../../../common/schemas/date-range.schema.js';

export const GetAggregatedCampaignReportsSchema = DateRangeSchema.extend({
  eventName: z.enum(campaignReportEventValues),
});

export type GetAggregatedCampaignReportsDto = z.infer<
  typeof GetAggregatedCampaignReportsSchema
>;
