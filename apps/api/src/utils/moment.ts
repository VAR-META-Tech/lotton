import moment from 'moment';

/**
 * Converts a Unix timestamp to a UTC date.
 *
 * @param {string} timestamp - The Unix timestamp to convert.
 * @returns {Date} - The converted UTC date.
 */
function unixToUTCDate(timestamp: string): Date {
  return moment.unix(Number(timestamp)).utc().toDate();
}

/**
 * Converts a date to a Unix timestamp.
 *
 * @param {Date} date - The date to convert.
 * @returns {number} - The converted Unix timestamp.
 */
function dateToUnixTimestamp(date: Date): number {
  return moment(date).unix();
}

/**
 * Formats a date in a specific format.
 *
 * @param {Date} date - The date to format.
 * @param {string} format - The format string.
 * @returns {string} - The formatted date.
 */
function formatDate(date: Date, format: string): string {
  return moment(date).format(format);
}

/**
 * Converts a date to a local time.
 *
 * @param {Date} date - The date to convert.
 * @returns {string} - The converted local time.
 */
function toLocalTime(date: Date): string {
  return moment(date).format();
}

export { dateToUnixTimestamp, formatDate, toLocalTime, unixToUTCDate };
