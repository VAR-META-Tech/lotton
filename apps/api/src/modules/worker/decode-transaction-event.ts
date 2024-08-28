import type { Slice } from '@ton/core';

export class DecodeTransactionEvent {
  static loadPoolCreatedEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 778348720) {
      throw Error('Invalid prefix');
    }
    const _poolId = sc_0.loadIntBig(257);
    const _ticketPrice = sc_0.loadUintBig(32);
    const _initialRounds = sc_0.loadUintBig(8);
    const _startTime = sc_0.loadUintBig(32);
    const _endTime = sc_0.loadUintBig(32);
    const active = sc_0.loadBit();
    const _creator = sc_0.loadAddress();

    return {
      $$type: 'PoolCreatedEvent' as const,
      poolId: _poolId,
      ticketPrice: _ticketPrice,
      initialRounds: _initialRounds,
      startTime: _startTime,
      endTime: _endTime,
      active: active,
      creator: _creator,
    };
  }
}
