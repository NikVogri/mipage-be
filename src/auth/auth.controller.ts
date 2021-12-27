import { Body, Controller, Post } from '@nestjs/common';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() authRegisterCredentialsDto: AuthRegisterCredentialsDto,
  ) {
    return this.authService.register(authRegisterCredentialsDto);
  }

  @Post('/login')
  async login(@Body() authLoginCredentialsDto: AuthLoginCredentialsDto) {
    const token = await this.authService.login(authLoginCredentialsDto);

    return {
      token,
    };
  }
}
