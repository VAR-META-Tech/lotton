import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TokenPrice } from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import type { FetchResult } from '@/utils/paginate';
import { FetchType, paginateEntities } from '@/utils/paginate';

import type { QueryTFTokenPriceDto } from './dto/tf_token_price.query';
import type { QueryTokenPriceDto } from './dto/token_price.query';

@Injectable()
export class TokenPriceService {
  constructor(
    @InjectRepository(TokenPrice)
    private readonly tokenPriceRepository: Repository<TokenPrice>,
  ) {}

  async getItemsByPagination(
    query?: QueryTokenPriceDto,
    pagination?: QueryPaginationDto,
  ): Promise<FetchResult<TokenPrice>> {
    try {
      const { tokenId, fromDate, toDate, sort, search } = query;
      const queryBuilder = this.tokenPriceRepository
        .createQueryBuilder('tokenPrice')
        .innerJoin('tokenPrice.token', 'token')
        .select([
          'tokenPrice.id',
          'tokenPrice.price',
          'tokenPrice.createdAt',
          'tokenPrice.updatedAt',
          'token.name',
          'token.symbol',
          'token.icon',
        ]);

      // Query conditions mapping
      const conditions = [
        {
          condition: tokenId,
          query: 'tokenPrice.tokenId = :tokenId',
          param: { tokenId },
        },

        {
          condition: search,
          query: '(token.name LIKE :search OR token.symbol LIKE :search )',
          param: { search: `%${search}%` },
        },
        {
          condition: fromDate,
          query: 'tokenPrice.createdAt >= :fromDate',
          param: { fromDate },
        },
        {
          condition: toDate,
          query: 'tokenPrice.createdAt <= :toDate',
          param: { toDate },
        },
      ];

      // Apply conditions
      conditions.forEach(({ condition, query, param }) => {
        if (condition) {
          queryBuilder.andWhere(query, param);
        }
      });

      // Sorting
      if (sort) {
        queryBuilder.orderBy('tokenPrice.createdAt', sort);
      }

      // Paginate
      return await paginateEntities<TokenPrice>(
        queryBuilder,
        pagination,
        FetchType.MANAGED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getItems(query?: QueryTFTokenPriceDto): Promise<TokenPrice[]> {
    try {
      const { tokenId, fromDate, toDate, sort } = query;

      const queryBuilder = this.tokenPriceRepository
        .createQueryBuilder('tokenPrice')
        .select(['tokenPrice.price', 'tokenPrice.createdAt']);

      // Query conditions mapping
      const conditions = [
        {
          condition: tokenId,
          query: 'tokenPrice.tokenId = :tokenId',
          param: { tokenId },
        },
        {
          condition: fromDate,
          query: 'tokenPrice.createdAt >= :fromDate',
          param: { fromDate },
        },
        {
          condition: toDate,
          query: 'tokenPrice.createdAt <= :toDate',
          param: { toDate },
        },
      ];

      // Apply conditions
      conditions.forEach(({ condition, query, param }) => {
        if (condition) {
          queryBuilder.andWhere(query, param);
        }
      });

      // Sorting
      if (sort) {
        queryBuilder.orderBy('tokenPrice.createdAt', sort);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
