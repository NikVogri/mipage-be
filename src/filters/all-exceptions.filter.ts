import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { LogService } from 'src/log/log.service';
import { Request, Response } from 'express';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logService: LogService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const log = this.logService.build(request);

    if (exception instanceof HttpException) {
      log.setOutput(exception.getResponse());
      log.logError(exception).save();

      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    log.logError(exception).save();
    response.status(500).json({ message: 'Internal server error' });
  }
}
