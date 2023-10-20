import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/' })
export class RootController {
  @Get('/version')
  version() {
    const version = process.env.npm_package_version;
    return { version };
  }
}
