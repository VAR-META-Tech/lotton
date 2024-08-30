import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from '@ton/core';
import { Maybe } from '@ton/core/dist/utils/maybe';

export default class Pool implements Contract {
  static createForDeploy(code: Cell, initialPoolValue: number): Pool {
    const data = beginCell().storeUint(initialPoolValue, 64).endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Pool(address, { code, data });
  }

  // eslint-disable-next-line no-unused-vars
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: '0.01', // send 0.01 TON to contract for rent
      bounce: false,
    });
  }

  async buyTicket(provider: ContractProvider, via: Sender, messageBody?: Maybe<string | Cell>) {
    try {
      await provider.internal(via, {
        value: '0.05', // send 0.05 TON for gas
        body: messageBody,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async claimPrize(provider: ContractProvider, via: Sender, messageBody?: Maybe<string | Cell>) {
    try {
      await provider.internal(via, {
        value: '0.05', // send 0.05 TON for gas
        body: messageBody,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
