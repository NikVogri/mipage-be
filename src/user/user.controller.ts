import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
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

  @Post('/me/personal-info')
  @UseGuards(JwtAuthGuard)
  updatePersonalInfo(
    @GetUser() user: User,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    return this.userService.updatePersonalInfo(user, updatePersonalInfoDto);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser() user: User, @Res() response: Response) {
    await this.userService.deleteUser(user);

    response
      .cookie('mipage-auth', null, {
        expires: new Date(Date.now() - 3600), // set expire to date in the past
      })
      .status(200)
      .send({ success: true });
  }
}
