import type {
  ArgumentsHost,
  ExceptionFilter as ExceptionFilterBase,
} from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { writeFileSync } from 'fs';
import * as path from 'path';

import { getLogger } from '@/utils/logger';

const logger = getLogger('ExceptionFilter');

class EmptyObject {
  constructor() {}
}

function processMessage(exception: any): string {
  let message: any =
    exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';
  if (typeof message == 'object') {
    message = message.message ? message.message : message.error || message;
  }
  return message;
}

@Catch()
export class ExceptionFilter<T> implements ExceptionFilterBase {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = `Body: ${JSON.stringify(request.body)}`;
    const query = `Query: ${JSON.stringify(request.query)}`;
    const params = `Params: ${JSON.stringify(request.params)}`;

    logger.error(body);
    logger.error(query);
    logger.error(params);
    logger.error(exception);

    // If status is 500, write log to file
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const logFilePath = path.join(__dirname, '../../../../logs/error.txt');
      const logMessage = `[❌] Error at ${new Date().toISOString()}:\n${
        (exception as Error).stack
      }\n${body}\n${query}\n${params}\n\n`;
      writeFileSync(logFilePath, logMessage, { flag: 'a' }); // 'a' flag for appending
    }

    const message = processMessage(exception);

    response.status(status).json({
      meta: {
        code: status,
        message,
      },
      data: new EmptyObject(),
    });
  }
}
