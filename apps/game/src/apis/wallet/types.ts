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

export interface IGetExtendedAddressInformationParams extends IGetBalanceParams {}

export interface IGetExtendedAddressInformationResponse {
  ok: boolean;
  result: IGetExtendedAddressInformationResult;
}

export interface IGetExtendedAddressInformationResult {
  '@type': string;
  address: IGetExtendedAddressInformationAddress;
  balance: string;
  last_transaction_id: IGetExtendedAddressInformationLastTransactionId;
  block_id: IGetExtendedAddressInformationBlockId;
  sync_utime: number;
  account_state: IGetExtendedAddressInformationAccountState;
  revision: number;
  '@extra': string;
}

export interface IGetExtendedAddressInformationAddress {
  '@type': string;
  account_address: string;
}

export interface IGetExtendedAddressInformationLastTransactionId {
  '@type': string;
  lt: string;
  hash: string;
}

export interface IGetExtendedAddressInformationBlockId {
  '@type': string;
  workchain: number;
  shard: string;
  seqno: number;
  root_hash: string;
  file_hash: string;
}

export interface IGetExtendedAddressInformationAccountState {
  '@type': string;
  wallet_id: string;
  seqno: number;
}
