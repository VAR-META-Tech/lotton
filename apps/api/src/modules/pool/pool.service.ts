import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { mnemonicToWalletKey, sign } from '@ton/crypto';
import { Address, beginCell } from '@ton/ton';
import dayjs from 'dayjs';
import bigDecimal from 'js-big-decimal';
import type { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import type { StellaConfig } from '@/configs';
import type { User } from '@/database/entities';
import {
  Pool,
  PoolPrize,
  PoolRound,
  Prizes,
  Token,
  UserTicket,
} from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { PoolRoundStatusEnum, PoolStatusEnum } from '@/shared/enums';
import type { FetchResult } from '@/utils/paginate';
import {
  FetchType,
  generatePagination,
  paginateEntities,
} from '@/utils/paginate';

import { PoolRoundService } from '../poolRound/poolRound.service';
import type { CreatePoolDto, PoolPrizes } from './dto/create-pool.dto';
import type { ClaimDto } from './dto/get-pool.query';
import {
  type PoolQueryDto,
  type UserPoolDto,
  UserPoolType,
} from './dto/get-pool.query';
import type { UpdatePoolDto } from './dto/update-pool.dto';

export class PoolService {
  constructor(
    @InjectRepository(Pool) private readonly poolRepository: Repository<Pool>,
    @InjectRepository(PoolRound)
    private readonly roundRepository: Repository<PoolRound>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(PoolPrize)
    private readonly poolPrizesRepository: Repository<PoolPrize>,
    private readonly poolRoundService: PoolRoundService,
    private readonly configService: ConfigService<StellaConfig>,
    @InjectRepository(Prizes)
    private readonly prizesRepository: Repository<Prizes>,
    @InjectRepository(UserTicket)
    private readonly userTicketRepository: Repository<UserTicket>,
  ) {}
  async create(createPoolDto: CreatePoolDto) {
    try {
      const pool = new Pool();
      pool.name = createPoolDto.name;
      pool.currency = await this.tokenRepository.findOne({
        where: { id: +createPoolDto.currency },
      });
      // pool.poolIdOnChain = createPoolDto.poolIdOnChain;
      pool.sequency = createPoolDto.sequency;
      pool.totalRounds = createPoolDto.totalRounds;
      pool.startTime = createPoolDto.startTime;
      pool.ticketPrice = createPoolDto.ticketPrice;
      pool.endTime =
        +createPoolDto.startTime +
        +createPoolDto.sequency * +createPoolDto.totalRounds;

      await this.poolRepository.save(pool);

      // Create rounds
      // let startTime = createPoolDto.startTime;
      // for (let i = 1; i <= createPoolDto.totalRounds; i++) {
      //   const endTime = dayjs(startTime)
      //     .add(createPoolDto.sequency, 'seconds')
      //     .toDate();
      //   const round = new PoolRound();
      //   round.startTime = dayjs(startTime).toDate();
      //   round.endTime = endTime;
      //   round.pool = pool;
      //   round.roundNumber = i;
      //   await this.roundRepository.save(round);
      //   startTime = endTime;
      // }
      const poolPrizes = createPoolDto.poolPrizes.map((poolDto) => {
        const poolPrize = new PoolPrize();
        poolPrize.pool = pool;
        poolPrize.matchNumber = poolDto.matchNumber;
        poolPrize.allocation = poolDto.allocation;
        return poolPrize;
      });
      await this.poolPrizesRepository.save(poolPrizes);

      return pool;
    } catch (error) {
      throw error;
    }
  }

  async update(_poolId: number, _updatePoolDto: UpdatePoolDto) {
    // const poolExist = await this.findOne(poolId);
    // if (!poolExist) throw Causes.NOT_FOUND('Pool');

    // if (dayjs(poolExist.startTime) > dayjs()) {
    //   const pool = await this.newPoolForUpdate({
    //     ...updatePoolDto,
    //     startTime: updatePoolDto?.startTime ?? poolExist.startTime,
    //     sequency: updatePoolDto?.sequency ?? poolExist.sequency,
    //     totalRounds: updatePoolDto?.totalRounds ?? poolExist.totalRounds,
    //   });
    //   await this.poolRepository.update(poolId, pool);

    //   const numChangeRound = poolExist.totalRounds - updatePoolDto.totalRounds;
    //   const isChangeStartTime = poolExist.startTime !== updatePoolDto.startTime;

    //   if (Math.abs(numChangeRound) > 0 || isChangeStartTime) {
    //     await this.poolRoundService.deleteRoundsFromTime(
    //       poolId,
    //       poolExist.startTime,
    //     );

    //     let startTime = updatePoolDto.startTime;
    //     for (let i = 1; i <= updatePoolDto.totalRounds; i++) {
    //       const endTime = dayjs(startTime)
    //         .add(updatePoolDto.sequency, 'days')
    //         .toDate();
    //       const round = new PoolRound();
    //       round.startTime = dayjs(startTime).toDate();
    //       round.endTime = endTime;
    //       round.pool = poolExist;
    //       round.roundNumber = i;
    //       await this.poolRoundService.create(round);
    //       startTime = endTime;
    //     }

    //     const prizes: Partial<PoolPrize>[] = [];
    //     for (const prize of updatePoolDto.poolPrizes) {
    //       prizes.push({
    //         allocation: prize.allocation,
    //         pool: poolExist,
    //         matchNumber: prize.matchNumber,
    //       });
    //     }
    //     await this.poolPrizesRepository
    //       .createQueryBuilder()
    //       .insert()
    //       .into(PoolPrize)
    //       .values(prizes)
    //       .orUpdate(['allocation'], ['poolId', 'matchNumber'])
    //       .execute();
    //   }
    // } else {
    //   if (poolExist.name !== updatePoolDto.name)
    //     throw new BadRequestException('Name cannot be changed');
    //   if (poolExist.currency.id !== updatePoolDto.currency)
    //     throw new BadRequestException('Currency cannot be changed');
    //   if (
    //     dayjs(poolExist.startTime).toISOString() !==
    //     dayjs(updatePoolDto.startTime).toISOString()
    //   )
    //     throw new BadRequestException('Start time cannot be changed');
    //   if (poolExist.sequency !== updatePoolDto.sequency)
    //     throw new BadRequestException('Sequency cannot be changed');
    //   if (Number(poolExist.ticketPrice) !== Number(updatePoolDto.ticketPrice))
    //     throw new BadRequestException('Ticket price cannot be changed');

    //   if (!this.checkPoolPrizes(poolExist.poolPrizes, updatePoolDto.poolPrizes))
    //     throw new BadRequestException('Pool prizes cannot be changed');

    //   const countRoundOnGoing = await this.poolRoundService.countOnGoing(
    //     poolId,
    //   );

    //   if (updatePoolDto.totalRounds > poolExist.totalRounds) {
    //     // Add new
    //     let startTime = poolExist.endTime;
    //     for (
    //       let i = 1;
    //       i <= updatePoolDto.totalRounds - poolExist.totalRounds;
    //       i++
    //     ) {
    //       const endTime = dayjs(startTime)
    //         .add(updatePoolDto.sequency, 'days')
    //         .toDate();
    //       const round = new PoolRound();
    //       round.startTime = dayjs(startTime).toDate();
    //       round.endTime = endTime;
    //       round.pool = poolExist;
    //       round.roundNumber = poolExist.totalRounds + i;
    //       await this.poolRoundService.create(round);
    //       startTime = endTime;
    //     }
    //   }

    //   if (updatePoolDto.totalRounds < poolExist.totalRounds) {
    //     // Remove some
    //     if (countRoundOnGoing <= updatePoolDto.totalRounds) {
    //       await this.poolRoundService.deleteRoundGreaterRoundNumber(
    //         poolId,
    //         updatePoolDto.totalRounds + 1,
    //       );
    //     } else if (countRoundOnGoing > updatePoolDto.totalRounds) {
    //       throw new BadRequestException(
    //         'Total number of rounds cannot be changed to less than number of on-going rounds',
    //       );
    //     }
    //   }

    //   const pool = await this.newPoolForUpdate({
    //     ...updatePoolDto,
    //     startTime: updatePoolDto?.startTime ?? poolExist.startTime,
    //     sequency: updatePoolDto?.sequency ?? poolExist.sequency,
    //     totalRounds: updatePoolDto?.totalRounds ?? poolExist.totalRounds,
    //   });
    //   await this.poolRepository.update(poolId, pool);
    // }

    return true;
  }

  async find(pagination: QueryPaginationDto, query: PoolQueryDto) {
    try {
      const { status, search } = query;

      const queryBuilder = this.poolRepository
        .createQueryBuilder('pool')
        .where('status = :status', { status: PoolStatusEnum.ACTIVE });

      if (search) {
        queryBuilder.andWhere('pool.name LIKE :search ', {
          search: `%${search}%`,
        });
      }
      if (status && status == PoolRoundStatusEnum.UPCOMING) {
        queryBuilder.andWhere('pool.startTime > UNIX_TIMESTAMP(NOW())');
      }
      if (status && status == PoolRoundStatusEnum.ONGOING) {
        queryBuilder.andWhere(
          'pool.startTime < UNIX_TIMESTAMP(NOW()) AND pool.endTime > UNIX_TIMESTAMP(NOW())',
        );
      }
      if (status && status == PoolRoundStatusEnum.CLOSED) {
        queryBuilder.andWhere('pool.endTime < UNIX_TIMESTAMP(NOW())');
      }
      if (status && status == PoolRoundStatusEnum.DELETE) {
        queryBuilder.andWhere('pool.deletedAt IS NOT NULL').withDeleted();
      }

      return await paginateEntities<Pool>(
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
      const poolQueryBuilder = this.poolRepository.createQueryBuilder('pool');
      const prizes = await this.prizesRepository
        .createQueryBuilder('prizes')
        .leftJoinAndSelect(
          Pool,
          'pool',
          'pool.poolIdOnChain = prizes.poolIdOnChain',
        )
        .select([
          'pool.id as poolId',
          'pool.poolIdOnChain as poolIdOnChain',
          'prizes.*',
        ])
        .groupBy('prizes.id')
        .where('pool.id = :poolId', { poolId: id })
        .getRawMany();

      const pool = await poolQueryBuilder
        .clone()
        .leftJoinAndSelect('pool.currency', 'token')
        .leftJoinAndSelect('pool.rounds', 'rounds')
        .leftJoinAndSelect('pool.poolPrizes', 'poolPrizes')
        .where('pool.id = :poolId', { poolId: id })
        .getOne();

      pool.rounds = await Promise.all(
        pool.rounds.map(async (round) => ({
          ...round,
          totalPrizes:
            prizes.find(
              (prize) => prize.roundIdOnChain === round.roundIdOnChain,
            )?.totalPrizes ?? '0',
          winners: await this.getWinners(round.id),
          totalTickets: await this.getTotalTickets(round.id),
        })),
      );
      return pool;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTotalTickets(roundId: number) {
    const [, total] = await this.userTicketRepository.findAndCountBy({
      round: {
        id: roundId,
      },
    });
    return total;
  }

  getWinners(roundId: number) {
    return this.userTicketRepository
      .createQueryBuilder('userTicket')
      .leftJoin('userTicket.round', 'round')
      .where(
        'userTicket.winningMatch IS NOT NULL AND userTicket.winningMatch > 0',
      )
      .andWhere('round.id = :roundId', {
        roundId,
      })
      .select([
        'COUNT(userTicket.userWallet) as totalWinning',
        'userTicket.winningMatch as winningMatch',
      ])
      .groupBy('userTicket.winningMatch')
      .getRawMany();
  }

  async deleteOne(poolId: number) {
    const poolExist = await this.findOne(poolId);
    if (!poolExist) throw Causes.NOT_FOUND('Pool');

    if (dayjs(poolExist?.startTime) > dayjs()) {
      await this.poolRepository.softRemove(poolExist);
      await this.poolPrizesRepository
        .createQueryBuilder()
        .softDelete()
        .from(PoolPrize)
        .where('poolId = :poolId', { poolId })
        .execute();
      await this.poolRoundService.softDelete(poolId);
      return true;
    }

    throw new BadRequestException(
      'Cannot delete this pool that has already started.',
    );
  }

  checkPoolPrizes(prizesDB: PoolPrize[], prizesUpdate: PoolPrizes[]) {
    let status = true;

    prizesDB.map((prize) => {
      const prizesExistId = prizesUpdate.findIndex(
        (prizeUpdate) => prizeUpdate.matchNumber === prize.matchNumber,
      );

      if (
        prizesExistId > 0 &&
        prizesUpdate[prizesExistId].allocation !== prize.allocation
      )
        status = false;
    });

    return status;
  }

  async newPoolForUpdate(updatePoolDto: UpdatePoolDto) {
    const pool = new Pool();

    updatePoolDto?.name && (pool.name = updatePoolDto?.name);
    updatePoolDto?.currency &&
      (pool.currency = await this.tokenRepository.findOne({
        where: { id: +updatePoolDto?.currency },
      }));
    updatePoolDto?.sequency && (pool.sequency = updatePoolDto?.sequency);
    updatePoolDto?.totalRounds &&
      (pool.totalRounds = updatePoolDto?.totalRounds);
    updatePoolDto?.startTime && (pool.startTime = updatePoolDto?.startTime);
    updatePoolDto?.ticketPrice &&
      (pool.ticketPrice = updatePoolDto?.ticketPrice);
    (!!updatePoolDto?.startTime ||
      !!updatePoolDto?.sequency ||
      !!updatePoolDto?.totalRounds) &&
      (pool.endTime =
        +updatePoolDto?.startTime +
        +updatePoolDto?.sequency * +updatePoolDto?.totalRounds);

    return pool;
  }
  async findJoinedPools(
    user: User,
    query: UserPoolDto,
    pagination: QueryPaginationDto,
  ): Promise<FetchResult<Pool>> {
    try {
      const { type = UserPoolType.JOINED } = query;
      const { page = 1, pageSizes } = pagination;
      const take = pageSizes > 50 || !pageSizes ? 50 : pageSizes;
      const skip = (page - 1) * take || 0;

      const subQuery = this.poolRepository
        .createQueryBuilder('poolSub')
        .leftJoin('poolSub.rounds', 'roundsSub')
        .leftJoin('roundsSub.ticket', 'ticketSub')
        .where('ticketSub.userWallet = :userWallet', {
          userWallet: user.wallet,
        });
      if (type == UserPoolType.WINNER) {
        subQuery.andWhere('ticketSub.winningMatch >= :winningMatch', {
          winningMatch: 1,
        });
      }

      const [pools, totalItems] = await subQuery
        .clone()
        .skip(skip)
        .take(take)
        .getManyAndCount();

      if (pools.length == 0)
        return generatePagination<Pool>(totalItems, pools, page, take);

      const queryBuilder = this.poolRepository
        .createQueryBuilder('pool')
        .leftJoinAndSelect('pool.rounds', 'rounds')
        .leftJoinAndSelect('rounds.ticket', 'ticket')
        .where('pool.id IN (:...poolIds)', {
          poolIds: pools.map((pool) => pool?.id ?? 0),
        })
        .andWhere('ticket.userWallet = :userWallet', {
          userWallet: user.wallet,
        });

      const [items, countTicket] = await this.ticketsJoined(type, queryBuilder);

      return await this.mapTicket(
        generatePagination<Pool>(totalItems, items, page, take),
        countTicket,
      );
    } catch (error) {
      console.log({ error });

      throw new BadRequestException(error.message);
    }
  }

  ticketsJoined(
    userPoolType: UserPoolType,
    queryBuilder: SelectQueryBuilder<Pool>,
  ) {
    if (userPoolType === UserPoolType.JOINED) {
      return Promise.all([
        queryBuilder.clone().having('ticket.id IS NOT NULL').getMany(),
        this.getTotalTicketsRound(queryBuilder),
      ]);
    }

    return Promise.all([
      queryBuilder
        .clone()
        // .leftJoinAndSelect('pool.poolPrizes', 'prizes')
        .andWhere('ticket.winningMatch >= :winningMatch', {
          winningMatch: 1,
        })
        .having('ticket.id IS NOT NULL')
        .getMany(),
      this.getTotalTicketsRound(queryBuilder),
    ]);
  }

  getTotalTicketsRound(queryBuilder: SelectQueryBuilder<Pool>) {
    return queryBuilder
      .clone()
      .select(['count(ticket.id) as totalTicket', 'rounds.id as roundId'])
      .having('totalTicket > 0')
      .groupBy('rounds.id')
      .getRawMany();
  }

  async collectPrizes(
    user: User,
    claimDto: ClaimDto,
    pagination: QueryPaginationDto,
  ): Promise<FetchResult<Pool>> {
    try {
      const { poolId, roundId } = claimDto;
      const queryBuilder = this.poolRepository
        .createQueryBuilder('pool')
        .leftJoin('pool.rounds', 'rounds')
        .leftJoin('rounds.ticket', 'ticket')
        .leftJoin('pool.currency', 'currency')
        .where('ticket.userWallet = :userWallet', { userWallet: user.wallet })
        .andWhere('pool.id = :poolId', { poolId: poolId })
        .andWhere('rounds.id = :roundId', { roundId: roundId })
        .andWhere('ticket.winningMatch >= :winningMatch', { winningMatch: 1 })
        .select([
          'pool.id as poolId',
          'pool.name as poolName',
          'currency.name as currencyName',
          'currency.symbol as currencySymbol',
          'currency.decimals as currencyDecimals',
          'currency.contractAddress as contractAddress',
          'pool.sequency as sequency',
          'pool.totalRounds as totalRounds',
          'pool.ticketPrice as ticketPrice',
          'ticket.winningMatch as winningMatch',
          'ticket.id as ticketId',
          '(SELECT FLOOR(totalPrizes*(SELECT allocation from pool_prize where poolId = pool.id and winningMatch = ticket.winningMatch limit 1)/100)/(SELECT COUNT(user_ticket.id) FROM user_ticket where roundId = rounds.id and user_ticket.winningMatch = ticket.winningMatch group by user_ticket.winningMatch limit 1) from prizes where pool.poolIdOnChain = prizes.poolIdOnChain AND rounds.roundIdOnChain = prizes.roundIdOnChain limit 1) as winningPrize',
          'ticket.winningCode as winningCode',
          'ticket.code as ticketCode',
          'ticket.winningMatch as winningMatch',
          'ticket.userWallet as userWallet',
          'rounds.id as roundId',
          'rounds.roundNumber as roundNumber',
          'rounds.startTime as roundStartTime',
          'rounds.endTime as roundEndTime',
        ]);
      return await paginateEntities<Pool>(
        queryBuilder,
        pagination,
        FetchType.RAW,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async claim(user: User, claimDto: ClaimDto) {
    try {
      const { poolId, roundId } = claimDto;

      const roundExits = await this.poolRepository
        .createQueryBuilder('pool')
        .leftJoinAndSelect('pool.rounds', 'rounds')
        .andWhere('pool.id = :poolId', { poolId })
        .andWhere('rounds.id = :roundId', { roundId })
        .select([
          'pool.poolIdOnChain as poolIdOnChain',
          'rounds.roundIdOnChain as roundIdOnChain',
          'rounds.endTime as roundEndTime',
        ])
        .getRawOne();
      if (!roundExits) {
        throw new BadRequestException('Round does not exist');
      }

      if (dayjs.unix(roundExits.roundEndTime) > dayjs()) {
        throw new BadRequestException('Round is running or not started');
      }

      const builder = await this.poolRepository
        .createQueryBuilder('pool')
        .leftJoin('pool.rounds', 'rounds')
        .leftJoin('rounds.ticket', 'ticket')
        .andWhere('pool.id = :poolId', { poolId: poolId })
        .andWhere('rounds.id = :roundId', { roundId: roundId })
        .andWhere(
          'winningMatch IS NOT NULL AND ticket.winningMatch >= :winningMatch',
          { winningMatch: 1 },
        );

      const allWinners = await this.countTicketWinning(builder);
      const userWinning = await this.getUserTicketWinning(builder, user.wallet);

      if (userWinning.length === 0) {
        throw new BadRequestException('User has no winning tickets');
      }

      const allocation = await this.poolPrizesRepository
        .createQueryBuilder()
        .where('poolId = :poolId', { poolId: poolId })
        .getMany();

      const prizes = await this.getPrizes(poolId, roundId);

      const prizesToClaimDecimal = this.calculateUserWinningPrize(
        userWinning,
        allocation,
        prizes,
        allWinners,
      );

      const token = await this.poolRepository
        .createQueryBuilder('pool')
        .leftJoin('pool.currency', 'currency')
        .where('pool.id = :poolId', { poolId })
        .select(['currency.decimals as decimals'])
        .getRawOne();

      if (!token) throw Causes.NOT_FOUND('Token');

      const prizesToClaim = +prizesToClaimDecimal.getValue();

      const signatureData = beginCell()
        .storeInt(roundExits.poolIdOnChain, 32)
        .storeInt(roundExits.roundIdOnChain, 32)
        .storeAddress(Address.parse(user.wallet))
        .storeCoins(BigInt(prizesToClaim))
        .endCell();

      const keyPair = await mnemonicToWalletKey(
        this.configService
          .get('contract.adminWalletPhrase', { infer: true })
          .split(' '),
      );
      const signature = sign(signatureData.hash(), keyPair.secretKey).toString(
        'base64',
      );

      return {
        signature,
        prizesToClaim,
        token,
        roundExits,
        unitPrizes: prizesToClaim,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserTicketWinning(
    builder: SelectQueryBuilder<Pool>,
    wallet: string,
  ) {
    try {
      return await builder
        .clone()
        .andWhere('ticket.claimed = :claimed', { claimed: false })
        .andWhere('ticket.userWallet = :userWallet', { userWallet: wallet })
        .select([
          'ticket.winningMatch as winningMatch',
          'ticket.id as ticketId',
          'ticket.winningCode as winningCode',
          'ticket.code as ticketCode',
        ])
        .getRawMany();
    } catch (error) {
      throw error;
    }
  }

  async countTicketWinning(builder: SelectQueryBuilder<Pool>) {
    try {
      return await builder
        .clone()
        .select([
          'COUNT(ticket.id) as totalTickets',
          'ticket.winningMatch as winningMatch',
        ])
        .groupBy('ticket.winningMatch')
        .getRawMany();
    } catch (error) {
      throw error;
    }
  }

  async getPrizes(poolId: number, roundId: number) {
    try {
      return await this.poolRepository
        .createQueryBuilder('pool')
        .innerJoin('pool.rounds', 'rounds')
        .innerJoin(
          Prizes,
          'prizes',
          'pool.poolIdOnChain = prizes.poolIdOnChain AND rounds.roundIdOnChain = prizes.roundIdOnChain',
        )
        .select([
          'prizes.poolIdOnChain as poolIdOnChain',
          'prizes.roundIdOnChain as roundIdOnChain',
          'prizes.totalPrizes as totalPrizes',
          'prizes.claimedPrizes as claimedPrizes',
          'prizes.winningPrizes as winningPrizes',
          'prizes.totalTicketAmount as totalTicketAmount',
          'prizes.previousPrizes as previousPrizes',
        ])
        .where('pool.id = :poolId', { poolId: poolId })
        .andWhere('rounds.id = :roundId', { roundId: roundId })
        .getRawOne();
    } catch (error) {
      throw error;
    }
  }

  calculateUserWinningPrize(
    userWinning: Array<{
      winningMatch: number;
    }>,
    allocation: Array<{
      matchNumber: number;
      allocation: number;
    }>,
    prizes: { totalPrizes: number },
    allWinners: Array<{
      totalTickets: number;
      winningMatch: number;
    }>,
  ) {
    return userWinning.reduce((acc, ticket) => {
      const allocationPercent =
        allocation.find((a) => a.matchNumber == ticket.winningMatch)
          ?.allocation ?? 0;
      const totalTickets =
        allWinners.find((a) => a.winningMatch == ticket.winningMatch)
          ?.totalTickets ?? 0;

      const totalPrizesDecimal = new bigDecimal(prizes.totalPrizes);
      const allocationPercentDecimal = new bigDecimal(allocationPercent);
      const percentDecimal = new bigDecimal(100);
      const prizeForMatch = totalPrizesDecimal
        .multiply(allocationPercentDecimal)
        .divide(percentDecimal);

      const totalTicketsDecimal = new bigDecimal(totalTickets);

      // const prizeForMatch = prizes.totalPrizes * (allocationPercent / 100);
      const winningPrize = prizeForMatch.divide(totalTicketsDecimal).floor();
      // const winningPrize =
      //   prizeForMatch /
      //     allWinners.find((a) => a.winningMatch == ticket.winningMatch)
      //       ?.totalTickets ?? 0;

      return winningPrize.add(acc);
      // return acc + winningPrize;
    }, new bigDecimal(0));
  }

  async mapTicket(data: FetchResult<Pool>, rounds: any[]) {
    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        rounds: item.rounds
          .map((round) => ({
            ...round,
            totalTicket: Number(
              rounds.find((item) => item.roundId == round.id)?.totalTicket,
            ),
          }))
          .sort((a, b) => a.roundNumber - b.roundNumber),
      })),
    };
  }
}
