import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getLoggedInUser(@GetUser() user: User) {
    return user;
  }

  @Get('/find')
  @UseGuards(JwtAuthGuard)
  searchForUsers(@Query('q') query: string) {
    return this.userService.getUsersWithQuery(query);
  }
}
