import { Transaction, User } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { FetchType, paginateEntities } from '@/utils/paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryTransactionDto } from './dto/transaction.query';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactions(
    user: User,
    query: QueryTransactionDto,
    pagination: QueryPaginationDto,
  ) {
    try {
      const { tokenId, fromDate, toDate, type, sort } = query;
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .where('(transaction.fromAddress = :userWallet or transaction.toAddress = :userWallet)', {
          userWallet: user.wallet,
        })
        .orderBy('transaction.createdAt', sort);

      if (tokenId) {
        queryBuilder.andWhere('transaction.tokenId = :tokenId', { tokenId });
      }

      if (fromDate) {
        queryBuilder.andWhere('transaction.createdAt >= :fromDate', {
          fromDate,
        });
      }

      if (toDate) {
        queryBuilder.andWhere('transaction.createdAt <= :toDate', {
          toDate,
        });
      }

      if (type) {
        queryBuilder.andWhere('transaction.type = :type', { type });
      }

      return await paginateEntities<Transaction>(
        queryBuilder,
        pagination,
        FetchType.MANAGED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
