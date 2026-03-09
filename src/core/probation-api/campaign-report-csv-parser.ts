import { Logger } from '@nestjs/common';
import { CampaignReportEventName } from '../../common/types/campaign-report-event-name.type.js';
import { CampaignReportParsedCsvRow } from './types.js';

const REQUIRED_HEADERS: ReadonlyArray<keyof CampaignReportParsedCsvRow> = [
  'ad',
  'ad_id',
  'adgroup',
  'adgroup_id',
  'campaign',
  'campaign_id',
  'client_id',
  'event_name',
  'event_time',
];

export class CampaignReportCsvParser {
  private static readonly logger = new Logger(CampaignReportCsvParser.name);

  static parse(csv: string): Array<CampaignReportParsedCsvRow> {
    const lines = csv.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      this.logger.warn('CSV contains no data rows');
      return [];
    }

    const [headerLine, ...dataLines] = lines;
    const headers = headerLine?.split(',').map((header) => header.trim());
    const validatedHeaders = this.ensureRequiredHeaders(headers);

    return dataLines.map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const rawRow = Object.fromEntries(
        validatedHeaders.map((header, index) => [header, values[index] ?? '']),
      ) as Record<keyof CampaignReportParsedCsvRow, string>;

      return {
        ...rawRow,
        event_time: new Date(rawRow.event_time),
        event_name: rawRow.event_name as CampaignReportEventName,
      };
    });
  }

  private static ensureRequiredHeaders(headers?: Array<string>) {
    const missingHeaders = REQUIRED_HEADERS.filter(
      (requiredHeader) => !headers?.includes(requiredHeader),
    );

    if (missingHeaders.length) {
      throw new Error(
        `Invalid CSV: missing headers: ${missingHeaders.join(', ')}`,
      );
    }

    return headers!;
  }
}
