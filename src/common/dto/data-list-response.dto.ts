import { PaginationQuery } from '../decorators/pagination.decorator.js';
import { DataListMetaDto } from './data-list-response-meta.dto.js';

export class DataListResponse<T> {
  readonly data: T[];
  readonly meta: DataListMetaDto;

  constructor(data: T[], paginationQuery: PaginationQuery, itemCount: number) {
    this.data = data;
    this.meta = new DataListMetaDto(paginationQuery, itemCount);
  }
}
