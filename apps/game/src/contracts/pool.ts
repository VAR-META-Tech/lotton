import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from '@ton/core';
import { Maybe } from '@ton/core/dist/utils/maybe';
import Big from 'big.js';

export default class Pool implements Contract {
  static createForDeploy(code: Cell, initialPoolValue: number): Pool {
    const data = beginCell().storeUint(initialPoolValue, 64).endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Pool(address, { code, data });
  }

  constructor(
    // eslint-disable-next-line no-unused-vars
    readonly address: Address,
    // eslint-disable-next-line no-unused-vars
    readonly init?: { code: Cell; data: Cell }
  ) { }

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: '0.05', // send 0.05 TON to contract for rent
      bounce: false,
    });
  }

  async buyTicket({
    provider,
    via,
    messageBody,
    value,
  }: {
    provider: ContractProvider;
    via: Sender;
    messageBody?: Maybe<string | Cell>;
    value: number;
  }) {
    const BigValue = Big(value);
    const totalValue = BigValue.add(0.1); // send 0.05 TON for gas

    try {
      await provider.internal(via, {
        value: String(totalValue),
        body: messageBody,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async claimPrize(provider: ContractProvider, via: Sender, messageBody?: Maybe<string | Cell>) {
    try {
      await provider.internal(via, {
        value: '0.05', // send 0.05 TON for gas
        body: messageBody,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
