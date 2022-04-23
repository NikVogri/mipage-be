import { EntityRepository, Repository } from 'typeorm';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { AuthRegisterCredentialsDto } from '../auth/dto/auth-register-credentials.dto';
import { Password } from 'src/helpers/Password';
import { User } from './user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRespository extends Repository<User> {
  async createUser(authRegisterCredentialsDto: AuthRegisterCredentialsDto) {
    const { email, username, password } = authRegisterCredentialsDto;

    const hashedPassword = await Password.hash(password);

    const user = this.create({ email, username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User with this email already exists');
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
          'bio',
          'createdAt',
          'updatedAt',
        ],
      },
    );

    return user;
  }

  async getUserById(id: string): Promise<User> {
    return await this.findOne(id);
  }

  async getUsersWithQuery(query: string): Promise<User[]> {
    const users = await this.createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();

    return users;
  }

  async updatePersonalInfo(
    user: User,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    const { username, bio } = updatePersonalInfoDto;

    return await this.save({
      id: user.id,
      bio: bio,
      username: username,
    });
  }
}
