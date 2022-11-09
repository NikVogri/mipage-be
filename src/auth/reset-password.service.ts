import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRespository } from '../user/user.repository';
import { ResetPasswordRepository } from './reset-password.repository';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordToken } from './reset-password-token.entity';
import { ConfigService } from '@nestjs/config';
import { Password } from 'src/helpers/Password';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(UserRespository)
    private userRepository: UserRespository,
    @InjectRepository(ResetPasswordRepository)
    private resetPasswordRepository: ResetPasswordRepository,
    private configService: ConfigService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userService.getSingleUserByEmail(email);

    // Don't return error if user doesn't exist, this is so FE doesn't know if user exists
    if (!user) {
      return null;
    }

    // If old token exists it should be deleted so a new one can take it's place
    const oldToken = await this.resetPasswordRepository.getTokenByUserId(
      user.id,
    );

    if (oldToken) {
      await this.resetPasswordRepository.delete(oldToken);
    }

    const token = await this.resetPasswordRepository.savePasswordResetToken(
      user.id,
    );

    const resetUrl = `${this.configService.get(
      'URL_ORIGIN',
    )}/reset-password/${token}`;

    await this.emailService.sendPasswordReset(email, resetUrl);
  }

  async resetPasswordWithToken({ token, password }: ResetPasswordDto) {
    const resetToken = await this.resetPasswordRepository.getToken(token);
    this.validatePasswordResetToken(resetToken);

    const user = await this.userService.getSingleUser(resetToken.userId);

    await this.updatePassword(user.id, password);
    await this.resetPasswordRepository.delete(token);
  }

  validatePasswordResetToken(token: ResetPasswordToken) {
    if (!token) {
      throw new BadRequestException(
        'Invalid token provided. Please try resetting the password again.',
      );
    }

    const expireLengthInMs =
      this.configService.get('RESET_PASSWORD_TOKEN_EXPIRY_LENGTH') || 900000; // 15 minutes;

    if (new Date(token.createdAt).getTime() + expireLengthInMs < Date.now()) {
      throw new BadRequestException(
        'Token has expired. Please try resetting the password again.',
      );
    }
  }

  async updatePassword(userId: string, password: string) {
    const hashedPassword = await Password.hash(password);
    await this.userRepository.save({ id: userId, password: hashedPassword });
  }
}
