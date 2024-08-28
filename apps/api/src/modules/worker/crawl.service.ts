import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Slice, Transaction } from '@ton/core';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import { LatestBlock } from '@/database/entities';

import { DecodeTransactionEvent } from './decodeTransactionEvent';

@Injectable()
export class CrawlWorkerService {
  tonClient: TonClient;
  gameContractAddress: Address;

  constructor(
    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,
    private readonly configService: ConfigService<StellaConfig>,
  ) {
    this.tonClient = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // await getHttpEndpoint({ network: 'testnet' }),
    });

    this.gameContractAddress = Address.parse(
      this.configService.get('contract.gameContractAddress', {
        infer: true,
      }),
    );

    this.doCrawlJob();
  }

  async doJob() {
    const myAddress = Address.parse(
      'EQB7hoJ3UHzvd9zAIg2D6IWBCV_E5SzXN3DueQwNuwVcGtHH',
    );
    // const { stack } = await this.tonClient.sendMessage();

    // console.log(stack.readAddress());
  }

  loadPoolCreated(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 690511526) {
      throw Error('Invalid prefix');
    }
    const _ticketPrice = sc_0.loadUintBig(32);
    const _initialRounds = sc_0.loadUintBig(8);
    const _startTime = sc_0.loadUintBig(32);
    const _endTime = sc_0.loadUintBig(32);
    const _active = sc_0.loadBit();
    return {
      $$type: 'PoolCreated' as const,
      ticketPrice: _ticketPrice,
      initialRounds: _initialRounds,
      startTime: _startTime,
      endTime: _endTime,
      active: _active,
    };
  }

  async doCrawlJob() {
    while (true) {
      try {
        const currentBlockNumber = (await this.getCurrentBloc()).blockNumber;
        const latestBlockNumber = (await this.getContractState())
          .lastTransaction.lt;

        if (+currentBlockNumber > +latestBlockNumber) return;

        const transactions = await this.getTransactions(
          latestBlockNumber,
          currentBlockNumber.toString(),
        );

        for (const tx of transactions) {
          const isAbortedTx = tx.description?.['aborted'];
          if (isAbortedTx) continue;

          const inMsg = tx.inMessage;
          if (inMsg?.info.type == 'internal') {
            const originalBody = inMsg?.body.beginParse();
            const body = originalBody.clone();
            const op = body.loadUint(32);
            switch (op) {
              case 690511526:
                this.createPoolEvent(tx);
                break;

              default:
                break;
            }
          }
        }

        await this.updateBlockLt(latestBlockNumber);
      } catch (error) {
        console.log(error);
      }

      await this.wait(5000);
    }
  }

  async createPoolEvent(tx: Transaction) {
    const outMsgs = tx.outMessages.values()[0];
    const originalBody = outMsgs?.body.beginParse();
    const body = originalBody.clone();
    const payload = DecodeTransactionEvent.loadPoolCreatedEvent(originalBody);
  }

  async updateBlockLt(lt: string) {
    const currentBlock = await this.getCurrentBloc();
    currentBlock.blockNumber = +lt;
    return await this.latestBlockRepository.save(currentBlock);
  }

  async getCurrentBloc() {
    return this.latestBlockRepository
      .createQueryBuilder('latestBlock')
      .where(`latestBlock.key=:key`, {
        key: `crawl_${this.configService.get('contract.gameContractAddress', {
          infer: true,
        })}`,
      })
      .getOne();
  }

  async getContractState() {
    const contractState = await this.tonClient.getContractState(
      this.gameContractAddress,
    );
    console.log(contractState);
    return contractState;
  }

  async getTransactions(fromLt: string, toLt: string) {
    return this.tonClient.getTransactions(this.gameContractAddress, {
      // lt: fromLt,
      // to_lt: toLt,
      limit: 100,
    });
  }

  async _doCrawlJob() {
    const myAddress = Address.parse(
      'EQB7hoJ3UHzvd9zAIg2D6IWBCV_E5SzXN3DueQwNuwVcGtHH',
    );
    const count = 0;

    const test = await this.tonClient.getMasterchainInfo();

    console.log(test.latestSeqno);

    // while (count < 2) {
    //   const transactions = await this.tonClient.getTransactions(myAddress, {
    //     limit: 10,
    //   });

    //   // for (const tx of transactions) {
    //   //   const inMsg = tx.inMessage;
    //   //   if (inMsg?.info.type == 'internal') {
    //   //     const sender = inMsg?.info.src;
    //   //     const value = inMsg?.info.value.coins;

    //   //     const originalBody = inMsg?.body.beginParse();
    //   //     let body = originalBody.clone();
    //   //     const op = body.loadUint(32);

    //   //     if (op === 690511526) {
    //   //       // console.log(op, this.loadPoolCreated(originalBody));
    //   //     }
    //   //     // console.log(this.parseBody(inMsg?.body));
    //   //     // console.log(this.parseBody(inMsg?.body));

    //   //     // const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

    //   //     // if (op == 0) {
    //   //     //   // if opcode is 0: it's a simple message with comment
    //   //     //   const comment = body.loadStringTail();
    //   //     //   console.log(
    //   //     //     `Simple transfer from ${sender} with value ${fromNano(
    //   //     //       value,
    //   //     //     )} TON and comment: "${comment}"`,
    //   //     //   );
    //   //     // } else if (op == 0x7362d09c) {
    //   //     //   // if opcode is 0x7362d09c: it's a Jetton transfer notification

    //   //     //   body.skip(64); // skip query_id
    //   //     //   const jettonAmount = body.loadCoins();
    //   //     //   const jettonSender = body.loadAddressAny();
    //   //     //   const originalForwardPayload = body.loadBit()
    //   //     //     ? body.loadRef().beginParse()
    //   //     //     : body;
    //   //     //   let forwardPayload = originalForwardPayload.clone();

    //   //     //   // IMPORTANT: we have to verify the source of this message because it can be faked
    //   //     //   const runStack = (
    //   //     //     await this.tonClient.runMethod(sender, 'get_wallet_data')
    //   //     //   ).stack;
    //   //     //   runStack.skip(2);
    //   //     //   const jettonMaster = runStack.readAddress();
    //   //     //   const jettonWallet = (
    //   //     //     await this.tonClient.runMethod(
    //   //     //       jettonMaster,
    //   //     //       'get_wallet_address',
    //   //     //       [
    //   //     //         {
    //   //     //           type: 'slice',
    //   //     //           cell: beginCell().storeAddress(myAddress).endCell(),
    //   //     //         },
    //   //     //       ],
    //   //     //     )
    //   //     //   ).stack.readAddress();
    //   //     //   if (!jettonWallet.equals(sender)) {
    //   //     //     // if sender is not our real JettonWallet: this message was faked
    //   //     //     console.log(`FAKE Jetton transfer`);
    //   //     //     continue;
    //   //     //   }

    //   //     //   if (forwardPayload.remainingBits < 32) {
    //   //     //     // if forward payload doesn't have opcode: it's a simple Jetton transfer
    //   //     //     console.log(
    //   //     //       `Jetton transfer from ${jettonSender} with value ${fromNano(
    //   //     //         jettonAmount,
    //   //     //       )} Jetton`,
    //   //     //     );
    //   //     //   } else {
    //   //     //     const forwardOp = forwardPayload.loadUint(32);
    //   //     //     if (forwardOp == 0) {
    //   //     //       // if forward payload opcode is 0: it's a simple Jetton transfer with comment
    //   //     //       const comment = forwardPayload.loadStringTail();
    //   //     //       console.log(
    //   //     //         `Jetton transfer from ${jettonSender} with value ${fromNano(
    //   //     //           jettonAmount,
    //   //     //         )} Jetton and comment: "${comment}"`,
    //   //     //       );
    //   //     //     } else {
    //   //     //       // if forward payload opcode is something else: it's some message with arbitrary structure
    //   //     //       // you may parse it manually if you know other opcodes or just print it as hex
    //   //     //       console.log(
    //   //     //         `Jetton transfer with unknown payload structure from ${jettonSender} with value ${fromNano(
    //   //     //           jettonAmount,
    //   //     //         )} Jetton and payload: ${originalForwardPayload}`,
    //   //     //       );
    //   //     //     }

    //   //     //     console.log(`Jetton Master: ${jettonMaster}`);
    //   //     //   }
    //   //     // } else if (op == 0x05138d91) {
    //   //     //   // if opcode is 0x05138d91: it's a NFT transfer notification

    //   //     //   body.skip(64); // skip query_id
    //   //     //   const prevOwner = body.loadAddress();
    //   //     //   const originalForwardPayload = body.loadBit()
    //   //     //     ? body.loadRef().beginParse()
    //   //     //     : body;
    //   //     //   let forwardPayload = originalForwardPayload.clone();

    //   //     //   // IMPORTANT: we have to verify the source of this message because it can be faked
    //   //     //   const runStack = (
    //   //     //     await this.tonClient.runMethod(sender, 'get_nft_data')
    //   //     //   ).stack;
    //   //     //   runStack.skip(1);
    //   //     //   const index = runStack.readBigNumber();
    //   //     //   const collection = runStack.readAddress();
    //   //     //   const itemAddress = (
    //   //     //     await this.tonClient.runMethod(
    //   //     //       collection,
    //   //     //       'get_nft_address_by_index',
    //   //     //       [{ type: 'int', value: index }],
    //   //     //     )
    //   //     //   ).stack.readAddress();

    //   //     //   if (!itemAddress.equals(sender)) {
    //   //     //     console.log(`FAKE NFT Transfer`);
    //   //     //     continue;
    //   //     //   }

    //   //     //   if (forwardPayload.remainingBits < 32) {
    //   //     //     // if forward payload doesn't have opcode: it's a simple NFT transfer
    //   //     //     console.log(`NFT transfer from ${prevOwner}`);
    //   //     //   } else {
    //   //     //     const forwardOp = forwardPayload.loadUint(32);
    //   //     //     if (forwardOp == 0) {
    //   //     //       // if forward payload opcode is 0: it's a simple NFT transfer with comment
    //   //     //       const comment = forwardPayload.loadStringTail();
    //   //     //       console.log(
    //   //     //         `NFT transfer from ${prevOwner} with comment: "${comment}"`,
    //   //     //       );
    //   //     //     } else {
    //   //     //       // if forward payload opcode is something else: it's some message with arbitrary structure
    //   //     //       // you may parse it manually if you know other opcodes or just print it as hex
    //   //     //       console.log(
    //   //     //         `NFT transfer with unknown payload structure from ${prevOwner} and payload: ${originalForwardPayload}`,
    //   //     //       );
    //   //     //     }
    //   //     //   }

    //   //     //   console.log(`NFT Item: ${itemAddress}`);
    //   //     //   console.log(`NFT Collection: ${collection}`);
    //   //     // } else {
    //   //     //   // if opcode is something else: it's some message with arbitrary structure
    //   //     //   // you may parse it manually if you know other opcodes or just print it as hex
    //   //     //   console.log(
    //   //     //     `Message with unknown structure from ${sender} with value ${fromNano(
    //   //     //       value,
    //   //     //     )} TON and body: ${originalBody}`,
    //   //     //   );
    //   //     // }
    //   //   }
    //   // }

    //   count++;
    // }

    // const onBatchLoaded: BatchLoadedHandler = (event) => {
    //   const { offsetLt, offsetHash, transactions } = event;
    //   if (offsetLt) {
    //     console.log(
    //       `Got ${transactions.length} transaction(s) before ` +
    //         `transaction #${offsetLt}:${offsetHash}`,
    //     );
    //   } else {
    //     console.log(`Got ${transactions.length} last transaction(s)`);
    //   }
    // };

    // const onTransactionDiscovered: TransactionDiscoveredHandler = (event) => {
    //   const { transaction } = event;
    //   const { lt, hash } = transaction.transaction_id;
    //   console.log(`Discovered transaction #${lt}:${hash}`);
    // };

    // const onHttpError: HttpErrorHandler = (error) => console.error(error);

    // let skipBeforeTime: number | undefined;

    // while (true) {
    //   const result = await getAddressTransactions({
    //     provider: this.provider,
    //     address: myAddress,
    //     skipBeforeTime,
    //     itemsPerPage: 5,
    //     useHistoricalNodes: true,
    //     onBatchLoaded,
    //     onTransactionDiscovered,
    //     onHttpError,
    //   });

    //   const { bits, ...rest } = await this.provider.call2(myAddress, 'owner');

    //   // let nextItemIndex = stack.readBigNumber();
    //   // let contentRoot = stack.readCell();
    //   // let owner = stack.readAddress();

    //   console.log(rest, bits);
    //   console.log(bits.readBigNumber());

    //   for (const transaction of result.transactions) {
    //     const { lt, hash } = transaction.transaction_id;

    //     const { source, destination, value, msg_data, ...inMsg } =
    //       transaction.in_msg;

    //     const isExternal = !source;

    //     const hasOutMessages = transaction.out_msgs.length > 0;

    //     let payload: Uint8Array | undefined;
    //     let message: string | undefined;

    //     switch (msg_data['@type']) {
    //       case 'msg.dataText': {
    //         message = TonWeb.utils.base64toString(msg_data.text || '');
    //         break;
    //       }
    //       case 'msg.dataRaw': {
    //         payload = TonWeb.utils.base64ToBytes(msg_data.body || '');
    //         break;
    //       }
    //       default: {
    //         console.warn(`Unknown payload type: ${msg_data['@type']}`);
    //         break;
    //       }
    //     }

    //     console.log(
    //       `Processing transaction #${lt}:${hash}\n` +
    //         `from: ${isExternal ? 'external' : source}\n` +
    //         `to: ${destination}\n` +
    //         `value: ${TonWeb.utils.fromNano(value)}\n` +
    //         `has out messages: ${hasOutMessages ? 'Yes' : 'No'}\n` +
    //         (message ? `message: ${message}\n` : ''),
    //     );
    //   }

    //   skipBeforeTime = result.lastTransactionTime;

    //   console.log(`Waiting for 5 seconds…`);

    await this.wait(5 * 1000);
    // }
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
