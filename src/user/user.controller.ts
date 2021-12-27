import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getLoggedInUser(@GetUser() user: User) {
    return user;
  }
}
