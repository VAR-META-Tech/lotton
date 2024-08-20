import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { Network } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { SwaggerOperationEnum } from '@/shared/enums';
import type { FetchResult } from '@/utils/paginate';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { CreateNetworkDto } from './dto/network.create';
import { QueryNetworkDto } from './dto/network.query';
import { UpdateNetworkDto } from './dto/network.update';
import { NetworkService } from './network.service';

@ApiTags('network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get(':chainId')
  async getItem(@Param('chainId') chainId: number): Promise<Network> {
    return await this.networkService.getItem(chainId);
  }

  @Get()
  async getItemsByPagination(
    @Query() query?: QueryNetworkDto,
    @Query() pagination?: QueryPaginationDto,
  ): Promise<FetchResult<Network>> {
    return await this.networkService.getItemsByPagination(query, pagination);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createItem(
    @Body() dto: CreateNetworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.networkService.createItem(dto, file);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Patch(':chainId')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateItem(
    @Param('chainId') chainId: number,
    @Body() dto: UpdateNetworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.networkService.updateItem(chainId, dto, file);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @Delete(':chainId')
  @UseGuards(AdminJwtGuard)
  async deleteItem(@Param('chainId') chainId: number) {
    return await this.networkService.deleteItem(chainId);
  }
}
