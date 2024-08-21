import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/admin_roles.decorator';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { RoleEnum } from '@/shared/enums';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { CreatePoolDto } from './dto/create-pool.dto';
import { PoolQueryDto } from './dto/get-pool.query';
import { PoolService } from './pool.service';

@Controller('pools')
@ApiBearerAuth()
@ApiTags('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  @UseGuards(AdminJwtGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async create(@Body() createPoolDto: CreatePoolDto) {
    return await this.poolService.create(createPoolDto);
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
}
