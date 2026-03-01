import { HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  public readonly status: HttpStatus;
  public readonly meta?: Record<string, unknown>;

  constructor(options: {
    message: string;
    status?: HttpStatus;
    meta?: Record<string, unknown>;
  }) {
    super(options.message);
    this.status = options.status ?? HttpStatus.BAD_REQUEST;
    this.message = options.message;
    this.meta = options.meta;
  }
}
