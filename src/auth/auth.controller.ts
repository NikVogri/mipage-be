import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/register')
  async register(
    @Body() authRegisterCredentialsDto: AuthRegisterCredentialsDto,
  ) {
    return this.authService.register(authRegisterCredentialsDto);
  }

  @Post('/login')
  async login(
    @Res() response: Response,
    @Body() authLoginCredentialsDto: AuthLoginCredentialsDto,
  ) {
    const token = await this.authService.token(authLoginCredentialsDto);
    const isProd = this.configService.get('STAGE') === 'prod';

    response
      .cookie('mipage-auth', token, {
        httpOnly: true,
        domain: isProd ? this.configService.get('URL_ORIGIN') : undefined,
        expires: new Date(Date.now() + 86400000),
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
      })
      .status(200)
      .send({ success: true });
  }
}
