import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EMPTY, expand, map, Observable, retry, timer } from 'rxjs';
import {
  PROBATION_API_RETRY_DELAY_MS,
  PROBATION_API_RETRY_MAX_COUNT,
} from './constants.js';
import {
  CampaignReportParsedCsvRow,
  CampaignReportsRequest,
  CampaignReportsResponse,
} from './types.js';
import { CampaignReportEventName } from '../../common/types/campaign-report-event-name.type.js';

@Injectable()
export class ProbationApiService {
  private readonly logger = new Logger(ProbationApiService.name);

  constructor(private readonly httpService: HttpService) {}

  fetchAllCampaignReports(
    dto: CampaignReportsRequest,
  ): Observable<Array<CampaignReportParsedCsvRow>> {
    const queryString = this.buildQueryString(dto);

    return this.fetchApi(`/tasks/campaign/reports?${queryString}`).pipe(
      expand(({ data }) => {
        const nextUrl = data?.pagination?.next;
        if (!nextUrl) {
          return EMPTY;
        }

        return this.fetchApi(nextUrl);
      }),
      map(({ data }) => this.parseCsv(data.csv)),
    );
  }

  private fetchApi(url: string): Observable<CampaignReportsResponse> {
    return this.httpService.get<CampaignReportsResponse>(url).pipe(
      retry({
        count: PROBATION_API_RETRY_MAX_COUNT,
        delay: (error, retryCount) => {
          const message = 'An error occurred while fetching campaign reports';
          this.logger.error(message, error.stack);
          return timer(retryCount * PROBATION_API_RETRY_DELAY_MS);
        },
      }),
      map(({ data }) => data),
    );
  }

  private parseCsv(csv: string): Array<CampaignReportParsedCsvRow> {
    const lines = csv.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines[0];

    const headers = headerLine
      ? headerLine.split(',').map((header) => header.trim())
      : undefined;

    const requiredHeaders = this.ensureRequiredHeaders(headers);

    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const rawRow = Object.fromEntries(
        requiredHeaders.map((header, index) => [header, values[index] ?? '']),
      ) as Record<keyof CampaignReportParsedCsvRow, string>;

      return {
        ...rawRow,
        event_time: new Date(rawRow.event_time),
        event_name: rawRow.event_name as CampaignReportEventName,
      };
    });
  }

  private ensureRequiredHeaders(headers?: Array<string>) {
    const requiredHeaders = [
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
    const missingHeaders = requiredHeaders.filter(
      (requiredHeader) => !headers?.includes(requiredHeader),
    );

    if (missingHeaders.length) {
      throw new Error(
        `Invalid CSV: missing headers: ${missingHeaders.join(', ')}`,
      );
    }

    return requiredHeaders;
  }

  private buildQueryString(dto: CampaignReportsRequest): string {
    return new URLSearchParams({
      event_name: dto.event_name,
      from_date: dto.from_date,
      to_date: dto.to_date,
      take: dto.take.toString(),
    }).toString();
  }
}
