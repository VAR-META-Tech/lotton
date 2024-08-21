import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const parseTz = (stringDate: string) =>
  dayjs.tz(stringDate, process.env.Tz);
