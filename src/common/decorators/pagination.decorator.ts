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
    const parsedPage = Math.max(parseInt(request.query.page, 10) || 0, 0);

    const page = Math.max(parsedPage, PAGINATION_PAGE_MIN);
    const take = Math.max(
      parseInt(request.query.take, 10) || 0,
      PAGINATION_TAKE_MIN,
    );
    const skip = (page - 1) * take;

    if (take > options.maxTake) {
      throw new BadRequestException(
        `Request take parameter is invalid (must be a number between 1 and ${options.maxTake})`,
      );
    }

    return {
      page,
      take,
      skip,
    };
  })();
