import { Injectable, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogRepository } from './log.repository';
import { Request } from 'express';
import { JwtPayload } from 'src/models';
import { decode } from 'jsonwebtoken';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { isEmpty } from 'lodash';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export enum ERROR_TYPE {
  UNSPECIFIED = 'UNSPECIFIED',
  AXIOS = 'AXIOS',
}

export interface HttpLog {
  timestamp: string;
  origin?: string;
  statusCode?: number;
  path?: string;
  ip?: string;
  method: string;
  input: {
    body?: object;
    params?: object;
    query?: object;
  };
  output: object;
  user?: string;
  error?: {
    type: ERROR_TYPE;
    stack: string;
    message: string;
  };
  additionalPayload?: any;
}

@Injectable()
export class LogService {
  private log: HttpLog;

  constructor(
    @InjectRepository(LogRepository)
    private logRepository: LogRepository,
    private configService: ConfigService,
  ) {}

  public build(request: Request) {
    this.buildTemplate();
    this.log.origin = request.get('host');
    this.log.ip = request.ip;
    this.log.path = request.originalUrl;
    this.log.method = request.method;
    this.setInput(request);
    this.setUser(request);

    return this;
  }

  public setResponse(response: Response) {
    this.setOutput(response.body);
    return this;
  }

  public setOutput(output: any) {
    this.log.output = output;
    return this;
  }

  private setInput(request: Request) {
    ['params', 'query'].forEach((key) => {
      if (!isEmpty(request[key])) {
        this.log.input[key] = request[key];
      }
    });

    return this;
  }

  private setUser(request: Request) {
    if (request.user) {
      this.log.user = (request.user as User).id;
    }

    if (request.headers?.authorization?.includes('Bearer')) {
      const jwt = decode(
        request.headers.authorization.split(' ')[1],
      ) as JwtPayload;
      this.log.user = jwt?.id ? jwt.id : null;
    }

    return this;
  }

  public logSuccess(additionalPayload?: any) {
    if (additionalPayload) {
      this.log.additionalPayload = additionalPayload;
    }

    Logger.log(this.log);
    return this;
  }

  public logError(error: Error, additionalPayload?: any) {
    this.log.error = {
      type: ERROR_TYPE.UNSPECIFIED,
      message: error.message,
      stack: error.stack,
    };

    if (axios.isAxiosError(error)) {
      this.log.error.type === ERROR_TYPE.AXIOS;
      this.log.error.stack = error.response?.data ?? error;
    }

    if (additionalPayload) {
      this.log.additionalPayload = additionalPayload;
    }

    Logger.error(this.log);
    return this;
  }

  public async save() {
    if (this.configService.get('STAGE') === 'prod') {
      await this.logRepository.saveLog(JSON.stringify(this.log));
    }
  }

  private buildTemplate() {
    this.log = {
      timestamp: new Date().toString(),
      origin: undefined,
      path: undefined,
      ip: undefined,
      method: undefined,
      input: {},
      output: {},
      user: undefined,
      error: undefined,
      additionalPayload: undefined,
    };
  }
}
