import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  async transform<Data>(value: Data): Promise<Data> {
    const parsed = await this.schema.safeParseAsync(value);
    if (!parsed.success) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        meta: {
          validationErrors: JSON.parse(parsed.error.message),
        },
      });
    }
    return parsed.data as Data;
  }
}
