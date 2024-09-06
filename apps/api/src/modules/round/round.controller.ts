import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { SwaggerOperationEnum } from '@/shared/enums';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { UserJwtGuard } from '../auth/guards/user_jwt.guard';
import { RoundQueryDto } from './dto/round.query.dto';
import { RoundService } from './round.service';

@Controller('rounds')
@ApiTags('rounds')
@ApiBearerAuth()
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @Get()
  @UseGuards(AdminJwtGuard)
  async findRounds(
    @Query() query: RoundQueryDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return await this.roundService.findRounds(query, pagination);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @Get(':id')
  @UseGuards(AdminJwtGuard)
  async findRoundById(@Param('id') id: number) {
    return await this.roundService.findOne(+id);
  }

  @Get(':id/total-tickets')
  @UseGuards(UserJwtGuard)
  async totalTickets(@Param('id') id: number, @GetUser('user') user: User) {
    return await this.roundService.totalTickets(+id, user);
  }
}
