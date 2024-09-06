import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { IResponse } from '@/shared/interfaces/response.interface';
import { getLogger } from '@/utils/logger';

const logger = getLogger('Response');

function processResponseData(data: any, statusCode?: number): any {
  return {
    meta: {
      code: data?.statusCode || statusCode,
      message: data?.message || 'Successful',
    },
    data: data?.results || data || {},
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const { statusCode } = context.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(
        map(
          (data) => (
            logger.info(`API Response Status Code: ${statusCode}`),
            processResponseData(data, statusCode)
          ),
        ),
      );
  }
}
