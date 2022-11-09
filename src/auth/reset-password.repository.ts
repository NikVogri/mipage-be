import * as crypto from 'crypto';

import { EntityRepository, Repository } from 'typeorm';
import { ResetPasswordToken } from './reset-password-token.entity';

@EntityRepository(ResetPasswordToken)
export class ResetPasswordRepository extends Repository<ResetPasswordToken> {
  generateRandomToken(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  async savePasswordResetToken(userId: string): Promise<string> {
    const token = this.generateRandomToken();

    const resetTokenRecord = this.create({
      token: token,
      userId,
    });

    await this.save(resetTokenRecord);

    return token;
  }

  async getToken(token: string): Promise<ResetPasswordToken> {
    return await this.findOne({ token });
  }

  async getTokenByUserId(userId: string): Promise<ResetPasswordToken> {
    return await this.findOne({
      where: {
        userId,
      },
    });
  }
}
