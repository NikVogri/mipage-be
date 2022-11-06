import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
    const expiryLengthInMs = 86400000 * 30; // 30 days

    const token = await this.authService.token(authLoginCredentialsDto);
    const isProd = this.configService.get('STAGE') === 'prod';

    response
      .cookie('mipage-auth', token, {
        httpOnly: true,
        domain: isProd ? '.mipage.me' : undefined,
        expires: new Date(Date.now() + expiryLengthInMs),
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
      })
      .status(200)
      .send({ success: true });
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    response.clearCookie('mipage-auth').status(200).send({ success: true });
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetForgottenPassword(resetPasswordDto);
  }
}
