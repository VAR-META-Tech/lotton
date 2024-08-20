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

import type { Token } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { SwaggerOperationEnum } from '@/shared/enums';
import type { FetchResult } from '@/utils/paginate';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { CreateTokenDto } from './dto/token.create';
import { QueryTokenDto } from './dto/token.query';
import { UpdateTokenDto } from './dto/token.update';
import { TokenService } from './token.service';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get(':id')
  async getItem(@Param('id') id: number): Promise<Token> {
    return await this.tokenService.getItem(id);
  }

  @Get('')
  async getItemsByPagination(
    @Query() query?: QueryTokenDto,
    @Query() pagination?: QueryPaginationDto,
  ): Promise<FetchResult<Token>> {
    return await this.tokenService.getItemsByPagination(query, pagination);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createItem(
    @Body() dto: CreateTokenDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.tokenService.createItem(dto, file);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateItem(
    @Param('id') id: number,
    @Body() dto: UpdateTokenDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.tokenService.updateItem(id, dto, file);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminJwtGuard)
  async deleteItem(@Param('id') id: number) {
    return await this.tokenService.deleteItem(id);
  }
}
