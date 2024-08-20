import * as util from 'util';
import * as winston from 'winston';

// TODO: You can add this if you want
// import * as path from 'path';

const logIcons = {
  error: '❌',
  warn: '⚠️',
  info: '🟢',
  debug: '🐛',
  fatal: '💀',
};

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    info.message = `[${info.name}] ${info.message}`;
    info.level = info.name;
  }
  return info;
});

// TODO: You can add this if you want
// const logFiles = {
//   error: path.join(__dirname, '../../../logs/error.txt'),
//   warn: path.join(__dirname, '../../../logs/warn.txt'),
//   fatal: path.join(__dirname, '../../../logs/fatal.txt'),
// };

export function getLogger(name: string) {
  if (!winston.loggers.has(name)) {
    winston.loggers.add(name, {
      format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => {
          const { timestamp, level, message, stack, ...extra } = info;
          const icon = logIcons[info[Symbol.for('level')]] || '';
          const extraDetails = Object.keys(extra).length
            ? util.inspect(extra)
            : '';
          const stackTrace = stack ? `\nStack Trace:\n${stack}` : '';
          return `${icon} [${name}][${level}] - [${timestamp}]: ${message}${extraDetails}${stackTrace}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error', 'fatal'],
        }),

        // TODO: You can add this if you want
        // new winston.transports.File({ filename: logFiles.error, level: 'error' }),
        // new winston.transports.File({ filename: logFiles.warn, level: 'warn' }),
        // new winston.transports.File({ filename: logFiles.fatal, level: 'fatal' }),
      ],
    });
  }

  const logger = winston.loggers.get(name);

  return {
    debug(msg: any) {
      return logger.debug(msg);
    },
    info(msg: any) {
      return logger.info(msg);
    },
    warn(msg: any) {
      return logger.warn(msg);
    },
    error(msg: any, error?: Error) {
      return logger.error(error ? `[${error.name}] ${error.message}` : msg);
    },
    fatal(msg: any, error?: Error) {
      return logger.error(error ? `[${error.name}] ${error.message}` : msg);
    },
  };
}
