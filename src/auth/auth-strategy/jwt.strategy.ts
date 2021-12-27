import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Jwt } from 'src/models';

import { UserRespository } from '../../user/user.repository';
import { User } from '../../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRespository)
    private usersRespository: UserRespository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('PASSPORT_JTW_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: Jwt): Promise<User> {
    const user = await this.usersRespository.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
