import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { UserRespository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './auth-strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResetPasswordRepository } from './reset-password.repository';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRespository, ResetPasswordRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.PASSPORT_JTW_SECRET,
        signOptions: {
          expiresIn: 864000, // 10 days
        },
      }),
    }),
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy, UserService, ResetPasswordService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
