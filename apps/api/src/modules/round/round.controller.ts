import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueryPaginationDto } from '@/shared/dto/pagination.query';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { RoundQueryDto } from './dto/round.query.dto';
import { RoundService } from './round.service';

@Controller('rounds')
@ApiTags('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get()
  @UseGuards(AdminJwtGuard)
  async findRounds(
    @Query() query: RoundQueryDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return await this.roundService.findRounds(query, pagination);
  }

  @Get(':id')
  @UseGuards(AdminJwtGuard)
  async findRoundById(@Param('id') id: number) {
    return await this.roundService.findOne(+id);
  }
}
