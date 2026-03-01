import { HttpStatus } from '@nestjs/common';

export class AppException {
  public readonly status: HttpStatus;
  public readonly message: string;
  meta?: Record<string, unknown>;

  constructor(options: {
    message: string;
    status?: HttpStatus;
    meta?: Record<string, unknown>;
  }) {
    this.status = options.status ?? HttpStatus.BAD_REQUEST;
    this.message = options.message;
    this.meta = options.meta;
  }
}
