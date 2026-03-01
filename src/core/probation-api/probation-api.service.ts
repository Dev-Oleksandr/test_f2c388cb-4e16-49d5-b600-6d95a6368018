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

@Injectable()
export class ProbationApiService {
  private readonly logger = new Logger(ProbationApiService.name);

  constructor(private readonly httpService: HttpService) {}

  fetchAllCampaignReports(
    dto: CampaignReportsRequest,
  ): Observable<CampaignReportParsedCsvRow[]> {
    const queryString = this.compareQueryString(dto);

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
          this.logger.error(message, error.message);
          return timer(retryCount * PROBATION_API_RETRY_DELAY_MS);
        },
      }),
      map(({ data }) => data),
    );
  }

  private parseCsv(csv: string): CampaignReportParsedCsvRow[] {
    const lines = csv.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return [];
    }

    const headers = lines[0].split(',').map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());

      return headers.reduce<CampaignReportParsedCsvRow>(
        (row, header, index) => {
          row[header] = values[index] ?? '';
          return row;
        },
        {} as CampaignReportParsedCsvRow,
      );
    });
  }

  private compareQueryString(dto: CampaignReportsRequest): string {
    return new URLSearchParams({
      event_name: dto.event_name,
      from_date: dto.from_date,
      to_date: dto.to_date,
      take: dto.take.toString(),
    }).toString();
  }
}
