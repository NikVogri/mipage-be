import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';

import { UserRespository } from '../../user/user.repository';
import { User } from '../../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRespository)
    private usersRespository: UserRespository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies) return null;
        return req.cookies['mipage-auth'];
      },
      secretOrKey: configService.get('PASSPORT_JTW_SECRET'),
    });
  }

  async validate(data: any): Promise<User> {
    const user = await this.usersRespository.findOne({
      where: { id: data.id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
