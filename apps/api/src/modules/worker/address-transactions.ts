import TonWeb from '@ton.js/tonweb';

import {
  AddressType,
  HttpProvider,
  GetTransactionsResult,
  GetTransactionsResultTransaction,
} from '@ton.js/tonweb';

interface ProcessAddressTransactionsResult {
  transactions: GetTransactionsResultTransaction[];
  lastTransactionTime?: number;
}

export type BatchLoadedHandler = (event: BatchLoadedEvent) => void;

export interface BatchLoadedEvent {
  offsetLt?: string;
  offsetHash?: Hash;
  transactions: GetTransactionsResultTransaction[];
}

type Hash = string;

export type TransactionDiscoveredHandler = (
  event: TransactionDiscoveredEvent,
) => void;

export type HttpErrorHandler = (error: Error) => void;

export interface TransactionDiscoveredEvent {
  transaction: GetTransactionsResultTransaction;
}

/**
 * Returns transactions for the specified address by
 * querying the server and processing the transactions
 * iteratively batch-by-batch, optionally limited by the
 * specified time.
 *
 * Historical nodes could be used to return all transactions
 * for the specified address from the beginning of time.
 */
export async function getAddressTransactions(options: {
  provider: HttpProvider;
  address: AddressType;
  skipBeforeTime?: number;
  itemsPerPage?: number;
  useHistoricalNodes?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onBatchLoaded?: BatchLoadedHandler;
  onTransactionDiscovered?: TransactionDiscoveredHandler;
  onHttpError?: HttpErrorHandler;
}): Promise<ProcessAddressTransactionsResult> {
  const {
    provider,
    skipBeforeTime,
    itemsPerPage = 20,
    useHistoricalNodes,
  } = options;

  const address = new TonWeb.Address(options.address);

  let lastTransactionTime: number | undefined;
  let isLastPage = false;
  let offsetLt: string | undefined;
  let offsetHash: Hash | undefined;
  let transactions: GetTransactionsResultTransaction[] = [];

  const newTransactions: GetTransactionsResultTransaction[] = [];
  const processedTransactions = new Set<string>();

  // Fetching transactions batch-by-batch, until all
  // the desired transactions were processed
  loop: do {
    transactions = await fetchTransactions({
      provider,
      address,

      // At this moment TonCenter returns overlapping results
      // in its responses, when offset LT i used, so we have
      // to drop one transaction from the response. Increasing
      // the page size by one to accord for this discrepancy.
      // @todo: remove this when it's fixed.
      limit: offsetLt ? itemsPerPage + 1 : itemsPerPage,

      lt: offsetLt,
      hash: offsetHash,
      archival: useHistoricalNodes,
      maxRetries: options.maxRetries,
      retryDelay: options.retryDelay,
      onHttpError: options.onHttpError,
    });

    options.onBatchLoaded?.({
      offsetLt,
      offsetHash,
      transactions,
    });

    // Checking if we've reached the end
    if (transactions.length === 0) {
      break;
    }

    // Setting last transaction time to the time
    // of the first transaction from the first batch
    if (!lastTransactionTime) {
      lastTransactionTime = transactions[0].utime;
    }

    for (const transaction of transactions) {
      // console.log(transaction);
      // Stopping the further processing if the
      // desired time mark is reached
      // @todo: check if it should be "<" or "<="
      if (skipBeforeTime !== undefined && transaction.utime <= skipBeforeTime) {
        break loop;
      }

      // Skipping transaction that are already processed.
      // At this moment TonCenter returns overlapping results
      // in its responses.
      // @todo: remove this when it's fixed.
      const { lt, hash } = transaction.transaction_id;
      const transactionId = `${lt}:${hash}`;
      if (processedTransactions.has(transactionId)) {
        continue;
      }

      newTransactions.push(transaction);
      processedTransactions.add(transactionId);

      options.onTransactionDiscovered?.({ transaction });
    }

    // Getting offset values for the next batch API call
    // -----

    const { transaction_id } = transactions[transactions.length - 1];

    offsetLt = transaction_id.lt;
    offsetHash = transaction_id.hash;

    isLastPage = transactions.length < itemsPerPage;
  } while (!isLastPage);

  return {
    lastTransactionTime,
    transactions: newTransactions,
  };
}

async function fetchTransactions(options: {
  provider: HttpProvider;
  address: AddressType;
  limit?: number;
  lt?: string;
  hash?: string;
  archival?: any;
  maxRetries?: number;
  retryDelay?: number;
  onHttpError?: HttpErrorHandler;
}): Promise<GetTransactionsResult> {
  const {
    provider,
    limit,
    lt,
    hash,
    archival,
    maxRetries = 5,
    retryDelay = 3000,
  } = options;

  const address = new TonWeb.Address(options.address);

  let triesCount = 0;
  let gotResponse = false;

  while (!gotResponse) {
    triesCount++;

    try {
      return await provider.getTransactions(
        address.toString(false),
        limit,
        parseInt(lt, 10),
        hash,
        undefined,
        archival,
      );
    } catch (error: any) {
      options.onHttpError?.(error);

      if (triesCount >= maxRetries) {
        throw error;
      }

      await wait(retryDelay);
    }
  }
}

function wait(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
