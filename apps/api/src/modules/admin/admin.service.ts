import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { AdminStatusEnum, SocialAuthEnum } from '@/shared/enums';
import { FetchType, paginateEntities } from '@/utils/paginate';

import type {
  CreateAdminDto,
  QueryAdminDto,
  UpdateAdminDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const admin = new Admin();
      admin.email = createAdminDto.email;
      admin.fullName = createAdminDto.fullName;
      admin.role = createAdminDto.role;
      admin.isActive = true;
      admin.socialType = SocialAuthEnum.GOOGLE;
      return await this.adminRepository.save(admin);
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const exits = await this.adminRepository.findOne({ where: { id: id } });
      if (!exits)
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

      updateAdminDto.fullName && (exits.fullName = updateAdminDto.fullName);
      updateAdminDto.role && (exits.role = updateAdminDto.role);
      if (updateAdminDto.status) {
        const status =
          updateAdminDto.status === AdminStatusEnum.ACTIVE ? true : false;
        exits.isActive = status;
      }

      return await this.adminRepository.save(exits);
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async find(query: QueryAdminDto, pagination: QueryPaginationDto) {
    try {
      const { status, search } = query;
      const queryBuilder = this.adminRepository.createQueryBuilder('admin');

      if (search) {
        queryBuilder.andWhere(
          '(admin.fullName LIKE :search OR  admin.email LIKE :search)',
          {
            search: `%${search}%`,
          },
        );
      }

      if (status && status == AdminStatusEnum.ACTIVE) {
        queryBuilder.andWhere('admin.isActive = true');
      }
      if (status && status == AdminStatusEnum.INACTIVE) {
        queryBuilder.andWhere('admin.isActive = false');
      }

      return await paginateEntities<Admin>(
        queryBuilder,
        pagination,
        FetchType.MANAGED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRepository
        .createQueryBuilder('admin')
        .where('id = :id', { id })
        .getRawOne();
      return admin;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      const admin = await this.adminRepository.findOne({ where: { id } });
      if (!admin)
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

      return await this.adminRepository.softRemove(admin);
    } catch (error) {
      throw new BadRequestException(error.message ?? '');
    }
  }
}
