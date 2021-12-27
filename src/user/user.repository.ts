import { EntityRepository, Repository } from 'typeorm';
import { AuthRegisterCredentialsDto } from '../auth/dto/auth-register-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRespository extends Repository<User> {
  async createUser(authRegisterCredentialsDto: AuthRegisterCredentialsDto) {
    const { email, username, password } = authRegisterCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    const user = this.create({ email, username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async getAllUserDataByEmail(email: string): Promise<User | null> {
    const user = await this.findOne(
      { email },
      {
        select: [
          'id',
          'username',
          'email',
          'password',
          'avatar',
          'createdAt',
          'updatedAt',
        ],
      },
    );

    return user;
  }
}
