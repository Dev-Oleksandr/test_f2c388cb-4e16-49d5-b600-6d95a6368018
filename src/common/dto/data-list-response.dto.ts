import { PaginationQuery } from '../decorators/pagination.decorator.js';

export class DataListResponse<T> {
  readonly data: T[];
  readonly meta: DataListMetaDto;

  constructor(data: T[], paginationQuery: PaginationQuery, itemCount: number) {
    this.data = data;
    this.meta = new DataListMetaDto(paginationQuery, itemCount);
  }
}

class DataListMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ take, page }: PaginationQuery, itemCount: number) {
    this.page = page;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
