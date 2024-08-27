import { Hash } from 'crypto';
import TonWeb from 'tonweb';
import {
  BatchLoadedHandler,
  getAddressTransactions,
  HttpErrorHandler,
  TransactionDiscoveredHandler,
} from './address-transactions';

export class CrawlWorkerService {
  provider = new TonWeb.HttpProvider(
    'https://testnet.toncenter.com/api/v2/jsonRPC',
  );

  constructor() {
    this.doCrawlJob();
  }

  async doCrawlJob() {
    const myAddress = 'EQB7hoJ3UHzvd9zAIg2D6IWBCV_E5SzXN3DueQwNuwVcGtHH';

    const onBatchLoaded: BatchLoadedHandler = (event) => {
      const { offsetLt, offsetHash, transactions } = event;
      if (offsetLt) {
        console.log(
          `Got ${transactions.length} transaction(s) before ` +
            `transaction #${offsetLt}:${offsetHash}`,
        );
      } else {
        console.log(`Got ${transactions.length} last transaction(s)`);
      }
    };

    const onTransactionDiscovered: TransactionDiscoveredHandler = (event) => {
      const { transaction } = event;
      const { lt, hash } = transaction.transaction_id;
      console.log(`Discovered transaction #${lt}:${hash}`);
    };

    const onHttpError: HttpErrorHandler = (error) => console.error(error);

    let skipBeforeTime: number | undefined;

    while (true) {
      const result = await getAddressTransactions({
        provider: this.provider,
        address: myAddress,
        skipBeforeTime,
        itemsPerPage: 5,
        useHistoricalNodes: true,
        onBatchLoaded,
        onTransactionDiscovered,
        onHttpError,
      });

      const { bits, ...rest } = await this.provider.call2(myAddress, 'owner');

      // let nextItemIndex = stack.readBigNumber();
      // let contentRoot = stack.readCell();
      // let owner = stack.readAddress();

      console.log(rest, bits);
      console.log(bits.readBigNumber());

      for (const transaction of result.transactions) {
        const { lt, hash } = transaction.transaction_id;

        const { source, destination, value, msg_data, ...inMsg } =
          transaction.in_msg;

        const isExternal = !source;

        const hasOutMessages = transaction.out_msgs.length > 0;

        let payload: Uint8Array | undefined;
        let message: string | undefined;

        switch (msg_data['@type']) {
          case 'msg.dataText': {
            message = TonWeb.utils.base64toString(msg_data.text || '');
            break;
          }
          case 'msg.dataRaw': {
            payload = TonWeb.utils.base64ToBytes(msg_data.body || '');
            break;
          }
          default: {
            console.warn(`Unknown payload type: ${msg_data['@type']}`);
            break;
          }
        }

        console.log(
          `Processing transaction #${lt}:${hash}\n` +
            `from: ${isExternal ? 'external' : source}\n` +
            `to: ${destination}\n` +
            `value: ${TonWeb.utils.fromNano(value)}\n` +
            `has out messages: ${hasOutMessages ? 'Yes' : 'No'}\n` +
            (message ? `message: ${message}\n` : ''),
        );
      }

      skipBeforeTime = result.lastTransactionTime;

      console.log(`Waiting for 5 seconds…`);

      await this.wait(5 * 1000);
    }
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
