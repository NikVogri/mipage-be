import { Injectable, NotFoundException } from '@nestjs/common';
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
}
