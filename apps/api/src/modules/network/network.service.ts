import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import { Network } from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import type { IService } from '@/shared/interfaces/service.interface';
import type { FetchResult } from '@/utils/paginate';
import { FetchType, paginateEntities } from '@/utils/paginate';

import { FileService } from '../file/file.service';
import type { CreateNetworkDto } from './dto/network.create';
import type { QueryNetworkDto } from './dto/network.query';
import type { UpdateNetworkDto } from './dto/network.update';

@Injectable()
export class NetworkService
  implements
    IService<QueryNetworkDto, QueryPaginationDto, CreateNetworkDto, Network>
{
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    private readonly fileService: FileService,
  ) {}

  async getItemsByPagination(
    query?: QueryNetworkDto,
    pagination?: QueryPaginationDto,
  ): Promise<FetchResult<Network>> {
    const { chainId, search, fromDate, toDate, isActive } = query;
    const queryBuilder = this.networkRepository.createQueryBuilder('network');

    if (chainId) {
      queryBuilder.where('network.chainId = :chainId', { chainId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(network.name like :search or network.symbol like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (fromDate) {
      queryBuilder.andWhere('network.createdAt >= :fromDate', {
        fromDate,
      });
    }

    if (toDate) {
      queryBuilder.andWhere('network.createdAt <= :toDate', {
        toDate,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('network.isActive = :isActive', {
        isActive,
      });
    }

    return await paginateEntities<Network>(
      queryBuilder,
      pagination,
      FetchType.MANAGED,
    );
  }

  async getItem(chainId: number): Promise<Network> {
    const networkExist = await this.networkRepository.findOneBy({ chainId });
    if (!networkExist) {
      throw Causes.NOT_FOUND('Network');
    }
    return networkExist;
  }

  async createItem(
    dto: CreateNetworkDto,
    file: Express.Multer.File,
  ): Promise<Network> {
    const { chainId } = dto;
    let iconUrl: string;

    const networkExist = await this.networkRepository.findOneBy({
      chainId,
    });

    if (networkExist) {
      throw Causes.CONFLICT('Network', 'Network already exists');
    }

    if (file) {
      iconUrl = await this.fileService.uploadS3(file, 'networks');
    }

    return await this.networkRepository.save({ ...dto, icon: iconUrl });
  }

  async updateItem(
    chainId: number,
    dto: UpdateNetworkDto,
    file?: Express.Multer.File,
  ): Promise<boolean> {
    let iconUrl: string;

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Nothing to update!');
    }

    const networkExist = await this.networkRepository.findOneBy({
      chainId,
    });

    if (!networkExist) {
      throw Causes.NOT_FOUND('Network');
    }

    if (file) {
      await this.fileService.deleteS3(networkExist.icon);
      iconUrl = await this.fileService.uploadS3(file, 'networks');
    }

    const { affected } = await this.networkRepository.update(chainId, {
      ...dto,
      icon: iconUrl,
    });
    return affected > 0;
  }

  async deleteItem(chainId: number): Promise<boolean> {
    const networkExist = await this.networkRepository.findOneBy({
      chainId,
    });
    if (!networkExist) {
      throw Causes.NOT_FOUND('Network');
    }

    await this.fileService.deleteS3(networkExist.icon);

    const { affected } = await this.networkRepository.delete(chainId);
    return affected > 0;
  }
}
