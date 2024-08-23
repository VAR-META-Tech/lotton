import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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
