export interface IGetBalanceParams {
  address: string;
}

export interface IGetBalanceResponse {
  ok: boolean;
  result: IGetBalanceResult;
}

export interface IGetBalanceResult {
  '@type': string;
  balance: string;
  code: string;
  data: string;
  last_transaction_id: ILastTransactionId;
  block_id: IBlockId;
  frozen_hash: string;
  sync_utime: number;
  '@extra': string;
  state: string;
}

export interface ILastTransactionId {
  '@type': string;
  lt: string;
  hash: string;
}

export interface IBlockId {
  '@type': string;
  workchain: number;
  shard: string;
  seqno: number;
  root_hash: string;
  file_hash: string;
}
