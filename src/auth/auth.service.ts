import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { UserRespository } from '../user/user.repository';
import { Jwt } from 'src/models';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRepository: UserRespository,
    private jwtService: JwtService,
  ) {}

  async register(AuthRegisterCredentialsDto: AuthRegisterCredentialsDto) {
    return this.userRepository.createUser(AuthRegisterCredentialsDto);
  }

  async login(
    authLoginCredentialsDto: AuthLoginCredentialsDto,
  ): Promise<string> {
    const { email, password } = authLoginCredentialsDto;
    const user = await this.userRepository.getAllUserDataByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid login credentials provided');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid login credentials provided');
    }

    const jwtPayload: Jwt = {
      id: user.id,
      roles: [],
      version: process.env.JWT_VERSION,
    };

    return this.jwtService.sign(jwtPayload);
  }
}
