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

  static loadTicketPayoutResponse(slice: Slice) {
    const sc_0 = slice;
    const _ticket = sc_0.loadStringRefTail();
    return { $$type: 'TicketPayoutResponse' as const, ticket: _ticket };
  }

  static loadTicketBoughtEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1839181562) {
      throw Error('Invalid prefix');
    }
    const _poolId = sc_0.loadIntBig(257);
    const _roundId = sc_0.loadIntBig(257);
    const _quantity = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _buyer = sc_1.loadAddress();
    const _tickets = this.loadTicketPayoutResponse(sc_1);
    return {
      $$type: 'TicketBoughtEvent' as const,
      poolId: _poolId,
      roundId: _roundId,
      quantity: _quantity,
      buyer: _buyer,
      tickets: _tickets,
    };
  }

  static loadBuyTicket(slice: Slice) {
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
}
