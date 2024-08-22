import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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