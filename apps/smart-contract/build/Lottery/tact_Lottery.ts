import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type Lottery$Data = {
    $$type: 'Lottery$Data';
    owner: Address;
    admin: Dictionary<Address, boolean>;
    pools: Dictionary<bigint, Pool>;
    nextPoolId: bigint;
    usersTicket: Dictionary<bigint, RoundTicket>;
    result: Dictionary<bigint, Result>;
    rewardPools: Dictionary<bigint, bigint>;
    publicKey: bigint | null;
    claimData: Dictionary<bigint, ClaimInfo>;
    claimFeePercent: bigint;
}

export function storeLottery$Data(src: Lottery$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.admin, Dictionary.Keys.Address(), Dictionary.Values.Bool());
        b_0.storeDict(src.pools, Dictionary.Keys.BigInt(257), dictValueParserPool());
        b_0.storeInt(src.nextPoolId, 257);
        let b_1 = new Builder();
        b_1.storeDict(src.usersTicket, Dictionary.Keys.BigInt(257), dictValueParserRoundTicket());
        b_1.storeDict(src.result, Dictionary.Keys.BigInt(257), dictValueParserResult());
        b_1.storeDict(src.rewardPools, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        if (src.publicKey !== null && src.publicKey !== undefined) { b_1.storeBit(true).storeInt(src.publicKey, 257); } else { b_1.storeBit(false); }
        b_1.storeDict(src.claimData, Dictionary.Keys.BigInt(257), dictValueParserClaimInfo());
        b_1.storeInt(src.claimFeePercent, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadLottery$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _admin = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_0);
    let _pools = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserPool(), sc_0);
    let _nextPoolId = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _usersTicket = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserRoundTicket(), sc_1);
    let _result = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserResult(), sc_1);
    let _rewardPools = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_1);
    let _publicKey = sc_1.loadBit() ? sc_1.loadIntBig(257) : null;
    let _claimData = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserClaimInfo(), sc_1);
    let _claimFeePercent = sc_1.loadIntBig(257);
    return { $$type: 'Lottery$Data' as const, owner: _owner, admin: _admin, pools: _pools, nextPoolId: _nextPoolId, usersTicket: _usersTicket, result: _result, rewardPools: _rewardPools, publicKey: _publicKey, claimData: _claimData, claimFeePercent: _claimFeePercent };
}

function loadTupleLottery$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _admin = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    let _pools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserPool(), source.readCellOpt());
    let _nextPoolId = source.readBigNumber();
    let _usersTicket = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundTicket(), source.readCellOpt());
    let _result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserResult(), source.readCellOpt());
    let _rewardPools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _publicKey = source.readBigNumberOpt();
    let _claimData = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserClaimInfo(), source.readCellOpt());
    let _claimFeePercent = source.readBigNumber();
    return { $$type: 'Lottery$Data' as const, owner: _owner, admin: _admin, pools: _pools, nextPoolId: _nextPoolId, usersTicket: _usersTicket, result: _result, rewardPools: _rewardPools, publicKey: _publicKey, claimData: _claimData, claimFeePercent: _claimFeePercent };
}

function loadGetterTupleLottery$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _admin = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    let _pools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserPool(), source.readCellOpt());
    let _nextPoolId = source.readBigNumber();
    let _usersTicket = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundTicket(), source.readCellOpt());
    let _result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserResult(), source.readCellOpt());
    let _rewardPools = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _publicKey = source.readBigNumberOpt();
    let _claimData = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserClaimInfo(), source.readCellOpt());
    let _claimFeePercent = source.readBigNumber();
    return { $$type: 'Lottery$Data' as const, owner: _owner, admin: _admin, pools: _pools, nextPoolId: _nextPoolId, usersTicket: _usersTicket, result: _result, rewardPools: _rewardPools, publicKey: _publicKey, claimData: _claimData, claimFeePercent: _claimFeePercent };
}

function storeTupleLottery$Data(source: Lottery$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.admin.size > 0 ? beginCell().storeDictDirect(source.admin, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.pools.size > 0 ? beginCell().storeDictDirect(source.pools, Dictionary.Keys.BigInt(257), dictValueParserPool()).endCell() : null);
    builder.writeNumber(source.nextPoolId);
    builder.writeCell(source.usersTicket.size > 0 ? beginCell().storeDictDirect(source.usersTicket, Dictionary.Keys.BigInt(257), dictValueParserRoundTicket()).endCell() : null);
    builder.writeCell(source.result.size > 0 ? beginCell().storeDictDirect(source.result, Dictionary.Keys.BigInt(257), dictValueParserResult()).endCell() : null);
    builder.writeCell(source.rewardPools.size > 0 ? beginCell().storeDictDirect(source.rewardPools, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.publicKey);
    builder.writeCell(source.claimData.size > 0 ? beginCell().storeDictDirect(source.claimData, Dictionary.Keys.BigInt(257), dictValueParserClaimInfo()).endCell() : null);
    builder.writeNumber(source.claimFeePercent);
    return builder.build();
}

function dictValueParserLottery$Data(): DictionaryValue<Lottery$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLottery$Data(src)).endCell());
        },
        parse: (src) => {
            return loadLottery$Data(src.loadRef().beginParse());
        }
    }
}

export type Pool = {
    $$type: 'Pool';
    poolId: bigint;
    creator: Address;
    rounds: Dictionary<bigint, RoundConfig>;
    startTime: bigint;
    endTime: bigint;
    sequence: bigint;
    active: boolean;
    prizes: Dictionary<number, number>;
}

export function storePool(src: Pool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.poolId, 32);
        b_0.storeAddress(src.creator);
        b_0.storeDict(src.rounds, Dictionary.Keys.BigInt(257), dictValueParserRoundConfig());
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
        b_0.storeUint(src.sequence, 32);
        b_0.storeBit(src.active);
        b_0.storeDict(src.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    };
}

export function loadPool(slice: Slice) {
    let sc_0 = slice;
    let _poolId = sc_0.loadUintBig(32);
    let _creator = sc_0.loadAddress();
    let _rounds = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), sc_0);
    let _startTime = sc_0.loadUintBig(32);
    let _endTime = sc_0.loadUintBig(32);
    let _sequence = sc_0.loadUintBig(32);
    let _active = sc_0.loadBit();
    let _prizes = Dictionary.load(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), sc_0);
    return { $$type: 'Pool' as const, poolId: _poolId, creator: _creator, rounds: _rounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function loadTuplePool(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _creator = source.readAddress();
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), source.readCellOpt());
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _sequence = source.readBigNumber();
    let _active = source.readBoolean();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'Pool' as const, poolId: _poolId, creator: _creator, rounds: _rounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function loadGetterTuplePool(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _creator = source.readAddress();
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), source.readCellOpt());
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _sequence = source.readBigNumber();
    let _active = source.readBoolean();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'Pool' as const, poolId: _poolId, creator: _creator, rounds: _rounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function storeTuplePool(source: Pool) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeAddress(source.creator);
    builder.writeCell(source.rounds.size > 0 ? beginCell().storeDictDirect(source.rounds, Dictionary.Keys.BigInt(257), dictValueParserRoundConfig()).endCell() : null);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    builder.writeNumber(source.sequence);
    builder.writeBoolean(source.active);
    builder.writeCell(source.prizes.size > 0 ? beginCell().storeDictDirect(source.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8)).endCell() : null);
    return builder.build();
}

function dictValueParserPool(): DictionaryValue<Pool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePool(src)).endCell());
        },
        parse: (src) => {
            return loadPool(src.loadRef().beginParse());
        }
    }
}

export type RoundConfig = {
    $$type: 'RoundConfig';
    roundId: bigint;
    poolId: bigint;
    ticketPrice: bigint;
    startTime: bigint;
    endTime: bigint;
    active: boolean;
}

export function storeRoundConfig(src: RoundConfig) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.roundId, 32);
        b_0.storeUint(src.poolId, 32);
        b_0.storeCoins(src.ticketPrice);
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
        b_0.storeBit(src.active);
    };
}

export function loadRoundConfig(slice: Slice) {
    let sc_0 = slice;
    let _roundId = sc_0.loadUintBig(32);
    let _poolId = sc_0.loadUintBig(32);
    let _ticketPrice = sc_0.loadCoins();
    let _startTime = sc_0.loadUintBig(32);
    let _endTime = sc_0.loadUintBig(32);
    let _active = sc_0.loadBit();
    return { $$type: 'RoundConfig' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime, active: _active };
}

function loadTupleRoundConfig(source: TupleReader) {
    let _roundId = source.readBigNumber();
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _active = source.readBoolean();
    return { $$type: 'RoundConfig' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime, active: _active };
}

function loadGetterTupleRoundConfig(source: TupleReader) {
    let _roundId = source.readBigNumber();
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _active = source.readBoolean();
    return { $$type: 'RoundConfig' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime, active: _active };
}

function storeTupleRoundConfig(source: RoundConfig) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    builder.writeBoolean(source.active);
    return builder.build();
}

function dictValueParserRoundConfig(): DictionaryValue<RoundConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoundConfig(src)).endCell());
        },
        parse: (src) => {
            return loadRoundConfig(src.loadRef().beginParse());
        }
    }
}

export type TicketPayoutResponse = {
    $$type: 'TicketPayoutResponse';
    ticket: string;
}

export function storeTicketPayoutResponse(src: TicketPayoutResponse) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.ticket);
    };
}

export function loadTicketPayoutResponse(slice: Slice) {
    let sc_0 = slice;
    let _ticket = sc_0.loadStringRefTail();
    return { $$type: 'TicketPayoutResponse' as const, ticket: _ticket };
}

function loadTupleTicketPayoutResponse(source: TupleReader) {
    let _ticket = source.readString();
    return { $$type: 'TicketPayoutResponse' as const, ticket: _ticket };
}

function loadGetterTupleTicketPayoutResponse(source: TupleReader) {
    let _ticket = source.readString();
    return { $$type: 'TicketPayoutResponse' as const, ticket: _ticket };
}

function storeTupleTicketPayoutResponse(source: TicketPayoutResponse) {
    let builder = new TupleBuilder();
    builder.writeString(source.ticket);
    return builder.build();
}

function dictValueParserTicketPayoutResponse(): DictionaryValue<TicketPayoutResponse> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTicketPayoutResponse(src)).endCell());
        },
        parse: (src) => {
            return loadTicketPayoutResponse(src.loadRef().beginParse());
        }
    }
}

export type RandomTicketResponse = {
    $$type: 'RandomTicketResponse';
    ASCIINumber: bigint;
    ticket: string;
}

export function storeRandomTicketResponse(src: RandomTicketResponse) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.ASCIINumber, 257);
        b_0.storeStringRefTail(src.ticket);
    };
}

export function loadRandomTicketResponse(slice: Slice) {
    let sc_0 = slice;
    let _ASCIINumber = sc_0.loadIntBig(257);
    let _ticket = sc_0.loadStringRefTail();
    return { $$type: 'RandomTicketResponse' as const, ASCIINumber: _ASCIINumber, ticket: _ticket };
}

function loadTupleRandomTicketResponse(source: TupleReader) {
    let _ASCIINumber = source.readBigNumber();
    let _ticket = source.readString();
    return { $$type: 'RandomTicketResponse' as const, ASCIINumber: _ASCIINumber, ticket: _ticket };
}

function loadGetterTupleRandomTicketResponse(source: TupleReader) {
    let _ASCIINumber = source.readBigNumber();
    let _ticket = source.readString();
    return { $$type: 'RandomTicketResponse' as const, ASCIINumber: _ASCIINumber, ticket: _ticket };
}

function storeTupleRandomTicketResponse(source: RandomTicketResponse) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.ASCIINumber);
    builder.writeString(source.ticket);
    return builder.build();
}

function dictValueParserRandomTicketResponse(): DictionaryValue<RandomTicketResponse> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRandomTicketResponse(src)).endCell());
        },
        parse: (src) => {
            return loadRandomTicketResponse(src.loadRef().beginParse());
        }
    }
}

export type Ticket = {
    $$type: 'Ticket';
    ticket: string;
    ticketNumber: bigint;
    owner: Address;
}

export function storeTicket(src: Ticket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.ticket);
        b_0.storeInt(src.ticketNumber, 257);
        b_0.storeAddress(src.owner);
    };
}

export function loadTicket(slice: Slice) {
    let sc_0 = slice;
    let _ticket = sc_0.loadStringRefTail();
    let _ticketNumber = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    return { $$type: 'Ticket' as const, ticket: _ticket, ticketNumber: _ticketNumber, owner: _owner };
}

function loadTupleTicket(source: TupleReader) {
    let _ticket = source.readString();
    let _ticketNumber = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'Ticket' as const, ticket: _ticket, ticketNumber: _ticketNumber, owner: _owner };
}

function loadGetterTupleTicket(source: TupleReader) {
    let _ticket = source.readString();
    let _ticketNumber = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'Ticket' as const, ticket: _ticket, ticketNumber: _ticketNumber, owner: _owner };
}

function storeTupleTicket(source: Ticket) {
    let builder = new TupleBuilder();
    builder.writeString(source.ticket);
    builder.writeNumber(source.ticketNumber);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserTicket(): DictionaryValue<Ticket> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTicket(src)).endCell());
        },
        parse: (src) => {
            return loadTicket(src.loadRef().beginParse());
        }
    }
}

export type UserTicket = {
    $$type: 'UserTicket';
    users: Dictionary<Address, TicketPayoutResponse>;
}

export function storeUserTicket(src: UserTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.users, Dictionary.Keys.Address(), dictValueParserTicketPayoutResponse());
    };
}

export function loadUserTicket(slice: Slice) {
    let sc_0 = slice;
    let _users = Dictionary.load(Dictionary.Keys.Address(), dictValueParserTicketPayoutResponse(), sc_0);
    return { $$type: 'UserTicket' as const, users: _users };
}

function loadTupleUserTicket(source: TupleReader) {
    let _users = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserTicketPayoutResponse(), source.readCellOpt());
    return { $$type: 'UserTicket' as const, users: _users };
}

function loadGetterTupleUserTicket(source: TupleReader) {
    let _users = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserTicketPayoutResponse(), source.readCellOpt());
    return { $$type: 'UserTicket' as const, users: _users };
}

function storeTupleUserTicket(source: UserTicket) {
    let builder = new TupleBuilder();
    builder.writeCell(source.users.size > 0 ? beginCell().storeDictDirect(source.users, Dictionary.Keys.Address(), dictValueParserTicketPayoutResponse()).endCell() : null);
    return builder.build();
}

function dictValueParserUserTicket(): DictionaryValue<UserTicket> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUserTicket(src)).endCell());
        },
        parse: (src) => {
            return loadUserTicket(src.loadRef().beginParse());
        }
    }
}

export type RoundTicket = {
    $$type: 'RoundTicket';
    rounds: Dictionary<bigint, UserTicket>;
}

export function storeRoundTicket(src: RoundTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.rounds, Dictionary.Keys.BigInt(257), dictValueParserUserTicket());
    };
}

export function loadRoundTicket(slice: Slice) {
    let sc_0 = slice;
    let _rounds = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserUserTicket(), sc_0);
    return { $$type: 'RoundTicket' as const, rounds: _rounds };
}

function loadTupleRoundTicket(source: TupleReader) {
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserUserTicket(), source.readCellOpt());
    return { $$type: 'RoundTicket' as const, rounds: _rounds };
}

function loadGetterTupleRoundTicket(source: TupleReader) {
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserUserTicket(), source.readCellOpt());
    return { $$type: 'RoundTicket' as const, rounds: _rounds };
}

function storeTupleRoundTicket(source: RoundTicket) {
    let builder = new TupleBuilder();
    builder.writeCell(source.rounds.size > 0 ? beginCell().storeDictDirect(source.rounds, Dictionary.Keys.BigInt(257), dictValueParserUserTicket()).endCell() : null);
    return builder.build();
}

function dictValueParserRoundTicket(): DictionaryValue<RoundTicket> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoundTicket(src)).endCell());
        },
        parse: (src) => {
            return loadRoundTicket(src.loadRef().beginParse());
        }
    }
}

export type Winner = {
    $$type: 'Winner';
    ticket: string;
    owner: Address;
    prize: bigint;
}

export function storeWinner(src: Winner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.ticket);
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.prize);
    };
}

export function loadWinner(slice: Slice) {
    let sc_0 = slice;
    let _ticket = sc_0.loadStringRefTail();
    let _owner = sc_0.loadAddress();
    let _prize = sc_0.loadCoins();
    return { $$type: 'Winner' as const, ticket: _ticket, owner: _owner, prize: _prize };
}

function loadTupleWinner(source: TupleReader) {
    let _ticket = source.readString();
    let _owner = source.readAddress();
    let _prize = source.readBigNumber();
    return { $$type: 'Winner' as const, ticket: _ticket, owner: _owner, prize: _prize };
}

function loadGetterTupleWinner(source: TupleReader) {
    let _ticket = source.readString();
    let _owner = source.readAddress();
    let _prize = source.readBigNumber();
    return { $$type: 'Winner' as const, ticket: _ticket, owner: _owner, prize: _prize };
}

function storeTupleWinner(source: Winner) {
    let builder = new TupleBuilder();
    builder.writeString(source.ticket);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.prize);
    return builder.build();
}

function dictValueParserWinner(): DictionaryValue<Winner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWinner(src)).endCell());
        },
        parse: (src) => {
            return loadWinner(src.loadRef().beginParse());
        }
    }
}

export type ClaimInfo = {
    $$type: 'ClaimInfo';
    info: Dictionary<bigint, UserClaim>;
}

export function storeClaimInfo(src: ClaimInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.info, Dictionary.Keys.BigInt(257), dictValueParserUserClaim());
    };
}

export function loadClaimInfo(slice: Slice) {
    let sc_0 = slice;
    let _info = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserUserClaim(), sc_0);
    return { $$type: 'ClaimInfo' as const, info: _info };
}

function loadTupleClaimInfo(source: TupleReader) {
    let _info = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserUserClaim(), source.readCellOpt());
    return { $$type: 'ClaimInfo' as const, info: _info };
}

function loadGetterTupleClaimInfo(source: TupleReader) {
    let _info = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserUserClaim(), source.readCellOpt());
    return { $$type: 'ClaimInfo' as const, info: _info };
}

function storeTupleClaimInfo(source: ClaimInfo) {
    let builder = new TupleBuilder();
    builder.writeCell(source.info.size > 0 ? beginCell().storeDictDirect(source.info, Dictionary.Keys.BigInt(257), dictValueParserUserClaim()).endCell() : null);
    return builder.build();
}

function dictValueParserClaimInfo(): DictionaryValue<ClaimInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimInfo(src)).endCell());
        },
        parse: (src) => {
            return loadClaimInfo(src.loadRef().beginParse());
        }
    }
}

export type UserClaim = {
    $$type: 'UserClaim';
    user: Dictionary<Address, boolean>;
}

export function storeUserClaim(src: UserClaim) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.user, Dictionary.Keys.Address(), Dictionary.Values.Bool());
    };
}

export function loadUserClaim(slice: Slice) {
    let sc_0 = slice;
    let _user = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_0);
    return { $$type: 'UserClaim' as const, user: _user };
}

function loadTupleUserClaim(source: TupleReader) {
    let _user = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'UserClaim' as const, user: _user };
}

function loadGetterTupleUserClaim(source: TupleReader) {
    let _user = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'UserClaim' as const, user: _user };
}

function storeTupleUserClaim(source: UserClaim) {
    let builder = new TupleBuilder();
    builder.writeCell(source.user.size > 0 ? beginCell().storeDictDirect(source.user, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    return builder.build();
}

function dictValueParserUserClaim(): DictionaryValue<UserClaim> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUserClaim(src)).endCell());
        },
        parse: (src) => {
            return loadUserClaim(src.loadRef().beginParse());
        }
    }
}

export type Result = {
    $$type: 'Result';
    rounds: Dictionary<bigint, bigint>;
}

export function storeResult(src: Result) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.rounds, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
    };
}

export function loadResult(slice: Slice) {
    let sc_0 = slice;
    let _rounds = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_0);
    return { $$type: 'Result' as const, rounds: _rounds };
}

function loadTupleResult(source: TupleReader) {
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    return { $$type: 'Result' as const, rounds: _rounds };
}

function loadGetterTupleResult(source: TupleReader) {
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    return { $$type: 'Result' as const, rounds: _rounds };
}

function storeTupleResult(source: Result) {
    let builder = new TupleBuilder();
    builder.writeCell(source.rounds.size > 0 ? beginCell().storeDictDirect(source.rounds, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    return builder.build();
}

function dictValueParserResult(): DictionaryValue<Result> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeResult(src)).endCell());
        },
        parse: (src) => {
            return loadResult(src.loadRef().beginParse());
        }
    }
}

export type CreatePool = {
    $$type: 'CreatePool';
    jettonWallet: Address;
    ticketPrice: bigint;
    initialRounds: bigint;
    startTime: bigint;
    endTime: bigint;
    sequence: bigint;
    active: boolean;
    prizes: Dictionary<number, number>;
}

export function storeCreatePool(src: CreatePool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2095598070, 32);
        b_0.storeAddress(src.jettonWallet);
        b_0.storeUint(src.ticketPrice, 32);
        b_0.storeUint(src.initialRounds, 8);
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
        b_0.storeUint(src.sequence, 32);
        b_0.storeBit(src.active);
        b_0.storeDict(src.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    };
}

export function loadCreatePool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2095598070) { throw Error('Invalid prefix'); }
    let _jettonWallet = sc_0.loadAddress();
    let _ticketPrice = sc_0.loadUintBig(32);
    let _initialRounds = sc_0.loadUintBig(8);
    let _startTime = sc_0.loadUintBig(32);
    let _endTime = sc_0.loadUintBig(32);
    let _sequence = sc_0.loadUintBig(32);
    let _active = sc_0.loadBit();
    let _prizes = Dictionary.load(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), sc_0);
    return { $$type: 'CreatePool' as const, jettonWallet: _jettonWallet, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function loadTupleCreatePool(source: TupleReader) {
    let _jettonWallet = source.readAddress();
    let _ticketPrice = source.readBigNumber();
    let _initialRounds = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _sequence = source.readBigNumber();
    let _active = source.readBoolean();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'CreatePool' as const, jettonWallet: _jettonWallet, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function loadGetterTupleCreatePool(source: TupleReader) {
    let _jettonWallet = source.readAddress();
    let _ticketPrice = source.readBigNumber();
    let _initialRounds = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _sequence = source.readBigNumber();
    let _active = source.readBoolean();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'CreatePool' as const, jettonWallet: _jettonWallet, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, sequence: _sequence, active: _active, prizes: _prizes };
}

function storeTupleCreatePool(source: CreatePool) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonWallet);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.initialRounds);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    builder.writeNumber(source.sequence);
    builder.writeBoolean(source.active);
    builder.writeCell(source.prizes.size > 0 ? beginCell().storeDictDirect(source.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8)).endCell() : null);
    return builder.build();
}

function dictValueParserCreatePool(): DictionaryValue<CreatePool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreatePool(src)).endCell());
        },
        parse: (src) => {
            return loadCreatePool(src.loadRef().beginParse());
        }
    }
}

export type Claim = {
    $$type: 'Claim';
    poolId: bigint;
    roundId: bigint;
    amount: bigint;
    receiver: Address;
    signature: Slice;
}

export function storeClaim(src: Claim) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1449747896, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.receiver);
        b_0.storeRef(src.signature.asCell());
    };
}

export function loadClaim(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1449747896) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _amount = sc_0.loadCoins();
    let _receiver = sc_0.loadAddress();
    let _signature = sc_0.loadRef().asSlice();
    return { $$type: 'Claim' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver, signature: _signature };
}

function loadTupleClaim(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    let _signature = source.readCell().asSlice();
    return { $$type: 'Claim' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver, signature: _signature };
}

function loadGetterTupleClaim(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    let _signature = source.readCell().asSlice();
    return { $$type: 'Claim' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver, signature: _signature };
}

function storeTupleClaim(source: Claim) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    builder.writeSlice(source.signature.asCell());
    return builder.build();
}

function dictValueParserClaim(): DictionaryValue<Claim> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaim(src)).endCell());
        },
        parse: (src) => {
            return loadClaim(src.loadRef().beginParse());
        }
    }
}

export type WinningNumbersDrawnEvent = {
    $$type: 'WinningNumbersDrawnEvent';
    poolId: bigint;
    roundId: bigint;
    winningNumber: bigint;
}

export function storeWinningNumbersDrawnEvent(src: WinningNumbersDrawnEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3552390527, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeInt(src.winningNumber, 257);
    };
}

export function loadWinningNumbersDrawnEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3552390527) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _winningNumber = sc_0.loadIntBig(257);
    return { $$type: 'WinningNumbersDrawnEvent' as const, poolId: _poolId, roundId: _roundId, winningNumber: _winningNumber };
}

function loadTupleWinningNumbersDrawnEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _winningNumber = source.readBigNumber();
    return { $$type: 'WinningNumbersDrawnEvent' as const, poolId: _poolId, roundId: _roundId, winningNumber: _winningNumber };
}

function loadGetterTupleWinningNumbersDrawnEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _winningNumber = source.readBigNumber();
    return { $$type: 'WinningNumbersDrawnEvent' as const, poolId: _poolId, roundId: _roundId, winningNumber: _winningNumber };
}

function storeTupleWinningNumbersDrawnEvent(source: WinningNumbersDrawnEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.winningNumber);
    return builder.build();
}

function dictValueParserWinningNumbersDrawnEvent(): DictionaryValue<WinningNumbersDrawnEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWinningNumbersDrawnEvent(src)).endCell());
        },
        parse: (src) => {
            return loadWinningNumbersDrawnEvent(src.loadRef().beginParse());
        }
    }
}

export type UpdatePizes = {
    $$type: 'UpdatePizes';
    poolId: bigint;
    prizes: Dictionary<number, number>;
}

export function storeUpdatePizes(src: UpdatePizes) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4133815729, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeDict(src.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    };
}

export function loadUpdatePizes(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4133815729) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _prizes = Dictionary.load(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), sc_0);
    return { $$type: 'UpdatePizes' as const, poolId: _poolId, prizes: _prizes };
}

function loadTupleUpdatePizes(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'UpdatePizes' as const, poolId: _poolId, prizes: _prizes };
}

function loadGetterTupleUpdatePizes(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'UpdatePizes' as const, poolId: _poolId, prizes: _prizes };
}

function storeTupleUpdatePizes(source: UpdatePizes) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeCell(source.prizes.size > 0 ? beginCell().storeDictDirect(source.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8)).endCell() : null);
    return builder.build();
}

function dictValueParserUpdatePizes(): DictionaryValue<UpdatePizes> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdatePizes(src)).endCell());
        },
        parse: (src) => {
            return loadUpdatePizes(src.loadRef().beginParse());
        }
    }
}

export type BuyTicket = {
    $$type: 'BuyTicket';
    poolId: bigint;
    roundId: bigint;
    quantity: bigint;
}

export function storeBuyTicket(src: BuyTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3748203161, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeInt(src.quantity, 257);
    };
}

export function loadBuyTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3748203161) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _quantity = sc_0.loadIntBig(257);
    return { $$type: 'BuyTicket' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity };
}

function loadTupleBuyTicket(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _quantity = source.readBigNumber();
    return { $$type: 'BuyTicket' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity };
}

function loadGetterTupleBuyTicket(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _quantity = source.readBigNumber();
    return { $$type: 'BuyTicket' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity };
}

function storeTupleBuyTicket(source: BuyTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.quantity);
    return builder.build();
}

function dictValueParserBuyTicket(): DictionaryValue<BuyTicket> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyTicket(src)).endCell());
        },
        parse: (src) => {
            return loadBuyTicket(src.loadRef().beginParse());
        }
    }
}

export type DrawWinningNumbers = {
    $$type: 'DrawWinningNumbers';
    poolId: bigint;
    roundId: bigint;
    latestTxHash: string;
}

export function storeDrawWinningNumbers(src: DrawWinningNumbers) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3591482628, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeStringRefTail(src.latestTxHash);
    };
}

export function loadDrawWinningNumbers(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3591482628) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _latestTxHash = sc_0.loadStringRefTail();
    return { $$type: 'DrawWinningNumbers' as const, poolId: _poolId, roundId: _roundId, latestTxHash: _latestTxHash };
}

function loadTupleDrawWinningNumbers(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _latestTxHash = source.readString();
    return { $$type: 'DrawWinningNumbers' as const, poolId: _poolId, roundId: _roundId, latestTxHash: _latestTxHash };
}

function loadGetterTupleDrawWinningNumbers(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _latestTxHash = source.readString();
    return { $$type: 'DrawWinningNumbers' as const, poolId: _poolId, roundId: _roundId, latestTxHash: _latestTxHash };
}

function storeTupleDrawWinningNumbers(source: DrawWinningNumbers) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeString(source.latestTxHash);
    return builder.build();
}

function dictValueParserDrawWinningNumbers(): DictionaryValue<DrawWinningNumbers> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDrawWinningNumbers(src)).endCell());
        },
        parse: (src) => {
            return loadDrawWinningNumbers(src.loadRef().beginParse());
        }
    }
}

export type SetAdmin = {
    $$type: 'SetAdmin';
    admin: Address;
    active: boolean;
}

export function storeSetAdmin(src: SetAdmin) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(134190905, 32);
        b_0.storeAddress(src.admin);
        b_0.storeBit(src.active);
    };
}

export function loadSetAdmin(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 134190905) { throw Error('Invalid prefix'); }
    let _admin = sc_0.loadAddress();
    let _active = sc_0.loadBit();
    return { $$type: 'SetAdmin' as const, admin: _admin, active: _active };
}

function loadTupleSetAdmin(source: TupleReader) {
    let _admin = source.readAddress();
    let _active = source.readBoolean();
    return { $$type: 'SetAdmin' as const, admin: _admin, active: _active };
}

function loadGetterTupleSetAdmin(source: TupleReader) {
    let _admin = source.readAddress();
    let _active = source.readBoolean();
    return { $$type: 'SetAdmin' as const, admin: _admin, active: _active };
}

function storeTupleSetAdmin(source: SetAdmin) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.admin);
    builder.writeBoolean(source.active);
    return builder.build();
}

function dictValueParserSetAdmin(): DictionaryValue<SetAdmin> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetAdmin(src)).endCell());
        },
        parse: (src) => {
            return loadSetAdmin(src.loadRef().beginParse());
        }
    }
}

export type SetPublicKey = {
    $$type: 'SetPublicKey';
    publicKey: bigint;
}

export function storeSetPublicKey(src: SetPublicKey) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3279683070, 32);
        b_0.storeInt(src.publicKey, 257);
    };
}

export function loadSetPublicKey(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3279683070) { throw Error('Invalid prefix'); }
    let _publicKey = sc_0.loadIntBig(257);
    return { $$type: 'SetPublicKey' as const, publicKey: _publicKey };
}

function loadTupleSetPublicKey(source: TupleReader) {
    let _publicKey = source.readBigNumber();
    return { $$type: 'SetPublicKey' as const, publicKey: _publicKey };
}

function loadGetterTupleSetPublicKey(source: TupleReader) {
    let _publicKey = source.readBigNumber();
    return { $$type: 'SetPublicKey' as const, publicKey: _publicKey };
}

function storeTupleSetPublicKey(source: SetPublicKey) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.publicKey);
    return builder.build();
}

function dictValueParserSetPublicKey(): DictionaryValue<SetPublicKey> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetPublicKey(src)).endCell());
        },
        parse: (src) => {
            return loadSetPublicKey(src.loadRef().beginParse());
        }
    }
}

export type SetClaimFeePercent = {
    $$type: 'SetClaimFeePercent';
    claimFeePercent: bigint;
}

export function storeSetClaimFeePercent(src: SetClaimFeePercent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(233252030, 32);
        b_0.storeUint(src.claimFeePercent, 8);
    };
}

export function loadSetClaimFeePercent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 233252030) { throw Error('Invalid prefix'); }
    let _claimFeePercent = sc_0.loadUintBig(8);
    return { $$type: 'SetClaimFeePercent' as const, claimFeePercent: _claimFeePercent };
}

function loadTupleSetClaimFeePercent(source: TupleReader) {
    let _claimFeePercent = source.readBigNumber();
    return { $$type: 'SetClaimFeePercent' as const, claimFeePercent: _claimFeePercent };
}

function loadGetterTupleSetClaimFeePercent(source: TupleReader) {
    let _claimFeePercent = source.readBigNumber();
    return { $$type: 'SetClaimFeePercent' as const, claimFeePercent: _claimFeePercent };
}

function storeTupleSetClaimFeePercent(source: SetClaimFeePercent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.claimFeePercent);
    return builder.build();
}

function dictValueParserSetClaimFeePercent(): DictionaryValue<SetClaimFeePercent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetClaimFeePercent(src)).endCell());
        },
        parse: (src) => {
            return loadSetClaimFeePercent(src.loadRef().beginParse());
        }
    }
}

export type TransferFund = {
    $$type: 'TransferFund';
    to: Address;
    amount: bigint;
}

export function storeTransferFund(src: TransferFund) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3687331887, 32);
        b_0.storeAddress(src.to);
        b_0.storeCoins(src.amount);
    };
}

export function loadTransferFund(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3687331887) { throw Error('Invalid prefix'); }
    let _to = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    return { $$type: 'TransferFund' as const, to: _to, amount: _amount };
}

function loadTupleTransferFund(source: TupleReader) {
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'TransferFund' as const, to: _to, amount: _amount };
}

function loadGetterTupleTransferFund(source: TupleReader) {
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'TransferFund' as const, to: _to, amount: _amount };
}

function storeTupleTransferFund(source: TransferFund) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.to);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserTransferFund(): DictionaryValue<TransferFund> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransferFund(src)).endCell());
        },
        parse: (src) => {
            return loadTransferFund(src.loadRef().beginParse());
        }
    }
}

export type PoolCreatedEvent = {
    $$type: 'PoolCreatedEvent';
    poolId: bigint;
    ticketPrice: bigint;
    initialRounds: bigint;
    startTime: bigint;
    endTime: bigint;
    active: boolean;
    sequence: bigint;
    rounds: Dictionary<bigint, RoundConfig>;
    creator: Address;
    prizes: Dictionary<number, number>;
}

export function storePoolCreatedEvent(src: PoolCreatedEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(590692540, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeUint(src.ticketPrice, 32);
        b_0.storeUint(src.initialRounds, 8);
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
        b_0.storeBit(src.active);
        b_0.storeUint(src.sequence, 32);
        b_0.storeDict(src.rounds, Dictionary.Keys.BigInt(257), dictValueParserRoundConfig());
        b_0.storeAddress(src.creator);
        b_0.storeDict(src.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    };
}

export function loadPoolCreatedEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 590692540) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _ticketPrice = sc_0.loadUintBig(32);
    let _initialRounds = sc_0.loadUintBig(8);
    let _startTime = sc_0.loadUintBig(32);
    let _endTime = sc_0.loadUintBig(32);
    let _active = sc_0.loadBit();
    let _sequence = sc_0.loadUintBig(32);
    let _rounds = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), sc_0);
    let _creator = sc_0.loadAddress();
    let _prizes = Dictionary.load(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), sc_0);
    return { $$type: 'PoolCreatedEvent' as const, poolId: _poolId, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, active: _active, sequence: _sequence, rounds: _rounds, creator: _creator, prizes: _prizes };
}

function loadTuplePoolCreatedEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _initialRounds = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _active = source.readBoolean();
    let _sequence = source.readBigNumber();
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), source.readCellOpt());
    let _creator = source.readAddress();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'PoolCreatedEvent' as const, poolId: _poolId, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, active: _active, sequence: _sequence, rounds: _rounds, creator: _creator, prizes: _prizes };
}

function loadGetterTuplePoolCreatedEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _initialRounds = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    let _active = source.readBoolean();
    let _sequence = source.readBigNumber();
    let _rounds = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserRoundConfig(), source.readCellOpt());
    let _creator = source.readAddress();
    let _prizes = Dictionary.loadDirect(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8), source.readCellOpt());
    return { $$type: 'PoolCreatedEvent' as const, poolId: _poolId, ticketPrice: _ticketPrice, initialRounds: _initialRounds, startTime: _startTime, endTime: _endTime, active: _active, sequence: _sequence, rounds: _rounds, creator: _creator, prizes: _prizes };
}

function storeTuplePoolCreatedEvent(source: PoolCreatedEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.initialRounds);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    builder.writeBoolean(source.active);
    builder.writeNumber(source.sequence);
    builder.writeCell(source.rounds.size > 0 ? beginCell().storeDictDirect(source.rounds, Dictionary.Keys.BigInt(257), dictValueParserRoundConfig()).endCell() : null);
    builder.writeAddress(source.creator);
    builder.writeCell(source.prizes.size > 0 ? beginCell().storeDictDirect(source.prizes, Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8)).endCell() : null);
    return builder.build();
}

function dictValueParserPoolCreatedEvent(): DictionaryValue<PoolCreatedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePoolCreatedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadPoolCreatedEvent(src.loadRef().beginParse());
        }
    }
}

export type RoundCreated = {
    $$type: 'RoundCreated';
    roundId: bigint;
    poolId: bigint;
    ticketPrice: bigint;
    startTime: bigint;
    endTime: bigint;
}

export function storeRoundCreated(src: RoundCreated) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3113542296, 32);
        b_0.storeInt(src.roundId, 257);
        b_0.storeInt(src.poolId, 257);
        b_0.storeUint(src.ticketPrice, 32);
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
    };
}

export function loadRoundCreated(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3113542296) { throw Error('Invalid prefix'); }
    let _roundId = sc_0.loadIntBig(257);
    let _poolId = sc_0.loadIntBig(257);
    let _ticketPrice = sc_0.loadUintBig(32);
    let _startTime = sc_0.loadUintBig(32);
    let _endTime = sc_0.loadUintBig(32);
    return { $$type: 'RoundCreated' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime };
}

function loadTupleRoundCreated(source: TupleReader) {
    let _roundId = source.readBigNumber();
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    return { $$type: 'RoundCreated' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime };
}

function loadGetterTupleRoundCreated(source: TupleReader) {
    let _roundId = source.readBigNumber();
    let _poolId = source.readBigNumber();
    let _ticketPrice = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _endTime = source.readBigNumber();
    return { $$type: 'RoundCreated' as const, roundId: _roundId, poolId: _poolId, ticketPrice: _ticketPrice, startTime: _startTime, endTime: _endTime };
}

function storeTupleRoundCreated(source: RoundCreated) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    return builder.build();
}

function dictValueParserRoundCreated(): DictionaryValue<RoundCreated> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoundCreated(src)).endCell());
        },
        parse: (src) => {
            return loadRoundCreated(src.loadRef().beginParse());
        }
    }
}

export type TicketBoughtEvent = {
    $$type: 'TicketBoughtEvent';
    poolId: bigint;
    roundId: bigint;
    quantity: bigint;
    buyer: Address;
    tickets: string;
}

export function storeTicketBoughtEvent(src: TicketBoughtEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1249282626, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeInt(src.quantity, 257);
        let b_1 = new Builder();
        b_1.storeAddress(src.buyer);
        b_1.storeStringRefTail(src.tickets);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTicketBoughtEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1249282626) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _quantity = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _buyer = sc_1.loadAddress();
    let _tickets = sc_1.loadStringRefTail();
    return { $$type: 'TicketBoughtEvent' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity, buyer: _buyer, tickets: _tickets };
}

function loadTupleTicketBoughtEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _quantity = source.readBigNumber();
    let _buyer = source.readAddress();
    let _tickets = source.readString();
    return { $$type: 'TicketBoughtEvent' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity, buyer: _buyer, tickets: _tickets };
}

function loadGetterTupleTicketBoughtEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _quantity = source.readBigNumber();
    let _buyer = source.readAddress();
    let _tickets = source.readString();
    return { $$type: 'TicketBoughtEvent' as const, poolId: _poolId, roundId: _roundId, quantity: _quantity, buyer: _buyer, tickets: _tickets };
}

function storeTupleTicketBoughtEvent(source: TicketBoughtEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.quantity);
    builder.writeAddress(source.buyer);
    builder.writeString(source.tickets);
    return builder.build();
}

function dictValueParserTicketBoughtEvent(): DictionaryValue<TicketBoughtEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTicketBoughtEvent(src)).endCell());
        },
        parse: (src) => {
            return loadTicketBoughtEvent(src.loadRef().beginParse());
        }
    }
}

export type ClaimedEvent = {
    $$type: 'ClaimedEvent';
    poolId: bigint;
    roundId: bigint;
    amount: bigint;
    receiver: Address;
}

export function storeClaimedEvent(src: ClaimedEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(916403026, 32);
        b_0.storeInt(src.poolId, 257);
        b_0.storeInt(src.roundId, 257);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.receiver);
    };
}

export function loadClaimedEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 916403026) { throw Error('Invalid prefix'); }
    let _poolId = sc_0.loadIntBig(257);
    let _roundId = sc_0.loadIntBig(257);
    let _amount = sc_0.loadCoins();
    let _receiver = sc_0.loadAddress();
    return { $$type: 'ClaimedEvent' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver };
}

function loadTupleClaimedEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'ClaimedEvent' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver };
}

function loadGetterTupleClaimedEvent(source: TupleReader) {
    let _poolId = source.readBigNumber();
    let _roundId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'ClaimedEvent' as const, poolId: _poolId, roundId: _roundId, amount: _amount, receiver: _receiver };
}

function storeTupleClaimedEvent(source: ClaimedEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.poolId);
    builder.writeNumber(source.roundId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

function dictValueParserClaimedEvent(): DictionaryValue<ClaimedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadClaimedEvent(src.loadRef().beginParse());
        }
    }
}

 type Lottery_init_args = {
    $$type: 'Lottery_init_args';
    adminWallet: Address;
    publicKey: bigint;
}

function initLottery_init_args(src: Lottery_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.adminWallet);
        b_0.storeInt(src.publicKey, 257);
    };
}

async function Lottery_init(adminWallet: Address, publicKey: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initLottery_init_args({ $$type: 'Lottery_init_args', adminWallet, publicKey })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const Lottery_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    10050: { message: `Invalid claim fee percent` },
    13687: { message: `Pool is not active` },
    20265: { message: `Winning numbers already drawn` },
    24801: { message: `Round is not open for ticket purchases` },
    25441: { message: `User has no ticket in this round` },
    26690: { message: `Invalid prizes` },
    36876: { message: `Round does not exist` },
    41780: { message: `Total prize must be less than or equal to 100` },
    42120: { message: `Pool does not exist` },
    42342: { message: `Sequence must be positive` },
    42504: { message: `Already claimed` },
    45000: { message: `Insufficient funds in the contract` },
    47697: { message: `Round is not active` },
    48401: { message: `Invalid signature` },
    50778: { message: `Round is still active` },
    52453: { message: `Initial rounds must be positive` },
    52657: { message: `Prizes must be set` },
    57401: { message: `Start time must be before end time` },
    58319: { message: `Only the owner or admin can call this function` },
    58383: { message: `Insufficient funds sent` },
    59272: { message: `Quantity must be positive` },
}

const Lottery_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Lottery$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"admin","type":{"kind":"dict","key":"address","value":"bool"}},{"name":"pools","type":{"kind":"dict","key":"int","value":"Pool","valueFormat":"ref"}},{"name":"nextPoolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"usersTicket","type":{"kind":"dict","key":"int","value":"RoundTicket","valueFormat":"ref"}},{"name":"result","type":{"kind":"dict","key":"int","value":"Result","valueFormat":"ref"}},{"name":"rewardPools","type":{"kind":"dict","key":"int","value":"int"}},{"name":"publicKey","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"claimData","type":{"kind":"dict","key":"int","value":"ClaimInfo","valueFormat":"ref"}},{"name":"claimFeePercent","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Pool","header":null,"fields":[{"name":"poolId","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"creator","type":{"kind":"simple","type":"address","optional":false}},{"name":"rounds","type":{"kind":"dict","key":"int","value":"RoundConfig","valueFormat":"ref"}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"sequence","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"prizes","type":{"kind":"dict","key":"uint","keyFormat":8,"value":"uint","valueFormat":8}}]},
    {"name":"RoundConfig","header":null,"fields":[{"name":"roundId","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"poolId","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"ticketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TicketPayoutResponse","header":null,"fields":[{"name":"ticket","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"RandomTicketResponse","header":null,"fields":[{"name":"ASCIINumber","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ticket","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Ticket","header":null,"fields":[{"name":"ticket","type":{"kind":"simple","type":"string","optional":false}},{"name":"ticketNumber","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"UserTicket","header":null,"fields":[{"name":"users","type":{"kind":"dict","key":"address","value":"TicketPayoutResponse","valueFormat":"ref"}}]},
    {"name":"RoundTicket","header":null,"fields":[{"name":"rounds","type":{"kind":"dict","key":"int","value":"UserTicket","valueFormat":"ref"}}]},
    {"name":"Winner","header":null,"fields":[{"name":"ticket","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"prize","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"ClaimInfo","header":null,"fields":[{"name":"info","type":{"kind":"dict","key":"int","value":"UserClaim","valueFormat":"ref"}}]},
    {"name":"UserClaim","header":null,"fields":[{"name":"user","type":{"kind":"dict","key":"address","value":"bool"}}]},
    {"name":"Result","header":null,"fields":[{"name":"rounds","type":{"kind":"dict","key":"int","value":"int"}}]},
    {"name":"CreatePool","header":2095598070,"fields":[{"name":"jettonWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"ticketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"initialRounds","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"sequence","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"prizes","type":{"kind":"dict","key":"uint","keyFormat":8,"value":"uint","valueFormat":8}}]},
    {"name":"Claim","header":1449747896,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"signature","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"WinningNumbersDrawnEvent","header":3552390527,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winningNumber","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UpdatePizes","header":4133815729,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"prizes","type":{"kind":"dict","key":"uint","keyFormat":8,"value":"uint","valueFormat":8}}]},
    {"name":"BuyTicket","header":3748203161,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"quantity","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DrawWinningNumbers","header":3591482628,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"latestTxHash","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"SetAdmin","header":134190905,"fields":[{"name":"admin","type":{"kind":"simple","type":"address","optional":false}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetPublicKey","header":3279683070,"fields":[{"name":"publicKey","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SetClaimFeePercent","header":233252030,"fields":[{"name":"claimFeePercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"TransferFund","header":3687331887,"fields":[{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PoolCreatedEvent","header":590692540,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ticketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"initialRounds","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sequence","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"rounds","type":{"kind":"dict","key":"int","value":"RoundConfig","valueFormat":"ref"}},{"name":"creator","type":{"kind":"simple","type":"address","optional":false}},{"name":"prizes","type":{"kind":"dict","key":"uint","keyFormat":8,"value":"uint","valueFormat":8}}]},
    {"name":"RoundCreated","header":3113542296,"fields":[{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ticketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"TicketBoughtEvent","header":1249282626,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"quantity","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"tickets","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"ClaimedEvent","header":916403026,"fields":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
]

const Lottery_getters: ABIGetter[] = [
    {"name":"admins","arguments":[],"returnType":{"kind":"dict","key":"address","value":"bool"}},
    {"name":"isAdmin","arguments":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"currentPool","arguments":[],"returnType":{"kind":"dict","key":"int","value":"Pool","valueFormat":"ref"}},
    {"name":"poolById","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"Pool","optional":true}},
    {"name":"usersTicket","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"UserTicket","optional":false}},
    {"name":"userTicketByAddress","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"TicketPayoutResponse","optional":true}},
    {"name":"roundById","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"RoundConfig","optional":true}},
    {"name":"resultByRound","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"resultByPool","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"Result","optional":true}},
    {"name":"publicKey","arguments":[],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"claimData","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"UserClaim","optional":true}},
    {"name":"isClaim","arguments":[{"name":"poolId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"roundId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"contractBalance","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"claimFeePercent","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const Lottery_getterMapping: { [key: string]: string } = {
    'admins': 'getAdmins',
    'isAdmin': 'getIsAdmin',
    'currentPool': 'getCurrentPool',
    'poolById': 'getPoolById',
    'usersTicket': 'getUsersTicket',
    'userTicketByAddress': 'getUserTicketByAddress',
    'roundById': 'getRoundById',
    'resultByRound': 'getResultByRound',
    'resultByPool': 'getResultByPool',
    'publicKey': 'getPublicKey',
    'claimData': 'getClaimData',
    'isClaim': 'getIsClaim',
    'contractBalance': 'getContractBalance',
    'claimFeePercent': 'getClaimFeePercent',
    'owner': 'getOwner',
}

const Lottery_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"CreatePool"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BuyTicket"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DrawWinningNumbers"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetAdmin"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Claim"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetPublicKey"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetClaimFeePercent"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TransferFund"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class Lottery implements Contract {
    
    static async init(adminWallet: Address, publicKey: bigint) {
        return await Lottery_init(adminWallet, publicKey);
    }
    
    static async fromInit(adminWallet: Address, publicKey: bigint) {
        const init = await Lottery_init(adminWallet, publicKey);
        const address = contractAddress(0, init);
        return new Lottery(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Lottery(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Lottery_types,
        getters: Lottery_getters,
        receivers: Lottery_receivers,
        errors: Lottery_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: CreatePool | BuyTicket | DrawWinningNumbers | SetAdmin | Claim | SetPublicKey | SetClaimFeePercent | TransferFund | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreatePool') {
            body = beginCell().store(storeCreatePool(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BuyTicket') {
            body = beginCell().store(storeBuyTicket(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DrawWinningNumbers') {
            body = beginCell().store(storeDrawWinningNumbers(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetAdmin') {
            body = beginCell().store(storeSetAdmin(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Claim') {
            body = beginCell().store(storeClaim(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetPublicKey') {
            body = beginCell().store(storeSetPublicKey(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetClaimFeePercent') {
            body = beginCell().store(storeSetClaimFeePercent(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TransferFund') {
            body = beginCell().store(storeTransferFund(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getAdmins(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('admins', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
        return result;
    }
    
    async getIsAdmin(provider: ContractProvider, address: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(address);
        let source = (await provider.get('isAdmin', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getCurrentPool(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('currentPool', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserPool(), source.readCellOpt());
        return result;
    }
    
    async getPoolById(provider: ContractProvider, poolId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        let source = (await provider.get('poolById', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTuplePool(result_p) : null;
        return result;
    }
    
    async getUsersTicket(provider: ContractProvider, poolId: bigint, roundId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        let source = (await provider.get('usersTicket', builder.build())).stack;
        const result = loadGetterTupleUserTicket(source);
        return result;
    }
    
    async getUserTicketByAddress(provider: ContractProvider, poolId: bigint, roundId: bigint, user: Address) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        builder.writeAddress(user);
        let source = (await provider.get('userTicketByAddress', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleTicketPayoutResponse(result_p) : null;
        return result;
    }
    
    async getRoundById(provider: ContractProvider, poolId: bigint, roundId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        let source = (await provider.get('roundById', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleRoundConfig(result_p) : null;
        return result;
    }
    
    async getResultByRound(provider: ContractProvider, poolId: bigint, roundId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        let source = (await provider.get('resultByRound', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getResultByPool(provider: ContractProvider, poolId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        let source = (await provider.get('resultByPool', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleResult(result_p) : null;
        return result;
    }
    
    async getPublicKey(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('publicKey', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getClaimData(provider: ContractProvider, poolId: bigint, roundId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        let source = (await provider.get('claimData', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleUserClaim(result_p) : null;
        return result;
    }
    
    async getIsClaim(provider: ContractProvider, poolId: bigint, roundId: bigint, receiver: Address) {
        let builder = new TupleBuilder();
        builder.writeNumber(poolId);
        builder.writeNumber(roundId);
        builder.writeAddress(receiver);
        let source = (await provider.get('isClaim', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getContractBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('contractBalance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getClaimFeePercent(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('claimFeePercent', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}