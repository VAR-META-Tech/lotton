import type { ContractProvider, DictionaryValue, TupleReader } from '@ton/core';
import {
  type Address,
  beginCell,
  type Builder,
  Dictionary,
  type Slice,
  TupleBuilder,
} from '@ton/core';

export function loadTicketBoughtEvent(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2301065806) {
    throw Error('Invalid prefix');
  }
  let _poolId = sc_0.loadIntBig(257);
  let _roundId = sc_0.loadIntBig(257);
  let _quantity = sc_0.loadIntBig(257);
  let sc_1 = sc_0.loadRef().beginParse();
  let _buyer = sc_1.loadAddress();
  let _tickets = sc_1.loadStringRefTail();
  let _totalCost = sc_1.loadCoins();
  return {
    $$type: 'TicketBoughtEvent' as const,
    poolId: _poolId,
    roundId: _roundId,
    quantity: _quantity,
    buyer: _buyer,
    tickets: _tickets,
    totalCost: _totalCost,
  };
}

export function loadBuyTicket(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 3748203161) {
    throw Error('Invalid prefix');
  }
  const _poolId = sc_0.loadIntBig(257);
  const _roundId = sc_0.loadIntBig(257);
  const _quantity = sc_0.loadIntBig(257);
  return {
    $$type: 'BuyTicket' as const,
    poolId: _poolId,
    roundId: _roundId,
    quantity: _quantity,
  };
}

export function loadWinningNumbersDrawnEvent(slice: Slice) {
  const sc_0 = slice;

  if (sc_0.loadUint(32) !== 3552390527) {
    throw Error('Invalid prefix');
  }
  const _poolId = sc_0.loadIntBig(257);
  const _roundId = sc_0.loadIntBig(257);
  const _winningNumber = sc_0.loadIntBig(257);
  return {
    $$type: 'WinningNumbersDrawnEvent' as const,
    poolId: _poolId,
    roundId: _roundId,
    winningNumber: _winningNumber,
  };
}

export type SetAdmin = {
  $$type: 'SetAdmin';
  admin: Address;
};
export function storeSetAdmin(src: SetAdmin) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3397822855, 32);
    b_0.storeAddress(src.admin);
  };
}

type BuyTicket = {
  $$type: 'BuyTicket';
  poolId: bigint;
  roundId: bigint;
  quantity: bigint;
};

export function storeBuyTicket(src: BuyTicket) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3748203161, 32);
    b_0.storeInt(src.poolId, 257);
    b_0.storeInt(src.roundId, 257);
    b_0.storeInt(src.quantity, 257);
  };
}

type CreatePool = {
  $$type: 'CreatePool';
  jettonWallet: Address;
  ticketPrice: bigint;
  initialRounds: bigint;
  startTime: bigint;
  endTime: bigint;
  sequence: bigint;
  active: boolean;
};

export function storeCreatePool(src: CreatePool) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2004140043, 32);
    b_0.storeAddress(src.jettonWallet);
    b_0.storeUint(src.ticketPrice, 32);
    b_0.storeUint(src.initialRounds, 8);
    b_0.storeUint(src.startTime, 32);
    b_0.storeUint(src.endTime, 32);
    b_0.storeUint(src.sequence, 32);
    b_0.storeBit(src.active);
  };
}

type DrawWinningNumbers = {
  $$type: 'DrawWinningNumbers';
  poolId: bigint;
  roundId: bigint;
  latestTxHash: string;
};

export function storeDrawWinningNumbers(src: DrawWinningNumbers) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3591482628, 32);
    b_0.storeInt(src.poolId, 257);
    b_0.storeInt(src.roundId, 257);
    b_0.storeStringRefTail(src.latestTxHash);
  };
}

type TicketPayoutResponse = {
  $$type: 'TicketPayoutResponse';
  ticket: string;
};
function storeTicketPayoutResponse(src: TicketPayoutResponse) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeStringRefTail(src.ticket);
  };
}
function loadTicketPayoutResponse(slice: Slice) {
  const sc_0 = slice;
  const _ticket = sc_0.loadStringRefTail();
  return { $$type: 'TicketPayoutResponse' as const, ticket: _ticket };
}
function dictValueParserTicketPayoutResponse(): DictionaryValue<TicketPayoutResponse> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(
        beginCell().store(storeTicketPayoutResponse(src)).endCell(),
      );
    },
    parse: (src) => {
      return loadTicketPayoutResponse(src.loadRef().beginParse());
    },
  };
}
export function loadGetterTupleUserTicket(source: TupleReader) {
  const _users = Dictionary.loadDirect(
    Dictionary.Keys.Address(),
    dictValueParserTicketPayoutResponse(),
    source.readCellOpt(),
  );
  return { $$type: 'UserTicket' as const, users: _users };
}

type Pool = {
  $$type: 'Pool';
  poolId: bigint;
  creator: Address;
  rounds: Dictionary<bigint, RoundConfig>;
  startTime: bigint;
  endTime: bigint;
  sequence: bigint;
  active: boolean;
};
type RoundConfig = {
  $$type: 'RoundConfig';
  roundId: bigint;
  poolId: bigint;
  ticketPrice: bigint;
  startTime: bigint;
  endTime: bigint;
  active: boolean;
};

function storeRoundConfig(src: RoundConfig) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.roundId, 32);
    b_0.storeUint(src.poolId, 32);
    b_0.storeCoins(src.ticketPrice);
    b_0.storeUint(src.startTime, 32);
    b_0.storeUint(src.endTime, 32);
    b_0.storeBit(src.active);
  };
}
function loadRoundConfig(slice: Slice) {
  const sc_0 = slice;
  const _roundId = sc_0.loadUintBig(32);
  const _poolId = sc_0.loadUintBig(32);
  const _ticketPrice = sc_0.loadCoins();
  const _startTime = sc_0.loadUintBig(32);
  const _endTime = sc_0.loadUintBig(32);
  const _active = sc_0.loadBit();
  return {
    $$type: 'RoundConfig' as const,
    roundId: _roundId,
    poolId: _poolId,
    ticketPrice: _ticketPrice,
    startTime: _startTime,
    endTime: _endTime,
    active: _active,
  };
}

function dictValueParserRoundConfig(): DictionaryValue<RoundConfig> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeRoundConfig(src)).endCell());
    },
    parse: (src) => {
      return loadRoundConfig(src.loadRef().beginParse());
    },
  };
}
function storePool(src: Pool) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(src.poolId, 32);
    b_0.storeAddress(src.creator);
    b_0.storeDict(
      src.rounds,
      Dictionary.Keys.BigInt(257),
      dictValueParserRoundConfig(),
    );
    b_0.storeUint(src.startTime, 32);
    b_0.storeUint(src.endTime, 32);
    b_0.storeUint(src.sequence, 32);
    b_0.storeBit(src.active);
  };
}
function loadPool(slice: Slice) {
  const sc_0 = slice;
  const _poolId = sc_0.loadUintBig(32);
  const _creator = sc_0.loadAddress();
  const _rounds = Dictionary.load(
    Dictionary.Keys.BigInt(257),
    dictValueParserRoundConfig(),
    sc_0,
  );
  const _startTime = sc_0.loadUintBig(32);
  const _endTime = sc_0.loadUintBig(32);
  const _sequence = sc_0.loadUintBig(32);
  const _active = sc_0.loadBit();
  return {
    $$type: 'Pool' as const,
    poolId: _poolId,
    creator: _creator,
    rounds: _rounds,
    startTime: _startTime,
    endTime: _endTime,
    sequence: _sequence,
    active: _active,
  };
}
function dictValueParserPool(): DictionaryValue<Pool> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePool(src)).endCell());
    },
    parse: (src) => {
      return loadPool(src.loadRef().beginParse());
    },
  };
}

export function loadTuplePool(source: TupleReader) {
  const _poolId = source.readBigNumber();
  const _creator = source.readAddress();
  const _rounds = Dictionary.loadDirect(
    Dictionary.Keys.BigInt(257),
    dictValueParserRoundConfig(),
    source.readCellOpt(),
  );
  const _startTime = source.readBigNumber();
  const _endTime = source.readBigNumber();
  const _sequence = source.readBigNumber();
  const _active = source.readBoolean();
  return {
    $$type: 'Pool' as const,
    poolId: _poolId,
    creator: _creator,
    rounds: _rounds,
    startTime: _startTime,
    endTime: _endTime,
    sequence: _sequence,
    active: _active,
  };
}

export function loadPoolCreatedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 590692540) {
    throw Error('Invalid prefix');
  }
  const _poolId = sc_0.loadIntBig(257);
  const _ticketPrice = sc_0.loadUintBig(32);
  const _initialRounds = sc_0.loadUintBig(8);
  const _startTime = sc_0.loadUintBig(32);
  const _endTime = sc_0.loadUintBig(32);
  const _active = sc_0.loadBit();
  const _sequence = sc_0.loadUintBig(32);
  const _rounds = Dictionary.load(
    Dictionary.Keys.BigInt(257),
    dictValueParserRoundConfig(),
    sc_0,
  );
  const _creator = sc_0.loadAddress();
  const _prizes = Dictionary.load(
    Dictionary.Keys.Uint(8),
    Dictionary.Values.Uint(8),
    sc_0,
  );
  return {
    $$type: 'PoolCreatedEvent' as const,
    poolId: _poolId,
    ticketPrice: _ticketPrice,
    initialRounds: _initialRounds,
    startTime: _startTime,
    endTime: _endTime,
    active: _active,
    sequence: _sequence,
    rounds: _rounds,
    creator: _creator,
    prizes: _prizes,
  };
}

export async function getCurrentPool(provider: ContractProvider) {
  const builder = new TupleBuilder();
  const source = (await provider.get('currentPool', builder.build())).stack;
  const result = Dictionary.loadDirect(
    Dictionary.Keys.BigInt(257),
    dictValueParserPool(),
    source.readCellOpt(),
  );
  return result;
}

export async function getPoolById(provider: ContractProvider, poolId: bigint) {
  const builder = new TupleBuilder();
  builder.writeNumber(poolId);
  const source = (await provider.get('poolById', builder.build())).stack;
  const result_p = source.readTupleOpt();
  const result = result_p ? loadTuplePool(result_p) : null;
  return result;
}

export async function getResultByRound(
  provider: ContractProvider,
  poolId: bigint,
  roundId: bigint,
) {
  const builder = new TupleBuilder();
  builder.writeNumber(poolId);
  builder.writeNumber(roundId);
  const source = (await provider.get('resultByRound', builder.build())).stack;
  const result = source.readBigNumberOpt();
  return result;
}

export type SetPublicKey = {
  $$type: 'SetPublicKey';
  publicKey: bigint;
};

export function storeSetPublicKey(src: SetPublicKey) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(3279683070, 32);
    b_0.storeInt(src.publicKey, 257);
  };
}

export function loadClaimedEvent(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 916403026) {
    throw Error('Invalid prefix');
  }
  let _poolId = sc_0.loadIntBig(257);
  let _roundId = sc_0.loadIntBig(257);
  let _amount = sc_0.loadCoins();
  let _receiver = sc_0.loadAddress();
  return {
    $$type: 'ClaimedEvent' as const,
    poolId: _poolId,
    roundId: _roundId,
    amount: _amount,
    receiver: _receiver,
  };
}
