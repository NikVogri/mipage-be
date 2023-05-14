import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { GetUser } from './get-user.decorator';
import { parseUserForOutput } from './serializers/user.serializer';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getLoggedInUser(@GetUser() user: User) {
    return parseUserForOutput(user);
  }

  @Post('/me/personal-info')
  @UseGuards(JwtAuthGuard)
  async updatePersonalInfo(
    @GetUser() user: User,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    const responseUser = await this.userService.updatePersonalInfo(
      user,
      updatePersonalInfoDto,
    );

    return parseUserForOutput(responseUser);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser() user: User, @Res() response: Response) {
    await this.userService.deleteUser(user);

    response.clearCookie('mipage-auth').status(200).send({ success: true });
  }

  @Get('/:userId/profile')
  async getUserProfile(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    const user = await this.userService.getSingleUser(userId);

    response.setHeader(`Cache-Control`, `public, max-age=${60 * 60}`).send({
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      joinedAt: user.createdAt,
    });
  }
}
