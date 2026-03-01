export interface IDataListResponse<T> {
  limit: number;
  offset: number;
  total: number;
  data: T[];
}

export class DataListResponse {
  constructor(
    private readonly limit: number,
    private readonly offset: number,
  ) {}

  toResult<T>(data: T[], total: number): IDataListResponse<T> {
    return {
      total,
      data,
      limit: this.limit,
      offset: this.offset,
    };
  }
}
