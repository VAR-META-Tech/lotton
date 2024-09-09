import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { TokenPrice } from '@/database/entities';

import { QueryTokenPriceDto } from './dto/token_price.query';
import { TokenPriceService } from './token_price.service';

@ApiTags('token-price')
@Controller('token-price')
export class TokenPriceController {
  constructor(private readonly tokenPriceService: TokenPriceService) {}

  @Get('')
  async getTokenPriceByTokenId(
    @Query() query?: QueryTokenPriceDto,
  ): Promise<TokenPrice> {
    return await this.tokenPriceService.getItem(query);
  }
}
