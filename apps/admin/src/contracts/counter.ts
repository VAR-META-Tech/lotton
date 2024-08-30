import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";
import { Maybe } from "@ton/core/dist/utils/maybe";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }
  
  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

  async createPool(provider: ContractProvider, via: Sender, messageBody?: Maybe<Cell | string>) {
    await provider.internal(via, {
      value: "0.05", // send 0.002 TON for gas
      body: messageBody
    });
  }
}