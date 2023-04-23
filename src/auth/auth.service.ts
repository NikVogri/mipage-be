import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { UserRespository } from '../user/user.repository';
import { JwtPayload } from 'src/models';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Password } from 'src/helpers/Password';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRepository: UserRespository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(authRegisterCredentialsDto: AuthRegisterCredentialsDto) {
    const { email, username } = authRegisterCredentialsDto;

    await this.userRepository.createUser(authRegisterCredentialsDto);
    await this.emailService.sendWelcome(email, username);
  }

  async token(authLoginCredentialsDto: AuthLoginCredentialsDto) {
    const user = await this.validateUser(authLoginCredentialsDto);

    const jwtPayload: JwtPayload = {
      id: user.id,
      roles: [],
      version: process.env.JWT_VERSION,
    };

    return this.jwtService.sign(jwtPayload, {
      expiresIn: '182 days',
    });
  }

  async validateUser(
    authLoginCredentialsDto: AuthLoginCredentialsDto,
  ): Promise<User> {
    const { email, password } = authLoginCredentialsDto;
    const user = await this.userRepository.getAllUserDataByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid login credentials provided');
    }

    const passwordMatch = await Password.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid login credentials provided');
    }

    return user;
  }
}
