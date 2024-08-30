import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Address, Builder } from "@ton/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToTimestamp = (dateString: string) => {
  if (!dateString) return 0;
  dayjs.extend(utc);
  const parsedDate = dayjs(dateString);
  const timestamp = parsedDate.isValid() ? parsedDate.utc().unix() : NaN;
  return timestamp * 1000;
};

export const range = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, idx) => idx + start);
};

export const convertToDate = (dateString: any) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(customParseFormat);
  const date = dayjs(dateString).toDate();
  const formattedDate = dayjs(date).format('DD/MM/YYYY hh:mm:ss A');
  return formattedDate;
};

export type CreatePool = {
  $$type: 'CreatePool';
  jettonWallet: Address;
  ticketPrice: bigint;
  initialRounds: bigint;
  startTime: bigint;
  endTime: bigint;
  sequence: bigint;
  active: boolean;
};

export type CreatePoolWithoutType = Omit<CreatePool, '$$type'>;

export function storeCreatePool(src: CreatePool) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(2004140043, 32);
    b_0.storeAddress(src.jettonWallet);
    b_0.storeUint(src.ticketPrice, 32);
    b_0.storeUint(src.initialRounds, 8);
    b_0.storeUint(src.startTime, 32);
    b_0.storeUint(src.endTime, 32);
    b_0.storeUint(src.sequence, 32);
    b_0.storeBit(src.active);
  };
}
