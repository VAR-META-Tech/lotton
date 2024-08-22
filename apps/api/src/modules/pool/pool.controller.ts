import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { QueryPaginationDto } from '@/shared/dto/pagination.query';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { CreatePoolDto } from './dto/create-pool.dto';
import { PoolQueryDto } from './dto/get-pool.query';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { PoolService } from './pool.service';

@Controller('pools')
@ApiBearerAuth()
@ApiTags('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  @UseGuards(AdminJwtGuard)
  async create(@Body() createPoolDto: CreatePoolDto) {
    return await this.poolService.create(createPoolDto);
  }

  @Put(':id')
  @UseGuards(AdminJwtGuard)
  async update(@Param('id') id: number, @Body() updatePoolDto: UpdatePoolDto) {
    return await this.poolService.update(id, updatePoolDto);
  }

  @Get()
  findAll(
    @Query() query: PoolQueryDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return this.poolService.find(pagination, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AdminJwtGuard)
  delete(@Param('id') id: string) {
    return this.poolService.deleteOne(+id);
  }
}
