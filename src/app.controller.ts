import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/' })
export class AppController {
  @Get('/version')
  version() {
    return {
      version: process.env.APP_VERSION,
    };
  }
}
