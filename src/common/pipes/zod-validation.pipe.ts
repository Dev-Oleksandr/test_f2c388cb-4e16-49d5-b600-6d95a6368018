import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { AppException } from '../exceptions/app.exception.js';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  async transform<Data>(value: Data): Promise<Data> {
    const parsed = await this.schema.safeParseAsync(value);
    if (!parsed.success) {
      throw new AppException({
        status: HttpStatus.BAD_REQUEST,
        meta: {
          validationErrors: JSON.parse(parsed.error.message),
        },
        message: 'Validation failed',
      });
    }
    return parsed.data as Data;
  }
}
