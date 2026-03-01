import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  PAGINATION_PAGE_MIN,
  PAGINATION_TAKE_MAX,
  PAGINATION_TAKE_MIN,
} from './constants.js';

export interface PaginationQuery {
  take: number;
  skip: number;
  page: number;
}

export const Pagination = (
  options: { maxTake: number } = { maxTake: PAGINATION_TAKE_MAX },
) =>
  createParamDecorator((_: unknown, ctx: ExecutionContext): PaginationQuery => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const page = Number(query.page) || PAGINATION_PAGE_MIN;
    const take = Number(query.take) || PAGINATION_TAKE_MIN;
    const skip = (page - 1) * take;

    if (take > options.maxTake) {
      throw new BadRequestException(
        `Request take parameter is invalid (must be a number between 1 and ${options.maxTake})`,
      );
    }

    if (page < PAGINATION_PAGE_MIN) {
      throw new BadRequestException(
        `Request page parameter is invalid (must be a number more than ${PAGINATION_PAGE_MIN})`,
      );
    }

    return {
      page,
      take,
      skip,
    };
  })();
