import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Response,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from 'src/log/log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logService: LogService) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap({
        next: (response: any) => {
          const res = ctx.switchToHttp().getResponse<Response>();
          const log = this.logService
            .build(req)
            .setResponse({ ...res, body: response });
          log.logSuccess();
          log.save();
        },
      }),
    );
  }
}
