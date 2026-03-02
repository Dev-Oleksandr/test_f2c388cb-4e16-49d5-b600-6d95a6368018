import { z } from 'zod';

export const CampaignReportJobStatusSchema = z.object({
  jobId: z.uuid(),
});

export type GetCampaignReportJobStatus = z.infer<
  typeof CampaignReportJobStatusSchema
>;
