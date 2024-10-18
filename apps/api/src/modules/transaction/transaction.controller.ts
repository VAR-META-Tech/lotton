import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';

import { UserJwtGuard } from '../auth/guards/user_jwt.guard';
import { QueryTransactionDto } from './dto/transaction.query';
import { TransactionService } from './transaction.service';

@ApiTags('transaction')
@Controller('transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(UserJwtGuard)
  async getTransactions(
    @GetUser('user') user: User,
    @Query() filter: QueryTransactionDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return await this.transactionService.getTransactions(
      user,
      filter,
      pagination,
    );
  }
}
