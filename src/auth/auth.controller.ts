import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { AuthService } from './auth.service';
import { ResetPasswordService } from './reset-password.service';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private resetPasswordService: ResetPasswordService,
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
        domain: isProd ? this.configService.get('COOKIE_DOMAIN') : undefined,
        maxAge: 1000 * 60 * 60 * 24 * 31, // 31 days
        secure: isProd,
        sameSite: 'strict',
      })
      .status(200)
      .send({ success: true });
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    const isProd = this.configService.get('STAGE') === 'prod';

    response
      .clearCookie('mipage-auth', {
        domain: isProd ? this.configService.get('COOKIE_DOMAIN') : undefined,
      })
      .status(200)
      .send({ success: true });
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.resetPasswordService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordService.resetPasswordWithToken(resetPasswordDto);
  }
}
