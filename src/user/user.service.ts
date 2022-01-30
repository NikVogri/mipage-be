import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRespository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRespository) private userRepository: UserRespository,
  ) {}

  getSingleUser = (userId: string): Promise<User> => {
    const user = this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    return user;
  };

  getUsersWithQuery = (query: string): Promise<User[]> => {
    if (!query) {
      throw new BadRequestException("Query can't be empty");
    }

    return this.userRepository.getUsersWithQuery(query);
  };
}
