import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-login-credentials.dto';
import { AuthRegisterCredentialsDto } from './dto/auth-register-credentials.dto';
import { UserRespository } from '../user/user.repository';
import { Jwt } from 'src/models';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { ResetPasswordRepository } from './reset-password.repository';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordToken } from './reset-password-token.entity';
import { ConfigService } from '@nestjs/config';
import { Password } from 'src/helpers/Password';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRepository: UserRespository,
    @InjectRepository(ResetPasswordRepository)
    private resetPasswordRepository: ResetPasswordRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  async register(authRegisterCredentialsDto: AuthRegisterCredentialsDto) {
    const { email, username } = authRegisterCredentialsDto;

    await this.userRepository.createUser(authRegisterCredentialsDto);
    await this.emailService.sendWelcome(email, username);
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

  async token(authLoginCredentialsDto: AuthLoginCredentialsDto) {
    const user = await this.validateUser(authLoginCredentialsDto);

    const jwtPayload: Jwt = {
      id: user.id,
      roles: [],
      version: process.env.JWT_VERSION,
    };

    return this.jwtService.sign(jwtPayload);
  }

  async createPasswordResetToken(userId: string) {
    return await this.resetPasswordRepository.savePasswordResetToken(userId);
  }

  async getPasswordResetToken(token: string) {
    return await this.resetPasswordRepository.findOne({
      where: { token },
    });
  }

  async getPasswordResetTokenByUserId(userId: string) {
    return await this.resetPasswordRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async deletePasswordResetToken(token: string) {
    return await this.resetPasswordRepository.delete(token);
  }

  validatePasswordResetToken(token: ResetPasswordToken) {
    if (!token) {
      throw new BadRequestException('Invalid token provided');
    }

    const expireLengthInMs =
      this.configService.get('RESET_PASSWORD_TOKEN_EXPIRY_LENGTH') || 900000; // 15 minutes;

    if (new Date(token.createdAt).getTime() + expireLengthInMs < Date.now()) {
      throw new BadRequestException('Token has expired');
    }
  }

  async updatePassword(userId: string, password: string) {
    const hashedPassword = await Password.hash(password);
    await this.userRepository.save({ id: userId, password: hashedPassword });
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userService.getSingleUserByEmail(email);

    // Don't return error if user doesn't exist, this is so FE doesn't know if user exists
    if (!user) {
      return null;
    }

    // If old token exists it should be deleted so a new one can take it's place
    const oldToken = await this.getPasswordResetTokenByUserId(user.id);
    if (oldToken) {
      await this.deletePasswordResetToken(oldToken.token);
    }

    const token = await this.createPasswordResetToken(user.id);

    const resetUrl = `${this.configService.get(
      'URL_ORIGIN',
    )}/reset-password/${token}`;

    await this.emailService.sendPasswordReset(email, resetUrl);
  }

  async resetForgottenPassword({ token, password }: ResetPasswordDto) {
    const resetToken = await this.getPasswordResetToken(token);
    this.validatePasswordResetToken(resetToken);

    const user = await this.userService.getSingleUser(resetToken.userId);

    await this.updatePassword(user.id, password);
    await this.deletePasswordResetToken(token);
  }
}
