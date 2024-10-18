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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { UserJwtGuard } from '../auth/guards/user_jwt.guard';
import { CreatePoolDto } from './dto/create-pool.dto';
import {
  ClaimDto,
  ConfirmClaimDto,
  PoolQueryDto,
  UserPoolDto,
} from './dto/get-pool.query';
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

  @Get('joined')
  @UseGuards(UserJwtGuard)
  async findJoinedPools(
    @GetUser('user') user: User,
    @Query() query: UserPoolDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return await this.poolService.findJoinedPools(user, query, pagination);
  }

  @Get('collect-prize')
  @ApiOperation({
    description: 'summary user claimed',
    summary: 'User claimed pool',
  })
  @UseGuards(UserJwtGuard)
  async collectPrizes(
    @GetUser('user') user: User,
    @Query() claimDto: ClaimDto,
    @Query() pagination: QueryPaginationDto,
  ) {
    return await this.poolService.collectPrizes(user, claimDto, pagination);
  }

  @Get('claim/signature')
  @ApiOperation({
    description: `
    const encode = Buffer.from(signature, 'base64');
    const signatureCell = beginCell().storeBuffer(encode).endCell();
    TODO:// send signatureCell to SC`,
    summary: 'User claimed pool signature',
  })
  @UseGuards(UserJwtGuard)
  async claim(@GetUser('user') user: User, @Query() claimDto: ClaimDto) {
    const result = await this.poolService.claim(user, claimDto);
    return result;
  }

  @Get('claim/confirm')
  @ApiOperation({
    description: '',
    summary: 'User confirm claimed prize',
  })
  @UseGuards(UserJwtGuard)
  async confirmClaim(
    @GetUser('user') user: User,
    @Query() confirmClaimDto: ConfirmClaimDto,
  ) {
    const result = await this.poolService.confirmClaim(user, confirmClaimDto);
    return result;
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
