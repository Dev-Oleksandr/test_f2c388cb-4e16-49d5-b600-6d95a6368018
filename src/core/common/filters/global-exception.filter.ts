import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(
        new HttpException(
          {
            message: exception.message,
            status: `${exception.getStatus()}`,
          },
          exception.getStatus(),
        ),
        host,
      );
    }

    super.catch(
      new HttpException(
        {
          message: this.getErrorMessageOrEmpty(exception),
          status: `${HttpStatus.INTERNAL_SERVER_ERROR}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
      host,
    );
  }

  private getErrorMessageOrEmpty(exception: unknown): string {
    return typeof exception === 'object' && exception && 'message' in exception
      ? `${exception.message}`
      : '';
  }
}
