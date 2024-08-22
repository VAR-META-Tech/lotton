import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/admin_roles.decorator';
import { GetUser } from '@/common/decorators/user.decorator';
import { Admin } from '@/database/entities';
import { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { RoleEnum, SwaggerOperationEnum } from '@/shared/enums';
import type { FetchResult } from '@/utils/paginate';

import { AdminJwtGuard } from '../auth/guards/admin_jwt.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto, QueryAdminDto, UpdateAdminDto } from './dto/admin.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @Get('me')
  @UseGuards(AdminJwtGuard)
  async getMe(@GetUser() admin: Admin): Promise<Admin> {
    return admin;
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Get('list-roles')
  @Roles(RoleEnum.SUPER_ADMIN)
  async getListRoles(): Promise<RoleEnum[]> {
    return Object.values(RoleEnum);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Post('')
  @Roles(RoleEnum.SUPER_ADMIN)
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminService.create(createAdminDto);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Get('')
  @Roles(RoleEnum.SUPER_ADMIN)
  async getAdmins(
    @Query() query: QueryAdminDto,
    @Query() pagination: QueryPaginationDto,
  ): Promise<FetchResult<Admin>> {
    return await this.adminService.find(query, pagination);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async getAdmin(@Query('id') id: number): Promise<Admin> {
    return await this.adminService.findOne(id);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async updateAdmin(
    @Query('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return await this.adminService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.SUPER_ADMIN })
  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async deleteAdmin(@Query('id') id: number): Promise<Admin> {
    return await this.adminService.delete(id);
  }
}
