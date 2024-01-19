import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { User } from './user.entity';
import { UserRespository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRespository) private userRepository: UserRespository,
  ) {}

  getSingleUser = async (userId: string): Promise<User> => {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    return user;
  };

  getSingleUserByEmail = async (email: string): Promise<User> => {
    return await this.userRepository.findOne({ where: { email } });
  };

  updatePersonalInfo = (
    user: User,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) => {
    return this.userRepository.updatePersonalInfo(user, updatePersonalInfoDto);
  };

  deleteUser = (user: User) => {
    return this.userRepository.delete({ id: user.id });
  };
}
