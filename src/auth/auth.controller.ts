import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { EMAIL } from 'src/email/models';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  @Post('/register')
  async register(
    @Body() authRegisterCredentialsDto: AuthRegisterCredentialsDto,
  ) {
    const { email, username } = authRegisterCredentialsDto;

    await this.authService.register(authRegisterCredentialsDto);

    await this.emailService.sendEmail(EMAIL.welcome, email, {
      username: username,
    });
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
        domain: isProd ? '.mipage.me' : undefined,
        expires: new Date(Date.now() + 86400000),
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
      })
      .status(200)
      .send({ success: true });
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    response
      .cookie('mipage-auth', null, {
        expires: new Date(Date.now() - 3600), // set expire to date in the past
      })
      .status(200)
      .send({ success: true });
  }
}
